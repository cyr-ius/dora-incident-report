import { Box, List, ListItem, Typography } from '@mui/material';
import { FC, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useLocale } from '../context/LocaleContext';
import { useSchema } from '../context/SchemaContext';
import { deduplicateErrors } from './utils';

export const DebugMode: FC = () => {
  const { locale } = useLocale();
  const { activeStep, currenterrors, errors } = useSchema();

  const { data } = useData();
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);

  return (
    <Box className="App-debug-pre">
      <small>
        Locale: {locale.toUpperCase()} - Step: {activeStep}
        <br />
        Current Errors:
        <br />
        {deduplicateErrors(currenterrors).map((error, index) => (
          <List sx={{p:0}}>
          <ListItem sx={{p:0, pl:1}}>
            {<Typography variant="body2" color="error"><code>{error.instancePath || '/'}</code> : {error.message} </Typography>}
          </ListItem>
        </List>
        ))}  
        <br />    
        Export JSON:
        <pre id="boundData">{stringifiedData}</pre>
        Errors:
        <br />
        {JSON.stringify(errors, null, 2)}
      </small>
    </Box>
  );
};
