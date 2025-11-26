# Backend Explanation

This document explains the backend structure and how it works.

## Overview

The backend is a Node.js/Express API server that handles:
- Receiving encrypted files from the frontend
- Storing encrypted files (currently in-memory, will be S3)
- Serving encrypted files for download
- Generating unique file IDs

## Architecture

```
Frontend (Browser)
    ↓
    Encrypts file client-side
    ↓
POST /api/upload
    ↓
Backend receives encrypted binary
    ↓
Backend stores file (currently in-memory)
    ↓
Backend returns: { fileId: "uuid" }
    ↓
Frontend creates shareable link:
    https://site.com/download/FILE_ID#key=ENCRYPTION_KEY
```

## Key Files Explained

### `src/index.ts` - Main Server

This is the entry point. It:
- Sets up Express app
- Configures CORS (allows frontend to make requests)
- Registers routes
- Starts the server

**Key parts:**
```typescript
app.use(cors({
  origin: config.cors.origin,  // Only allow requests from frontend
}))

app.use('/api/upload', uploadRoutes)    // Handle uploads
app.use('/api/download', downloadRoutes) // Handle downloads
```

### `src/routes/upload.ts` - Upload Endpoint

**What it does:**
1. Receives encrypted file via `multipart/form-data`
2. Validates file exists
3. Generates unique UUID (fileId)
4. Stores file temporarily (in-memory for now)
5. Returns fileId to frontend

**Request:**
```
POST /api/upload
Content-Type: multipart/form-data
Body: file (encrypted binary)
```

**Response:**
```json
{
  "fileId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Important:** The server NEVER sees the encryption key. Only the encrypted file binary.

### `src/routes/download.ts` - Download Endpoint

**What it does:**
1. Receives fileId from URL
2. Validates fileId format (must be UUID)
3. Retrieves encrypted file from storage
4. Returns encrypted file binary

**Request:**
```
GET /api/download/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response:**
- Content-Type: `application/octet-stream`
- Body: Encrypted file binary

**Important:** Server returns encrypted file. Decryption happens in the browser using the key from URL fragment.

### `src/config/storage.ts` - Temporary Storage

**Current Implementation:**
- Uses in-memory `Map<string, Buffer>`
- Files are lost when server restarts
- Only for development/testing

**Future (S3 Integration):**
- Files will be stored in AWS S3
- Persistent storage
- Scalable

### `src/middleware/upload.ts` - File Upload Configuration

Uses `multer` to handle file uploads:
- Stores files in memory (not on disk)
- Enforces file size limit (50MB default)
- Accepts any file type (encrypted files have no specific extension)

### `src/middleware/errorHandler.ts` - Error Handling

Catches and formats errors:
- 400: Bad request (invalid fileId, missing file)
- 404: File not found
- 500: Server error

### `src/config/env.ts` - Environment Configuration

Loads and validates environment variables:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Frontend URL (default: http://localhost:5173)
- `MAX_FILE_SIZE`: Max file size in bytes (default: 50MB)

## Security Features

### 1. Zero-Knowledge Architecture
- Server never receives encryption keys
- Server only stores encrypted files
- Decryption happens client-side

### 2. UUID File IDs
- File IDs are UUIDs (hard to guess)
- Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Validated before processing

### 3. CORS Protection
- Only allows requests from configured frontend origin
- Prevents unauthorized access

### 4. File Size Limits
- Enforced at middleware level
- Prevents DoS attacks
- Default: 50MB

## Current Limitations

### 1. In-Memory Storage
- Files lost on server restart
- Not suitable for production
- **Solution:** S3 integration (to be added)

### 2. No File Expiration
- Files never expire
- Could fill up storage
- **Solution:** Add expiration/cleanup job

### 3. No Rate Limiting
- No protection against abuse
- **Solution:** Add rate limiting middleware

### 4. No Metadata Storage
- No filename, size, or upload date stored
- **Solution:** Optional metadata storage (if needed)

## How to Test

### 1. Start Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Test Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Backend server is running",
  "timestamp": "...",
  "environment": "development"
}
```

### 3. Test Upload (using curl)

```bash
# Create a test encrypted file
echo "test encrypted data" > test.enc

# Upload it
curl -X POST \
  -F "file=@test.enc" \
  http://localhost:3000/api/upload
```

Expected response:
```json
{
  "fileId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

### 4. Test Download

```bash
# Use the fileId from upload response
curl http://localhost:3000/api/download/FILE_ID \
  --output downloaded.enc
```

## Next Steps: S3 Integration

When ready to integrate S3:

1. **Install AWS SDK:**
   ```bash
   npm install @aws-sdk/client-s3
   ```

2. **Update `src/config/env.ts`:**
   - Add S3 configuration (region, bucket, credentials)

3. **Create `src/config/s3.ts`:**
   - Initialize S3 client
   - Create upload/download functions

4. **Update `src/routes/upload.ts`:**
   - Replace `storeFile()` with S3 upload
   - Remove temporary storage

5. **Update `src/routes/download.ts`:**
   - Replace `getFile()` with S3 download
   - Remove temporary storage

6. **Remove `src/config/storage.ts`:**
   - No longer needed after S3 integration

## Questions?

- **Q: Why in-memory storage?** A: Temporary solution until S3 is integrated.
- **Q: Can server decrypt files?** A: No, server never has encryption keys.
- **Q: What if server restarts?** A: Files in memory are lost. S3 will fix this.
- **Q: How to add file expiration?** A: Add scheduled job to delete old files from S3.

