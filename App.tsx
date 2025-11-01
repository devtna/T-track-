import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTobaccoData } from './hooks/useTobaccoData';
import { useGoalData } from './hooks/useGoalData';
import { useTheme } from './hooks/useTheme';
import type { SmokeLog, ChartData } from './types';
import Header from './components/Header';
import DashboardCard from './components/DashboardCard';
import UsageChart from './components/UsageChart';
import HistoryItem from './components/HistoryItem';
import HistoryHeader from './components/HistoryHeader';
import { LogButton, ClearButton } from './components/ActionButtons';
import Tabs from './components/Tabs';
import Reports from './components/Reports';
import Goals from './components/Goals';
import Settings from './components/Settings';
import { DashboardCardSkeleton, ChartSkeleton } from './components/skeletons';
import ShareCard from './components/ShareCard';
import { handleShareImage } from './utils/share';
import { playSound } from './utils/sounds';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { logs, addLog, deleteLog, clearAllLogs, isLoaded: logsLoaded } = useTobaccoData();
  const { goals, setGoal, isLoaded: goalsLoaded } = useGoalData();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scrolled, setScrolled] = useState(false);
  const shareDashboardRef = useRef<HTMLDivElement>(null);

  const TABS = useMemo(() => [
    { id: 'dashboard', label: t('tabs.dashboard') },
    { id: 'goals', label: t('tabs.goals') },
    { id: 'weekly', label: t('tabs.weekly') },
    { id: 'monthly', label: t('tabs.monthly') },
    { id: 'yearly', label: t('tabs.yearly') },
    { id: 'settings', label: t('tabs.settings') },
  ], [t]);

  const groupLogsByDate = useCallback((logsToGroup: SmokeLog[]) => {
    const groups: (SmokeLog | { type: 'header'; label: string })[] = [];
    let lastDate: string | null = null;
  
    const today = new Date();
    const todayDate = today.toLocaleDateString(i18n.language);
    today.setDate(today.getDate() - 1);
    const yesterdayDate = today.toLocaleDateString(i18n.language);
  
    logsToGroup.forEach(log => {
      const logDateObj = new Date(log.timestamp);
      const logDate = logDateObj.toLocaleDateString(i18n.language);
  
      if (logDate !== lastDate) {
        let label = logDateObj.toLocaleDateString(i18n.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (logDate === todayDate) {
          label = t('history.today');
        } else if (logDate === yesterdayDate) {
          label = t('history.yesterday');
        }
        groups.push({ type: 'header', label });
        lastDate = logDate;
      }
      groups.push(log);
    });
    return groups;
  }, [i18n.language, t]);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddLog = () => {
    addLog();
    playSound('log');
  };

  const handleClearAll = () => {
    if (logs.length > 0) {
      clearAllLogs();
      playSound('clear');
    }
  };

  const dashboardStats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const todayLogs = logs.filter(log => log.timestamp >= todayStart);
    const totalDays = logs.length > 0
      ? (Date.now() - logs[logs.length - 1].timestamp) / (1000 * 60 * 60 * 24)
      : 0;
    
    const weeklyAverage = totalDays >= 1 ? (logs.length / (totalDays < 7 ? 7 : totalDays)) * 7 : logs.length;

    const calculateStreak = (logsToCalc: SmokeLog[]): number => {
      if (!logsToCalc || logsToCalc.length === 0) {
        return 0;
      }

      const uniqueLogTimestamps = [
        ...new Set(
          logsToCalc.map(log => {
            const d = new Date(log.timestamp);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
          })
        )
      ].sort((a, b) => b - a);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const yesterdayTimestamp = yesterday.getTime();
      
      if (uniqueLogTimestamps[0] !== todayTimestamp && uniqueLogTimestamps[0] !== yesterdayTimestamp) {
        return 0;
      }
      
      let streak = 0;
      let expectedTimestamp = uniqueLogTimestamps[0];

      for (const timestamp of uniqueLogTimestamps) {
        if (timestamp === expectedTimestamp) {
          streak++;
          const expectedDate = new Date(expectedTimestamp);
          expectedDate.setDate(expectedDate.getDate() - 1);
          expectedTimestamp = expectedDate.getTime();
        } else {
          break;
        }
      }
      return streak;
    };


    return {
      todayCount: todayLogs.length,
      totalCount: logs.length,
      weeklyAverage: parseFloat(weeklyAverage.toFixed(1)),
      streak: calculateStreak(logs),
    };
  }, [logs]);
  
  const dashboardChartData: ChartData[] = useMemo(() => {
    const data: ChartData[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      
      const count = logs.filter(log => log.timestamp >= dayStart && log.timestamp < dayEnd).length;
      data.push({
        name: date.toLocaleDateString(i18n.language, { weekday: 'short' }),
        count: count,
      });
    }
    return data;
  }, [logs, i18n.language]);

  const groupedHistory = useMemo(() => groupLogsByDate(logs), [logs, groupLogsByDate]);
  
  const isLoaded = logsLoaded && goalsLoaded;
  
  const handleShareDashboard = async () => {
    try {
        await handleShareImage(
            shareDashboardRef.current,
            t('share.title'),
            t('share.text.daily')
        );
    } catch (e) {
        alert(t('share.error'));
    }
  };

  const renderContent = () => {
    if (!isLoaded) {
        return (
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                    <DashboardCardSkeleton />
                    <DashboardCardSkeleton />
                    <DashboardCardSkeleton />
                    <DashboardCardSkeleton />
                </div>
                <ChartSkeleton />
            </div>
        )
    }

    if (activeTab === 'dashboard') {
        return (
            <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                    <DashboardCard title={t('dashboard.smokesToday')} value={dashboardStats.todayCount} icon="today" />
                    <DashboardCard title={t('dashboard.currentStreak')} value={dashboardStats.streak} icon="streak" subtext={t('dashboard.days')} />
                    <DashboardCard title={t('dashboard.weeklyAverage')} value={dashboardStats.weeklyAverage} icon="average" />
                    <DashboardCard title={t('dashboard.totalTracked')} value={dashboardStats.totalCount} icon="total" />
                </div>
                
                <div className="bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{t('dashboard.past7Days')}</h2>
                        <button onClick={handleShareDashboard} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-primary bg-brand-light dark:bg-dark-bg-secondary dark:text-brand-light rounded-md hover:opacity-80 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                            {t('share.button')}
                        </button>
                    </div>
                    <UsageChart data={dashboardChartData} />
                </div>
            </div>
        )
    }

    if (activeTab === 'goals') {
        return <Goals logs={logs} goals={goals} onSetGoal={setGoal} />;
    }

    if (activeTab === 'settings') {
      return <Settings />;
    }

    return <Reports logs={logs} reportType={activeTab as 'weekly' | 'monthly' | 'yearly'} theme={theme} />;
  }

  return (
    <div className="min-h-screen text-text-primary dark:text-dark-text-primary font-sans">
      <Header scrolled={scrolled} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-5xl">

        <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        
        {renderContent()}

        <div className="bg-base-100 dark:bg-dark-bg rounded-xl shadow-md mt-8">
           <div className="p-4 md:p-6 border-b border-base-200 dark:border-dark-border flex justify-between items-center">
             <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{t('history.title')}</h2>
             {logs.length > 0 && <ClearButton onClick={handleClearAll} isIcon={true} />}
           </div>
           <div className="divide-y divide-base-200 dark:divide-dark-border max-h-96 overflow-y-auto">
             {isLoaded && logs.length === 0 ? (
                <div className="text-center p-8 flex flex-col items-center">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-base-300 dark:text-dark-bg-secondary mb-4">
                        <path d="M18.5 12C18.5 11.8383 18.5522 11.6803 18.6477 11.5555C19.1654 10.9254 19.5 10.125 19.5 9.25C19.5 7.73122 18.2688 6.5 16.75 6.5C16.3331 6.5 15.943 6.60228 15.6 6.78687C14.7766 5.6143 13.4883 4.83333 12 4.83333C9.94721 4.83333 8.25 6.53054 8.25 8.58333C8.25 8.91667 8.25 9.08333 8.25 9.25C8.25 10.125 7.91541 10.9254 7.39774 11.5555C7.30225 11.6803 7.25 11.8383 7.25 12C7.25 12.1617 7.30225 12.3197 7.39774 12.4445C7.91541 13.0746 8.25 13.875 8.25 14.75C8.25 14.9167 8.25 15.0833 8.25 15.4167C8.25 17.4695 9.94721 19.1667 12 19.1667C13.4883 19.1667 14.7766 18.3857 15.6 17.2131C15.943 17.3977 16.3331 17.5 16.75 17.5C18.2688 17.5 19.5 16.2688 19.5 14.75C19.5 13.875 19.1654 13.0746 18.6477 12.4445C18.5522 12.3197 18.5 12.1617 18.5 12Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12 12L5.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  <h3 className="mt-2 text-sm font-medium text-text-primary dark:text-dark-text-primary">{t('history.empty.title')}</h3>
                  <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">{t('history.empty.subtitle')}</p>
                </div>
             ) : (
                groupedHistory.map((item, index) => {
                  if ('type' in item && item.type === 'header') {
                    return <HistoryHeader key={`header-${index}`} label={item.label} />;
                  }
                  const log = item as SmokeLog;
                  return <HistoryItem key={log.id} log={log} onDelete={deleteLog} />;
                })
             )}
           </div>
        </div>
      </main>

      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-dark-body-bg/80 backdrop-blur-sm border-t border-base-200 dark:border-dark-border flex justify-center mt-8">
        <LogButton 
            onClick={handleAddLog} 
            lastLogTimestamp={logs[0]?.timestamp}
        />
      </div>

       <ShareCard
            ref={shareDashboardRef}
            title={t('share.card.dailyTitle')}
            stats={[
                { label: t('share.card.smokesToday'), value: dashboardStats.todayCount },
                { label: t('share.card.currentStreak'), value: `${dashboardStats.streak} ${t('dashboard.days')}` }
            ]}
            theme={theme}
        />
    </div>
  );
};

export default App;
