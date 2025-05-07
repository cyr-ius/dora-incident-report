import { JsonSchema7 } from '@jsonforms/core';
import { Box, Button } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalErrors } from '../components/GlobalErrors';
import { validationSchema } from '../components/utils';
import { useError } from '../context/ErrorContext';

interface ValidateButtonProps {
  schema: JsonSchema7;
  ajv: any;
  data: any;
  categories?: any;
  activeStep?: number;
}

export const ValidateButton: FC<ValidateButtonProps> = ({
  schema,
  ajv,
  data,
  categories,
  activeStep,
}) => {
  const { t } = useTranslation();
  const { setErrors } = useError();
  const validationButton = () => {
    let result: any;

    result = validationSchema(
      schema as JsonSchema7,
      ajv,
      data,
      categories,
      activeStep ?? 0,
    );

    if (result.currentErrors.length > 0) {
      console.warn('Erreurs de validation :', result.currentErrors);
      setErrors(result.currentErrors);
      return;
    } else {
      setErrors([]);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="center">
        <Button onClick={validationButton}>{t('Validation')}</Button>
      </Box>
      <GlobalErrors />
    </Box>
  );
};
