// HTML-escapes user-supplied text before it's persisted, so stored content can
// never be interpreted as markup regardless of what later renders it. Applied
// on write (not read) so every current and future render path is safe by default.
export const escapeHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};
