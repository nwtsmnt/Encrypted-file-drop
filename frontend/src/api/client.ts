// API client for backend communication
// Handles all HTTP requests to the backend API

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface UploadResponse {
  fileId: string
  expiresAt: string
}

export interface FileMetadataResponse {
  filename: string
  expiresAt: string
  uploadedAt: string
  downloadCount: number
  size: number
}

export interface ApiError {
  error: string
  message?: string
}

/**
 * Upload encrypted file to backend
 * @param encryptedFile - The encrypted binary file (Blob or File)
 * @param originalFilename - Original filename to preserve extension
 * @param expiresInDays - Number of days until expiration (1-14, default: 7)
 * @returns Promise with fileId and expiration
 */
export async function uploadFile(encryptedFile: Blob | File, originalFilename: string, expiresInDays: number = 7): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', encryptedFile, 'encrypted.enc')
  formData.append('filename', originalFilename)
  formData.append('expiresInDays', expiresInDays.toString())

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: `Upload failed: ${response.statusText}`,
    }))
    throw new Error(error.error || error.message || 'Upload failed')
  }

  return response.json()
}

/**
 * Get file metadata for download page
 * @param fileId - The file ID
 * @returns Promise with file metadata
 */
export async function getFileMetadata(fileId: string): Promise<FileMetadataResponse> {
  const response = await fetch(`${API_URL}/download/${fileId}/metadata`, {
    method: 'GET',
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('File not found or expired')
    }
    const error: ApiError = await response.json().catch(() => ({
      error: `Failed to get file metadata: ${response.statusText}`,
    }))
    throw new Error(error.error || error.message || 'Failed to get file metadata')
  }

  return response.json()
}

/**
 * Download encrypted file from backend
 * @param fileId - The file ID returned from upload
 * @returns Promise with encrypted file as Blob and original filename
 */
export async function downloadFile(fileId: string): Promise<{ blob: Blob; filename: string }> {
  const response = await fetch(`${API_URL}/download/${fileId}`, {
    method: 'GET',
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('File not found')
    }
    const error: ApiError = await response.json().catch(() => ({
      error: `Download failed: ${response.statusText}`,
    }))
    throw new Error(error.error || error.message || 'Download failed')
  }

  // Extract filename from Content-Disposition header
  // Supports both standard format and RFC 5987 (filename*=UTF-8''encoded)
  let filename = 'decrypted-file'
  const contentDisposition = response.headers.get('Content-Disposition')
  if (contentDisposition) {
    // Try RFC 5987 format first: filename*=UTF-8''encoded-name
    const rfc5987Match = contentDisposition.match(/filename\*=UTF-8''(.+)/)
    if (rfc5987Match && rfc5987Match[1]) {
      try {
        const decoded = decodeURIComponent(rfc5987Match[1])
        filename = decoded.endsWith('.enc') ? decoded.slice(0, -4) : decoded
      } catch {
        // Fallback to regular filename if decoding fails
      }
    }
    
    // Fallback to regular filename parameter if RFC 5987 not found or failed
    if (filename === 'decrypted-file') {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch && filenameMatch[1]) {
        const filenameWithExt = filenameMatch[1]
        // Remove .enc extension if present
        if (filenameWithExt.endsWith('.enc')) {
          filename = filenameWithExt.slice(0, -4)
        } else {
          filename = filenameWithExt
        }
      }
    }
  }

  return { blob: await response.blob(), filename }
}

/**
 * Health check endpoint
 * @returns Promise with health status
 */
export async function healthCheck(): Promise<{ status: string; message?: string }> {
  const response = await fetch(`${API_URL}/health`)
  if (!response.ok) {
    throw new Error('Health check failed')
  }
  return response.json()
}

