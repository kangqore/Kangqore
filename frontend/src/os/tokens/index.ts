/**
 * Kangqore OS Design Tokens — JS/TS layer
 *
 * Mirror of the CSS variables in os.css.
 * Import from here for Framer Motion, charts, canvas, dynamic style generation.
 * For Tailwind classnames use the `os-*` utility classes instead.
 */

export { surface, border, brand, text, status } from './colors'
export { font, fontSize, fontWeight, lineHeight, letterSpacing } from './typography'
export { space, layout } from './spacing'
export { radius } from './radii'
export { shadow } from './shadows'
export { spring, tween, variants, staggerContainer, staggerChild } from './motion'

// Convenience bundle — import everything at once
import { surface, border, brand, text, status } from './colors'
import { font, fontSize, fontWeight } from './typography'
import { space } from './spacing'
import { radius } from './radii'
import { shadow } from './shadows'

export const tokens = { surface, border, brand, text, status, font, fontSize, fontWeight, space, radius, shadow }
export default tokens
