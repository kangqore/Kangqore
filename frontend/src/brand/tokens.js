/**
 * Kangqore brand tokens — SINGLE SOURCE OF TRUTH.
 *
 * Official values declared 2026-08-21. Do not restate these hex literals
 * anywhere else; import from here instead. Consumers:
 *   - tailwind.config.js      (brand-blue, brand-cyan)
 *   - src/os/tokens/colors.ts (brand.blue, brand.cyan)
 *   - src/index.css           MANUAL MIRROR — CSS custom properties cannot
 *                             import from JS. If BRAND_BLUE changes here,
 *                             --primary and --ring must be updated by hand.
 *
 * Why BLUE_ON_DARK exists (measured WCAG contrast, not a stray fourth blue):
 *
 *                      on #060b18 (os dark surface)   on #ffffff
 *   #2564ea (brand)              3.83  FAILS AA 4.5        5.13  passes
 *   #3b82f6 (on-dark)            5.34  passes              3.68  low
 *
 * The brand blue fails AA body-text contrast on the product's dark surface.
 * BLUE_ON_DARK is the required accessibility variant for dark backgrounds —
 * it is a deliberate derived token. Do not "correct" it to BRAND_BLUE.
 */

/** Canonical brand blue. */
const BRAND_BLUE = '#2564ea';

/** Derived variant for dark surfaces — required for WCAG AA. See note above. */
const BLUE_ON_DARK = '#3b82f6';

/** Companion cyan — accent and highlight. */
const BRAND_CYAN = '#4ab6d4';

/**
 * Official brand gradient (90deg). This is the brand-standard reference.
 * Note: src/os/tokens/colors.ts intentionally uses a 135deg diagonal variant
 * on product surfaces — diagonal reads better on cards and panels. That is a
 * deliberate variant, not drift.
 */
const BRAND_GRADIENT = `linear-gradient(90deg, ${BRAND_BLUE} 0%, ${BRAND_CYAN} 100%)`;

module.exports = {
  BRAND_BLUE,
  BLUE_ON_DARK,
  BRAND_CYAN,
  BRAND_GRADIENT,
};
