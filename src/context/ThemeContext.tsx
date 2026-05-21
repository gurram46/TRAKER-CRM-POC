import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark' | 'pure-dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'crm-theme';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const isTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark' || value === 'pure-dark' || value === 'system';

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';

    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(savedTheme) ? savedTheme : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      root.setAttribute('data-theme', theme === 'system' ? getSystemTheme() : theme);
    };

    applyTheme();
    window.localStorage.setItem(STORAGE_KEY, theme);

    if (theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
