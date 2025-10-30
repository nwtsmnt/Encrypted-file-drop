import crypto from './crypto'
import * as ui from './ui'

function el(id: string) { return document.getElementById(id)! }

let currentFile: File | null = null
let isEncrypting = false
let isDecrypting = false

export function initApp() {
  const root = document.getElementById('app')!
  root.innerHTML = `
    <div class="container">
      <header>
        <h1 class="logo">Encrypt and Go</h1>
        <p class="tagline">Secure files, keys never leave your browser.</p>
        <div class="cta-buttons">
          <button id="encrypt-cta" class="btn">Encrypt a file</button>
          <button id="decrypt-cta" class="btn btn-secondary">Decrypt a file</button>
        </div>
      </header>

      <main class="main-content">
        <section id="encrypt-section" class="card">
          <h2>Encrypt File</h2>
          <div id="drag-drop" class="drag-drop">
            <svg class="lock-icon" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4V6H16V4C16 1.79 14.21 0 12 0S8 1.79 8 4V6H10V4C10 2.9 10.9 2 12 2ZM18 8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM18 20H6V10H18V20Z"/>
            </svg>
            <p>Drag & drop a file here or click to browse</p>
            <input id="file-input" type="file" class="file-input" />
          </div>
          <div id="file-preview" class="file-preview" style="display: none;"></div>
          <div class="key-input">
            <input id="key-input" type="password" placeholder="Enter passphrase or generate key" />
            <button id="toggle-visibility" class="toggle-visibility">👁️</button>
          </div>
          <div class="row">
            <button id="generate-key" class="btn">Generate Key</button>
            <button id="encrypt-btn" class="btn" disabled>Encrypt & Download</button>
          </div>
          <div id="progress" class="progress" style="display: none;"><div class="progress-bar"></div></div>
          <div id="envelope-panel" class="envelope-panel" style="display: none;">
            <h3>Envelope JSON</h3>
            <pre id="envelope-json"></pre>
            <div class="row">
              <button id="copy-envelope" class="btn">Copy Envelope</button>
              <button id="download-envelope" class="btn btn-secondary">Download Envelope</button>
            </div>
          </div>
        </section>

        <section id="decrypt-section" class="card" style="display: none;">
          <h2>Decrypt File</h2>
          <input id="dec-file-input" type="file" accept=".enc" />
          <textarea id="envelope-paste" placeholder="Or paste envelope JSON here" rows="4"></textarea>
          <input id="dec-key-input" type="password" placeholder="Enter key or passphrase" />
          <div class="row">
            <button id="decrypt-btn" class="btn">Decrypt & Download</button>
          </div>
          <div id="dec-progress" class="progress" style="display: none;"><div class="progress-bar"></div></div>
        </section>
      </main>
    </div>
    <div id="toast" class="toast"></div>
  `

  // Event listeners
  const encryptCta = el('encrypt-cta') as HTMLButtonElement
  const decryptCta = el('decrypt-cta') as HTMLButtonElement
  const dragDrop = el('drag-drop')
  const fileInput = el('file-input') as HTMLInputElement
  const toggleVisibility = el('toggle-visibility') as HTMLButtonElement
  const generateKey = el('generate-key') as HTMLButtonElement
  const encryptBtn = el('encrypt-btn') as HTMLButtonElement
  const copyEnvelope = el('copy-envelope') as HTMLButtonElement
  const downloadEnvelope = el('download-envelope') as HTMLButtonElement
  const decryptBtn = el('decrypt-btn') as HTMLButtonElement

  encryptCta.addEventListener('click', () => {
    el('encrypt-section').scrollIntoView({ behavior: 'smooth' })
  })

  decryptCta.addEventListener('click', () => {
    el('decrypt-section').style.display = 'block'
    el('decrypt-section').scrollIntoView({ behavior: 'smooth' })
  })

  // Drag & drop
  dragDrop.addEventListener('click', () => fileInput.click())
  dragDrop.addEventListener('dragover', (e) => {
    e.preventDefault()
    dragDrop.classList.add('dragover')
  })
  dragDrop.addEventListener('dragleave', () => dragDrop.classList.remove('dragover'))
  dragDrop.addEventListener('drop', (e) => {
    e.preventDefault()
    dragDrop.classList.remove('dragover')
    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  })
  fileInput.addEventListener('change', (e) => {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  })

  toggleVisibility.addEventListener('click', () => {
    const input = el('key-input') as HTMLInputElement
    input.type = input.type === 'password' ? 'text' : 'password'
  })

  generateKey.addEventListener('click', () => {
    const key = crypto.generateRandomKeyBase64()
    ;(el('key-input') as HTMLInputElement).value = key
    showToast('Key generated and copied to clipboard')
    navigator.clipboard.writeText(key)
  })

  encryptBtn.addEventListener('click', async () => {
    if (!currentFile || isEncrypting) return
    isEncrypting = true
    encryptBtn.disabled = true
    encryptBtn.textContent = 'Encrypting...'

    const progress = el('progress')
    const progressBar = progress.querySelector('.progress-bar') as HTMLElement
    progress.style.display = 'block'
    progressBar.style.width = '0%'

    try {
      const data = await ui.readFileAsUint8(currentFile)
      const salt = crypto.rndBytes(16)
      const iv = crypto.rndBytes(12)
      const pass = (el('key-input') as HTMLInputElement).value.trim()
      let key: CryptoKey
      if (pass === '') {
        const raw = crypto.fromBase64(crypto.generateRandomKeyBase64())
        key = await crypto.importRawKey(raw)
      } else {
        key = await crypto.deriveKeyFromPassphrase(pass, salt)
      }

      const { ciphertext } = await crypto.encryptBytes(data, key, iv)
      const envelope = crypto.makeEnvelope({ salt, iv, ciphertext, filename: currentFile.name, mime: currentFile.type, size: currentFile.size })

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50))
        progressBar.style.width = `${i}%`
      }

      await ui.downloadEnc(salt, iv, ciphertext, currentFile.name)
      el('envelope-json').textContent = crypto.envelopeToJson(envelope)
      el('envelope-panel').style.display = 'block'

      // Animation
      const lockIcon = dragDrop.querySelector('.lock-icon') as SVGElement
      lockIcon.classList.add('locked')
      showConfetti()

      showToast('Encryption complete! File downloaded.')
    } catch (e) {
      showToast('Encryption failed', true)
    } finally {
      isEncrypting = false
      encryptBtn.disabled = false
      encryptBtn.textContent = 'Encrypt & Download'
      progress.style.display = 'none'
    }
  })

  copyEnvelope.addEventListener('click', async () => {
    const text = el('envelope-json').textContent || ''
    await ui.copyToClipboard(text)
    showToast('Envelope copied!')
  })

  downloadEnvelope.addEventListener('click', () => {
    const text = el('envelope-json').textContent || ''
    const blob = new Blob([text], { type: 'application/json' })
    ui.downloadBlob(blob, 'envelope.json')
  })

  decryptBtn.addEventListener('click', async () => {
    if (isDecrypting) return
    isDecrypting = true
    decryptBtn.disabled = true
    decryptBtn.textContent = 'Decrypting...'

    const decProgress = el('dec-progress')
    const decProgressBar = decProgress.querySelector('.progress-bar') as HTMLElement
    decProgress.style.display = 'block'
    decProgressBar.style.width = '0%'

    try {
      let salt: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array
      const decFileInput = el('dec-file-input') as HTMLInputElement
      const envelopePaste = el('envelope-paste') as HTMLTextAreaElement

      if (decFileInput.files && decFileInput.files.length > 0) {
        const file = decFileInput.files[0]
        const data = await ui.readFileAsUint8(file)
        ;({ salt, iv, ciphertext } = crypto.parseEncBinary(data))
      } else if (envelopePaste.value.trim()) {
        const envelope = JSON.parse(envelopePaste.value)
        salt = crypto.fromBase64(envelope.salt)
        iv = crypto.fromBase64(envelope.iv)
        ciphertext = crypto.fromBase64(envelope.ciphertext)
      } else {
        throw new Error('No file or envelope provided')
      }

      const pass = (el('dec-key-input') as HTMLInputElement).value.trim()
      let key: CryptoKey
      if (!pass) throw new Error('No key provided')
      try {
        const raw = crypto.fromBase64(pass)
        if (raw.length === 32) {
          key = await crypto.importRawKey(raw)
        } else {
          key = await crypto.deriveKeyFromPassphrase(pass, salt)
        }
      } catch {
        key = await crypto.deriveKeyFromPassphrase(pass, salt)
      }

      const pt = await crypto.decryptBytes(ciphertext, key, iv)
      const blob = new Blob([pt], { type: 'application/octet-stream' })
      ui.downloadBlob(blob, 'decrypted')

      // Simulate progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 30))
        decProgressBar.style.width = `${i}%`
      }

      showToast('Decryption successful!')
    } catch (e) {
      showToast('Decryption failed — check key or file', true)
      el('decrypt-section').classList.add('shake')
      setTimeout(() => el('decrypt-section').classList.remove('shake'), 500)
    } finally {
      isDecrypting = false
      decryptBtn.disabled = false
      decryptBtn.textContent = 'Decrypt & Download'
      decProgress.style.display = 'none'
    }
  })
}

function handleFileSelect(file: File) {
  if (file.size > crypto.MAX_FILE_BYTES) {
    showToast('File too large (max 50MB)', true)
    return
  }
  currentFile = file
  const preview = el('file-preview')
  preview.innerHTML = `
    <p><strong>File:</strong> ${file.name}</p>
    <p><strong>Size:</strong> ${ui.formatBytes(file.size)}</p>
    <p><strong>Type:</strong> ${file.type || 'Unknown'}</p>
  `
  preview.style.display = 'block'
  ;(el('encrypt-btn') as HTMLButtonElement).disabled = false
}

function showToast(message: string, isError = false) {
  const toast = el('toast')
  toast.textContent = message
  toast.style.background = isError ? 'var(--error)' : 'var(--success)'
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 3000)
}

function showConfetti() {
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti'
    confetti.style.left = Math.random() * 100 + 'vw'
    confetti.style.animationDelay = Math.random() * 2 + 's'
    document.body.appendChild(confetti)
    setTimeout(() => document.body.removeChild(confetti), 2000)
  }
}
