# Backend API - Encrypted File Drop

Backend Express server for the encrypted file drop application.

## Features

- RESTful API for file upload and download
- Encrypted file storage (S3 integration to be added)
- UUID-based file identification
- CORS support
- Error handling middleware
- TypeScript for type safety

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── env.ts      # Environment variables
│   │   └── storage.ts  # Temporary storage (will be replaced with S3)
│   ├── middleware/     # Express middleware
│   │   ├── errorHandler.ts  # Error handling
│   │   └── upload.ts       # File upload configuration
│   ├── routes/         # API routes
│   │   ├── upload.ts   # Upload endpoint
│   │   └── download.ts # Download endpoint
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   └── index.ts        # Main server file
├── .env.example        # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=52428800
```

### 3. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Backend server is running",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "environment": "development"
}
```

### Upload File

```
POST /api/upload
Content-Type: multipart/form-data
Body: file (encrypted binary)
```

Response:
```json
{
  "fileId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

### Download File

```
GET /api/download/:fileId
```

Response: Encrypted file binary (application/octet-stream)

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server (after build)
- `npm run clean` - Remove build directory

### Temporary Storage

**Important:** The current implementation uses in-memory storage (`Map`) which is only for development/testing. Files are lost when the server restarts.

**S3 Integration:** The S3 integration will be added later. Placeholders are marked with `TODO: Upload to S3` comments.

## Security Notes

- Files are stored encrypted (encryption happens client-side)
- Server never sees encryption keys
- File IDs are UUIDs (hard to guess)
- CORS is configured for frontend origin
- File size limits are enforced

## Next Steps

1. Integrate AWS S3 for file storage
2. Add file expiration/cleanup
3. Add rate limiting
4. Add request logging
5. Add file metadata (optional)

