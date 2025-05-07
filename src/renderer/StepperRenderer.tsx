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
import Grid2 from '@mui/material/Grid2';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadJSONButton } from '../buttons/DownloadJSON';
import { GeneratePDGButton } from '../buttons/GeneratePDF';
import { ValidateButton } from '../buttons/Validation';
import { CustomAjv } from '../components/ajv';
import { validationSchema } from '../components/utils';
import { useError } from '../context/ErrorContext';
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
  const { locale, setLocale } = useLocale();
  const ajv = useMemo(() => CustomAjv(locale), [locale]);
  const { t } = useTranslation();
  const { setErrors } = useError();

  useEffect(() => {
    // Emit event on each step change
    const event = new CustomEvent('stepChange', {
      detail: activeStep,
    });
    window.dispatchEvent(event);
  }, [activeStep]);

  if (!visible) {
    return null;
  }

  const stepUiSchema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: categories[activeStep].elements,
  };

  const handleNext = () => {
    const result = validationSchema(
      schema as JsonSchema7,
      ajv,
      data,
      categories,
      activeStep,
    );
    console.debug('Validation errors :', result.currentErrors);
    const filteredErrors = result.currentErrors.filter(
      (item: any) => item.instancePath !== '/incidentSubmission',
    );
    console.warn('Validation filtered errors:', filteredErrors);

    if (filteredErrors.length > 0) {
      setErrors(filteredErrors);
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

  return (
    <Grid2 container justifyContent="center">
      <Grid2
        size={{ xs: 12, sm: 12, md: 8 }}
        sx={{
          mx: 2,
          mb: 2,
          display: {
            xs: 'none', // caché sur xs
            sm: 'block', // visible à partir de sm
          },
        }}
        justifyContent="center">
        <Stepper activeStep={activeStep} alternativeLabel>
          {categories.map((category: any, index: any) => (
            <Step key={index}>
              <StepLabel>{t(category.label)}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 8, md: 6 }} sx={{ mx: 2 }}>
        <Box className="jsonforms-container">
          <ValidateButton
            schema={schema as JsonSchema7}
            ajv={ajv}
            data={data}
            categories={categories}
            activeStep={activeStep}></ValidateButton>
          <Box>
            <JsonFormsDispatch
              schema={schema}
              uischema={stepUiSchema}
              path={path}
              renderers={renderers}
              cells={cells}
            />
          </Box>
        </Box>
      </Grid2>
      <Grid2 size={{ xs: 8, sm: 8, md: 6 }}>
        <Box display="flex" justifyContent="space-between" sx={{ mx: 2 }}>
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
            <DownloadJSONButton schema={schema as JsonSchema7} data={data} />
          )}
          {activeStep === categories.length - 1 && (
            <GeneratePDGButton schema={schema as JsonSchema7} data={data} />
          )}
        </Box>
      </Grid2>
    </Grid2>
  );
};

export const customCategorizationStepperTester = rankWith(3, isCategorization);

export const CustomCategorizationStepperRenderer = withJsonFormsLayoutProps(
  CustomCategorizationStepper,
);
