import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../db';
import type { SmokeLog, Goal } from '../types';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const logs = await db.logs.toArray();
      const goals = await db.goals.toArray();
      const data = {
        logs,
        goals,
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      const date = new Date().toISOString().split('T')[0];
      link.download = `tobacco-track-backup-${date}.json`;
      link.click();
    } catch (error) {
      console.error("Failed to export data", error);
      alert(t('settings.export.error'));
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
            throw new Error('File content is not a string');
        }
        const data = JSON.parse(text);

        // Basic validation
        if (!data.logs || !data.goals || !Array.isArray(data.logs) || !Array.isArray(data.goals)) {
          throw new Error('Invalid file structure');
        }

        const confirmed = window.confirm(t('settings.import.confirm'));
        if (confirmed) {
          await db.transaction('rw', db.logs, db.goals, async () => {
            await db.logs.clear();
            await db.goals.clear();
            await db.logs.bulkAdd(data.logs as SmokeLog[]);
            await db.goals.bulkAdd(data.goals as Goal[]);
          });
          alert(t('settings.import.success'));
          window.location.reload();
        }
      } catch (error) {
        console.error("Failed to import data", error);
        alert(t('settings.import.error.invalidFile'));
      } finally {
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="animate-fade-in bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 md:p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2">{t('settings.title')}</h2>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{t('settings.description')}</p>
      </div>

      <div className="space-y-4">
        {/* Export Card */}
        <div>
          <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">{t('settings.export.label')}</h3>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-3">{t('settings.export.description')}</p>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-secondary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('settings.export.button')}
          </button>
        </div>

        <div className="border-t border-base-200 dark:border-dark-border"></div>

        {/* Import Card */}
        <div>
          <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">{t('settings.import.label')}</h3>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-3">{t('settings.import.description')}</p>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {t('settings.import.button')}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
