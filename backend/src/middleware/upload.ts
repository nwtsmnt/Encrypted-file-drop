// File upload middleware using multer
import multer from 'multer'
import { config } from '../config/env'

// Configure multer to store files in memory (we'll upload to S3 later)
const storage = multer.memoryStorage()

// File filter to only accept encrypted files
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept all files for now (encrypted files have no specific extension)
  // In production, you might want to validate file signatures
  cb(null, true)
}

export const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize, // 50MB default
  },
  fileFilter,
})

