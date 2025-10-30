// crypto.ts — secure Web Crypto helpers for AES-GCM + PBKDF2
const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const MAX_FILE_BYTES = 50 * 1024 * 1024 // 50 MB

function rndBytes(len: number) {
  const b = new Uint8Array(len)
  crypto.getRandomValues(b)
  return b
}

export function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
}

export function fromBase64(b64: string) {
  const s = atob(b64)
  const a = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i)
  return a
}

export async function deriveKeyFromPassphrase(passphrase: string, salt: Uint8Array, iterations = 250000) {
  const passKey = await crypto.subtle.importKey('raw', encoder.encode(passphrase), { name: 'PBKDF2' }, false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    passKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function importRawKey(raw: Uint8Array) {
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

export async function exportRawKey(key: CryptoKey) {
  const raw = await crypto.subtle.exportKey('raw', key)
  return new Uint8Array(raw)
}

export function generateRandomKeyBase64() {
  const k = rndBytes(32)
  return toBase64(k)
}

export async function encryptBytes(plaintext: Uint8Array, key: CryptoKey, iv?: Uint8Array) {
  const ivLocal = iv ?? rndBytes(12)
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: ivLocal }, key, plaintext))
  return { iv: ivLocal, ciphertext: ct }
}

export async function decryptBytes(ciphertext: Uint8Array, key: CryptoKey, iv: Uint8Array) {
  const pt = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext))
  return pt
}

export function envelopeToJson(obj: any) {
  return JSON.stringify(obj, null, 2)
}

export function makeEnvelope(params: {
  salt: Uint8Array
  iv: Uint8Array
  ciphertext: Uint8Array
  filename: string
  mime?: string
  size?: number
  iterations?: number
}) {
  return {
    version: 1,
    algo: 'AES-GCM',
    kdf: 'PBKDF2',
    iterations: params.iterations ?? 250000,
    salt: toBase64(params.salt),
    iv: toBase64(params.iv),
    ciphertext: toBase64(params.ciphertext),
    filename: params.filename,
    mime: params.mime ?? 'application/octet-stream',
    size: params.size ?? params.ciphertext.byteLength,
    created_at: new Date().toISOString()
  }
}

export function makeEncBinary(salt: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array) {
  const out = new Uint8Array(salt.length + iv.length + ciphertext.length)
  out.set(salt, 0)
  out.set(iv, salt.length)
  out.set(ciphertext, salt.length + iv.length)
  return out
}

export function parseEncBinary(data: Uint8Array) {
  // salt 16, iv 12
  const salt = data.slice(0, 16)
  const iv = data.slice(16, 28)
  const ciphertext = data.slice(28)
  return { salt, iv, ciphertext }
}

export async function selfTest() {
  const msg = encoder.encode('selftest-' + Math.random())
  const salt = rndBytes(16)
  const pass = 'test-passphrase-' + Math.random()
  const iterations = 100000
  const key = await deriveKeyFromPassphrase(pass, salt, iterations)
  const { iv, ciphertext } = await encryptBytes(msg, key)
  const pt = await decryptBytes(ciphertext, key, iv)
  const ok = decoder.decode(pt) === decoder.decode(msg)
  return { ok }
}

export default {
  rndBytes,
  toBase64,
  fromBase64,
  deriveKeyFromPassphrase,
  importRawKey,
  exportRawKey,
  generateRandomKeyBase64,
  encryptBytes,
  decryptBytes,
  envelopeToJson,
  makeEnvelope,
  makeEncBinary,
  parseEncBinary,
  selfTest,
  MAX_FILE_BYTES
}
