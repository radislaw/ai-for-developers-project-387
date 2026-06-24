import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'orange',
  colors: {
    orange: [
      '#fff7ed',
      '#ffedd5',
      '#fed7aa',
      '#fdba74',
      '#fb923c',
      '#f97316',
      '#ea580c',
      '#c2410c',
      '#9a3412',
      '#7c2d12',
    ],
  },
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
    md: '0 4px 6px rgba(0, 0, 0, 0.08)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.12)',
  },
  defaultRadius: 'md',
});