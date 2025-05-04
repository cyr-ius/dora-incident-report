import { JsonSchema7 } from '@jsonforms/core';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Grid from '@mui/material/Grid';
import localize from 'ajv-i18n';
import { ErrorObject } from 'ajv/dist/2020';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import { FC, useEffect, useMemo, useState } from 'react';
import { useDebug } from '../context/DebugContext';
import { useLocale } from '../context/LocaleContext';
import {
  CustomCategorizationStepperRenderer,
  customCategorizationStepperTester,
} from '../renderer/StepperRenderer';
import {
  YesNoBooleanRenderer,
  yesNoBooleanTester,
} from '../renderer/YesNoBooleanREnderer';
import schema from '../schema.json';
import uischema from '../uischema.json';
import { CustomAjv } from './ajv';
import { initialData } from './initialData';

const renderers = [
  ...materialRenderers,
  {
    tester: customCategorizationStepperTester,
    renderer: CustomCategorizationStepperRenderer,
  },
  {
    tester: yesNoBooleanTester,
    renderer: YesNoBooleanRenderer,
  },
];

export const JsonFormsDora: FC = () => {
  const [data, setData] = useState<object>(initialData);
  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const { debugMode, toggleDebugMode } = useDebug();
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const { locale, setLocale } = useLocale();
  const ajv = useMemo(() => CustomAjv(locale), [locale]);

  const createTranslator =
    (locale: any) => (key: string, defaultMessage: any) => {
      console.log(
        `Locale: ${locale}, Key: ${key}, Default Message: ${defaultMessage}`,
      );
      return defaultMessage;
    };
  const translation = useMemo(() => createTranslator(locale), [locale]);

  useEffect(() => {
    // Si erreurs et que l’AJV les localise
    if (errors.length > 0 && (ajv as any)._localize) {
      (ajv as any)._localize(errors);
      setErrors([...errors]); // force le re-render avec les erreurs traduites
    }
  }, [locale, errors, ajv]);

  return (
    <Grid container justifyContent={'center'} spacing={1}>
      <Box className="App-language">
        <FormControl size="small">
          <InputLabel id="locale-label">Langue</InputLabel>
          <Select
            labelId="locale-label"
            value={locale}
            label="Langue"
            onChange={e => setLocale(e.target.value as 'en' | 'fr')}>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="fr">Français</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {debugMode && (
        <div className="App-debug-pre">
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
        </div>
      )}
      <Grid className="jsonform">
        <JsonForms
          schema={schema as JsonSchema7}
          i18n={{ locale: locale, translate: translation }}
          uischema={uischema}
          data={data}
          renderers={renderers}
          cells={materialCells}
          onChange={({ data, errors }) => {
            if (errors && errors.length > 0) {
              localize[locale](errors);
            }
            setData(data);
            setErrors(errors || []);
          }}
          ajv={ajv}
        />
      </Grid>
    </Grid>
  );
};
