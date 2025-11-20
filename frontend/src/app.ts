import crypto from './crypto'
import * as ui from './ui'
import * as api from './api/client'

function el(id: string) { return document.getElementById(id)! }

let currentFile: File | null = null
let isEncrypting = false
let isDecrypting = false
let countdownInterval: number | null = null

export function initApp() {
  const root = document.getElementById('app')!
  
  // Check if this is a download link
  const urlParams = new URLSearchParams(window.location.search)
  const hash = window.location.hash.substring(1) // Remove leading #
  
  let fileIdFromUrl: string | null = null
  let keyFromUrl: string | null = null
  
  console.log('Parsing URL - hash:', hash, 'pathname:', window.location.pathname, 'search:', window.location.search)
  
  // Parse download link from hash: #download/fileId#key=encodedKey
  // Also support: #download/fileId?key=encodedKey
  if (hash) {
    // Try format: download/fileId#key=value
    if (hash.startsWith('download/')) {
      const parts = hash.split('#')
      const downloadPart = parts[0] // download/fileId
      fileIdFromUrl = downloadPart.replace('download/', '').split('/')[0].split('?')[0]
      
      // Look for key in hash parts (format: #key=value)
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i]
        if (part?.startsWith('key=')) {
          keyFromUrl = decodeURIComponent(part.substring(4))
          break
        }
      }
      
      // Also check if key is in query string format within hash
      if (!keyFromUrl && downloadPart.includes('?')) {
        const queryPart = downloadPart.split('?')[1]
        const hashParams = new URLSearchParams(queryPart)
        const key = hashParams.get('key')
        if (key) {
          keyFromUrl = decodeURIComponent(key)
        }
      }
    }
    
    // Try parsing as query string in hash: #fileId=xxx&key=yyy
    if (!fileIdFromUrl || !keyFromUrl) {
      try {
        const hashParams = new URLSearchParams(hash)
        if (!fileIdFromUrl) fileIdFromUrl = hashParams.get('fileId')
        if (!keyFromUrl) keyFromUrl = hashParams.get('key') ? decodeURIComponent(hashParams.get('key')!) : null
      } catch (e) {
        console.log('Could not parse hash as query string:', e)
      }
    }
  }
  
  // Try pathname format: /download/fileId
  if (!fileIdFromUrl && window.location.pathname.includes('/download/')) {
    fileIdFromUrl = window.location.pathname.split('/download/')[1]?.split('/')[0] || null
  }
  
  // Try query parameters: ?fileId=xxx&key=yyy
  if (!fileIdFromUrl) {
    fileIdFromUrl = urlParams.get('fileId')
  }
  if (!keyFromUrl) {
    const keyParam = urlParams.get('key')
    if (keyParam) {
      keyFromUrl = decodeURIComponent(keyParam)
    }
  }

  console.log('Parsed URL - fileId:', fileIdFromUrl, 'key present:', !!keyFromUrl)

  // Show download page if we have fileId and key
  if (fileIdFromUrl && keyFromUrl) {
    console.log('Detected download link - fileId:', fileIdFromUrl, 'key length:', keyFromUrl.length)
    root.innerHTML = getDownloadPageHTML()
    console.log('Download page HTML rendered')
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(() => {
        initDownloadPage(fileIdFromUrl!, keyFromUrl!)
      }, 50)
    })
  } else {
    console.log('No download link detected, showing upload page')
    root.innerHTML = getUploadPageHTML()
    initUploadPage()
  }
}

