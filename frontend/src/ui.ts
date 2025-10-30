import crypto from './crypto'

export function formatBytes(n: number) {
  if (n < 1024) return n + ' B'
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB'
  return (n / (1024 * 1024)).toFixed(2) + ' MB'
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function readFileAsUint8(file: File) {
  return new Uint8Array(await file.arrayBuffer())
}

export async function downloadEnc(salt: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array, filename: string) {
  const bin = crypto.makeEncBinary(salt, iv, ciphertext)
  const blob = new Blob([bin], { type: 'application/octet-stream' })
  downloadBlob(blob, filename + '.enc')
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text)
}
