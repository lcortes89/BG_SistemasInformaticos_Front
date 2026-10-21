import { createHmac } from 'node:crypto'

// BGSI-276: the same 6-digit codes as Google/Microsoft Authenticator (RFC 6238), so the E2E can act as the phone
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Decode(text) {
  let bits = 0
  let value = 0
  const bytes = []
  for (const char of text.replace(/[\s=]/g, '').toUpperCase()) {
    value = (value << 5) | ALPHABET.indexOf(char)
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Buffer.from(bytes)
}

// stepsLater = 1: the next code (the current one may have been used already)
export function totp(secret, stepsLater = 0, now = Date.now()) {
  const step = Math.floor(now / 1000 / 30) + stepsLater
  const counter = Buffer.alloc(8)
  counter.writeBigUInt64BE(BigInt(step))
  const hash = createHmac('sha1', base32Decode(secret)).update(counter).digest()
  const offset = hash[hash.length - 1] & 0x0f
  const binary = ((hash[offset] & 0x7f) << 24) | (hash[offset + 1] << 16) | (hash[offset + 2] << 8) | hash[offset + 3]
  return String(binary % 1_000_000).padStart(6, '0')
}
