import addFormats from 'ajv-formats';
import localize from 'ajv-i18n';
import Ajv2020 from 'ajv/dist/2020';

export const CustomAjv = (locale: string = 'en'): Ajv2020 => {
  const ajv = new Ajv2020({
    strict: false,
    allErrors: true,
  });

  (ajv as any)._localize = (errors: any[]) => {
    const fn = (localize as any)[locale] ?? localize.en;
    fn(errors);
  };

  addFormats(ajv);

  return ajv;
};
