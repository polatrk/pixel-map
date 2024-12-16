import { t } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    // <select onInput={changeLanguage}>
    //   <option value='fr'>Français</option>
    //   <option value='en'>English</option>
    // </select>
    <div className="dropdown">
    <button className="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {t('Language')}
    </button>
    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <button className="dropdown-item" onClick={() => changeLanguage('fr')}>Français</button>
      <button className="dropdown-item" onClick={() => changeLanguage('en')}>English</button>
    </div>
  </div>
  
  );
};

export default LanguageSwitcher;