function getUploadPageHTML() {
  return `
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
            <div class="logo-icon-small" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 8V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9zm3 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
              </svg>
              <div class="keyhole-dot" aria-hidden="true"></div>
            </div>
            <h1 class="logo">encrypt&Go</h1>
          </div>
          <p class="tagline">Enterprise-grade file encryption in your browser</p>
          <p class="subtitle">Secure, fast, and private. Your keys never leave your device.</p>
        </div>
      </header>

      <main class="main-content">
        <section id="encrypt-section" class="card active">
          <div class="card-header">
            <h2>Upload & Encrypt File</h2>
            <p>Choose a file, set your encryption key, and share it securely.</p>
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
              <span>Upload</span>
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

          <div class="expiration-section">
            <label class="input-label">File Expiration</label>
            <select id="expiration-select" class="expiration-select">
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7" selected>7 days</option>
              <option value="14">14 days</option>
            </select>
            <p class="expiration-hint">Files will be automatically deleted after expiration</p>
          </div>

          <div class="action-buttons">
            <button id="encrypt-btn" class="btn-primary" disabled>
              <span class="btn-text">Encrypt & Upload</span>
              <div class="btn-loader" style="display: none;"></div>
            </button>
          </div>

          <div id="progress" class="progress-container" style="display: none;">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <div class="progress-text">Encrypting and uploading your file...</div>
          </div>

          <div id="upload-result" class="result-panel" style="display: none;">
            <div class="success-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
              </svg>
            </div>
            <h3>File Uploaded Successfully!</h3>
            <p>Your file has been encrypted and uploaded to the server.</p>
            <div class="share-link-container">
              <label>Shareable Link:</label>
              <input id="share-link" type="text" readonly class="share-link-input" />
              <button id="copy-link" class="btn-secondary">Copy Link</button>
            </div>
          </div>
        </section>
      </main>
    </div>

    <div id="toast" class="toast"></div>
    <div id="confetti-container"></div>
  `
}

function getDownloadPageHTML() {
  return `
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
            <div class="logo-icon-small" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 8V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9zm3 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
              </svg>
              <div class="keyhole-dot" aria-hidden="true"></div>
            </div>
            <h1 class="logo">encrypt&Go</h1>
          </div>
          <p class="tagline">Secure File Download</p>
        </div>
      </header>

      <main class="main-content">
        <section id="download-section" class="card download-card active">
          <div id="download-loading" class="download-loading" style="display: none;">
            <div class="loader"></div>
            <p>Loading file information...</p>
          </div>

          <div id="download-content" class="download-content">
            <div class="file-icon-large">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            
            <h2 id="download-filename" class="download-filename">Loading...</h2>
            <div class="file-meta">
              <span id="file-size-display" class="file-size-badge">--</span>
              <span id="download-count" class="download-count-badge">--</span>
            </div>

            <div id="countdown-timer" class="countdown-timer">
              <div class="timer-icon">⏰</div>
              <div class="timer-text">
                <span class="timer-label">File expires in:</span>
                <span id="timer-display" class="timer-display">Loading...</span>
              </div>
            </div>

            <div class="key-input-section">
              <label class="input-label">Decryption Key</label>
              <div class="key-input-container">
                <input id="download-key-input" type="password" placeholder="Enter decryption key" />
                <button id="download-toggle-visibility" class="visibility-toggle">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                  </svg>
                </button>
              </div>
            </div>

            <button id="download-btn" class="btn-primary btn-download-large">
              <span class="btn-text">Download & Decrypt</span>
              <div class="btn-loader" style="display: none;"></div>
            </button>

            <div id="download-progress" class="progress-container" style="display: none;">
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
              <div class="progress-text">Downloading and decrypting...</div>
            </div>

            <div id="download-error" class="download-error" style="display: none;">
              <div class="error-icon">⚠️</div>
              <p id="error-message"></p>
            </div>
          </div>
        </section>
      </main>
    </div>

    <div id="toast" class="toast"></div>
  `
}

