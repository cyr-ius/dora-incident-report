import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleButton } from '../buttons/Locale';
import { useDebug } from '../context/DebugContext';
import { appVersion } from '../version';
import { PopperErrors } from './Popper';

export const Footer: FC = () => {
  const { debugMode } = useDebug();
  const { t } = useTranslation();

  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <footer className="App-footer">
      <img src="./logo_covea.png" alt="Logo" className="Branding-logo" />
      <div className="App-version">
        <small>Version: {appVersion}</small>
        {debugMode && <small> - {t('Created by')} Cédric Levasseur</small>}
      </div>
      <LocaleButton />
      <PopperErrors />
    </footer>
  );
};
