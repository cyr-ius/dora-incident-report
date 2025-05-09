// src/context/DebugContext.tsx
import React, { createContext, useContext, useState } from 'react';

export const DebugContext = createContext({
  debugMode: false,
  toggleDebugMode: () => {},
});

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [debugMode, setDebugMode] = useState(false);
  const toggleDebugMode = () => setDebugMode(prev => !prev);

  return (
    <DebugContext.Provider value={{ debugMode, toggleDebugMode }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => useContext(DebugContext);
