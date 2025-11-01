import React from 'react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

// Fix: Export the DashboardCardProps interface so it can be imported in other components.
export interface DashboardCardProps {
  title: string;
  value: number;
  icon: 'today' | 'average' | 'total' | 'compare' | 'streak';
  subtext?: string;
  subtextColor?: string;
}

// Fix: Use React.ReactElement instead of JSX.Element to resolve "Cannot find namespace 'JSX'" error.
const icons: Record<DashboardCardProps['icon'], React.ReactElement> = {
  today: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  average: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  total: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  streak: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" />
    </svg>
  ),
  compare: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
  ),
};


const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, subtext, subtextColor }) => {
  const animatedValue = useAnimatedCounter(value);
  const displayValue = Number.isInteger(value) ? Math.round(animatedValue) : animatedValue.toFixed(1);

  return (
    <div className="bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="bg-gradient-to-br from-brand-primary to-emerald-400 text-white p-3 rounded-full shadow-sm">
        {icons[icon]}
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{displayValue}</p>
        {subtext && (
            <p className={`text-xs font-medium ${subtextColor || 'text-text-secondary dark:text-dark-text-secondary'}`}>{subtext}</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;