// ─── Overlay Coordinator ──────────────────────────────────────────────────────
// The eQORE assistant panel and the eROOT greeting are independent components
// that both anchor to the bottom-right. Neither knew about the other, so both
// could be open at once — overlapping each other and covering the copy a
// visitor was mid-way through reading.
//
// This is the smallest shared signal that fixes it without either component
// having to own the other's state: each reports when it opens or closes, and
// can ask whether anything else is currently open before revealing itself.
//
// `document.body.dataset.kqOverlay` mirrors the set so it is inspectable in
// devtools and assertable from a test without reaching into React state.
// ────────────────────────────────────────────────────────────────────────────────

const OPEN = new Set();
const CHANGE_EVENT = 'kq:overlay-change';

function syncBody() {
  if (typeof document === 'undefined') return;
  const value = [...OPEN].join(' ');
  if (value) document.body.dataset.kqOverlay = value;
  else delete document.body.dataset.kqOverlay;
}

/** Report that a floating panel has opened or closed. */
export function setOverlayOpen(name, open) {
  const had = OPEN.has(name);
  if (open) OPEN.add(name);
  else OPEN.delete(name);
  if (had === Boolean(open)) return;
  syncBody();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { open: [...OPEN] } }));
  }
}

/** Is any panel other than `except` currently open? */
export function isOverlayOpen(except) {
  for (const name of OPEN) if (name !== except) return true;
  return false;
}

/** Subscribe to open/close changes. Returns an unsubscribe function. */
export function onOverlayChange(handler) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}
