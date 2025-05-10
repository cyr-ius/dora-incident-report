import { JsonSchema } from '@jsonforms/core';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Button } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { ErrorObject } from 'ajv';
import localize from 'ajv-i18n';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import schema from '../assets/irSchema.json';
import uischema from '../assets/uiIrSchema.json';
import { useData } from '../context/DataContext';
import { useDebug } from '../context/DebugContext';
import { useCustomErrors } from '../context/ErrorContext';
import { useLocale } from '../context/LocaleContext';
import { useSchema } from '../context/SchemaContext';
import {
  StepperWrapperRenderer,
  StepperWrapperTester,
} from '../renderer/StepperRenderer';
import { CustomAjv } from './ajv';
import { DebugMode } from './DebugMode';
import { initialData } from './initialData';
import { createTranslator } from './utils';

const renderers = [
  ...materialRenderers,
  {
    tester: StepperWrapperTester,
    renderer: StepperWrapperRenderer,
  },
];

export const FormsDoraIr: FC = () => {
  const { setData } = useData();
  const { locale } = useLocale();
  const { t } = useTranslation();
  const ajv = useMemo(() => CustomAjv(locale), [locale]);
  const translation = createTranslator(t, locale);
  const { debugMode } = useDebug();

  const {customerrors} = useCustomErrors();
  const mergedErrors = useMemo(() => customerrors, [customerrors]);

  const { setSchema, setUISchema, setActiveStep, setErrors, setCurrentErrors } =
  useSchema();

  useEffect(() => {
    setSchema(schema as JsonSchema);
    setUISchema(uischema);
    setActiveStep(0);
    setErrors([]);
    setCurrentErrors([]);
  }, []);

  return (
      <Grid2 container justifyContent={'center'}>
        <Grid2
          size={{ xs: 12, sm: 12, md: 4 }}
          sx={{
            display: debugMode ? 'block' : 'none',
            mx: 1,
            height: 'calc(100vh - 330px)',
          }}>
          <DebugMode />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 12, md: debugMode ? 6 : 12 }}>
          <JsonForms
            schema={schema as JsonSchema}
            i18n={{ locale: locale, translate: translation }}
            uischema={uischema}
            data={initialData}
            renderers={renderers}
            cells={materialCells}
            ajv={ajv}
            validationMode="ValidateAndShow"
            onChange={({ data, errors }) => {
              if (errors && errors.length > 0)
                localize[locale](errors)              
              setData(data);
              setErrors(errors || []);
            }}
            config= {{
              restrict: true,
              trim: false,
              showUnfocusedDescription: debugMode ,
              hideRequiredAsterisk: false
            }}    
            additionalErrors={mergedErrors}        
          />
        </Grid2>
      </Grid2>
  );
};
