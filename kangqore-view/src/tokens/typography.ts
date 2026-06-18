export const font = {
  ui:      '"Inter", system-ui, -apple-system, sans-serif',
  display: '"Figtree", system-ui, -apple-system, sans-serif',
  mono:    '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
} as const

export const fontSize = {
  xs:   '0.625rem',  // 10px
  sm:   '0.75rem',   // 12px
  base: '0.875rem',  // 14px
  md:   '1rem',      // 16px
  lg:   '1.25rem',   // 20px
  xl:   '1.75rem',   // 28px
} as const

export const fontWeight = {
  normal:   400,
  semibold: 600,
  bold:     700,
} as const

export const lineHeight = {
  tight:  '1.2',
  snug:   '1.375',
  normal: '1.5',
  relaxed:'1.625',
} as const

export const letterSpacing = {
  tight:  '-0.03em',
  snug:   '-0.02em',
  normal: '0',
  wide:   '0.04em',
  wider:  '0.08em',
  widest: '0.16em',
} as const
