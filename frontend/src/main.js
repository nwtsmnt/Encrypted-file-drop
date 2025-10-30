import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="app">
    <header class="hero">
      <div class="hero-title">
        <h1>Encrypt & Go</h1>
      </div>
      <p>Secure your files with enterprise-grade encryption. Keys never leave your device.</p>
      <div class="hero-buttons">
        <button class="cta-btn" onclick="showSection('encrypt')">Encrypt File</button>
        <button class="cta-btn secondary" onclick="showSection('decrypt')">Decrypt File</button>
      </div>
    </header>

    <main>
      <section id="encrypt-section" class="section active">
        <h2>Encrypt a File</h2>
        <form id="encrypt-form" class="form">
          <div class="form-group">
            <label for="encrypt-file">Select File to Encrypt</label>
            <input type="file" id="encrypt-file" required>
          </div>
          <div class="form-group">
            <label for="encrypt-password">Password</label>
            <input type="password" id="encrypt-password" placeholder="Enter a strong password" required>
          </div>
          <button type="submit" class="action-btn">Encrypt & Download</button>
        </form>
      </section>

      <section id="decrypt-section" class="section">
        <h2>Decrypt a File</h2>
        <form id="decrypt-form" class="form">
          <div class="form-group">
            <label for="decrypt-file">Select Encrypted File</label>
            <input type="file" id="decrypt-file" required>
          </div>
          <div class="form-group">
            <label for="decrypt-password">Password</label>
            <input type="password" id="decrypt-password" placeholder="Enter your password" required>
          </div>
          <button type="submit" class="action-btn">Decrypt & Download</button>
        </form>
      </section>

      <div id="progress-container" class="progress-container hidden">
        <div class="progress-ring">
          <svg class="progress-circle" width="120" height="120">
            <circle cx="60" cy="60" r="54" stroke="#e0e0e0" stroke-width="6" fill="none"></circle>
            <circle cx="60" cy="60" r="54" stroke="#7c3aed" stroke-width="6" fill="none" stroke-dasharray="339.292" stroke-dashoffset="339.292" class="progress-bar"></circle>
          </svg>
          <div class="progress-text">Processing...</div>
        </div>
      </div>

      <div id="success-modal" class="modal hidden">
        <div class="modal-content">
          <div class="success-icon">✓</div>
          <h3>Success!</h3>
          <p>Your file has been processed successfully.</p>
          <button onclick="closeModal()">Close</button>
        </div>
        <div class="confetti"></div>
      </div>
    </main>
  </div>
`

// JavaScript for UI interactions
window.showSection = function(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section + '-section').classList.add('active');
}

window.closeModal = function() {
  document.getElementById('success-modal').classList.add('hidden');
}

// Encryption and Decryption functions using Web Crypto API
async function deriveKey(password, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptFile(file, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  
  const arrayBuffer = await file.arrayBuffer();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    arrayBuffer
  );
  
  // Combine salt + iv + encrypted data
  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  return new Blob([result], { type: 'application/octet-stream' });
}

async function decryptFile(file, password) {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const encrypted = data.slice(28);
  
  const key = await deriveKey(password, salt);
  
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    );
    
    return new Blob([decrypted]);
  } catch (error) {
    throw new Error('Decryption failed. Please check your password.');
  }
}

// Update form handlers
document.getElementById('encrypt-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const fileInput = document.getElementById('encrypt-file');
  const password = document.getElementById('encrypt-password').value;
  
  if (!fileInput.files[0] || !password) return;
  
  showProgress();
  try {
    const encryptedBlob = await encryptFile(fileInput.files[0], password);
    const url = URL.createObjectURL(encryptedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileInput.files[0].name + '.encrypted';
    a.click();
    URL.revokeObjectURL(url);
    hideProgress();
    showSuccess();
  } catch (error) {
    hideProgress();
    alert('Encryption failed: ' + error.message);
  }
});

document.getElementById('decrypt-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const fileInput = document.getElementById('decrypt-file');
  const password = document.getElementById('decrypt-password').value;
  
  if (!fileInput.files[0] || !password) return;
  
  showProgress();
  try {
    const decryptedBlob = await decryptFile(fileInput.files[0], password);
    const url = URL.createObjectURL(decryptedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileInput.files[0].name.replace('.encrypted', '');
    a.click();
    URL.revokeObjectURL(url);
    hideProgress();
    showSuccess();
  } catch (error) {
    hideProgress();
    alert(error.message);
  }
});

function showProgress() {
  document.getElementById('progress-container').classList.remove('hidden');
  animateProgress();
}

function hideProgress() {
  document.getElementById('progress-container').classList.add('hidden');
}

function showSuccess() {
  document.getElementById('success-modal').classList.remove('hidden');
  launchConfetti();
}

function animateProgress() {
  const circle = document.querySelector('.progress-bar');
  circle.style.strokeDashoffset = '0';
}

function launchConfetti() {
  // Simple confetti animation
  const confetti = document.querySelector('.confetti');
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 2 + 's';
    confetti.appendChild(particle);
    setTimeout(() => particle.remove(), 3000);
  }
}
