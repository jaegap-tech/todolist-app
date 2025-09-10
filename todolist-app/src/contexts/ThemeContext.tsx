import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../services/localStorage';
import { THEME_STORAGE_KEY } from '../constants';
import { ThemeContext } from './ThemeContext.utils';
import type { ThemeName } from './ThemeContext.utils';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const storedTheme = loadFromLocalStorage<ThemeName>(THEME_STORAGE_KEY);
    return storedTheme || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme class
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(themeName);

    // Save preference to local storage
    saveToLocalStorage(THEME_STORAGE_KEY, themeName);
  }, [themeName]);

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};