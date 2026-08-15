/**
 * Security Utility Module — URL Sanitization & Open Redirect Defense
 */

const DEFAULT_FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

/**
 * Sanitizes a target redirect URL to prevent Open Redirect vulnerabilities.
 * Ensures the target is either a relative path starting with '/' or belongs to
 * an allowed frontend origin.
 */
export function sanitizeRedirectUrl(targetUrl: string, defaultFallback = '/'): string {
  if (!targetUrl || typeof targetUrl !== 'string') {
    return defaultFallback
  }

  const trimmed = targetUrl.trim()

  // Prevent protocol-relative URL bypass (e.g. //attacker.com)
  if (trimmed.startsWith('//')) {
    return defaultFallback
  }

  // Relative path starting with single '/'
  if (trimmed.startsWith('/') && !trimmed.startsWith('/\\')) {
    return trimmed
  }

  try {
    const targetParsed = new URL(trimmed)
    const allowedParsed = new URL(DEFAULT_FRONTEND_URL)

    // Verify hostname matches allowed application frontend domain
    if (targetParsed.hostname === allowedParsed.hostname) {
      return targetParsed.toString()
    }
  } catch {
    // If URL parsing fails, fallback to safe path
    return defaultFallback
  }

  return defaultFallback
}
