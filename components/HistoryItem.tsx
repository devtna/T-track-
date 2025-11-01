import React from 'react';
import { useTranslation } from 'react-i18next';
import type { SmokeLog } from '../types';

interface HistoryItemProps {
  log: SmokeLog;
  onDelete: (id: number) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ log, onDelete }) => {
  const { i18n } = useTranslation();
  const date = new Date(log.timestamp);
  const formattedDate = date.toLocaleDateString(i18n.language, {
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-4 flex justify-between items-center group hover:bg-emerald-50 dark:hover:bg-dark-bg-secondary/50 transition-colors">
      <div>
        <p className="font-semibold text-text-primary dark:text-dark-text-primary">{formattedTime}</p>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{formattedDate}</p>
      </div>
      <button
        onClick={() => onDelete(log.id)}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Delete log entry"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default HistoryItem;