function initUploadPage() {
  const dragDrop = el('drag-drop')
  const fileInput = el('file-input') as HTMLInputElement
  const toggleVisibility = el('toggle-visibility') as HTMLButtonElement
  const generateKey = el('generate-key') as HTMLButtonElement
  const encryptBtn = el('encrypt-btn') as HTMLButtonElement
  const copyLink = el('copy-link') as HTMLButtonElement

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
    btnText.textContent = 'Encrypting & Uploading...'
    btnLoader.style.display = 'block'
    encryptBtn.disabled = true

    const progress = el('progress')
    const progressFill = progress.querySelector('.progress-fill') as HTMLElement
    progress.style.display = 'flex'
    progressFill.style.width = '0%'

    updateSteps(3)

    try {
      progressFill.style.width = '20%'
      const data = await ui.readFileAsUint8(currentFile)
      const salt = crypto.rndBytes(16)
      const iv = crypto.rndBytes(12)
      const pass = (el('key-input') as HTMLInputElement).value.trim()
      let key: CryptoKey
      let encryptionKey: string
      
      if (pass === '') {
        // Generate a random key and use the SAME key for both encryption and storage
        encryptionKey = crypto.generateRandomKeyBase64()
        const raw = crypto.fromBase64(encryptionKey)
        key = await crypto.importRawKey(raw)
      } else {
        // Check if the input is a base64-encoded 32-byte key (from "Generate Random Key")
        // or a regular passphrase
        try {
          const decoded = crypto.fromBase64(pass)
          if (decoded.length === 32) {
            // This is a base64-encoded 32-byte key (generated key)
            console.log('Detected base64-encoded 32-byte key, using as raw key')
            encryptionKey = pass
            key = await crypto.importRawKey(decoded)
          } else {
            // Not a 32-byte key, treat as passphrase
            console.log('Input is not a 32-byte key, treating as passphrase')
            encryptionKey = pass
            key = await crypto.deriveKeyFromPassphrase(pass, salt)
          }
        } catch (e) {
          // Base64 decode failed, definitely a passphrase
          console.log('Base64 decode failed, treating as passphrase')
          encryptionKey = pass
          key = await crypto.deriveKeyFromPassphrase(pass, salt)
        }
      }

      progressFill.style.width = '40%'
      const { ciphertext } = await crypto.encryptBytes(data, key, iv)

      progressFill.style.width = '60%'
      const encryptedBinary = crypto.makeEncBinary(salt, iv, ciphertext)
      const encryptedBlob = new Blob([encryptedBinary], { type: 'application/octet-stream' })

      progressFill.style.width = '80%'
      const expiresInDays = parseInt((el('expiration-select') as HTMLSelectElement).value) || 7
      const result = await api.uploadFile(encryptedBlob, currentFile.name, expiresInDays)

      progressFill.style.width = '100%'
      const baseUrl = window.location.origin
      const shareableLink = `${baseUrl}/#download/${result.fileId}#key=${encodeURIComponent(encryptionKey)}`

      const uploadResult = el('upload-result')
      const shareLinkInput = el('share-link') as HTMLInputElement
      shareLinkInput.value = shareableLink
      uploadResult.style.display = 'block'

      dragDrop.classList.add('success')
      showConfetti()
      showToast('File encrypted and uploaded successfully!')

      uploadResult.scrollIntoView({ behavior: 'smooth' })

    } catch (e) {
      console.error('Encryption/Upload error:', e)
      showToast(`Upload failed: ${e instanceof Error ? e.message : 'Unknown error'}`, true)
      el('encrypt-section').classList.add('error-shake')
      setTimeout(() => el('encrypt-section').classList.remove('error-shake'), 500)
    } finally {
      isEncrypting = false
      btnText.textContent = 'Encrypt & Upload'
      btnLoader.style.display = 'none'
      encryptBtn.disabled = false
      progress.style.display = 'none'
    }
  })

  copyLink.addEventListener('click', async () => {
    const shareLinkInput = el('share-link') as HTMLInputElement
    await ui.copyToClipboard(shareLinkInput.value)
    showToast('Link copied to clipboard!')
  })
}

