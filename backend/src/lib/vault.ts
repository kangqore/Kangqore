import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto'

const ALG = 'aes-256-gcm'

function getKey(): Buffer {
  const raw = process.env.INTEGRATION_ENCRYPTION_KEY
  if (!raw) {
    // Deterministic fallback from JWT_SECRET so it works without explicit key
    const fallback = process.env.JWT_SECRET ?? 'kangqore-dev-vault-key-change-in-prod'
    return createHash('sha256').update(fallback).digest()
  }
  // Accept hex-encoded 64-char key or raw string
  return raw.length === 64 ? Buffer.from(raw, 'hex') : createHash('sha256').update(raw).digest()
}

export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv  = randomBytes(12)
  const cipher = createCipheriv(ALG, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  // Format: iv(24 hex) + tag(32 hex) + encrypted(hex)
  return iv.toString('hex') + tag.toString('hex') + encrypted.toString('hex')
}

export function decrypt(ciphertext: string): string {
  const key  = getKey()
  const iv   = Buffer.from(ciphertext.slice(0, 24), 'hex')
  const tag  = Buffer.from(ciphertext.slice(24, 56), 'hex')
  const data = Buffer.from(ciphertext.slice(56), 'hex')
  const decipher = createDecipheriv(ALG, key, iv)
  decipher.setAuthTag(tag)
  return decipher.update(data) + decipher.final('utf8')
}

export function encryptConfig(config: Record<string, string>): string {
  return encrypt(JSON.stringify(config))
}

export function decryptConfig(ciphertext: string): Record<string, string> {
  return JSON.parse(decrypt(ciphertext))
}
