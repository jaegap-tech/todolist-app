import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { themes } from '../styles/themes';
import type { Theme, ThemeName } from '../styles/themes'; // Import Theme and ThemeName as types
import { loadFromLocalStorage, saveToLocalStorage } from '../services/localStorage';

interface ThemeContextType {
  currentTheme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'themePreference';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const storedTheme = loadFromLocalStorage<ThemeName>(THEME_STORAGE_KEY);
    return storedTheme || 'light'; // Default to light theme
  });

  useEffect(() => {
    saveToLocalStorage(THEME_STORAGE_KEY, themeName);
  }, [themeName]);

  const currentTheme = themes[themeName];

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themeName, setTheme }}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
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
