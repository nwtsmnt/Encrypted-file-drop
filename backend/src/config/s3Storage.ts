// S3 storage implementation for encrypted files
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { config } from './env'
import { Buffer } from 'buffer'

export interface FileMetadata {
  filename: string
  expiresAt: Date
  downloadCount: number
  uploadedAt: Date
  size: number
}

// Initialize S3 client
const s3Client = new S3Client({
  region: config.s3.region,
  credentials: config.s3.accessKeyId && config.s3.secretAccessKey
    ? {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      }
    : undefined, // Use IAM role if credentials not provided
})

const BUCKET_NAME = config.s3.bucket
const METADATA_PREFIX = 'metadata/'
const FILES_PREFIX = 'files/'

/**
 * Store a file in S3 with metadata
 * @param fileId - Unique file identifier
 * @param buffer - File buffer (encrypted)
 * @param filename - Original filename
 * @param expiresInDays - Number of days until expiration (default: 7)
 */
export async function storeFile(
  fileId: string,
  buffer: Buffer,
  filename: string,
  expiresInDays: number = 7
): Promise<void> {
  const uploadedAt = new Date()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  const metadata: FileMetadata = {
    filename,
    expiresAt,
    downloadCount: 0,
    uploadedAt,
    size: buffer.length,
  }

  // Store metadata as JSON in S3
  const metadataKey = `${METADATA_PREFIX}${fileId}.json`
  const metadataUpload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: metadataKey,
      Body: JSON.stringify(metadata),
      ContentType: 'application/json',
    },
  })
  await metadataUpload.done()

  // Store encrypted file in S3
  const fileKey = `${FILES_PREFIX}${fileId}`
  const fileUpload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: 'application/octet-stream',
      // Set expiration metadata
      Metadata: {
        'expires-at': expiresAt.toISOString(),
        'original-filename': filename,
      },
    },
  })
  await fileUpload.done()
}

/**
 * Retrieve a file from S3
 * @param fileId - Unique file identifier
 * @returns File buffer or undefined if not found or expired
 */
export async function getFile(fileId: string): Promise<Buffer | undefined> {
  try {
    // First check metadata to verify file exists and not expired
    const metadata = await getFileMetadata(fileId)
    if (!metadata) {
      return undefined
    }

    // Check if expired
    if (new Date() > metadata.expiresAt) {
      // File expired, delete it
      await deleteFile(fileId)
      return undefined
    }

    // Download file from S3
    const fileKey = `${FILES_PREFIX}${fileId}`
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    })

    const response = await s3Client.send(command)
    if (!response.Body) {
      return undefined
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of response.Body as any) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks)
  } catch (error: any) {
    if (error.name === 'NoSuchKey' || error.name === 'NotFound') {
      return undefined
    }
    console.error('Error getting file from S3:', error)
    throw error
  }
}

/**
 * Get file metadata from S3
 * @param fileId - Unique file identifier
 * @returns File metadata or undefined if not found
 */
export async function getFileMetadata(fileId: string): Promise<Omit<FileMetadata, 'buffer'> | undefined> {
  try {
    const metadataKey = `${METADATA_PREFIX}${fileId}.json`
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: metadataKey,
    })

    const response = await s3Client.send(command)
    if (!response.Body) {
      return undefined
    }

    // Convert stream to string
    const chunks: Uint8Array[] = []
    for await (const chunk of response.Body as any) {
      chunks.push(chunk)
    }
    const metadataJson = Buffer.concat(chunks).toString('utf-8')
    const metadata: FileMetadata = JSON.parse(metadataJson)

    // Check if expired
    if (new Date() > new Date(metadata.expiresAt)) {
      await deleteFile(fileId)
      return undefined
    }

    return {
      filename: metadata.filename,
      expiresAt: new Date(metadata.expiresAt),
      downloadCount: metadata.downloadCount,
      uploadedAt: new Date(metadata.uploadedAt),
      size: metadata.size,
    }
  } catch (error: any) {
    if (error.name === 'NoSuchKey' || error.name === 'NotFound') {
      return undefined
    }
    console.error('Error getting metadata from S3:', error)
    throw error
  }
}

/**
 * Update file metadata (e.g., increment download count)
 * @param fileId - Unique file identifier
 * @param updates - Partial metadata updates
 */
export async function updateFileMetadata(
  fileId: string,
  updates: Partial<FileMetadata>
): Promise<void> {
  const metadata = await getFileMetadata(fileId)
  if (!metadata) {
    return
  }

  const updatedMetadata: FileMetadata = {
    ...metadata,
    ...updates,
    expiresAt: new Date(metadata.expiresAt),
    uploadedAt: new Date(metadata.uploadedAt),
  } as FileMetadata

  const metadataKey = `${METADATA_PREFIX}${fileId}.json`
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: metadataKey,
      Body: JSON.stringify(updatedMetadata),
      ContentType: 'application/json',
    },
  })
  await upload.done()
}

/**
 * Increment download count
 * @param fileId - Unique file identifier
 */
export async function incrementDownloadCount(fileId: string): Promise<void> {
  const metadata = await getFileMetadata(fileId)
  if (metadata) {
    await updateFileMetadata(fileId, {
      downloadCount: metadata.downloadCount + 1,
    })
  }
}

/**
 * Check if a file exists
 * @param fileId - Unique file identifier
 * @returns true if file exists
 */
export async function fileExists(fileId: string): Promise<boolean> {
  try {
    const fileKey = `${FILES_PREFIX}${fileId}`
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    })
    await s3Client.send(command)
    return true
  } catch (error: any) {
    if (error.name === 'NotFound' || error.name === 'NoSuchKey') {
      return false
    }
    throw error
  }
}

/**
 * Delete a file from S3
 * @param fileId - Unique file identifier
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    const fileKey = `${FILES_PREFIX}${fileId}`
    const metadataKey = `${METADATA_PREFIX}${fileId}.json`

    // Delete both file and metadata
    await Promise.all([
      s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileKey,
        })
      ),
      s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: metadataKey,
        })
      ),
    ])
  } catch (error) {
    console.error('Error deleting file from S3:', error)
    // Don't throw - deletion is best effort
  }
}

