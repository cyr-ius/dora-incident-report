import { ErrorObject } from 'ajv';
import { createContext, ReactNode, useContext, useState } from 'react';

type CustomError = ErrorObject;

interface ErrorContextType {
  customerrors: CustomError[];
  addError: (error: CustomError) => void;
  clearErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [customerrors, setErrors] = useState<CustomError[]>([]);

  const addError = (error: CustomError) => {
    setErrors(prev => [...prev, error]);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider value={{ customerrors, addError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useCustomErrors = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useCustomErrors must be used within an ErrorProvider');
  }
  return context;
};