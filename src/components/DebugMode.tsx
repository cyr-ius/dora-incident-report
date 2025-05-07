import { Box } from '@mui/material';
import { FC, useMemo } from 'react';
import { useLocale } from '../context/LocaleContext';

interface DebugModeProps {
  data: any;
  errors: any;
}

export const DebugMode: FC<DebugModeProps> = ({ data, errors }) => {
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const { locale } = useLocale();
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
        Locale: {locale.toUpperCase()}
        <br />
        Export JSON:
      </small>
      <pre id="boundData">{stringifiedData}</pre>
      <small>
        Errors:
        <br />
        {JSON.stringify(errors, null, 2)}
      </small>
    </Box>
  );
};
