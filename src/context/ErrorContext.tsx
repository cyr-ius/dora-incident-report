import { ErrorObject } from 'ajv/dist/2020';
import { createContext, useContext, useState } from 'react';

interface ErrorContextType {
  errors: ErrorObject[];
  setErrors: (errors: ErrorObject[]) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [errors, setErrors] = useState<ErrorObject[]>([]);
  return (
    <ErrorContext.Provider value={{ errors, setErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
