import { BRAND_BLUE, BRAND_CYAN } from '../../brand/tokens'

export const surface = {
  bg:    '#060b18',
  0:     '#0d1117',
  1:     '#151C2F',
  2:     '#1a2340',
  3:     '#1f2a4a',
  glass: 'rgba(21, 28, 47, 0.72)',
} as const

export const border = {
  default: '#2E2854',
  subtle:  'rgba(46, 40, 84, 0.45)',
  strong:  '#3d3870',
} as const

// Brand tokens — single source: src/brand/tokens.js. Do not inline brand hex here.
// The 135deg gradient below is a deliberate product-surface variant: diagonal
// reads better on cards and panels. The 90deg BRAND_GRADIENT in tokens.js is the
// brand-standard reference. Both are intentional — this is not drift.
export const brand = {
  blue:     BRAND_BLUE,
  cyan:     BRAND_CYAN,
  blueDim:  'rgba(37, 100, 234, 0.14)',
  cyanDim:  'rgba(74, 182, 212, 0.12)',
  blueGlow: 'rgba(37, 100, 234, 0.35)',
  cyanGlow: 'rgba(74, 182, 212, 0.25)',
  gradient: `linear-gradient(135deg, ${BRAND_BLUE} 0%, ${BRAND_CYAN} 100%)`,
} as const

export const text = {
  1: '#ffffff',
  2: '#e2e8f0',
  3: '#94a3b8',
  4: '#64748b',
  5: '#475569',
} as const

export const status = {
  success:    '#059669',
  warning:    '#d97706',
  danger:     '#ef4444',
  info:       BRAND_BLUE, // intentionally the brand blue — see src/brand/tokens.js
  successDim: 'rgba(5,   150, 105, 0.12)',
  warningDim: 'rgba(217, 119,   6, 0.12)',
  dangerDim:  'rgba(239,  68,  68, 0.12)',
  infoDim:    'rgba(37,  100, 234, 0.12)',
} as const
