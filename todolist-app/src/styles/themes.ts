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
  background: '#111827',
  cardBackground: '#1f2937',
  text: '#f9fafb',
  secondaryText: '#9ca3af',
  border: '#374151',

  primary: '#3b82f6',
  primaryHover: '#3b82f6',
  danger: '#ef4444',
  dangerHover: '#ef4444',

  checkbox: '#3b82f6',
  completedText: '#10b981',
  error: '#ef4444',
  emptyState: '#9ca3af',

  tagBackground: '#374151',
  tagText: '#f9fafb',
};

export const tagColors = {
  blue: '#3b82f6',
  green: '#10b981',
  orange: '#f59e0b',
  red: '#ef4444',
  purple: '#a78bfa',
};

export type Theme = typeof lightTheme;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type ThemeName = keyof typeof themes;
