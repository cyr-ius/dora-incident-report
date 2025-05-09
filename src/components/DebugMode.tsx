import { Box } from '@mui/material';
import { FC, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useLocale } from '../context/LocaleContext';
import { useSchema } from '../context/SchemaContext';

export const DebugMode: FC = () => {
  const { locale } = useLocale();
  const { activeStep, currenterrors, errors } = useSchema();

  const { data } = useData();
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);

  return (
    <Box className="App-debug-pre">
      <small>
        Pour l'import du schéma DORA, dans la balise $schema
        <br />
        <ul>
          <li>Retirer le # en fin de ligne</li>
          <li>Remplacer le http par du https</li>
        </ul>
        <br />
        Locale: {locale.toUpperCase()} - Step: {activeStep}
        <br />
        Export JSON
        <pre id="boundData">{stringifiedData}</pre>
      </small>
      <small>
        Current Errors:
        <br />
        {JSON.stringify(currenterrors, null, 2)}
        <br />
        <br />
        Errors:
        <br />
        {JSON.stringify(errors, null, 2)}
      </small>
    </Box>
  );
};
