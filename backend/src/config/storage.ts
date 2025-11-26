// Temporary in-memory storage (for development/testing)
// This will be replaced with S3 integration later

import { Buffer } from 'buffer'

export interface FileMetadata {
  buffer: Buffer
  filename: string
  expiresAt: Date
  downloadCount: number
  uploadedAt: Date
}

/**
 * Temporary file storage
 * 
 * NOTE: This is only for development/testing.
 * In production, files will be stored in S3.
 * This Map will be cleared when the server restarts.
 */
export const temporaryStorage = new Map<string, FileMetadata>()

/**
 * Store a file temporarily with metadata
 * @param fileId - Unique file identifier
 * @param buffer - File buffer
 * @param filename - Original filename
 * @param expiresInDays - Number of days until expiration (default: 7)
 */
export function storeFile(fileId: string, buffer: Buffer, filename: string, expiresInDays: number = 7): void {
  const uploadedAt = new Date()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)
  
  temporaryStorage.set(fileId, {
    buffer,
    filename,
    expiresAt,
    downloadCount: 0,
    uploadedAt
  })
}

/**
 * Retrieve a file from temporary storage
 * @param fileId - Unique file identifier
 * @returns File buffer or undefined if not found or expired
 */
export function getFile(fileId: string): Buffer | undefined {
  const file = temporaryStorage.get(fileId)
  if (!file) return undefined
  
  // Check if expired
  if (new Date() > file.expiresAt) {
    temporaryStorage.delete(fileId)
    return undefined
  }
  
  return file.buffer
}

/**
 * Get file metadata
 * @param fileId - Unique file identifier
 * @returns File metadata or undefined if not found
 */
export function getFileMetadata(fileId: string): Omit<FileMetadata, 'buffer'> | undefined {
  const file = temporaryStorage.get(fileId)
  if (!file) return undefined
  
  // Check if expired
  if (new Date() > file.expiresAt) {
    temporaryStorage.delete(fileId)
    return undefined
  }
  
  return {
    filename: file.filename,
    expiresAt: file.expiresAt,
    downloadCount: file.downloadCount,
    uploadedAt: file.uploadedAt
  }
}

/**
 * Increment download count
 * @param fileId - Unique file identifier
 */
export function incrementDownloadCount(fileId: string): void {
  const file = temporaryStorage.get(fileId)
  if (file) {
    file.downloadCount++
  }
}

/**
 * Check if a file exists
 * @param fileId - Unique file identifier
 * @returns true if file exists
 */
export function fileExists(fileId: string): boolean {
  return temporaryStorage.has(fileId)
}

/**
 * Delete a file from temporary storage
 * @param fileId - Unique file identifier
 */
export function deleteFile(fileId: string): void {
  temporaryStorage.delete(fileId)
}

