import crypto from './crypto'

export function formatBytes(n: number) {
  if (n < 1024) return n + ' B'
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB'
  return (n / (1024 * 1024)).toFixed(2) + ' MB'
}

export function downloadBlob(blob: Blob, filename: string) {
  console.log('downloadBlob called with filename:', filename, 'blob size:', blob.size)
  try {
    // Sanitize filename to avoid issues
    const sanitizedFilename = filename.replace(/[<>:"/\\|?*]/g, '_')
    console.log('Sanitized filename:', sanitizedFilename)
    
    // Method 1: Try using download attribute
    const url = URL.createObjectURL(blob)
    console.log('Object URL created:', url)
    
    const a = document.createElement('a')
    a.href = url
    a.download = sanitizedFilename
    a.style.display = 'none'
    a.setAttribute('download', sanitizedFilename)
    
    // Make sure the link is in the DOM
    document.body.appendChild(a)
    console.log('Anchor element appended to body')
    
    // Force a reflow
    void a.offsetHeight
    
    // Try multiple methods to trigger download
    console.log('Triggering download click...')
    
    // Method 1: Direct click
    try {
      a.click()
      console.log('Download click triggered (method 1)')
    } catch (e) {
      console.warn('Method 1 failed, trying method 2:', e)
      
      // Method 2: MouseEvent
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
      a.dispatchEvent(event)
      console.log('Download click triggered (method 2)')
    }
    
    // Method 3: Fallback - open in new window (if click doesn't work)
    setTimeout(() => {
      try {
        // Check if download was triggered by checking if URL is still valid
        // If not, try opening in new window as fallback
        if (document.body.contains(a)) {
          console.log('Download may not have triggered, trying fallback...')
          // Don't remove yet, give browser time to process
        }
      } catch (e) {
        console.error('Fallback check error:', e)
      }
    }, 100)
    
    // Clean up after a delay
    setTimeout(() => {
      try {
        if (document.body.contains(a)) {
          document.body.removeChild(a)
        }
        URL.revokeObjectURL(url)
        console.log('Cleanup complete')
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError)
      }
    }, 2000)
    
    return true
  } catch (error) {
    console.error('Error in downloadBlob:', error)
    // Last resort: try to open blob URL directly
    try {
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 10000)
      console.log('Opened blob URL in new window as fallback')
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
    }
    throw error
  }
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
