# Backend Development Setup Guide - Linux

Complete setup instructions for backend developers using Linux operating systems.

---

## Prerequisites

### System Requirements
- Ubuntu 20.04+ / Debian 11+ / Fedora 35+ / Arch Linux
- 8GB RAM minimum
- 20GB free disk space
- Internet connection

### Required Knowledge
- Basic Linux command line
- Basic JavaScript/Node.js
- Git fundamentals
- Basic database concepts

---

## Installation Steps

### Step 1: Install Node.js

#### Ubuntu/Debian:
```bash
# Update package index
sudo apt update

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

#### Fedora:
```bash
# Install Node.js 20.x
sudo dnf install nodejs

# Verify installation
node --version
npm --version
```

####Arch Linux:
```bash
# Install Node.js
sudo pacman -S nodejs npm

# Verify installation
node --version
npm --version
```

---

### Step 2: Install Git

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install git

# Verify installation
git --version

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### Fedora:
```bash
sudo dnf install git
git --version
```

#### Arch Linux:
```bash
sudo pacman -S git
git --version
```

---

### Step 3: Install Docker and Docker Compose

#### Ubuntu/Debian:
```bash
# Remove old versions
sudo apt-get remove docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
sudo docker --version
sudo docker compose version
```

#### Fedora:
```bash
# Install Docker
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
sudo docker --version
sudo docker compose version
```

#### Arch Linux:
```bash
# Install Docker
sudo pacman -S docker docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
sudo docker --version
sudo docker compose version
```

#### Add User to Docker Group (All Distributions):
```bash
# Add current user to docker group
sudo usermod -aG docker $USER

# Apply group changes (logout and login, or run)
newgrp docker

# Verify docker works without sudo
docker ps
```

---

### Step 4: Install Visual Studio Code (Recommended)

#### Ubuntu/Debian:
```bash
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
rm -f packages.microsoft.gpg

sudo apt update
sudo apt install code
```

#### Fedora:
```bash
sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'

sudo dnf check-update
sudo dnf install code
```

#### Arch Linux:
```bash
yay -S visual-studio-code-bin
```

#### Install Extensions:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

---

### Step 5: Install PostgreSQL Client (Optional, for Database Management)

#### Ubuntu/Debian:
```bash
sudo apt install postgresql-client
psql --version
```

#### Fedora:
```bash
sudo dnf install postgresql
psql --version
```

#### Arch Linux:
```bash
sudo pacman -S postgresql
psql --version
```

---

### Step 6: Clone Repository

```bash
# Navigate to projects directory
cd ~/Projects

# Clone repository
git clone <repository-url> encrypted-file-drop

# Navigate into project
cd encrypted-file-drop

# Create feature branch
git checkout -b backend-setup
```

---

### Step 7: Initialize Backend Project

```bash
# Create backend directory
mkdir -p backend
cd backend

# Initialize Node.js project
npm init -y
```

---

### Step 8: Install Dependencies

```bash
# Install production dependencies
npm install express cors dotenv multer minio pg sequelize uuid

# Install development dependencies
npm install --save-dev typescript @types/node @types/express @types/cors @types/multer @types/uuid ts-node nodemon

# Initialize TypeScript
npx tsc --init
```

---

### Step 9: Configure TypeScript

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

### Step 10: Update package.json Scripts

Edit `package.json` and add/update the scripts section:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "clean": "rm -rf dist"
  }
}
```

---

### Step 11: Create Project Structure

```bash
# Create directories
mkdir -p src/routes
mkdir -p src/controllers
mkdir -p src/models
mkdir -p src/config
mkdir -p src/middleware

# Create files
touch src/index.ts
touch src/routes/upload.ts
touch src/routes/download.ts
touch src/config/database.ts
touch src/config/minio.ts
touch .env
touch .gitignore
```

---

### Step 12: Configure Environment Variables

Edit `.env`:

```bash
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

### Step 13: Create Basic Express Server

Edit `src/index.ts`:

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

```bash
# Start development server
npm run dev

# You should see:
# Server running on http://localhost:3000
# Health check: http://localhost:3000/api/health
```

In another terminal:
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Should return:
# {"status":"ok","message":"Backend server is running","timestamp":"..."}
```

