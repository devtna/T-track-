import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '../hooks/useSubscription';
import type { SmokeLog } from '../types';
import AIInsights from './AIInsights';

interface ProTabProps {
    logs: SmokeLog[];
}

const ProFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-text-secondary dark:text-dark-text-secondary">{children}</span>
    </li>
);

const ProTab: React.FC<ProTabProps> = ({ logs }) => {
    const { t } = useTranslation();
    const { isPro, subscribe, unsubscribe } = useSubscription();

    if (!isPro) {
        return (
            <div className="animate-fade-in bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 md:p-8 text-center">
                <div className="max-w-md mx-auto">
                    <div className="mx-auto mb-4 inline-block p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">{t('pro.upgrade.title')}</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary mb-6">{t('pro.upgrade.description')}</p>

                    <ul className="space-y-3 text-left mb-8">
                        <ProFeature>{t('pro.upgrade.features.insights')}</ProFeature>
                        <ProFeature>{t('pro.upgrade.features.unlimited')}</ProFeature>
                        <ProFeature>{t('pro.upgrade.features.reporting')}</ProFeature>
                        <ProFeature>{t('pro.upgrade.features.support')}</ProFeature>
                    </ul>
                    
                    <button 
                        onClick={subscribe}
                        className="w-full max-w-xs h-12 px-6 bg-gradient-to-r from-brand-primary to-emerald-600 text-white font-bold rounded-full shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-primary focus:ring-opacity-50 transition-transform transform hover:scale-105"
                    >
                        {t('pro.upgrade.button')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 md:p-6 text-center">
                <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-1">{t('pro.manage.title')}</h2>
                <p className="text-text-secondary dark:text-dark-text-secondary mb-4">{t('pro.manage.description')}</p>
                <button
                    onClick={unsubscribe}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                    {t('pro.manage.button')}
                </button>
            </div>
            <AIInsights logs={logs} />
        </div>
    );
};

export default ProTab;