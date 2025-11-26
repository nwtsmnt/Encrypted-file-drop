// Download route handler
import { Router, Request, Response, NextFunction } from 'express'
import { getFile, getFileMetadata, incrementDownloadCount } from '../config/s3Storage'

const router = Router()

/**
 * GET /api/download/:fileId/metadata
 * Get file metadata (for download page)
 * 
 * Response: { filename, expiresAt, downloadCount, size }
 */
router.get(
  '/:fileId/metadata',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileId } = req.params

      // Validate fileId format (UUID)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(fileId)) {
        return res.status(400).json({
          error: 'Invalid file ID',
          message: 'File ID must be a valid UUID',
        })
      }

      const metadata = await getFileMetadata(fileId)
      if (!metadata) {
        return res.status(404).json({
          error: 'File not found',
          message: `File with ID ${fileId} does not exist or has expired`,
        })
      }

      res.json({
        filename: metadata.filename,
        expiresAt: metadata.expiresAt.toISOString(),
        uploadedAt: metadata.uploadedAt.toISOString(),
        downloadCount: metadata.downloadCount,
        size: metadata.size,
      })
    } catch (error) {
      console.error('Metadata error:', error)
      next(error)
    }
  }
)

/**
 * GET /api/download/:fileId
 * Download an encrypted file
 * 
 * Response: encrypted file binary
 */
router.get(
  '/:fileId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileId } = req.params

      console.log('Download request for fileId:', fileId)

      // Validate fileId format (UUID)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(fileId)) {
        console.log('Invalid fileId format:', fileId)
        return res.status(400).json({
          error: 'Invalid file ID',
          message: 'File ID must be a valid UUID',
        })
      }

      // Get file from S3
      const fileBuffer = await getFile(fileId)

      if (!fileBuffer) {
        console.log('File not found in S3:', fileId)
        return res.status(404).json({
          error: 'File not found',
          message: `File with ID ${fileId} does not exist or has expired`,
        })
      }

      // Get original filename from metadata
      const metadata = await getFileMetadata(fileId)
      if (!metadata) {
        console.log('File metadata not found or expired:', fileId)
        return res.status(404).json({
          error: 'File not found',
          message: `File with ID ${fileId} does not exist or has expired`,
        })
      }
      
      const filename = metadata.filename

      console.log('File found in S3, filename:', filename, 'size:', fileBuffer.length, 'bytes', 'downloads:', metadata.downloadCount)
      
      // Increment download count
      await incrementDownloadCount(fileId)

      // Encode filename for Content-Disposition header (RFC 5987)
      // HTTP headers must be ASCII, so we need to encode non-ASCII characters
      const filenameWithExt = `${filename}.enc`
      
      // Create a simple ASCII-safe fallback filename
      const asciiFallback = `file.enc`
      
      // Encode UTF-8 filename for RFC 5987 format
      // encodeURIComponent produces URL-encoded string (only ASCII characters: 0x20-0x7E)
      // This ensures all non-ASCII characters are properly encoded
      const encodedFilenameWithExt = encodeURIComponent(filenameWithExt)
      
      // Validate encoded string contains only valid HTTP header characters
      const isValidEncoded = /^[\x20-\x7E]*$/.test(encodedFilenameWithExt)
      
      // Use RFC 5987 format: filename for ASCII fallback, filename* for UTF-8 encoded
      // Format: attachment; filename="fallback.enc"; filename*=UTF-8''encoded-name.enc
      // The filename* parameter is the one browsers will use for the actual download name
      let contentDisposition: string
      
      if (isValidEncoded) {
        // Build header with RFC 5987 encoding
        contentDisposition = `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodedFilenameWithExt}`
      } else {
        // Fallback to simple header if encoding validation fails
        console.warn('Filename encoding validation failed, using fallback')
        contentDisposition = `attachment; filename="${asciiFallback}"`
      }

      // Set headers
      res.setHeader('Content-Type', 'application/octet-stream')
      res.setHeader('Content-Disposition', contentDisposition)
      res.setHeader('Content-Length', fileBuffer.length.toString())

      // Send file
      res.send(fileBuffer)
    } catch (error) {
      console.error('Download error:', error)
      next(error)
    }
  }
)

export default router

