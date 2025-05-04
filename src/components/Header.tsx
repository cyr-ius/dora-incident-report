import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebug } from '../context/DebugContext';

export const Header: FC = () => {
  const { debugMode, toggleDebugMode } = useDebug();
  const { t } = useTranslation();

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="./logo.svg"
          className="App-logo"
          alt="logo"
          onClick={toggleDebugMode}
        />
        <h1 className="App-title">{t('DORA Major Incident Report')}</h1>
        <p className="App-intro">European Bankink Authority.</p>
      </header>

      {debugMode && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          Debug mode is <strong>ON</strong>
        </div>
      )}
    </div>
  );
};
