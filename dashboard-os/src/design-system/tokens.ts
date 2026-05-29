export const colors = {
  brand: {
    50:  '#f5f0ff',
    100: '#ede0ff',
    200: '#d9bfff',
    300: '#be93ff',
    400: '#a855f7',
    500: '#9333ea',
    600: '#7c22ce',
    700: '#6b21a8',
    800: '#581c87',
    900: '#3b0764',
  },
  surface: {
    0:   '#ffffff',
    50:  '#f8f9fb',
    100: '#f1f3f7',
    200: '#e4e8f0',
    300: '#c8d0e0',
    400: '#9aaabf',
    500: '#6b7a99',
  },
  text: {
    primary:   '#0f1117',
    secondary: '#4b5368',
    muted:     '#8896b0',
    inverse:   '#ffffff',
  },
  status: {
    success: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dot: '#22c55e' },
    warning: { bg: '#fffbeb', text: '#92400e', border: '#fde68a', dot: '#f59e0b' },
    danger:  { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', dot: '#ef4444' },
    info:    { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6' },
    neutral: { bg: '#f8f9fb', text: '#4b5368', border: '#e4e8f0', dot: '#9aaabf' },
  },
  sidebar: {
    bg:         '#0f1117',
    hover:      '#1a1d26',
    active:     '#1e1b4b',
    activeBorder:'#7c22ce',
    text:       '#9aaabf',
    textActive: '#ffffff',
    border:     '#1e2130',
  },
} as const

export const radius = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  full: '9999px',
} as const

export const shadow = {
  sm:  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md:  '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  lg:  '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
  xl:  '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
  card:'0 0 0 1px rgb(0 0 0 / 0.04), 0 2px 8px 0 rgb(0 0 0 / 0.06)',
} as const
