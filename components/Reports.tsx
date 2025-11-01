import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { SmokeLog, ChartData } from '../types';
import DashboardCard from './DashboardCard';
import UsageChart from './UsageChart';
import type { DashboardCardProps } from './DashboardCard';
import ShareCard from './ShareCard';
import { handleShareImage } from '../utils/share';

type ReportType = 'weekly' | 'monthly' | 'yearly';

interface ReportsProps {
  logs: SmokeLog[];
  reportType: ReportType;
  theme: 'light' | 'dark' | 'system';
}

// --- Helper Functions ---

const getComparison = (current: number, previous: number) => {
    if (previous === 0) {
      return {
        subtextKey: current > 0 ? 'reports.comparison.upFrom' : 'reports.comparison.stillAt',
        subtextValues: { value: 0 },
        subtextColor: current > 0 ? 'text-red-500' : 'text-green-500',
      };
    }
    if (current === previous) {
      return {
        subtextKey: 'reports.comparison.noChange',
        subtextValues: {},
        subtextColor: 'text-text-secondary dark:text-dark-text-secondary',
      };
    }
  
    const percentChange = ((current - previous) / previous) * 100;
    const key = percentChange > 0 ? 'reports.comparison.increase' : 'reports.comparison.decrease';
    const color = percentChange > 0 ? 'text-red-500' : 'text-green-500';
  
    return {
      subtextKey: key,
      subtextValues: { percent: `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(0)}` },
      subtextColor: color,
    };
  };

// Helper to format Date to 'YYYY-MM-DD' for input[type=date]
const formatDateForInput = (date: Date): string => {
    if (!date || isNaN(date.getTime())) {
        return '';
    }
    return date.toISOString().split('T')[0];
};


// --- Report Generation Logic ---

// Fix: Update the type of the `t` function to allow for a second argument for translation options.
const generateReportData = (logs: SmokeLog[], reportType: ReportType, startDate: Date, endDate: Date, t: (key: string, options?: any) => string) => {
  let title = '';
  let statsCards: DashboardCardProps[] = [];
  let chartData: ChartData[] = [];

  // Weekly Report
  if (reportType === 'weekly') {
    const startOfPrevPeriod = new Date(startDate);
    startOfPrevPeriod.setDate(startDate.getDate() - 7);
    const endOfPrevPeriod = new Date(endDate);
    endOfPrevPeriod.setDate(endDate.getDate() - 7);

    title = t('reports.weekly');

    const currentPeriodLogs = logs.filter(l => l.timestamp >= startDate.getTime() && l.timestamp <= endDate.getTime());
    const prevPeriodLogs = logs.filter(l => l.timestamp >= startOfPrevPeriod.getTime() && l.timestamp <= endOfPrevPeriod.getTime());

    const comparison = getComparison(currentPeriodLogs.length, prevPeriodLogs.length);
    const daysInRange = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1);

    statsCards = [
      { title: t('reports.inRange'), value: currentPeriodLogs.length, icon: 'total' },
      { title: t('reports.dailyAverage'), value: parseFloat((currentPeriodLogs.length / daysInRange).toFixed(1)), icon: 'average' },
      // Fix: Remove `as any` cast as the `t` function signature now correctly handles the second argument.
      { title: t('reports.vsPrevious'), value: prevPeriodLogs.length, icon: 'compare', subtext: t(comparison.subtextKey, comparison.subtextValues), subtextColor: comparison.subtextColor },
    ];

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    chartData = weekdays.map((dayName, i) => {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i - startDate.getDay()); // Adjust to start of week (Sunday)
        const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate() + i).getTime();
        const dayEnd = dayStart + 24 * 60 * 60 * 1000;
        
        let count = 0;
        if(dayStart >= startDate.getTime() && dayStart < endDate.getTime()){
            count = logs.filter(log => log.timestamp >= dayStart && log.timestamp < dayEnd).length;
        }

        return { name: dayName, count };
    }).slice(0, Math.min(7, daysInRange));
  }

  // Monthly Report
  if (reportType === 'monthly') {
    const startOfPrevMonth = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 0);
    endOfPrevMonth.setHours(23, 59, 59, 999);

    title = t('reports.monthly');

    const currentMonthLogs = logs.filter(l => l.timestamp >= startDate.getTime() && l.timestamp <= endDate.getTime());
    const prevMonthLogs = logs.filter(l => l.timestamp >= startOfPrevMonth.getTime() && l.timestamp <= endOfPrevMonth.getTime());

    const comparison = getComparison(currentMonthLogs.length, prevMonthLogs.length);
    const daysInMonth = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1);

    statsCards = [
      { title: t('reports.inRange'), value: currentMonthLogs.length, icon: 'total' },
      { title: t('reports.dailyAverage'), value: parseFloat((currentMonthLogs.length / daysInMonth).toFixed(1)), icon: 'average' },
      // Fix: Remove `as any` cast as the `t` function signature now correctly handles the second argument.
      { title: t('reports.vsLastMonth'), value: prevMonthLogs.length, icon: 'compare', subtext: t(comparison.subtextKey, comparison.subtextValues), subtextColor: comparison.subtextColor },
    ];

    let week = 1;
    for (let i = 1; i <= endDate.getDate(); i += 7) {
      const weekStart = new Date(startDate.getFullYear(), startDate.getMonth(), i).getTime();
      const weekEnd = new Date(startDate.getFullYear(), startDate.getMonth(), Math.min(i + 6, endDate.getDate() + 1)).getTime();
      const count = currentMonthLogs.filter(l => l.timestamp >= weekStart && l.timestamp < weekEnd).length;
      chartData.push({ name: `Week ${week}`, count });
      week++;
    }
  }

  // Yearly Report
  if (reportType === 'yearly') {
    const startOfPrevYear = new Date(startDate.getFullYear() - 1, 0, 1);
    const endOfPrevYear = new Date(startDate.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

    title = t('reports.yearly');

    const currentYearLogs = logs.filter(l => l.timestamp >= startDate.getTime() && l.timestamp <= endDate.getTime());
    const prevYearLogs = logs.filter(l => l.timestamp >= startOfPrevYear.getTime() && l.timestamp <= endOfPrevYear.getTime());

    const comparison = getComparison(currentYearLogs.length, prevYearLogs.length);

    statsCards = [
      { title: t('reports.inRange'), value: currentYearLogs.length, icon: 'total' },
      { title: t('reports.monthlyAverage'), value: parseFloat((currentYearLogs.length / 12).toFixed(1)), icon: 'average' },
      // Fix: Remove `as any` cast as the `t` function signature now correctly handles the second argument.
      { title: t('reports.vsLastYear'), value: prevYearLogs.length, icon: 'compare', subtext: t(comparison.subtextKey, comparison.subtextValues), subtextColor: comparison.subtextColor },
    ];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(startDate.getFullYear(), i, 1).getTime();
      const monthEnd = new Date(startDate.getFullYear(), i + 1, 0, 23, 59, 59, 999).getTime();
      const count = currentYearLogs.filter(l => l.timestamp >= monthStart && l.timestamp <= monthEnd).length;
      chartData.push({ name: monthNames[i], count });
    }
  }

  return { title, statsCards, chartData };
};


