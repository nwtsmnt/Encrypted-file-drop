# Backend Development Setup Guide - Windows

Complete setup instructions for backend developers using Windows 10/11 operating systems.

---

## Prerequisites

### System Requirements
- Windows 10 (version 1903 or higher) or Windows 11
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space
- Internet connection
- Administrator access

### Required Knowledge
- Basic Windows command line (PowerShell or Command Prompt)
- Basic JavaScript/Node.js
- Git fundamentals
- Basic database concepts

---

## Installation Steps

### Step 1: Install Node.js

1. Download Node.js installer:
   - Visit: https://nodejs.org/
   - Download LTS version (v20.x.x recommended)
   - Choose Windows Installer (.msi) 64-bit

2. Run the installer:
   - Double-click the downloaded file
   - Click "Next" through the installation wizard
   - Accept the license agreement
   - Keep default installation path
   - Check "Automatically install the necessary tools" option
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

3. Verify installation:
   Open PowerShell or Command Prompt:
   ```powershell
   node --version
   npm --version
   ```

---

### Step 2: Install Git

1. Download Git installer:
   - Visit: https://git-scm.com/download/win
   - Download latest version (Git-2.x.x-64-bit.exe)

2. Run the installer:
   - Double-click the downloaded file
   - Click "Next" through installation wizard
   - Keep default components selected
   - Choose "Git from the command line and also from 3rd-party software"
   - Choose "Use bundled OpenSSH"
   - Choose "Use the OpenSSL library"
   - Choose "Checkout Windows-style, commit Unix-style line endings"
   - Choose "Use MinTTY"
   - Keep other default options
   - Click "Install"
   - Click "Finish"

3. Configure Git:
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   git config --global core.autocrlf true
   ```

4. Verify installation:
   ```powershell
   git --version
   ```

---

### Step 3: Install Docker Desktop

1. System Requirements Check:
   - Enable Hyper-V (Windows 10 Pro/Enterprise/Education)
   - OR Enable WSL 2 (Windows 10 Home or all Windows 11)

2. Enable WSL 2 (Recommended Method):
   Open PowerShell as Administrator:
   ```powershell
   wsl --install
   ```
   Restart your computer when prompted.

3. Download Docker Desktop:
   - Visit: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"
   - Download Docker Desktop Installer.exe

4. Install Docker Desktop:
   - Double-click the installer
   - Ensure "Use WSL 2 instead of Hyper-V" is checked
   - Click "Ok"
   - Wait for installation to complete
   - Click "Close and restart"

5. Start Docker Desktop:
   - Launch Docker Desktop from Start Menu
   - Accept the Docker Subscription Service Agreement
   - Wait for Docker Engine to start (Docker icon in system tray)

6. Verify installation:
   Open PowerShell:
   ```powershell
   docker --version
   docker compose version
   ```

---

### Step 4: Install Visual Studio Code (Recommended)

1. Download VS Code:
   - Visit: https://code.visualstudio.com/
   - Click "Download for Windows"
   - Download the User Installer

2. Run the installer:
   - Double-click the downloaded file
   - Accept the license agreement
   - Check "Add to PATH" option
   - Check "Register Code as an editor for supported file types"
   - Check "Add 'Open with Code' action to context menu"
   - Click "Install"
   - Click "Finish"

3. Install Extensions:
   Open VS Code terminal and run:
   ```powershell
   code --install-extension dbaeumer.vscode-eslint
   code --install-extension esbenp.prettier-vscode
   code --install-extension ms-azuretools.vscode-docker
   ```

---

### Step 5: Clone Repository

Open PowerShell or Command Prompt:

```powershell
# Navigate to projects directory
cd C:\Users\YourUsername\Documents
mkdir Projects
cd Projects

# Clone repository (replace with actual URL)
git clone <repository-url> encrypted-file-drop

# Navigate into project
cd encrypted-file-drop

# Create feature branch
git checkout -b backend-setup
```

---

### Step 6: Initialize Backend Project

```powershell
# Create backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y
```

---

### Step 7: Install Dependencies

```powershell
# Install production dependencies
npm install express cors dotenv multer minio pg sequelize uuid

# Install development dependencies
npm install --save-dev typescript @types/node @types/express @types/cors @types/multer @types/uuid ts-node nodemon

# Initialize TypeScript
npx tsc --init
```

---

### Step 8: Configure TypeScript

Edit `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

### Step 9: Update package.json Scripts

Edit `package.json` and add/update the scripts section:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "clean": "rmdir /s /q dist"
  }
}
```

---

### Step 10: Create Project Structure

```powershell
# Create directories
mkdir src\routes
mkdir src\controllers
mkdir src\models
mkdir src\config
mkdir src\middleware

