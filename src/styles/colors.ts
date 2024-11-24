// Primary color: Deep Teal (Professional, trustworthy, medical)
// Secondary color: Warm Purple (Energetic, innovative)
// Accent color: Soft Gold (Premium, welcoming)

export const colors = {
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
} as const;

export const gradients = {
  primary: {
    light: 'from-primary-500 to-primary-600',
    DEFAULT: 'from-primary-600 to-primary-700',
    dark: 'from-primary-700 to-primary-800',
  },
  secondary: {
    light: 'from-secondary-500 to-secondary-600',
    DEFAULT: 'from-secondary-600 to-secondary-700',
    dark: 'from-secondary-700 to-secondary-800',
  },
  accent: {
    light: 'from-accent-500 to-accent-600',
    DEFAULT: 'from-accent-600 to-accent-700',
    dark: 'from-accent-700 to-accent-800',
  },
  background: {
    light: 'from-primary-50 via-secondary-50 to-accent-50',
    DEFAULT: 'from-primary-100 via-secondary-100 to-accent-100',
    dark: 'from-primary-900 via-secondary-900 to-accent-900',
  },
} as const;
