import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ButtonProps {
  onClick: () => void;
}

interface LogButtonProps extends ButtonProps {
    lastLogTimestamp?: number;
}

interface ClearButtonProps extends ButtonProps {
    isIcon?: boolean;
}

const formatRelativeTime = (timestamp: number | undefined, locale: string): string => {
    if (!timestamp) return '';
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
  
    try {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

        if (seconds < 60) return rtf.format(-seconds, 'second');
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return rtf.format(-minutes, 'minute');

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return rtf.format(-hours, 'hour');

        const days = Math.floor(hours / 24);
        if (days < 30) return rtf.format(-days, 'day');
        
        const months = Math.floor(days / 30);
        if (months < 12) return rtf.format(-months, 'month');

        const years = Math.floor(months / 12);
        return rtf.format(-years, 'year');
    } catch (e) {
        // Fallback for older browsers or environments without Intl.RelativeTimeFormat
        let interval = seconds / 31536000;
        if (interval > 1) return `${Math.floor(interval)}y ago`;
        interval = seconds / 2592000;
        if (interval > 1) return `${Math.floor(interval)}mo ago`;
        interval = seconds / 86400;
        if (interval > 1) return `${Math.floor(interval)}d ago`;
        interval = seconds / 3600;
        if (interval > 1) return `${Math.floor(interval)}h ago`;
        interval = seconds / 60;
        if (interval > 1) return `${Math.floor(interval)}m ago`;
        return `${Math.floor(seconds)}s ago`;
    }
};


export const LogButton: React.FC<LogButtonProps> = ({ onClick, lastLogTimestamp }) => {
  const { t, i18n } = useTranslation();
  const [relativeTime, setRelativeTime] = useState(() => formatRelativeTime(lastLogTimestamp, i18n.language));

  useEffect(() => {
    setRelativeTime(formatRelativeTime(lastLogTimestamp, i18n.language));
    const intervalId = setInterval(() => {
        setRelativeTime(formatRelativeTime(lastLogTimestamp, i18n.language));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId);
  }, [lastLogTimestamp, i18n.language]);

  const buttonClasses = "bg-brand-primary text-white hover:bg-brand-secondary focus:ring-4 focus:ring-brand-primary focus:ring-opacity-50 transition-transform transform hover:scale-105";

  return (
    <button
        onClick={onClick}
        className={`flex items-center justify-center gap-3 w-full max-w-xs h-14 px-6 font-bold rounded-full shadow-lg focus:outline-none transition-all duration-300 ${buttonClasses}`}
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <div className="text-left">
            <span>{t('actions.log')}</span>
            {relativeTime && <div className="text-xs opacity-80 -mt-1">{t('actions.lastLog', { time: relativeTime })}</div>}
        </div>
    </button>
  );
};

export const ClearButton: React.FC<ClearButtonProps> = ({ onClick, isIcon = false }) => {
  const { t } = useTranslation();
  if (isIcon) {
    return (
        <button 
            onClick={onClick} 
            className="p-2 text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-700 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label={t('actions.clearAll')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    )
  }
  return (
     <button onClick={onClick} className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">
      {t('actions.clearAll')}
     </button>
  )
}