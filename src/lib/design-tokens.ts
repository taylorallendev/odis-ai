/**
 * Design Tokens for OdisAI Landing Page
 * Based on 8-point grid system and veterinary design theme
 */

// Spacing (8-point grid system)
export const spacing = {
  xs: '4px',   // 0.5 * 8
  sm: '8px',   // 1 * 8
  md: '16px',  // 2 * 8
  lg: '24px',  // 3 * 8
  xl: '32px',  // 4 * 8
  '2xl': '48px', // 6 * 8
  '3xl': '64px', // 8 * 8
  '4xl': '96px', // 12 * 8
} as const;

// Typography scale
export const typography = {
  display: {
    large: {
      fontSize: '4.5rem', // 72px
      lineHeight: '1.1',
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
    medium: {
      fontSize: '3.75rem', // 60px
      lineHeight: '1.1',
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
    small: {
      fontSize: '3rem', // 48px
      lineHeight: '1.2',
      fontWeight: '600',
      letterSpacing: '-0.01em',
    },
  },
  heading: {
    h1: {
      fontSize: '2.25rem', // 36px
      lineHeight: '1.2',
      fontWeight: '600',
    },
    h2: {
      fontSize: '1.875rem', // 30px
      lineHeight: '1.3',
      fontWeight: '600',
    },
    h3: {
      fontSize: '1.5rem', // 24px
      lineHeight: '1.4',
      fontWeight: '600',
    },
  },
  body: {
    large: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.6',
      fontWeight: '400',
    },
    medium: {
      fontSize: '1rem', // 16px
      lineHeight: '1.6',
      fontWeight: '400',
    },
    small: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.5',
      fontWeight: '400',
    },
  },
} as const;

// Color palette (veterinary theme)
export const colors = {
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Primary teal
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Primary blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  accent: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Emerald
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

// Shadows (layered for depth)
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// Border radius
export const borderRadius = {
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem',   // 8px
  xl: '0.75rem',  // 12px
  '2xl': '1rem',  // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// Animation timings
export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    linear: 'linear',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;