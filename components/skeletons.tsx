import React from 'react';

export const DashboardCardSkeleton: React.FC = () => {
    return (
        <div className="bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 flex items-center space-x-4">
            <div className="animate-pulse bg-base-300 dark:bg-dark-bg-secondary rounded-full h-12 w-12"></div>
            <div className="flex-1 space-y-2">
                <div className="animate-pulse bg-base-300 dark:bg-dark-bg-secondary rounded h-4 w-3/4"></div>
                <div className="animate-pulse bg-base-300 dark:bg-dark-bg-secondary rounded h-6 w-1/2"></div>
            </div>
        </div>
    );
};

export const ChartSkeleton: React.FC = () => {
    return (
        <div className="bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 md:p-6">
            <div className="animate-pulse bg-base-300 dark:bg-dark-bg-secondary rounded h-6 w-1/3 mb-4"></div>
            <div className="animate-pulse bg-base-200 dark:bg-dark-bg-secondary rounded-lg w-full h-[300px]"></div>
        </div>
    );
};