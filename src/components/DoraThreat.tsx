import { JsonSchema7 } from '@jsonforms/core';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import Grid2 from '@mui/material/Grid2';
import { FC, useEffect, useMemo } from 'react';
import schema from '../assets/cybSchema.json';
import uischema from '../assets/uiCybSchema.json';
import { useData } from '../context/DataContext';
import { useDebug } from '../context/DebugContext';
import { useLocale } from '../context/LocaleContext';
import { useSchema } from '../context/SchemaContext';
import {
  StepperWrapperRenderer,
  StepperWrapperTester,
} from '../renderer/StepperRenderer';
import { CustomAjv } from './ajv';
import { DebugMode } from './DebugMode';
import { createTranslator } from './utils';

const renderers = [
  ...materialRenderers,
  {
    tester: StepperWrapperTester,
    renderer: StepperWrapperRenderer,
  },
];

const initialData = {};

export const FormsDoraCyb: FC = () => {
  const { data, setData } = useData();
  const { locale } = useLocale();
  const ajv = useMemo(() => CustomAjv(locale), [locale]);
  const translation = useMemo(() => createTranslator(locale), [locale]);
  const { debugMode } = useDebug();
  const { setSchema, setUISchema, setActiveStep, setErrors, setCurrentErrors } =
  useSchema();

  useEffect(() => {
    setSchema(schema);
    setUISchema(uischema);
    setActiveStep(0);
    setErrors([]);
    setCurrentErrors([]);
  }, []);

  return (
    <Grid2 container justifyContent={'center'}>
      <Grid2
        size={{ xs: 12, sm: 12, md: 4 }}
        sx={{ display: debugMode ? 'block' : 'none', mx: 1 }}>
        <DebugMode />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 12, md: debugMode ? 6 : 12 }}>
        <JsonForms
          schema={schema as JsonSchema7}
          // i18n={{ locale: locale, translate: translation }}
          uischema={uischema}
          data={initialData}
          renderers={renderers}
          cells={materialCells}
          ajv={ajv}
          validationMode="ValidateAndShow"
          onChange={({ data, errors }) => {
            //   if (errors && errors.length > 0) {
            //     localize[locale](errors);
            //   }
            setData(data);
            setErrors(errors || []);
          }}
        />
      </Grid2>
    </Grid2>
  );
};