---

### Step 15: Setup Docker Services

Navigate to project root:
```bash
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

```bash
# Start PostgreSQL and MinIO
docker compose up -d

# Check services are running
docker compose ps

# You should see both services with status "Up"
```

---

### Step 17: Verify Docker Services

#### Test PostgreSQL:
```bash
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

Edit `backend/src/config/database.ts`:

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

Edit `backend/src/config/init-db.ts`:

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

Update `backend/src/index.ts` to initialize database:

```typescript
import { initDatabase } from './config/init-db';

// Add after dotenv.config()
initDatabase().catch(console.error);
```

---

### Step 20: Commit Your Work

```bash
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
backend/
├── node_modules/          (auto-generated)
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── init-db.ts
│   │   └── minio.ts
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   │   ├── download.ts
│   │   └── upload.ts
│   └── index.ts
├── dist/                  (auto-generated after build)
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## Development Workflow

### Start All Services
```bash
# Terminal 1: Start Docker services
docker compose up -d

# Terminal 2: Start Express server
cd backend
npm run dev
```

### Stop Services
```bash
# Stop Express (Ctrl+C in terminal)

# Stop Docker services
docker compose down
```

### View Logs
```bash
# Backend logs: visible in terminal running npm run dev

# PostgreSQL logs
docker compose logs postgres

# MinIO logs
docker compose logs minio
```

---

## Common Commands

### Docker
```bash
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
```bash
# Connect to PostgreSQL
docker exec -it encrypted-files-db psql -U postgres -d encrypted_files

# Inside psql:
\dt                          # List tables
\d files                     # Describe files table
SELECT * FROM files;         # Query files
\q                          # Quit
```

### Node.js
```bash
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

### Issue: Docker permission denied
**Solution:**
```bash
sudo usermod -aG docker $USER
newgrp docker
# Or logout and login again
```

### Issue: Port already in use
**Solution:**
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :5432
sudo lsof -i :9000

# Kill process
kill -9 <PID>

# Or change port in .env file
```

### Issue: Cannot connect to PostgreSQL
**Solution:**
```bash
# Check Docker container is running
docker compose ps

# Check container logs
docker compose logs postgres

# Restart container
docker compose restart postgres
```

### Issue: Cannot connect to MinIO
**Solution:**
```bash
# Check container is running
docker compose ps

# Check logs
docker compose logs minio

# Verify ports in docker-compose.yml
```

### Issue: TypeScript errors
**Solution:**
```bash
# Check tsconfig.json configuration
cat tsconfig.json

# Install missing types
npm install -D @types/node @types/express

# Clean and rebuild
npm run clean
npm run build
```

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

### Using curl:
```bash
# Health check
curl http://localhost:3000/api/health

# Upload file (once endpoint is created)
curl -X POST -F "file=@/path/to/file.txt" http://localhost:3000/api/upload

# Download file
curl http://localhost:3000/api/download/<file-id> --output downloaded-file
```

### Using Postman:
1. Download from: https://www.postman.com/downloads/
2. Install: `sudo snap install postman` (Ubuntu)
3. Create new request
4. Test endpoints

---

## Database Management Tools (Optional)

### DBeaver (Recommended):
```bash
# Download and install
wget https://dbeaver.io/files/dbeaver-ce_latest_amd64.deb
sudo dpkg -i dbeaver-ce_latest_amd64.deb
sudo apt-get install -f

# Or use snap
sudo snap install dbeaver-ce

# Connection details:
# Host: localhost
# Port: 5432
# Database: encrypted_files
# Username: postgres
# Password: postgres
```

---

## Resources

### Official Documentation
- Node.js: https://nodejs.org/docs/
- Express.js: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/docs/
- MinIO: https://min.io/docs/minio/linux/index.html
- Docker: https://docs.docker.com/

### Learning Resources
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- REST API Design: https://restfulapi.net/

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
- [ ] Docker and Docker Compose installed
- [ ] Docker running without sudo
- [ ] VS Code installed
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

**Estimated Setup Time:** 45-60 minutes

**Next Document:** `docs/common/PROJECT_STRUCTURE.md`

