import {
  isCategorization,
  isCategory,
  LayoutProps,
  rankWith,
  VerticalLayout,
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsLayoutProps } from '@jsonforms/react';
import { Box, Button, Grid2, Step, StepLabel, Stepper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DownloadJSONButton } from '../buttons/DownloadJSON';
import { GeneratePDGButton } from '../buttons/GeneratePDF';
import { useSchema } from '../context/SchemaContext';

const StepperWrapper = (props: LayoutProps) => {
  const categories = (props.uischema as any).elements.filter(isCategory);
  const {errors, activeStep, setActiveStep } = useSchema();
  const { t } = useTranslation();

  const stepUiSchema: VerticalLayout = {
    type: 'VerticalLayout',
    elements: categories[activeStep].elements,
  };

  const handleNext = () => {
    const prev = Math.min(activeStep + 1, categories.length - 1);
    setActiveStep(prev);
  };

  const handlePrev = () => {
    const prev = Math.max(activeStep - 1, 0);
    setActiveStep(prev);
  };

  return (
    <Grid2
      container
      justifyContent="center"
      sx={{ height: 'calc(100vh - 330px)' }}>
      <Grid2
        size={{ xs: 12, sm: 12, md: 8 }}
        sx={{
          mx: 2,
          mb: 2,
          display: {
            xs: 'none', // caché sur xs
            sm: 'block', // visible à partir de sm
          },
          my: 'auto',
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
      <Grid2
        size={{ xs: 12, sm: 8, md: 7 }}
        sx={{
          px: 2,
          overflowY: 'auto',
          height: 'calc(100vh - 550px)',
        }}>
        <Box>
          <JsonFormsDispatch {...props} uischema={stepUiSchema} />
        </Box>
      </Grid2>
      <Grid2 size={{ xs: 8, sm: 8, md: 6 }} sx={{ my: 'auto' }}>
        <Box display="flex" justifyContent="space-between" sx={{ mx: 2 }}>
          <Button
            variant="contained"
            onClick={handlePrev}
            disabled={activeStep === 0}>
            {t('Previous')}
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              activeStep === categories.length - 1 || errors.length != 0
            }>
            {t('Next')}
          </Button>
          {activeStep === categories.length - 1 && (
            <DownloadJSONButton schema={props.schema} data={props.data} />
          )}
          {activeStep === categories.length - 1 && (
            <GeneratePDGButton schema={props.schema} data={props.data} />
          )}
        </Box>
      </Grid2>
    </Grid2>
  );
};

export const StepperWrapperRenderer = withJsonFormsLayoutProps(StepperWrapper);

export const StepperWrapperTester = rankWith(3, isCategorization);
