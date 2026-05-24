import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'pos_theme';

/**
 * isLoggedIn  — true while user is actively using the app
 * isLoggingOut — true during the sign-out animation (1.5 s window)
 *
 * Theme is stored locally and toggles only between light and dark.
 * The login page always renders in its default light style.
 */
export const useTheme = (isLoggedIn: boolean = false, isLoggingOut: boolean = false) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    if (!isLoggedIn || isLoggingOut) {
      root.removeAttribute('data-theme');
      return;
    }

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, isLoggedIn, isLoggingOut]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};
