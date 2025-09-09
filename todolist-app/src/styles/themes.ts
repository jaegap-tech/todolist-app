export const lightTheme = {
  background: '#f5f7fa',
  cardBackground: '#ffffff',
  text: '#1f2937',
  secondaryText: '#6b7280',
  border: '#e5e7eb',

  primary: '#3b82f6',
  primaryHover: '#3b82f6',
  danger: '#ef4444',
  dangerHover: '#ef4444',

  checkbox: '#3b82f6',
  completedText: '#10b981',
  error: '#ef4444',
  emptyState: '#6b7280',

  tagBackground: '#e0e0e0',
  tagText: '#1f2937',
};

export const darkTheme = {
  background: '#1a1a1a',
  cardBackground: '#2c2c2c',
  text: '#f5f5f5',
  secondaryText: '#bbbbbb',
  border: '#444444',
  primary: '#61dafb',
  primaryHover: '#21a1f1',
  danger: '#ff6b6b',
  dangerHover: '#ee5253',
  checkbox: '#61dafb',
  completedText: '#999',
  error: '#ff6b6b',
  emptyState: '#bbbbbb',
  tagBackground: '#444444',
  tagText: '#f5f5f5',
};

export const tagColors = {
  blue: '#3b82f6',
  green: '#10b981',
  orange: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
};

export type Theme = typeof lightTheme;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type ThemeName = keyof typeof themes;