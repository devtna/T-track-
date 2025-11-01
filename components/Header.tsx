import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
    scrolled: boolean;
}

const ThemeIcon = () => {
    const { theme } = useTheme();
    if (theme === 'dark') {
      return ( // Moon Icon
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    }
    if (theme === 'light') {
      return ( // Sun Icon
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
    return ( // System Icon
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
};

const Header: React.FC<HeaderProps> = ({ scrolled }) => {
    const { t, i18n } = useTranslation();
    const { cycleTheme } = useTheme();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setLangDropdownOpen(false);
    };

  return (
    <header className={`sticky top-0 z-10 bg-white/80 dark:bg-dark-body-bg/80 backdrop-blur-sm transition-shadow duration-300 ${scrolled ? 'shadow-md dark:shadow-black/20' : 'shadow-sm dark:shadow-black/10'} border-b border-transparent dark:border-dark-border`}>
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              {t('header.title')} <span className="text-brand-primary">{t('header.subtitle')}</span>
            </h1>
        </div>
        
        <div className="flex items-center gap-2">
            <button
                onClick={cycleTheme}
                className="p-2 text-sm font-medium text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors rounded-md hover:bg-base-200 dark:hover:bg-dark-bg"
                aria-label="Cycle theme"
            >
                <ThemeIcon />
            </button>
            <div className="relative">
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)} 
                className="flex items-center gap-2 text-sm font-medium text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors p-2 rounded-md hover:bg-base-200 dark:hover:bg-dark-bg"
                aria-haspopup="true"
                aria-expanded={langDropdownOpen}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <span>{i18n.language.split('-')[0].toUpperCase()}</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-dark-bg rounded-md shadow-lg py-1 z-20 ring-1 ring-black dark:ring-dark-border ring-opacity-5">
                  <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-base-200 dark:hover:bg-dark-bg-secondary">{t('language.english')}</button>
                  <button onClick={() => changeLanguage('es')} className="block w-full text-left px-4 py-2 text-sm text-text-primary dark:text-dark-text-primary hover:bg-base-200 dark:hover:bg-dark-bg-secondary">{t('language.spanish')}</button>
                </div>
              )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;