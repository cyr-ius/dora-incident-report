import { JsonSchema7 } from '@jsonforms/core';
import Ajv2020 from 'ajv/dist/2020';

export const validationSchema = (
  schema: JsonSchema7,
  ajv: Ajv2020,
  data: object,
  categories?: any,
  activeStep?: number,
): any => {
  let activeScopes: string[] = [];
  let currentErrors: any[] = [];

  if (categories.length >= 0 && activeStep != undefined && activeStep >= 0) {
    const currentCategoryElements = categories[activeStep].elements ?? [];
    console.debug('Current Category: ', currentCategoryElements);
    const extractScopes = (elements: any[]): string[] => {
      let scopes: string[] = [];
      for (const el of elements) {
        if (el.scope?.startsWith('#/properties/')) {
          const scopePath = el.scope.replace('#/properties/', '');
          scopes.push(scopePath);
        }
        if (el.elements) {
          scopes = [...scopes, ...extractScopes(el.elements)];
        }
      }
      return scopes;
    };
    activeScopes = extractScopes(currentCategoryElements);
    console.debug('Current Scopes', activeScopes);
  }

  const validate = ajv.compile(schema);
  const valid = validate(data);
  console.debug('Current Data: ', data);

  if (activeScopes.length > 0) {
    validate.errors?.forEach(err => {
      activeScopes.forEach((scope: string) => {
        if (err.instancePath.includes(scope)) {
          currentErrors = [...currentErrors, err];
        } else if (
          'missingProperty' in err.params &&
          err.params.missingProperty.includes(scope)
        ) {
          currentErrors = [...currentErrors, err];
        }
      });
    });
  } else {
    if (validate.errors) currentErrors = [...validate.errors];
  }
  console.debug('Current Errors: ', currentErrors);
  console.debug('Validation: ', valid, validate);
  return { valid, validate, currentErrors };
};

export const createTranslator =
  (locale: any) => (key: string, defaultMessage: any) => {
    console.log(
      `Locale: ${locale}, Key: ${key}, Default Message: ${defaultMessage}`,
    );
    return defaultMessage;
  };
