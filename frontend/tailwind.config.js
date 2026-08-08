/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {

      // ── Fonts ───────────────────────────────────────────────────────────
      fontFamily: {
        sans:    ['"Inter"',   'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Figtree"', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },

      // ── OS Color Tokens ─────────────────────────────────────────────────
      colors: {
        // Existing brand/shadcn tokens (kept for backwards compat)
        'brand-blue': '#2564ea',
        'brand-cyan': '#4ab6d4',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card:        { DEFAULT: 'hsl(var(--card))',        foreground: 'hsl(var(--card-foreground))'        },
        popover:     { DEFAULT: 'hsl(var(--popover))',     foreground: 'hsl(var(--popover-foreground))'     },
        primary:     { DEFAULT: 'hsl(var(--primary))',     foreground: 'hsl(var(--primary-foreground))'     },
        secondary:   { DEFAULT: 'hsl(var(--secondary))',   foreground: 'hsl(var(--secondary-foreground))'   },
        muted:       { DEFAULT: 'hsl(var(--muted))',       foreground: 'hsl(var(--muted-foreground))'       },
        accent:      { DEFAULT: 'hsl(var(--accent))',      foreground: 'hsl(var(--accent-foreground))'      },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        chart: { '1': 'hsl(var(--chart-1))', '2': 'hsl(var(--chart-2))', '3': 'hsl(var(--chart-3))', '4': 'hsl(var(--chart-4))', '5': 'hsl(var(--chart-5))' },

        // ── OS design tokens — alpha-value functions enable bg-os-blue/20 etc. ──
        'os-bg':      ({ opacityValue }) => opacityValue !== undefined ? `rgba(6,11,24,${opacityValue})`      : '#060b18',
        'os-s0':      ({ opacityValue }) => opacityValue !== undefined ? `rgba(13,17,23,${opacityValue})`     : '#0d1117',
        'os-s1':      ({ opacityValue }) => opacityValue !== undefined ? `rgba(21,28,47,${opacityValue})`     : '#151C2F',
        'os-s2':      ({ opacityValue }) => opacityValue !== undefined ? `rgba(26,35,64,${opacityValue})`     : '#1a2340',
        'os-s3':      ({ opacityValue }) => opacityValue !== undefined ? `rgba(31,42,74,${opacityValue})`     : '#1f2a4a',
        'os-border':  ({ opacityValue }) => opacityValue !== undefined ? `rgba(46,40,84,${opacityValue})`     : '#2E2854',
        'os-blue':    ({ opacityValue }) => opacityValue !== undefined ? `rgba(37,100,234,${opacityValue})`   : '#2564ea',
        'os-cyan':    ({ opacityValue }) => opacityValue !== undefined ? `rgba(74,182,212,${opacityValue})`   : '#4ab6d4',
        'os-text-1':  ({ opacityValue }) => opacityValue !== undefined ? `rgba(255,255,255,${opacityValue})`  : '#ffffff',
        'os-text-2':  ({ opacityValue }) => opacityValue !== undefined ? `rgba(226,232,240,${opacityValue})` : '#e2e8f0',
        'os-text-3':  ({ opacityValue }) => opacityValue !== undefined ? `rgba(148,163,184,${opacityValue})` : '#94a3b8',
        'os-text-4':  ({ opacityValue }) => opacityValue !== undefined ? `rgba(100,116,139,${opacityValue})` : '#64748b',
        'os-text-5':  ({ opacityValue }) => opacityValue !== undefined ? `rgba(71,85,105,${opacityValue})`   : '#475569',
        'os-success': ({ opacityValue }) => opacityValue !== undefined ? `rgba(5,150,105,${opacityValue})`   : '#059669',
        'os-warning': ({ opacityValue }) => opacityValue !== undefined ? `rgba(217,119,6,${opacityValue})`   : '#d97706',
        'os-danger':  ({ opacityValue }) => opacityValue !== undefined ? `rgba(239,68,68,${opacityValue})`   : '#ef4444',
      },

      // ── OS Typography Scale ─────────────────────────────────────────────
      fontSize: {
        'os-xs':   ['0.625rem', { lineHeight: '1rem',    letterSpacing: '0.04em'  }],  // 10px
        'os-sm':   ['0.75rem',  { lineHeight: '1.125rem', letterSpacing: '0.01em' }],  // 12px
        'os-base': ['0.875rem', { lineHeight: '1.375rem', letterSpacing: '0'      }],  // 14px
        'os-md':   ['1rem',     { lineHeight: '1.5rem',   letterSpacing: '-0.01em'}],  // 16px
        'os-lg':   ['1.25rem',  { lineHeight: '1.5rem',   letterSpacing: '-0.02em'}],  // 20px
        'os-xl':   ['1.75rem',  { lineHeight: '2rem',     letterSpacing: '-0.03em'}],  // 28px

        // ── Marketing service pages ───────────────────────────────────────
        // That tree had 14 arbitrary font sizes in simultaneous use (10px x466,
        // 15px x232, 9px x67, 17px x41, 7px x25 …) with no ratio governing
        // them, so nothing had a reliable visual rank. These are the only
        // sizes it should use. 11px is the floor — below that, labels stop
        // being readable at arm's length regardless of contrast.
        // Enforced by scripts/audit-design-tokens.mjs.
        'svc-label': ['11px', { lineHeight: '1.25', letterSpacing: '0.12em' }],  // eyebrows, tags
        'svc-xs':    ['12px', { lineHeight: '1.4'  }],
        'svc-sm':    ['14px', { lineHeight: '1.5'  }],
        'svc-base':  ['16px', { lineHeight: '1.6'  }],
        'svc-lg':    ['20px', { lineHeight: '1.5'  }],
        'svc-xl':    ['24px', { lineHeight: '1.35' }],
        'svc-2xl':   ['32px', { lineHeight: '1.25' }],
        'svc-3xl':   ['48px', { lineHeight: '1.15' }],
        'svc-4xl':   ['64px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },

      // ── OS Border Radius ────────────────────────────────────────────────
      borderRadius: {
        // shadcn tokens (kept)
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // OS tokens (new)
        'os-xs': 'var(--os-radius-xs)',
        'os-sm': 'var(--os-radius-sm)',
        'os-md': 'var(--os-radius-md)',
        'os-lg': 'var(--os-radius-lg)',
        'os-xl': 'var(--os-radius-xl)',
      },

      // ── OS Shadows ──────────────────────────────────────────────────────
      boxShadow: {
        'os-sm':   'var(--os-shadow-sm)',
        'os-md':   'var(--os-shadow-md)',
        'os-lg':   'var(--os-shadow-lg)',
        'os-glow': 'var(--os-shadow-glow)',
        'os-cyan': 'var(--os-shadow-cyan)',
      },

      // ── OS Backdrop Blur ────────────────────────────────────────────────
      backdropBlur: {
        'os': '20px',
        'os-sm': '8px',
        'os-lg': '40px',
      },

      // ── Background Images ───────────────────────────────────────────────
      backgroundImage: {
        'brand-gradient':    'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)',
        'os-gradient':       'linear-gradient(135deg, var(--os-surface-1) 0%, var(--os-surface-0) 100%)',
        'os-gradient-blue':  'linear-gradient(135deg, rgba(37,100,234,0.15) 0%, rgba(37,100,234,0.04) 100%)',
        'os-gradient-hero':  'linear-gradient(135deg, #0d1117 0%, #0a0f1e 50%, #060b18 100%)',
      },

      // ── Motion Durations ────────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: '220ms',
        fast:    '120ms',
        base:    '220ms',
        slow:    '380ms',
      },

      // ── Keyframes ───────────────────────────────────────────────────────
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'marquee-vertical': { '0%': { transform: 'translateY(0)' },    '100%': { transform: 'translateY(-50%)' } },
        'marquee':          { '0%': { transform: 'translateX(0)' },    '100%': { transform: 'translateX(-50%)' } },
        'blob':             { '0%': { transform: 'translate(0px,0px) scale(1)' }, '33%': { transform: 'translate(30px,-50px) scale(1.1)' }, '66%': { transform: 'translate(-20px,20px) scale(0.9)' }, '100%': { transform: 'translate(0px,0px) scale(1)' } },
        // OS animations
        'os-float':         { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
        'os-pulse-glow':    { '0%,100%': { boxShadow: '0 0 12px rgba(37,100,234,0.2)' }, '50%': { boxShadow: '0 0 28px rgba(37,100,234,0.45)' } },
        'os-shimmer':       { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        'os-enter-up':      { from: { opacity: '0', transform: 'translateY(8px)' },   to: { opacity: '1', transform: 'translateY(0)' } },
        'os-enter-scale':   { from: { opacity: '0', transform: 'scale(0.96)' },        to: { opacity: '1', transform: 'scale(1)' } },
        'os-exit-down':     { from: { opacity: '1', transform: 'translateY(0)' },      to: { opacity: '0', transform: 'translateY(8px)' } },
        'os-shake':         { '0%,100%': { transform: 'translateX(0)' }, '20%': { transform: 'translateX(-3px)' }, '40%': { transform: 'translateX(3px)' }, '60%': { transform: 'translateX(-3px)' }, '80%': { transform: 'translateX(3px)' } },
      },
      animation: {
        'accordion-down':    'accordion-down 0.2s ease-out',
        'accordion-up':      'accordion-up 0.2s ease-out',
        'marquee-vertical':  'marquee-vertical 20s linear infinite',
        'marquee':           'marquee 120s linear infinite',
        'blob':              'blob 7s infinite',
        // OS animations
        'os-float':          'os-float 3s ease-in-out infinite',
        'os-pulse-glow':     'os-pulse-glow 2.5s ease-in-out infinite',
        'os-shimmer':        'os-shimmer 1.4s ease-in-out infinite',
        'os-enter-up':       'os-enter-up 0.22s var(--os-ease-smooth) forwards',
        'os-enter-scale':    'os-enter-scale 0.18s var(--os-ease-bounce) forwards',
        'os-shake':          'os-shake 0.35s var(--os-ease-snappy)',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};
