import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from '@google/genai';
import type { SmokeLog } from '../types';

interface AIInsightsProps {
    logs: SmokeLog[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ logs }) => {
    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [insights, setInsights] = useState<string | null>(null);

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setError(null);
        setInsights(null);

        if (logs.length < 5) {
            setError(t('pro.insights.noData'));
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Format recent logs for the prompt
            const recentLogs = logs.slice(0, 50).map(log => ({
                timestamp: log.timestamp,
                localTime: new Date(log.timestamp).toLocaleString(i18n.language)
            }));
            
            const prompt = `
                Analyze the following tobacco consumption log data for a user trying to be more mindful of their habits.
                The data is a JSON array of recent log entries, each with a UTC timestamp and a localized time string.
                Data: ${JSON.stringify(recentLogs, null, 2)}
                
                Based on this data, please do the following:
                1. Identify the time of day (e.g., morning, afternoon, late night) when the user logs the most frequently.
                2. Provide one or two brief, encouraging, and non-judgmental observations about their patterns.
                3. Offer one actionable, non-medical tip for mindfulness during their high-frequency times. For example, suggest taking a short walk, drinking a glass of water, or doing a 1-minute breathing exercise before they log.
                
                Keep the entire response concise, positive, and under 100 words.
                Address the user directly as "you".
                The current language preference is ${i18n.language}. Please provide the response in this language.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setInsights(response.text);

        } catch (err) {
            console.error("Gemini API error:", err);
            setError(t('pro.insights.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-base-100 dark:bg-dark-bg rounded-xl shadow-md p-4 md:p-6">
            <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2">{t('pro.insights.title')}</h3>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">{t('pro.insights.description')}</p>
            
            <button
                onClick={handleGenerateInsights}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-secondary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('pro.insights.generating')}
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        {t('pro.insights.button')}
                    </>
                )}
            </button>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            {insights && (
                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 rounded-r-lg">
                    <p className="text-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap">{insights}</p>
                </div>
            )}
        </div>
    );
};

export default AIInsights;
