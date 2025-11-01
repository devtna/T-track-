import React, { forwardRef } from 'react';

interface ShareCardStat {
    label: string;
    value: string | number;
}

interface ShareCardProps {
    title: string;
    stats: ShareCardStat[];
    theme: 'light' | 'dark' | 'system';
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ title, stats, theme }, ref) => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div
            ref={ref}
            className={`fixed -left-[9999px] top-0 p-8 flex flex-col justify-between font-sans ${isDark ? 'dark bg-dark-bg' : 'bg-base-100'}`}
            style={{ width: '600px', height: '400px' }}
        >
            <header className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
                  Tobacco <span className="text-brand-primary">Track</span>
                </h1>
            </header>
            
            <main>
                <h2 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-6">{title}</h2>
                <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <p className="text-lg font-medium text-text-secondary dark:text-dark-text-secondary">{stat.label}</p>
                            <p className="text-5xl font-extrabold text-brand-primary">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="text-right">
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Track your habits, take control.</p>
            </footer>
        </div>
    );
});

export default ShareCard;
