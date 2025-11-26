// Type definitions for the application

export interface UploadResponse {
  fileId: string
  expiresAt: string
}

export interface ApiError {
  error: string
  message?: string
}

export interface FileMetadata {
  fileId: string
  size: number
  uploadedAt: Date
}

