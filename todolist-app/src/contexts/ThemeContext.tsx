import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../services/localStorage';

export type ThemeName = 'light' | 'dark';

interface ThemeContextType {
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'themePreference';

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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};