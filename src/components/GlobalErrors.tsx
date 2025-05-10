import { Box } from '@mui/material';
import { FC } from 'react';
import { useCustomErrors } from '../context/ErrorContext';
import { useSchema } from '../context/SchemaContext';
import { deduplicateErrors } from './utils';

export const GlobalErrors: FC = () => {
  const { currenterrors } = useSchema();

  if (currenterrors.length === 0) return null;

  const deduplicatedErrors = deduplicateErrors(currenterrors)

  return (
    <Box className="Forms-validation-errors">
      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
        {deduplicatedErrors
          // .filter(err => err.keyword === 'required')
          .map((err, i) => (
            <li key={i}>{err.message}</li>
          ))}
      </ul>
    </Box>
  );
};
