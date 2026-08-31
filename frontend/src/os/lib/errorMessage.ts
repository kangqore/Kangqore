/**
 * Turn anything thrown or returned into a string safe to render.
 *
 * This exists because the backend has two error shapes. Route handlers return
 * `{ error: "a message" }`, but the global express error handler returns
 * `{ error: { message, stack } }` in development — an object. Reading
 * `data.error` and rendering it therefore crashed React with "Objects are not
 * valid as a React child (found: object with keys {message, stack})", and the
 * crash happened in the code whose whole job was to display an error, so the
 * real failure was replaced by a worse one.
 *
 * Never returns anything but a string.
 */
export function errorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (!err) return fallback
  if (typeof err === 'string') return err

  const e = err as any
  const payload = e?.response?.data

  // `{ error: { message, stack } }` — the development error handler.
  if (payload?.error && typeof payload.error === 'object') {
    return String(payload.error.message ?? payload.error.error ?? fallback)
  }
  // `{ error: "a message" }` — a route handler.
  if (typeof payload?.error === 'string') return payload.error
  if (typeof payload?.message === 'string') return payload.message

  if (typeof e?.message === 'string') return e.message
  // Last resort: something unexpected, rendered as text rather than thrown at
  // React.
  try { return JSON.stringify(err).slice(0, 300) } catch { return fallback }
}
