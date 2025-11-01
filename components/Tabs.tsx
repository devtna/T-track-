import React from 'react';

type Tab = {
  id: string;
  label: string;
};

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-base-200 dark:bg-dark-body-bg p-1 rounded-lg mb-6 flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'bg-base-100 dark:bg-dark-bg text-brand-dark dark:text-brand-light shadow-sm'
                : 'text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
            } flex-1 whitespace-nowrap py-2 px-2 md:px-3 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-secondary rounded-md`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
    </div>
  );
};

export default Tabs;