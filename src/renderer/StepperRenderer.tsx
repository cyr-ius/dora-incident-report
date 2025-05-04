import {
  isCategorization,
  isCategory,
  JsonSchema7,
  LayoutProps,
  rankWith,
  VerticalLayout,
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsLayoutProps } from '@jsonforms/react';
import { Box, Button, Step, StepLabel, Stepper } from '@mui/material';
import { ErrorObject } from 'ajv/dist/2020';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomAjv } from '../components/ajv';
import {
  generatePDF,
  handleDownload,
  validationCategory,
} from '../components/utils';
import { useLocale } from '../context/LocaleContext';

const CustomCategorizationStepper = ({
  uischema,
  schema,
  path,
  renderers,
  cells,
  visible,
  data,
}: LayoutProps) => {
  const categories = (uischema as any).elements.filter(isCategory);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const { locale, setLocale } = useLocale();
  const ajv = useMemo(() => CustomAjv(locale), [locale]);
  const { t } = useTranslation();

  useEffect(() => {
    // Emit event on each step change
    const event = new CustomEvent('stepChange', {
      detail: activeStep,
    });
    window.dispatchEvent(event);

    // Si erreurs et que l’AJV les localise
    if (errors.length > 0 && (ajv as any)._localize) {
      (ajv as any)._localize(errors);
      setErrors([...errors]); // force le re-render avec les erreurs traduites
    }
  }, [activeStep, locale, errors, ajv]);

  if (!visible) {
    return null;
  }

  const stepUiSchema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: categories[activeStep].elements,
  };

  const handleNext = () => {
    const result = validationCategory(
      schema as JsonSchema7,
      ajv,
      data,
      categories,
      activeStep,
    );
    if (result.currentErrors.length > 0) {
      console.warn('Erreurs de validation :', result.currentErrors);
      setErrors(result.currentErrors);
      return;
    } else {
      setActiveStep(prev => Math.min(prev + 1, categories.length - 1));
      setErrors([]);
    }
  };

  const handlePrev = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
    setErrors([]);
  };

  const validationButton = () => {
    const result = validationCategory(
      schema as JsonSchema7,
      ajv,
      data,
      categories,
      activeStep,
    );
    if (result.currentErrors.length > 0) {
      console.warn('Erreurs de validation :', result.currentErrors);
      setErrors(result.currentErrors);
      return;
    } else {
      setErrors([]);
    }
  };

  const downloadButton = () => {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (valid) {
      handleDownload(data);
    } else {
      if (validate.errors) setErrors(validate.errors);
    }
  };

  const pdfButton = () => {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (valid) {
      generatePDF(data);
    } else {
      if (validate.errors) setErrors(validate.errors);
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {categories.map((category: any, index: any) => (
          <Step key={index}>
            <StepLabel>{t(category.label)}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button onClick={validationButton}>{t('Validation')}</Button>
      </Box>
      <Box className="jsonforms-container">
        {errors.filter(err => err.keyword === 'required').length > 0 && (
          <Box className="jsonforms-errors">
            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
              {errors
                .filter(err => err.keyword === 'required')
                .map((err, i) => (
                  <li key={i}>{err.message}</li>
                ))}
            </ul>
          </Box>
        )}
        <Box flexGrow={2}>
          <JsonFormsDispatch
            schema={schema}
            uischema={stepUiSchema}
            path={path}
            renderers={renderers}
            cells={cells}
          />
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          variant="contained"
          onClick={handlePrev}
          disabled={activeStep === 0}>
          {t('Previous')}
        </Button>
        {activeStep != categories.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === categories.length - 1}>
            {t('Next')}
          </Button>
        )}
        {activeStep === categories.length - 1 && (
          <Button variant="contained" color="primary" onClick={downloadButton}>
            {t('Download')} JSON
          </Button>
        )}
        {activeStep === categories.length - 1 && (
          <Button variant="contained" color="primary" onClick={pdfButton}>
            {t('Generate')} PDF
          </Button>
        )}
      </Box>
    </Box>
  );
};

export const customCategorizationStepperTester = rankWith(
  100,
  isCategorization,
);

export const CustomCategorizationStepperRenderer = withJsonFormsLayoutProps(
  CustomCategorizationStepper,
);
