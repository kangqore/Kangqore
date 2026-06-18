/**
 * Kangqore OS Motion System — Phase 2
 *
 * Spring physics, not easing curves. Everything that moves should feel
 * like it has mass. Import from here, never hardcode animation values.
 *
 * Usage:
 *   import { spring, variants, stagger } from '@os/motion'
 *   <motion.div variants={variants.card} initial="hidden" animate="visible" />
 */

import type { Transition, Variants } from 'framer-motion'

// ── Spring Presets ─────────────────────────────────────────────────────────
//
// snappy  — fast, decisive. UI feedback, button press, badge pop.
// smooth  — medium weight. Page entry, card expand, modal open.
// lazy    — slow, deliberate. Large panels, hero sections, sidebars.
// bouncy  — overshoots slightly. Empty state icons, success states.

export const spring = {
  snappy: { type: 'spring', stiffness: 420, damping: 36, mass: 1   } as Transition,
  smooth: { type: 'spring', stiffness: 220, damping: 26, mass: 1   } as Transition,
  lazy:   { type: 'spring', stiffness: 130, damping: 22, mass: 1   } as Transition,
  bouncy: { type: 'spring', stiffness: 380, damping: 20, mass: 0.8 } as Transition,
} as const

// ── Tween Presets (for opacity — springs don't apply to opacity) ───────────
export const tween = {
  fast:   { type: 'tween', duration: 0.12, ease: [0.4, 0, 0.2, 1]        } as Transition,
  base:   { type: 'tween', duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94]} as Transition,
  slow:   { type: 'tween', duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94]} as Transition,
} as const

// ── Reusable Variants ──────────────────────────────────────────────────────

/** Fade + rise — the default for almost everything entering the viewport */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0,  transition: { ...spring.smooth, opacity: { ...tween.base } } },
  exit:    { opacity: 0, y: 6,  transition: { ...tween.fast } },
}

/** Fade + scale — for modals, popovers, cards that pop into view */
export const fadeScale: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1,    transition: { ...spring.snappy, opacity: { ...tween.fast } } },
  exit:    { opacity: 0, scale: 0.97, transition: { ...tween.fast } },
}

/** Slide from right — for drawers, detail panels */
export const slideRight: Variants = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0,  transition: { ...spring.smooth, opacity: { ...tween.base } } },
  exit:    { opacity: 0, x: 16, transition: { ...tween.fast } },
}

/** Slide from bottom — for toasts, bottom sheets */
export const slideUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0,  transition: { ...spring.smooth, opacity: { ...tween.base } } },
  exit:    { opacity: 0, y: 12, transition: { ...tween.fast } },
}

/** Float — for empty state icons, decorative elements */
export const float: Variants = {
  rest:  { y: 0   },
  hover: { y: -4,  transition: { ...spring.lazy }   },
  float: { y: [0, -4, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
}

/** Press — for interactive cards, buttons with physical press feel */
export const press: Variants = {
  rest:  { scale: 1    },
  hover: { scale: 1.02, transition: { ...spring.snappy } },
  tap:   { scale: 0.97, transition: { ...spring.snappy } },
}

/** Stagger container — wrap a list with this, children get staggered entry */
export const staggerContainer = (staggerSeconds = 0.05): Variants => ({
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerSeconds, delayChildren: 0.02 },
  },
})

/** Stagger child — use with staggerContainer on the parent */
export const staggerChild: Variants = {
  hidden:  { opacity: 0, y: 8,  scale: 0.98 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { ...spring.smooth, opacity: { ...tween.base } } },
}

// ── Convenience: page-level entry ─────────────────────────────────────────
export const pageEntry: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { ...tween.base, staggerChildren: 0.04, delayChildren: 0.06 } },
}

// ── Convenience: tab content swap ─────────────────────────────────────────
export const tabContent: Variants = {
  hidden:  { opacity: 0, y: 6  },
  visible: { opacity: 1, y: 0, transition: { ...spring.smooth, opacity: { ...tween.fast } } },
  exit:    { opacity: 0,       transition: { ...tween.fast } },
}

// ── Convenience re-export ──────────────────────────────────────────────────
export const variants = {
  fadeUp,
  fadeScale,
  slideRight,
  slideUp,
  float,
  press,
  staggerChild,
  pageEntry,
  tabContent,
} as const

export const motion = { spring, tween, variants, staggerContainer }
export default motion