async function initDownloadPage(fileId: string, encryptionKey: string) {
  console.log('Initializing download page for fileId:', fileId, 'key length:', encryptionKey.length)
  
  // Wait a bit for DOM to be ready, then get elements
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const downloadLoading = document.getElementById('download-loading')
  const downloadContent = document.getElementById('download-content')
  const downloadError = document.getElementById('download-error')
  let downloadBtn = document.getElementById('download-btn') as HTMLButtonElement
  const keyInput = document.getElementById('download-key-input') as HTMLInputElement
  
  console.log('Elements found:', {
    downloadLoading: !!downloadLoading,
    downloadContent: !!downloadContent,
    downloadBtn: !!downloadBtn,
    keyInput: !!keyInput,
    downloadError: !!downloadError
  })
  
  // If button not found, try to find it or create it
  if (!downloadBtn) {
    console.warn('Download button not found, searching...')
    downloadBtn = document.querySelector('#download-btn') as HTMLButtonElement
    if (!downloadBtn && downloadContent) {
      // Create button as fallback
      const fallbackBtn = document.createElement('button')
      fallbackBtn.id = 'download-btn'
      fallbackBtn.className = 'btn-primary btn-download-large'
      fallbackBtn.innerHTML = '<span class="btn-text">Download & Decrypt</span><div class="btn-loader" style="display: none;"></div>'
      downloadContent.appendChild(fallbackBtn)
      downloadBtn = fallbackBtn
      console.log('Created fallback download button')
    }
  }
  
  if (!downloadBtn) {
    console.error('Download button not found! Available buttons:', Array.from(document.querySelectorAll('button')).map(b => ({ id: b.id, classes: b.className })))
    showToast('Download button not found. Please refresh the page.', true)
    return
  }
  
  if (!downloadContent) {
    console.error('Download content not found!')
    showToast('Page content not loaded. Please refresh.', true)
    return
  }
  
  // Set the key from URL
  if (keyInput) {
    keyInput.value = encryptionKey
    console.log('Key set from URL (length):', encryptionKey.length)
  }

  // Toggle visibility
  const toggleVisibility = document.getElementById('download-toggle-visibility') as HTMLButtonElement
  if (toggleVisibility && keyInput) {
    toggleVisibility.addEventListener('click', () => {
      if (keyInput) {
        keyInput.type = keyInput.type === 'password' ? 'text' : 'password'
      }
    })
  }

  // Ensure the card section is visible
  const downloadSection = document.getElementById('download-section')
  if (downloadSection) {
    downloadSection.classList.add('active')
    downloadSection.style.display = 'block'
  }
  
  // Ensure download content is visible immediately
  if (downloadContent) {
    downloadContent.style.display = 'block'
    downloadContent.style.visibility = 'visible'
    downloadContent.style.opacity = '1'
  }
  
  // Ensure button is visible and enabled - use !important styles
  downloadBtn.style.cssText = `
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    cursor: pointer !important;
  `
  downloadBtn.disabled = false
  
  // Show loading overlay while fetching metadata
  if (downloadLoading) {
    downloadLoading.style.display = 'flex'
  }
  
  let metadata: api.FileMetadataResponse | null = null

  try {
    console.log('Loading file metadata...')
    // Load file metadata
    metadata = await api.getFileMetadata(fileId)
    console.log('Metadata loaded:', metadata)
    
    // Display file info
    const filenameEl = document.getElementById('download-filename')
    const sizeEl = document.getElementById('file-size-display')
    const countEl = document.getElementById('download-count')
    
    if (filenameEl) filenameEl.textContent = metadata.filename
    if (sizeEl) sizeEl.textContent = ui.formatBytes(metadata.size)
    if (countEl) countEl.textContent = `${metadata.downloadCount} download${metadata.downloadCount !== 1 ? 's' : ''}`
    
    // Start countdown timer immediately (timer is always visible)
    startCountdown(new Date(metadata.expiresAt))
    
    // Hide loading overlay, content is already visible
    if (downloadLoading) downloadLoading.style.display = 'none'
    if (downloadError) downloadError.style.display = 'none'
    
  } catch (error: any) {
    console.error('Failed to load file metadata:', error)
    if (downloadLoading) downloadLoading.style.display = 'none'
    if (downloadError) {
      downloadError.style.display = 'block'
      const errorMsgEl = document.getElementById('error-message')
      if (errorMsgEl) errorMsgEl.textContent = error.message || 'Failed to load file information'
    }
    // Still allow download attempt even if metadata fails
    const filenameEl = document.getElementById('download-filename')
    if (filenameEl) filenameEl.textContent = 'File (metadata unavailable)'
  }
  
  // Download button handler - always set up, even if metadata failed
  console.log('Setting up download button handler')
  
  // Store metadata in closure for button handler
  const finalMetadata = metadata
  
  // Remove any existing listeners by cloning
  const newBtn = downloadBtn.cloneNode(true) as HTMLButtonElement
  downloadBtn.parentNode?.replaceChild(newBtn, downloadBtn)
  
  // Ensure new button is visible
  newBtn.style.cssText = `
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    cursor: pointer !important;
  `
  newBtn.disabled = false
  
  // Set up click handler
  const handleDownload = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Download button clicked!')
    const key = keyInput?.value.trim() || encryptionKey
    if (!key) {
      showToast('Please enter a decryption key', true)
      return
    }
    
    // Use metadata filename if available, otherwise try to get it during download
    const filename = finalMetadata?.filename || 'decrypted-file'
    console.log('Starting download, fileId:', fileId, 'filename:', filename, 'key length:', key.length)
    try {
      await downloadAndDecrypt(fileId, key, filename)
    } catch (err) {
      console.error('Error in download handler:', err)
      showToast('Download failed: ' + (err instanceof Error ? err.message : 'Unknown error'), true)
    }
  }
  
  newBtn.onclick = handleDownload
  newBtn.addEventListener('click', handleDownload)
  
  console.log('Download button handler set up successfully')
  console.log('Button is visible:', {
    display: window.getComputedStyle(newBtn).display,
    visibility: window.getComputedStyle(newBtn).visibility,
    opacity: window.getComputedStyle(newBtn).opacity,
    disabled: newBtn.disabled,
    width: window.getComputedStyle(newBtn).width,
    height: window.getComputedStyle(newBtn).height,
    inDOM: document.body.contains(newBtn)
  })
}

