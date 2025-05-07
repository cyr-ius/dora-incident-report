import { JsonSchema7 } from '@jsonforms/core';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import Grid2 from '@mui/material/Grid2';
import localize from 'ajv-i18n';
import { ErrorObject } from 'ajv/dist/2020';
import { FC, useMemo, useState } from 'react';
import schema from '../assets/cybSchema.json';
import uischema from '../assets/uiCybSchema.json';
import { useDebug } from '../context/DebugContext';
import { useLocale } from '../context/LocaleContext';
import {
  CustomCategorizationStepperRenderer,
  customCategorizationStepperTester,
} from '../renderer/StepperRenderer';
import { TextAreaRenderer, TextAreaTester } from '../renderer/TextAreaRenderer';
import {
  YesNoBooleanRenderer,
  yesNoBooleanTester,
} from '../renderer/YesNoBooleanRenderer';
import { CustomAjv } from './ajv';
import { DebugMode } from './DebugMode';
import { createTranslator } from './utils';

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
  {
    tester: TextAreaTester,
    renderer: TextAreaRenderer,
  },
];

const initialData = {};

export const FormsDoraCyb: FC = () => {
  const [data, setData] = useState<object>(initialData);
  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const { locale } = useLocale();
  const ajv = useMemo(() => CustomAjv(locale), [locale]);
  const translation = useMemo(() => createTranslator(locale), [locale]);
  const { debugMode } = useDebug();

  return (
    <Grid2 container justifyContent={'center'}>
      <Grid2
        size={{ xs: 12, sm: 12, md: 4 }}
        sx={{ display: debugMode ? 'block' : 'none', mx: 1 }}>
        <DebugMode data={data} errors={errors} />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 12, md: debugMode ? 6 : 12 }}>
        <JsonForms
          schema={schema as JsonSchema7}
          // i18n={{ locale: locale, translate: translation }}
          uischema={uischema}
          data={data}
          renderers={renderers}
          cells={materialCells}
          ajv={ajv}
          onChange={({ data, errors }) => {
            if (errors && errors.length > 0) {
              localize[locale](errors);
            }
            setData(data);
            setErrors(errors || []);
          }}
        />
      </Grid2>
    </Grid2>
  );
};