# Create files
New-Item src\index.ts
New-Item src\routes\upload.ts
New-Item src\routes\download.ts
New-Item src\config\database.ts
New-Item src\config\minio.ts
New-Item .env
New-Item .gitignore
```

Alternative using Command Prompt:
```cmd
md src\routes src\controllers src\models src\config src\middleware
type nul > src\index.ts
type nul > src\routes\upload.ts
type nul > src\routes\download.ts
type nul > src\config\database.ts
type nul > src\config\minio.ts
type nul > .env
type nul > .gitignore
```

---

### Step 11: Configure Environment Variables

Edit `.env`:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=encrypted_files
DB_USER=postgres
DB_PASSWORD=postgres

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=encrypted-files
MINIO_USE_SSL=false
```

---

### Step 12: Configure .gitignore

Edit `.gitignore`:

```
# Dependencies
node_modules/

# Environment
.env
.env.local
.env.production

# Build outputs
dist/
*.tsbuildinfo

# Logs
*.log

# OS
Thumbs.db
```

---

### Step 13: Create Basic Express Server

Edit `src\index.ts`:

```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
```

---

### Step 14: Test Express Server

```powershell
# Start development server
npm run dev

# You should see:
# Server running on http://localhost:3000
# Health check: http://localhost:3000/api/health
```

In another PowerShell window:
```powershell
# Test health endpoint (using curl if available, or use browser)
curl http://localhost:3000/api/health

# Or use Invoke-WebRequest
Invoke-WebRequest -Uri http://localhost:3000/api/health
```

---

### Step 15: Setup Docker Services

Navigate to project root:
```powershell
cd ..  # Go back to encrypted-file-drop directory
```

The `docker-compose.yml` file should already exist. If not, create it:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: encrypted-files-db
    environment:
      POSTGRES_DB: encrypted_files
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: encrypted-files-storage
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  postgres_data:
  minio_data:
```

---

### Step 16: Start Docker Services

Ensure Docker Desktop is running, then:

```powershell
# Start PostgreSQL and MinIO
docker compose up -d

# Check services are running
docker compose ps

# You should see both services with status "Up"
```

---

### Step 17: Verify Docker Services

#### Test PostgreSQL:
```powershell
# Connect to PostgreSQL
docker exec -it encrypted-files-db psql -U postgres -d encrypted_files

# You should see: encrypted_files=#
# Type \q to quit
```

#### Test MinIO:
- Open browser: http://localhost:9001
- Login credentials:
  - Username: `minioadmin`
  - Password: `minioadmin`
- You should see the MinIO dashboard

---

### Step 18: Create Database Configuration

Edit `backend\src\config\database.ts`:

```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0].now);
  }
});

export default pool;
```

---

### Step 19: Create Database Table

Edit `backend\src\config\init-db.ts`:

```typescript
import pool from './database';

