// ─── Canonical booking CTA ────────────────────────────────────────────────────
// One verb, one destination.
//
// The homepage previously offered six differently-worded routes to the same
// action — "Explore Our Capabilities", "Schedule Your 30-min Discovery Call"
// (→ /contact), "Schedule Your Consultation", "Get a Free Consultation"
// (→ /contact), "Get in touch", and a second "Schedule Your 30-min Discovery
// Call" pointing at /book-discovery. Three of them navigated the visitor away
// from the BookingWidget already mounted mid-page, and /book-discovery is not a
// declared route at all: it fell through to the `path="*"` catch-all in
// App.jsx, so that CTA never reached the booking flow.
//
// Import these rather than retyping the label or the target.
// ────────────────────────────────────────────────────────────────────────────────

/** The only wording used for the booking action, site-wide. */
export const BOOKING_CTA_LABEL = 'Book a 30-minute discovery call';

/**
 * On-page target, for surfaces rendered on the homepage alongside the
 * BookingWidget (`<section id="scheduling-widget">`). Anchoring keeps the
 * visitor on the flow the page already contains.
 */
export const BOOKING_CTA_HREF = '#scheduling-widget';

/**
 * Standalone booking page, for surfaces NOT on the homepage — `/book/:slug`
 * in frontend/src/routes/publicRoutes.jsx renders BookingPage.
 */
export const BOOKING_CTA_ROUTE = '/book/discovery-call';
