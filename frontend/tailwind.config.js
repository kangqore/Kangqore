const { BRAND_BLUE, BRAND_CYAN, BRAND_GRADIENT } = require('./src/brand/tokens');

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
        // Brand tokens — single source: src/brand/tokens.js. Do not inline hex here.
        'brand-blue': BRAND_BLUE,
        'brand-cyan': BRAND_CYAN,
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

        // ── OS Semantic Design Tokens (mapped to CSS variables in os.css) ──
        'surface-base':     'var(--color-surface-base)',
        'surface-primary':  'var(--color-surface-primary)',
        'surface-secondary':'var(--color-surface-secondary)',
        'surface-elevated': 'var(--color-surface-elevated)',
        'surface-inverse':  'var(--color-surface-inverse)',
        
        'border':           'var(--color-border)',
        'border-subtle':    'var(--color-border-subtle)',
        'border-strong':    'var(--color-border-strong)',
        
        'text-primary':     'var(--color-text-primary)',
        'text-secondary':   'var(--color-text-secondary)',
        'text-muted':       'var(--color-text-muted)',
        'text-inverse':     'var(--color-text-inverse)',
        
        'brand-primary':    'var(--color-brand-primary)',
        'brand-secondary':  'var(--color-brand-secondary)',
        'success':          'var(--color-success)',
        'warning':          'var(--color-warning)',
        'danger':           'var(--color-danger)',
        'info':             'var(--color-info)',
        
        'success-bg':       'var(--color-success-bg)',
        'warning-bg':       'var(--color-warning-bg)',
        'danger-bg':        'var(--color-danger-bg)',
        'info-bg':          'var(--color-info-bg)',
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

      // ── Global Heavily Rounded Borders ──────────────────────────────────
      borderRadius: {
        // Enforce Apple visionOS/iOS widget deep squircles across all standard tailwind classes
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        // Specific OS tokens
        'os-xs': '4px',
        'os-sm': '8px',
        'os-md': '12px',
        'os-lg': '16px',
        'os-xl': '24px',
      },

      // ── OS Shadows ──────────────────────────────────────────────────────
      boxShadow: {
        'os-sm':   '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'os-md':   '0 4px 14px 0 rgba(0, 0, 0, 0.05)', // Apple card shadow
        'os-lg':   '0 12px 48px 0 rgba(0, 0, 0, 0.12)', // Apple floating window shadow
        'os-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
      },

      // ── OS Backdrop Blur ────────────────────────────────────────────────
      backdropBlur: {
        'os-thin': '12px',
        'os-regular': '20px', // Apple regular material
        'os-thick': '40px',   // Apple thick material
        'os': '20px',
      },

      // ── Background Images ───────────────────────────────────────────────
      backgroundImage: {
        'brand-gradient':    BRAND_GRADIENT,
        'os-gradient':       'linear-gradient(135deg, var(--os-surface-1) 0%, var(--os-surface-0) 100%)',
        'os-gradient-blue':  'linear-gradient(135deg, rgba(37,100,234,0.15) 0%, rgba(37,100,234,0.04) 100%)',
        'os-gradient-hero':  'linear-gradient(135deg, #0d1117 0%, #0a0f1e 50%, #060b18 100%)',
      },

      // ── Motion Durations & Curves ───────────────────────────────────────
      transitionDuration: {
        DEFAULT: '220ms',
        fast:    '120ms',
        base:    '220ms',
        slow:    '380ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'spring-bouncy': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
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
