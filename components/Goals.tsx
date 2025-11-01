import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { SmokeLog, Goal, GoalType } from '../types';
import GoalProgress from './GoalProgress';

interface GoalsProps {
  logs: SmokeLog[];
  goals: Record<GoalType, Goal>;
  onSetGoal: (goal: Goal) => void;
}

const GOAL_TABS: { id: GoalType, labelKey: string }[] = [
    { id: 'daily', labelKey: 'goals.tabs.daily' },
    { id: 'weekly', labelKey: 'goals.tabs.weekly' },
    { id: 'monthly', labelKey: 'goals.tabs.monthly' },
];

const getMotivationalMessage = (limit: number, percentage: number): { textKey: string; icon: React.ReactElement; colorClass: string; } => {
    const icons = {
        default: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
        trophy: <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 01-2-2V9a2 2 0 012-2h4l2 3h4a2 2 0 012 2v2a2 2 0 01-2 2h-4l-2-3H9zM9 21a2 2 0 01-2-2V9" />,
        flag: <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />,
        warning: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
        thumb_up: <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.714 4.264M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />,
        heart: <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    };

    const iconBase = (path: React.ReactElement, className: string) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{path}</svg>;

    if (limit === 0) return { 
        textKey: "goals.motivation.start", 
        icon: iconBase(icons.flag, 'text-blue-500'),
        colorClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
    };
    if (percentage === 0) return { 
        textKey: "goals.motivation.cleanSlate", 
        icon: iconBase(icons.trophy, 'text-green-500'),
        colorClass: 'bg-green-50 dark:bg-green-900/20 border-green-500'
    };
    if (percentage < 50) return { 
        textKey: "goals.motivation.excellent", 
        icon: iconBase(icons.thumb_up, 'text-green-500'),
        colorClass: 'bg-green-50 dark:bg-green-900/20 border-green-500'
    };
    if (percentage < 90) return { 
        textKey: "goals.motivation.gettingClose", 
        icon: iconBase(icons.default, 'text-yellow-500'),
        colorClass: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
    };
    if (percentage <= 100) return { 
        textKey: "goals.motivation.limitReached", 
        icon: iconBase(icons.warning, 'text-orange-500'),
        colorClass: 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
    };
    return { 
        textKey: "goals.motivation.overLimit", 
        icon: iconBase(icons.heart, 'text-red-500'),
        colorClass: 'bg-red-50 dark:bg-red-900/20 border-red-500'
    };
};


const Goals: React.FC<GoalsProps> = ({ logs, goals, onSetGoal }) => {
    const { t } = useTranslation();
    const [activeGoalType, setActiveGoalType] = useState<GoalType>('daily');
    const [inputValue, setInputValue] = useState<string>('');
    
    const activeGoal = goals[activeGoalType];

    useEffect(() => {
        setInputValue(activeGoal.limit > 0 ? String(activeGoal.limit) : '');
    }, [activeGoalType, activeGoal]);
    
    const { currentCount, percentage } = useMemo(() => {
        const now = new Date();
        let startTime: number;

        if (activeGoalType === 'daily') {
            startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        } else if (activeGoalType === 'weekly') {
            const dayOfWeek = now.getDay();
            const firstDayOfWeek = new Date(now);
            firstDayOfWeek.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
            startTime = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate()).getTime();
        } else { // monthly
            startTime = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        }
        
        const count = logs.filter(log => log.timestamp >= startTime).length;
        const limit = activeGoal.limit;
        const perc = limit > 0 ? Math.round((count / limit) * 100) : 0;
        
        return { currentCount: count, percentage: perc };
    }, [logs, activeGoal, activeGoalType]);

    const handleSetGoal = (e: React.FormEvent) => {
        e.preventDefault();
        const limit = parseInt(inputValue, 10);
        if (!isNaN(limit) && limit >= 0) {
            onSetGoal({ type: activeGoalType, limit });
        }
    };
    
    const { textKey, icon: motivationalIcon, colorClass } = getMotivationalMessage(activeGoal.limit, percentage);
    const motivationalText = t(textKey);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 md:p-6">
                <div className="flex border-b border-base-200 dark:border-dark-border mb-4">
                    {GOAL_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveGoalType(tab.id)}
                            className={`py-2 px-4 text-sm font-semibold transition-colors ${
                                activeGoalType === tab.id
                                    ? 'border-b-2 border-brand-primary text-brand-primary'
                                    : 'text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
                            }`}
                        >
                            {t(tab.labelKey)}
                        </button>
                    ))}
                </div>
                
                <div className="p-2">
                    <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-2">{t('goals.setGoalTitle', { type: t(`goals.tabs.${activeGoalType}`) })}</h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
                        {t('goals.setGoalSubtitle')}
                    </p>
                    <form onSubmit={handleSetGoal} className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="number"
                            min="0"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder={t('goals.inputPlaceholder')}
                            className="flex-grow p-2 border border-base-300 dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary bg-transparent dark:text-dark-text-primary"
                            aria-label={`${activeGoalType} consumption limit`}
                        />
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-secondary transition-colors">
                            {t('goals.setGoalButton')}
                        </button>
                    </form>
                </div>
            </div>

            <div className="bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 md:p-6">
                <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-4">{t('goals.progressTitle')}</h3>
                {activeGoal.limit > 0 ? (
                    <GoalProgress current={currentCount} limit={activeGoal.limit} />
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-base-200 dark:border-dark-border rounded-lg">
                        <p className="text-text-secondary dark:text-dark-text-secondary">{t('goals.noGoal.title')}</p>
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{t('goals.noGoal.subtitle')}</p>
                    </div>
                )}
            </div>
            
            <div className={`rounded-lg p-4 flex items-center gap-4 border-l-4 ${colorClass}`}>
                <div>
                    {motivationalIcon}
                </div>
                <p className="text-text-secondary dark:text-dark-text-secondary font-medium flex-1">{motivationalText}</p>
            </div>
        </div>
    );
};

export default Goals;