async function downloadAndDecrypt(fileId: string, encryptionKey: string, originalFilename: string) {
  if (isDecrypting) {
    console.log('Download already in progress, ignoring click')
    return
  }
  isDecrypting = true
  
  const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement
  if (!downloadBtn) {
    console.error('Download button not found in downloadAndDecrypt!')
    isDecrypting = false
    return
  }
  
  const btnText = downloadBtn.querySelector('.btn-text') as HTMLElement
  const btnLoader = downloadBtn.querySelector('.btn-loader') as HTMLElement
  const downloadProgress = document.getElementById('download-progress')
  const progressFill = downloadProgress?.querySelector('.progress-fill') as HTMLElement
  const downloadError = document.getElementById('download-error')
  
  if (btnText) btnText.textContent = 'Downloading & Decrypting...'
  if (btnLoader) btnLoader.style.display = 'block'
  downloadBtn.disabled = true
  if (downloadProgress) downloadProgress.style.display = 'flex'
  if (downloadError) downloadError.style.display = 'none'
  if (progressFill) progressFill.style.width = '0%'

  try {
    console.log('Starting download for fileId:', fileId, 'filename:', originalFilename)
    if (progressFill) progressFill.style.width = '20%'
    
    // Download encrypted file - try to get filename from response if not provided
    let filenameToUse = originalFilename
    const { blob: encryptedBlob, filename: responseFilename } = await api.downloadFile(fileId)
    console.log('File downloaded, size:', encryptedBlob.size)
    
    // Use response filename if metadata filename wasn't available
    if (filenameToUse === 'decrypted-file' && responseFilename && responseFilename !== 'decrypted-file') {
      filenameToUse = responseFilename
      console.log('Using filename from download response:', filenameToUse)
    }
    
    if (progressFill) progressFill.style.width = '40%'
    const encryptedData = await ui.readFileAsUint8(new File([encryptedBlob], 'encrypted.enc'))
    console.log('File read as Uint8Array, length:', encryptedData.length)
    
    if (progressFill) progressFill.style.width = '50%'
    const { salt, iv, ciphertext } = crypto.parseEncBinary(encryptedData)
    console.log('Encrypted binary parsed - salt:', salt.length, 'iv:', iv.length, 'ciphertext:', ciphertext.length)
    
    if (progressFill) progressFill.style.width = '60%'
    // Derive or import key
    let key: CryptoKey
    console.log('Processing encryption key, length:', encryptionKey.length, 'characters')
    
    try {
      // Try to decode as base64 first to check if it's a raw key
      const raw = crypto.fromBase64(encryptionKey)
      console.log('Decoded key length:', raw.length, 'bytes')
      
      if (raw.length === 32) {
        // This is a raw 32-byte key (base64 encoded)
        console.log('Using raw key (32 bytes) - direct import')
        key = await crypto.importRawKey(raw)
        console.log('Raw key imported successfully')
      } else {
        // Not a 32-byte key, treat as passphrase
        console.log('Key is not 32 bytes, treating as passphrase')
        key = await crypto.deriveKeyFromPassphrase(encryptionKey, salt)
        console.log('Key derived from passphrase successfully')
      }
    } catch (e: any) {
      console.error('Key processing error:', e)
      // If base64 decode fails, it's definitely a passphrase
      console.log('Base64 decode failed, treating as passphrase')
      try {
        key = await crypto.deriveKeyFromPassphrase(encryptionKey, salt)
        console.log('Key derived from passphrase (fallback)')
      } catch (deriveError: any) {
        console.error('Key derivation also failed:', deriveError)
        throw new Error(`Failed to process encryption key: ${deriveError?.message || 'Unknown error'}`)
      }
    }

    if (progressFill) progressFill.style.width = '80%'
    console.log('Decrypting...')
    let pt: Uint8Array
    try {
      pt = await crypto.decryptBytes(ciphertext, key, iv)
      console.log('Decryption successful, plaintext length:', pt.length)
    } catch (decryptError: any) {
      console.error('Decryption failed:', decryptError)
      const errorMsg = decryptError?.message || 'Decryption failed'
      if (errorMsg.includes('operation-specific') || errorMsg.includes('decrypt')) {
        throw new Error('Decryption failed: The encryption key is incorrect or the file is corrupted. Please verify the key matches the one used during upload.')
      }
      throw new Error(`Decryption failed: ${errorMsg}`)
    }
    
    if (progressFill) progressFill.style.width = '90%'
    
    // Use the filename (from metadata or response)
    // Create a new Uint8Array to ensure proper type compatibility
    const ptArray = new Uint8Array(pt)
    const blob = new Blob([ptArray], { type: 'application/octet-stream' })
    console.log('Blob created, size:', blob.size, 'type:', blob.type)
    console.log('Downloading file as:', filenameToUse)
    
    // Small delay to ensure UI updates
    await new Promise(resolve => setTimeout(resolve, 100))
    
    ui.downloadBlob(blob, filenameToUse)
    
    if (progressFill) progressFill.style.width = '100%'
    console.log('Download initiated successfully')

    showToast('File downloaded and decrypted successfully!')
    
    // Update download count if possible
    setTimeout(async () => {
      try {
        const metadata = await api.getFileMetadata(fileId)
        const countEl = document.getElementById('download-count')
        if (countEl) {
          countEl.textContent = `${metadata.downloadCount} download${metadata.downloadCount !== 1 ? 's' : ''}`
        }
      } catch (e) {
        console.error('Failed to update download count:', e)
      }
    }, 1000)
    
  } catch (error: any) {
    console.error('Download/decryption error:', error)
    const errorMessage = error.message || 'Download/decryption failed'
    showToast(errorMessage, true)
    if (downloadError) {
      downloadError.style.display = 'block'
      const errorMsgEl = document.getElementById('error-message')
      if (errorMsgEl) errorMsgEl.textContent = errorMessage
    }
  } finally {
    isDecrypting = false
    if (btnText) btnText.textContent = 'Download & Decrypt'
    if (btnLoader) btnLoader.style.display = 'none'
    downloadBtn.disabled = false
    if (downloadProgress) downloadProgress.style.display = 'none'
  }
}

