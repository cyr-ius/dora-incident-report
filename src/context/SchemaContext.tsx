import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import localize from 'ajv-i18n';
import { ErrorObject } from 'ajv/dist/2020';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  currentScopes,
  currentScopesErrors,
  deduplicateErrors,
  validateSchema,
} from '../components/utils';
import { useData } from './DataContext';
import { useCustomErrors } from './ErrorContext';
import { useLocale } from './LocaleContext';

interface SchemaContextType {
  activeStep: number;
  schema: JsonSchema | undefined;
  uischema: UISchemaElement | undefined;
  errors: ErrorObject<string, Record<string, any>, unknown>[];
  currenterrors: ErrorObject<string, Record<string, any>, unknown>[];
  setActiveStep: (step: number) => void;
  setSchema: (schema: JsonSchema) => void;
  setUISchema: (uischema: UISchemaElement) => void;
  setErrors: (
    errors: ErrorObject<string, Record<string, any>, unknown>[],
  ) => void;
  setCurrentErrors: (
    errors: ErrorObject<string, Record<string, any>, unknown>[],
  ) => void;
}

const SchemaContext = createContext<SchemaContextType | undefined>(undefined);

export const SchemaProvider = ({ children }: { children: React.ReactNode }) => {
  const {locale} = useLocale();
  const {customerrors, addError, clearErrors} = useCustomErrors();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [schema, setSchema] = useState<JsonSchema | undefined>(undefined);
  const [errors, setErrors] = useState<
    ErrorObject<string, Record<string, any>, unknown>[]
  >([]);
  const [uischema, setUISchema] = useState<UISchemaElement | undefined>(
    undefined,
  );
  const [currenterrors, setFilteredErrors] = useState<
    ErrorObject<string, Record<string, any>, unknown>[]
  >([]);

  const { data } = useData();

  let currentErrors: ErrorObject<string, Record<string, any>, unknown>[] = []

  const setCurrentErrors = (errs: any) => {
    console.debug('Error Step', activeStep);
    if (schema) {
      const activeScopes = currentScopes(uischema, activeStep);
      const vs = validateSchema(schema, data);

      if (vs.validate.errors && vs.validate.errors.length > 0) {
        localize[locale](vs.validate.errors);
      }

      currentErrors = currentScopesErrors(activeScopes, vs.validate.errors);
      currentErrors = currentErrors.filter(
        err => err.instancePath != '/incidentSubmission',
      );
      console.debug('Error Context:', errors);
      setErrors(vs.validate.errors);
      setFilteredErrors(currentErrors);

    }
  };

  useEffect(() => {
    setCurrentErrors(errors);
  }, [activeStep, data]);


  return (
    <SchemaContext.Provider
      value={{
        activeStep,
        schema,
        uischema,
        errors,
        currenterrors,
        setActiveStep,
        setSchema,
        setUISchema,
        setErrors,
        setCurrentErrors,
      }}>
      {children}
    </SchemaContext.Provider>
  );
};

export const useSchema = () => {
  const context = useContext(SchemaContext);
  if (!context) {
    throw new Error('useSchema must be used within an SchemaProvider');
  }
  return context;
};
