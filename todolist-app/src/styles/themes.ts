export const lightTheme = {
  background: '#f0f2f5',
  cardBackground: '#ffffff',
  text: '#333333',
  secondaryText: '#666666',
  border: '#e0e0e0',
  primary: '#007bff',
  primaryHover: '#0056b3',
  danger: '#dc3545',
  dangerHover: '#c82333',
  checkbox: '#007bff',
  completedText: '#888',
  error: 'red',
  emptyState: '#888',
  tagBackground: '#e0e0e0',
  tagText: '#555',
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

export type Theme = typeof lightTheme;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type ThemeName = keyof typeof themes;
