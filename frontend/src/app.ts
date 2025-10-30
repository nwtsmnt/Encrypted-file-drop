import crypto from './crypto'
import * as ui from './ui'

function el(id: string) { return document.getElementById(id)! }

let currentFile: File | null = null
let isEncrypting = false
let isDecrypting = false

export function initApp() {
  const root = document.getElementById('app')!
  root.innerHTML = `
    <div class="hero-bg">
      <div class="hero-overlay"></div>
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <div class="container">
      <header class="hero">
        <div class="hero-content">
          <div class="logo-container">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
            </div>
            <h1 class="logo">encrypt&Go</h1>
          </div>
          <p class="tagline">Enterprise-grade file encryption in your browser</p>
          <p class="subtitle">Secure, fast, and private. Your keys never leave your device.</p>
        </div>
      </header>

      <nav class="nav-tabs">
        <button id="encrypt-tab" class="tab active">Encrypt File</button>
        <button id="decrypt-tab" class="tab">Decrypt File</button>
      </nav>

      <main class="main-content">
        <section id="encrypt-section" class="card active">
          <div class="card-header">
            <h2>Encrypt Your File</h2>
            <p>Choose a file, set your encryption key, and download the secure encrypted version.</p>
          </div>

          <div class="steps">
            <div class="step active" data-step="1">
              <div class="step-number">1</div>
              <span>Select File</span>
            </div>
            <div class="step" data-step="2">
              <div class="step-number">2</div>
              <span>Set Key</span>
            </div>
            <div class="step" data-step="3">
              <div class="step-number">3</div>
              <span>Encrypt</span>
            </div>
          </div>

          <div id="drag-drop" class="drag-drop">
            <div class="upload-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <h3>Drop your file here</h3>
            <p>or click to browse • Max 50MB</p>
            <input id="file-input" type="file" class="file-input" />
          </div>

          <div id="file-preview" class="file-preview" style="display: none;">
            <div class="file-info">
              <div class="file-icon">📄</div>
              <div class="file-details">
                <div class="file-name"></div>
                <div class="file-size"></div>
              </div>
            </div>
          </div>

          <div class="key-section">
            <label class="input-label">Encryption Key</label>
            <div class="key-input-container">
              <input id="key-input" type="password" placeholder="Enter a strong passphrase or generate a random key" />
              <button id="toggle-visibility" class="visibility-toggle">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                </svg>
              </button>
            </div>
            <button id="generate-key" class="btn-secondary">Generate Random Key</button>
          </div>

          <div class="action-buttons">
            <button id="encrypt-btn" class="btn-primary" disabled>
              <span class="btn-text">Encrypt & Download</span>
              <div class="btn-loader" style="display: none;"></div>
            </button>
          </div>

          <div id="progress" class="progress-container" style="display: none;">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <div class="progress-text">Encrypting your file...</div>
          </div>

          <div id="envelope-panel" class="result-panel" style="display: none;">
            <div class="success-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V9H8V11H11V14H13V11H16V9H13V6H11Z"/>
              </svg>
            </div>
            <h3>Encryption Complete!</h3>
            <p>Your file has been securely encrypted and downloaded.</p>
            <div class="envelope-actions">
              <button id="copy-envelope" class="btn-secondary">Copy Envelope</button>
              <button id="download-envelope" class="btn-outline">Download Envelope</button>
            </div>
            <details class="envelope-details">
              <summary>View Envelope JSON</summary>
              <pre id="envelope-json"></pre>
            </details>
          </div>
        </section>

        <section id="decrypt-section" class="card">
          <div class="card-header">
            <h2>Decrypt Your File</h2>
            <p>Upload your encrypted file and enter the decryption key to recover your original data.</p>
          </div>

          <div class="decrypt-inputs">
            <div class="input-group">
              <label class="input-label">Encrypted File</label>
              <input id="dec-file-input" type="file" accept=".enc" class="file-input-styled" />
            </div>

            <div class="input-group">
              <label class="input-label">Envelope JSON (optional)</label>
              <textarea id="envelope-paste" placeholder="Paste the envelope JSON here if you have it..." rows="3"></textarea>
            </div>

            <div class="input-group">
              <label class="input-label">Decryption Key</label>
              <input id="dec-key-input" type="password" placeholder="Enter your passphrase or key" />
            </div>
          </div>

          <div class="action-buttons">
            <button id="decrypt-btn" class="btn-primary">
              <span class="btn-text">Decrypt & Download</span>
              <div class="btn-loader" style="display: none;"></div>
            </button>
          </div>

          <div id="dec-progress" class="progress-container" style="display: none;">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <div class="progress-text">Decrypting your file...</div>
          </div>
        </section>
      </main>
    </div>

    <div id="toast" class="toast"></div>
    <div id="confetti-container"></div>
  `

  // Event listeners
  const encryptTab = el('encrypt-tab') as HTMLButtonElement
  const decryptTab = el('decrypt-tab') as HTMLButtonElement
  const dragDrop = el('drag-drop')
  const fileInput = el('file-input') as HTMLInputElement
  const toggleVisibility = el('toggle-visibility') as HTMLButtonElement
  const generateKey = el('generate-key') as HTMLButtonElement
  const encryptBtn = el('encrypt-btn') as HTMLButtonElement
  const copyEnvelope = el('copy-envelope') as HTMLButtonElement
  const downloadEnvelope = el('download-envelope') as HTMLButtonElement
  const decryptBtn = el('decrypt-btn') as HTMLButtonElement

  // Tab switching
  encryptTab.addEventListener('click', () => {
    encryptTab.classList.add('active')
    decryptTab.classList.remove('active')
    el('encrypt-section').classList.add('active')
    el('decrypt-section').classList.remove('active')
  })

  decryptTab.addEventListener('click', () => {
    decryptTab.classList.add('active')
    encryptTab.classList.remove('active')
    el('decrypt-section').classList.add('active')
    el('encrypt-section').classList.remove('active')
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
    const icon = toggleVisibility.querySelector('svg')
    if (icon) {
      icon.innerHTML = input.type === 'password' 
        ? '<path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>'
        : '<path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,7.3 1.78,7.89 1,8.5C2.73,12.89 7,16 12,16C13.55,16 15.03,15.7 16.38,15.22L16.81,15.63L19.73,18.55L21,17.27L3.27,2M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.39 23,11C21.27,6.61 17,3.5 12,3.5C10.6,3.5 9.26,3.75 8,4.2L10.17,6.37C10.74,6.13 11.35,6 12,6Z"/>'
    }
  })

  generateKey.addEventListener('click', () => {
    const key = crypto.generateRandomKeyBase64()
    ;(el('key-input') as HTMLInputElement).value = key
    showToast('Random key generated and copied to clipboard')
    navigator.clipboard.writeText(key)
    updateSteps(2)
  })

  encryptBtn.addEventListener('click', async () => {
    if (!currentFile || isEncrypting) return
    isEncrypting = true
    const btnText = encryptBtn.querySelector('.btn-text') as HTMLElement
    const btnLoader = encryptBtn.querySelector('.btn-loader') as HTMLElement
    btnText.textContent = 'Encrypting...'
    btnLoader.style.display = 'block'
    encryptBtn.disabled = true

    const progress = el('progress')
    const progressFill = progress.querySelector('.progress-fill') as HTMLElement
    progress.style.display = 'flex'
    progressFill.style.width = '0%'

    updateSteps(3)

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

      // Animate progress
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 30))
        progressFill.style.width = `${i}%`
      }

      await ui.downloadEnc(salt, iv, ciphertext, currentFile.name)
      el('envelope-json').textContent = crypto.envelopeToJson(envelope)
      el('envelope-panel').style.display = 'block'

      // Success animations
      dragDrop.classList.add('success')
      showConfetti()
      showToast('Encryption complete! File downloaded successfully.')

      // Scroll to results
      el('envelope-panel').scrollIntoView({ behavior: 'smooth' })

    } catch (e) {
      showToast('Encryption failed', true)
      el('encrypt-section').classList.add('error-shake')
      setTimeout(() => el('encrypt-section').classList.remove('error-shake'), 500)
    } finally {
      isEncrypting = false
      btnText.textContent = 'Encrypt & Download'
      btnLoader.style.display = 'none'
      encryptBtn.disabled = false
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
    const btnText = decryptBtn.querySelector('.btn-text') as HTMLElement
    const btnLoader = decryptBtn.querySelector('.btn-loader') as HTMLElement
    btnText.textContent = 'Decrypting...'
    btnLoader.style.display = 'block'
    decryptBtn.disabled = true

    const decProgress = el('dec-progress')
    const decProgressFill = decProgress.querySelector('.progress-fill') as HTMLElement
    decProgress.style.display = 'flex'
    decProgressFill.style.width = '0%'

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

      // Animate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 25))
        decProgressFill.style.width = `${i}%`
      }

      const pt = await crypto.decryptBytes(ciphertext, key, iv)
      const blob = new Blob([pt], { type: 'application/octet-stream' })
      ui.downloadBlob(blob, 'decrypted')

      showToast('Decryption successful! File downloaded.')
    } catch (e) {
      showToast('Decryption failed — check key or file', true)
      el('decrypt-section').classList.add('error-shake')
      setTimeout(() => el('decrypt-section').classList.remove('error-shake'), 500)
    } finally {
      isDecrypting = false
      btnText.textContent = 'Decrypt & Download'
      btnLoader.style.display = 'none'
      decryptBtn.disabled = false
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
  const fileName = preview.querySelector('.file-name') as HTMLElement
  const fileSize = preview.querySelector('.file-size') as HTMLElement
  
  fileName.textContent = file.name
  fileSize.textContent = ui.formatBytes(file.size)
  preview.style.display = 'block'
  ;(el('encrypt-btn') as HTMLButtonElement).disabled = false
  updateSteps(1)
}

function updateSteps(activeStep: number) {
  const steps = document.querySelectorAll('.step')
  steps.forEach((step, index) => {
    if (index + 1 === activeStep) {
      step.classList.add('active')
    } else if (index + 1 < activeStep) {
      step.classList.add('completed')
    } else {
      step.classList.remove('active', 'completed')
    }
  })
}

function showToast(message: string, isError = false) {
  const toast = el('toast')
  toast.textContent = message
  toast.className = `toast ${isError ? 'error' : 'success'}`
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 4000)
}

function showConfetti() {
  const container = el('confetti-container')
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti'
    confetti.style.left = Math.random() * 100 + 'vw'
    confetti.style.animationDelay = Math.random() * 2 + 's'
    confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'][Math.floor(Math.random() * 7)]
    container.appendChild(confetti)
    setTimeout(() => container.removeChild(confetti), 3000)
  }
}