function startCountdown(expiresAt: Date) {
  const timerDisplay = document.getElementById('timer-display')
  const countdownTimer = document.getElementById('countdown-timer')
  
  if (!timerDisplay || !countdownTimer) {
    console.error('Timer elements not found')
    return
  }
  
  // Clear any existing interval
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  
  function updateTimer() {
    if (!timerDisplay || !countdownTimer) return
    
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    
    if (diff <= 0) {
      timerDisplay.textContent = 'EXPIRED - File deleted'
      countdownTimer.classList.add('expired')
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
      // Disable download button if expired
      const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement
      if (downloadBtn) {
        downloadBtn.disabled = true
        downloadBtn.style.opacity = '0.5'
        downloadBtn.style.cursor = 'not-allowed'
      }
      return
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    // Format timer display
    let displayText = ''
    if (days > 0) {
      displayText = `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`
    } else if (hours > 0) {
      displayText = `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}, ${seconds} second${seconds !== 1 ? 's' : ''}`
    } else if (minutes > 0) {
      displayText = `${minutes} minute${minutes !== 1 ? 's' : ''}, ${seconds} second${seconds !== 1 ? 's' : ''}`
    } else {
      displayText = `${seconds} second${seconds !== 1 ? 's' : ''}`
    }
    
    timerDisplay.textContent = displayText
    countdownTimer.classList.remove('expired')
  }
  
  // Update immediately
  updateTimer()
  // Update every second
  countdownInterval = window.setInterval(updateTimer, 1000)
  console.log('Countdown timer started, expires at:', expiresAt.toISOString())
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

