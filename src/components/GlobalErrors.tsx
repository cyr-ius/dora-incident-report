import { Box } from '@mui/material';
import { FC } from 'react';
import { useError } from '../context/ErrorContext';
import { useLocale } from '../context/LocaleContext';
import { CustomAjv } from './ajv';

export const GlobalErrors: FC = () => {
  const { errors } = useError();
  const { locale } = useLocale();

  if (errors.length === 0) return null;

  const ajv = CustomAjv(locale);
  (ajv as any)._localize(errors);

  return (
    <Box className="jsonforms-errors" sx={{ mx: 2 }}>
      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
        {errors
          .filter(err => err.keyword === 'required')
          .map((err, i) => (
            <li key={i}>{err.message}</li>
          ))}
      </ul>
    </Box>
  );
};
