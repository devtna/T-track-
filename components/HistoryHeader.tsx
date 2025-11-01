import React from 'react';

interface HistoryHeaderProps {
  label: string;
}

const HistoryHeader: React.FC<HistoryHeaderProps> = ({ label }) => {
  return (
    <div className="bg-base-200 dark:bg-dark-bg-secondary px-4 py-1 sticky top-0 z-0">
      <p className="font-bold text-sm text-text-secondary dark:text-dark-text-secondary">{label}</p>
    </div>
  );
};

export default HistoryHeader;