import { createContext } from 'react';

export type ThemeName = 'light' | 'dark';

export interface ThemeContextType {
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);