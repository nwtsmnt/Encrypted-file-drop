// Upload route handler
import { Router, Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { upload } from '../middleware/upload'
import { UploadResponse } from '../types'
import { storeFile, getFileMetadata } from '../config/s3Storage'

const router = Router()

/**
 * POST /api/upload
 * Upload an encrypted file
 * 
 * Request: multipart/form-data with 'file' field and optional 'filename' field
 * Response: { fileId: string }
 */
router.post(
  '/',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file provided',
          message: 'Please include a file in the request',
        })
      }

      // Get original filename from form data or use default
      const originalFilename = (req.body.filename as string) || 'file'
      
      // Get expiration time (default: 7 days)
      const expiresInDays = parseInt(req.body.expiresInDays as string) || 7
      // Validate expiration (1-14 days)
      const validExpiration = Math.max(1, Math.min(14, expiresInDays))

      // Generate unique file ID
      const fileId = uuidv4()

      // Upload encrypted file to S3
      await storeFile(fileId, req.file.buffer, originalFilename, validExpiration)
      
      const metadata = await getFileMetadata(fileId)
      console.log('File stored in S3 with ID:', fileId, 'Filename:', originalFilename, 'Size:', req.file.buffer.length, 'bytes', 'Expires:', metadata?.expiresAt)

      const response: UploadResponse = {
        fileId,
        expiresAt: metadata?.expiresAt.toISOString() || new Date().toISOString(),
      }

      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }
)

export default router

