import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  // Initialize state from localStorage or default to 'system'
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');

  const applyTheme = useCallback((themeToApply: Theme) => {
    const root = window.document.documentElement;
    const isDark =
      themeToApply === 'dark' ||
      (themeToApply === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(isDark ? 'dark' : 'light');
    
    localStorage.setItem('theme', themeToApply);
    setTheme(themeToApply);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);
  
  const cycleTheme = useCallback(() => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    applyTheme(nextTheme);
  }, [theme, applyTheme]);

  return { theme, cycleTheme };
};
