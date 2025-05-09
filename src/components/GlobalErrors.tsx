import { Box } from '@mui/material';
import { FC } from 'react';
import { useSchema } from '../context/SchemaContext';

export const GlobalErrors: FC = () => {
  const { errors } = useSchema();

  if (errors.length === 0) return null;
  return (
    <Box className="Forms-validation-errors">
      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
        {errors
          // .filter(err => err.keyword === 'required')
          .map((err, i) => (
            <li key={i}>{err.message}</li>
          ))}
      </ul>
    </Box>
  );
};
