import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { ErrorObject } from 'ajv/dist/2020';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  currentScopes,
  currentScopesErrors,
  validateSchema,
} from '../components/utils';
import { useData } from './DataContext';

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

  const setCurrentErrors = (errs: any) => {
    console.log('Error Step', activeStep);
    if (schema) {
      const activeScopes = currentScopes(uischema, activeStep);
      const vs = validateSchema(schema, data);
      let currentErrors = currentScopesErrors(activeScopes, vs.validate.errors);
      currentErrors = currentErrors.filter(
        err => err.instancePath != '/incidentSubmission',
      );
      console.log('Error Context', errors);
      setErrors(currentErrors);

      console.log('Current Error Context', currentErrors);
      setFilteredErrors(currentErrors);
    }
  };

  useEffect(() => {
    setCurrentErrors(errors);
  }, [activeStep, schema, uischema, data]);

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