const Reports: React.FC<ReportsProps> = ({ logs, reportType, theme }) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const shareWeeklyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    let newStart = new Date();
    let newEnd = new Date();

    if (reportType === 'weekly') {
      const dayOfWeek = now.getDay();
      newStart.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start of week (Monday)
      newEnd = new Date(newStart);
      newEnd.setDate(newStart.getDate() + 6); // End of week (Sunday)
    } else if (reportType === 'monthly') {
      newStart = new Date(now.getFullYear(), now.getMonth(), 1);
      newEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (reportType === 'yearly') {
      newStart = new Date(now.getFullYear(), 0, 1);
      newEnd = new Date(now.getFullYear(), 11, 31);
    }
    
    newStart.setHours(0, 0, 0, 0);
    newEnd.setHours(23, 59, 59, 999);
    setStartDate(newStart);
    setEndDate(newEnd);
  }, [reportType]);


  const { title, statsCards, chartData } = useMemo(() => {
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return { title: t('general.loading'), statsCards: [], chartData: [] };
    }
    return generateReportData(logs, reportType, startDate, endDate, t);
  }, [logs, reportType, startDate, endDate, t]);
  
  const handleShareWeekly = async () => {
    try {
        await handleShareImage(
            shareWeeklyRef.current,
            t('share.title'),
            t('share.text.weekly')
        );
    } catch(e) {
        alert(t('share.error'));
    }
  };


  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<Date>>, isEndDate = false) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateVal = e.target.value;
      if (dateVal) {
          const newDate = new Date(dateVal);
          // Adjust for timezone offset
          const timezoneOffset = newDate.getTimezoneOffset() * 60000;
          const adjustedDate = new Date(newDate.getTime() + timezoneOffset);

          if(isEndDate) adjustedDate.setHours(23, 59, 59, 999);
          else adjustedDate.setHours(0, 0, 0, 0);
          setter(adjustedDate);
      }
  };

  return (
    <div className="animate-fade-in">
        <div className="bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary shrink-0">{title}</h2>
                {reportType === 'weekly' && (
                    <button onClick={handleShareWeekly} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-primary bg-brand-light dark:bg-dark-bg-secondary dark:text-brand-light rounded-md hover:opacity-80 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        {t('share.button')}
                    </button>
                )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                <div className="flex-1 w-full sm:w-auto">
                    <label htmlFor="start-date" className="sr-only">Start Date</label>
                    <input
                        type="date"
                        id="start-date"
                        value={formatDateForInput(startDate)}
                        onChange={handleDateChange(setStartDate)}
                        className="w-full p-2 border border-base-300 dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary bg-transparent dark:text-dark-text-primary"
                    />
                </div>
                <span className="text-text-secondary dark:text-dark-text-secondary hidden sm:block">-</span>
                <div className="flex-1 w-full sm:w-auto">
                    <label htmlFor="end-date" className="sr-only">End Date</label>
                    <input
                        type="date"
                        id="end-date"
                        value={formatDateForInput(endDate)}
                        onChange={handleDateChange(setEndDate, true)}
                        className="w-full p-2 border border-base-300 dark:border-dark-border rounded-md focus:ring-brand-primary focus:border-brand-primary bg-transparent dark:text-dark-text-primary"
                    />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            {statsCards.map(card => <DashboardCard key={`${card.title}-${card.value}`} {...card} />)}
        </div>
        <div className="bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 md:p-6">
            <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-4">{t('reports.trend')}</h3>
            <UsageChart data={chartData} />
        </div>

        {reportType === 'weekly' && statsCards.length > 1 && (
             <ShareCard
                ref={shareWeeklyRef}
                title={t('share.card.weeklyTitle')}
                stats={[
                    { label: statsCards[0].title, value: statsCards[0].value },
                    { label: statsCards[1].title, value: statsCards[1].value }
                ]}
                theme={theme}
            />
        )}
    </div>
  );
};

export default Reports;