export async function initDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS files (
      id UUID PRIMARY KEY,
      original_filename VARCHAR(255) NOT NULL,
      file_size BIGINT NOT NULL,
      mime_type VARCHAR(100),
      storage_key VARCHAR(255) NOT NULL,
      upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expiry_date TIMESTAMP,
      download_count INTEGER DEFAULT 0
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Database table initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
```

Update `backend\src\index.ts` to initialize database:

```typescript
import { initDatabase } from './config/init-db';

// Add after dotenv.config()
initDatabase().catch(console.error);
```

---

### Step 20: Commit Your Work

```powershell
# Go to project root
cd ..

# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "Backend: Initial setup with Express, Docker services, and database"

# Push to remote
git push origin backend-setup
```

---

## Project Structure

After setup:

```
backend\
├── node_modules\          (auto-generated)
├── src\
│   ├── config\
│   │   ├── database.ts
│   │   ├── init-db.ts
│   │   └── minio.ts
│   ├── controllers\
│   ├── middleware\
│   ├── models\
│   ├── routes\
│   │   ├── download.ts
│   │   └── upload.ts
│   └── index.ts
├── dist\                  (auto-generated after build)
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## Development Workflow

### Start All Services
```powershell
# Terminal 1: Ensure Docker Desktop is running, then start containers
docker compose up -d

# Terminal 2: Start Express server
cd backend
npm run dev
```

### Stop Services
```powershell
# Stop Express (Ctrl+C in terminal)

# Stop Docker services
docker compose down
```

### View Logs
```powershell
# Backend logs: visible in terminal running npm run dev

# PostgreSQL logs
docker compose logs postgres

# MinIO logs
docker compose logs minio
```

---

## Common Commands

### Docker
```powershell
# Start services
docker compose up -d

# Stop services
docker compose down

# View running containers
docker compose ps

# View logs
docker compose logs [service-name]

# Restart service
docker compose restart [service-name]

# Remove volumes (WARNING: deletes data)
docker compose down -v
```

### Database
```powershell
# Connect to PostgreSQL
docker exec -it encrypted-files-db psql -U postgres -d encrypted_files

# Inside psql:
\dt                          # List tables
\d files                     # Describe files table
SELECT * FROM files;         # Query files
\q                          # Quit
```

### Node.js
```powershell
# Install new package
npm install package-name

# Install dev package
npm install -D package-name

# Update packages
npm update

# Build TypeScript
npm run build

# Run production server
npm start
```

---

## Troubleshooting

### Issue: Docker Desktop won't start
**Solution:**
- Ensure WSL 2 is installed and updated
- Check Hyper-V is enabled (Windows Pro/Enterprise)
- Restart Windows
- Run Docker Desktop as Administrator

### Issue: Port already in use
**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :5432
netstat -ano | findstr :9000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue: Cannot connect to PostgreSQL
**Solution:**
- Ensure Docker Desktop is running
- Check container status: `docker compose ps`
- Check container logs: `docker compose logs postgres`
- Restart container: `docker compose restart postgres`

### Issue: Cannot connect to MinIO
**Solution:**
- Check Docker Desktop is running
- Verify container status: `docker compose ps`
- Check logs: `docker compose logs minio`
- Verify ports in docker-compose.yml

### Issue: PowerShell Execution Policy
**Solution:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: TypeScript errors
**Solution:**
```powershell
# Check tsconfig.json configuration
type tsconfig.json

# Install missing types
npm install -D @types/node @types/express

# Clean and rebuild
npm run clean
npm run build
```

### Issue: WSL 2 installation failed
**Solution:**
1. Open PowerShell as Administrator
2. Run: `wsl --update`
3. Run: `wsl --set-default-version 2`
4. Restart computer

---

## Next Steps

### Immediate Tasks (Week 1-2)

1. **Create Upload API Endpoint**
   - Configure multer for file uploads
   - Implement file size validation
   - Generate UUID for files
   - Store in MinIO
   - Save metadata to PostgreSQL

2. **Configure MinIO Client**
   - Create MinIO connection utility
   - Implement upload function
   - Implement download function
   - Create bucket management

3. **Create Download API Endpoint**
   - Validate file ID
   - Check expiry
   - Retrieve from MinIO
   - Increment download counter

4. **Implement Security**
   - Rate limiting
   - Input validation
   - Error handling middleware
   - Security headers (Helmet)

---

## Testing API Endpoints

### Using PowerShell:
```powershell
# Health check
Invoke-WebRequest -Uri http://localhost:3000/api/health

# Upload file (once endpoint is created)
$filePath = "C:\path\to\file.txt"
$uri = "http://localhost:3000/api/upload"
$fileContent = [System.IO.File]::ReadAllBytes($filePath)
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"
$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"file.txt`"",
    "Content-Type: application/octet-stream$LF",
    [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileContent),
    "--$boundary--$LF"
) -join $LF
Invoke-WebRequest -Uri $uri -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines
```

### Using Postman:
1. Download from: https://www.postman.com/downloads/
2. Install for Windows
3. Create new request
4. Test endpoints

---

## Database Management Tools (Optional)

### pgAdmin (Recommended):
1. Download from: https://www.pgadmin.org/download/pgadmin-4-windows/
2. Install the Windows installer
3. Launch pgAdmin 4
4. Create new server connection:
   - Host: localhost
   - Port: 5432
   - Database: encrypted_files
   - Username: postgres
   - Password: postgres

---

## Resources

### Official Documentation
- Node.js: https://nodejs.org/docs/
- Express.js: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/docs/
- MinIO: https://min.io/docs/minio/windows/index.html
- Docker Desktop: https://docs.docker.com/desktop/install/windows-install/

### Learning Resources
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- REST API Design: https://restfulapi.net/

---

## Windows-Specific Notes

### File Paths
- Use backslashes in Windows paths: `C:\Users\...`
- Use forward slashes in code for cross-platform compatibility
- Node.js accepts both forward and backslashes

### Line Endings
- Configure Git to handle CRLF/LF conversion automatically
- Already configured in Step 2 with `core.autocrlf true`

### Docker Desktop
- Requires WSL 2 (Windows 10/11) or Hyper-V (Windows Pro)
- Uses Linux containers by default (recommended)
- Resource limits configured in Docker Desktop settings

---

## Security Best Practices

- Never commit `.env` file
- Use environment variables for secrets
- Validate all user inputs
- Implement rate limiting
- Use parameterized queries
- Enable CORS selectively
- Implement proper error handling
- Log security events

---

## Checklist

Setup Complete When:
- [ ] Node.js v20+ installed and verified
- [ ] Git installed and configured
- [ ] Docker Desktop installed and running
- [ ] VS Code installed with extensions
- [ ] Repository cloned
- [ ] Backend directory created
- [ ] Dependencies installed
- [ ] TypeScript configured
- [ ] Express server runs successfully
- [ ] Docker services (PostgreSQL, MinIO) running
- [ ] Database connection successful
- [ ] MinIO console accessible
- [ ] Database table created
- [ ] Changes committed and pushed

---

**Estimated Setup Time:** 45-60 minutes (plus Windows updates if needed)

**Next Document:** `docs\common\PROJECT_STRUCTURE.md`

