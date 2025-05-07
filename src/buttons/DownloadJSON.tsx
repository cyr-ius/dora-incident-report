import { JsonSchema7 } from '@jsonforms/core';
import { Button } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomAjv } from '../components/ajv';
import { useError } from '../context/ErrorContext';

interface JSONButtonProps {
  schema: JsonSchema7;
  data: any;
}

export const DownloadJSONButton: FC<JSONButtonProps> = ({ schema, data }) => {
  const { t } = useTranslation();
  const { setErrors } = useError();

  const handleDownload = (data: any) => {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    const fileName = `formulaire_${timestamp}.json`;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadButton = () => {
    const ajv = CustomAjv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (valid) {
      handleDownload(data);
    } else {
      if (validate.errors) setErrors(validate.errors);
    }
  };
  return (
    <Button variant="contained" color="primary" onClick={downloadButton}>
      {t('Download')} JSON
    </Button>
  );
};
