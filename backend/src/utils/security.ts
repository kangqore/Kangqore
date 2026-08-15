/**
 * Security Utility Module — URL Sanitization & Open Redirect Defense
 */

const DEFAULT_FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

function getHostname(urlStr: string): string {
  try {
    return new URL(urlStr).hostname
  } catch {
    return ''
  }
}

const ALLOWED_HOSTNAMES = new Set([
  getHostname(DEFAULT_FRONTEND_URL) || 'localhost',
  'localhost',
  '127.0.0.1',
  'zoom.us',
  'app.hubspot.com',
  'login.salesforce.com',
])

/**
 * Sanitizes a target redirect URL to prevent Open Redirect vulnerabilities.
 * Ensures the target is either a relative path starting with '/' or belongs to
 * an allowed domain.
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
    const host = targetParsed.hostname.toLowerCase()

    if (ALLOWED_HOSTNAMES.has(host) || Array.from(ALLOWED_HOSTNAMES).some(h => host.endsWith('.' + h))) {
      return targetParsed.toString()
    }
  } catch {
    return defaultFallback
  }

  return defaultFallback
}
