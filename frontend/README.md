# Encrypt and Go — Frontend Demo

A polished, client-side web interface for secure file encryption and decryption. Files are encrypted in the browser using AES-256-GCM, and keys never leave your device.

## Features

- **Client-side encryption**: AES-256-GCM with PBKDF2 key derivation
- **Drag & drop interface**: Intuitive file upload with visual feedback
- **Key management**: Generate random keys or use passphrases
- **Envelope format**: JSON with metadata and base64-encoded ciphertext
- **Binary downloads**: .enc files for secure sharing
- **Responsive design**: Works on desktop and mobile
- **Animations**: Lock morph, progress rings, success confetti
- **Accessibility**: Keyboard navigation, ARIA labels, high contrast

## How to run

1. From the repo root, navigate to `frontend`:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

2. Open `http://localhost:5173` in your browser.

## Usage

### Encrypt a file
1. Click "Encrypt a file" or scroll to the Encrypt section.
2. Drag & drop a file (max 50MB) or click to browse.
3. Enter a passphrase or click "Generate Key" for a random 32-byte key.
4. Click "Encrypt & Download" — the .enc file downloads automatically.
5. Copy the envelope JSON for sharing (contains metadata but NOT the key).

### Decrypt a file
1. Click "Decrypt a file" to reveal the section.
2. Upload the .enc file or paste the envelope JSON.
3. Enter the passphrase or key used for encryption.
4. Click "Decrypt & Download" — the original file downloads.

## Security notes

- Keys are derived client-side and never sent to any server.
- Envelope JSON includes KDF parameters (salt, iterations) but not the key.
- Share the envelope and ciphertext via one channel, the key via another secure method.
- Use strong passphrases or random keys for maximum security.

## Tech stack

- **Framework**: Vite + vanilla TypeScript
- **Crypto**: Web Crypto API (AES-GCM, PBKDF2)
- **Styling**: CSS with custom properties
- **Icons**: Inline SVG
- **Animations**: CSS keyframes and transforms

## Development

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Envelope format

```json
{
  "version": 1,
  "algo": "AES-GCM",
  "kdf": "PBKDF2",
  "iterations": 250000,
  "salt": "<base64>",
  "iv": "<base64>",
  "ciphertext": "<base64>",
  "filename": "file.ext",
  "mime": "application/octet-stream",
  "size": 12345,
  "created_at": "2025-10-30T12:34:56Z"
}
```

## Binary format (.enc)

Raw bytes: `[salt (16 bytes)][iv (12 bytes)][ciphertext...]`

## Acceptance criteria

- Encrypt/decrypt flows work end-to-end with byte-for-byte accuracy.
- UI is responsive and accessible (keyboard nav, ARIA).
- Animations enhance UX without overwhelming.
- No backend changes required; all crypto is client-side.
