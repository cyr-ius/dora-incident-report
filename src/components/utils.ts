import { isCategory, JsonSchema } from '@jsonforms/core';
import { ErrorObject } from 'ajv/dist/2020';
import { CustomAjv } from './ajv';

export const createTranslator =
  (locale: any) => (key: string, defaultMessage: any) => {
    console.log(
      `Locale: ${locale}, Key: ${key}, Default Message: ${defaultMessage}`,
    );
    return defaultMessage;
  };

export const currentScopes = (uischema: any, activeStep: number): string[] => {
  const categories = (uischema as any).elements.filter(isCategory);
  let currentscopes: string[] = [];

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
    currentscopes = extractScopes(currentCategoryElements);
  }
  console.debug('Current Scopes', currentscopes);
  return currentscopes;
};

export const currentScopesErrors = (
  scopes: string[],
  errors: ErrorObject[]
) => {
  let currentErrors: ErrorObject[] = [];
  if (scopes.length > 0) {
    errors?.forEach((err: any) => {
      scopes.forEach((scope: string) => {
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
    if (errors) currentErrors = [...errors];
  }

  console.debug('Current Errors: ', currentErrors);
  return currentErrors;
};

export const validateSchema = (schema: JsonSchema, data: JsonSchema): any => {
  const ajv = CustomAjv();
  const validate = ajv.compile(schema);
  const valid = validate(data);

  console.debug('Validation: ', valid, validate);
  return { valid, validate };
};
