# Encrypted File Drop

Secure web application for client-side encrypted file sharing. Files are encrypted in the browser before upload, ensuring privacy and zero-knowledge storage. Supports expiring links and metadata stripping.

## Project Overview

**Objective:**
- Users upload files (up to 50MB)
- Files are encrypted in the browser before sending to server
- User receives a shareable link with encryption key in URL
- Anyone with the link can download and decrypt the file
- No login required - fully anonymous

**Key Feature:** Server never sees unencrypted files - true zero-knowledge architecture.

---

## Quick Start

### Choose Your Operating System

**Linux Users:**
- Navigate to `docs/linux/` directory
- Start with `QUICKSTART_GUIDE.md`

**Windows Users:**
- Navigate to `docs/windows/` directory
- Start with `QUICKSTART_GUIDE.md`

### Documentation Structure

```
Encrypted-file-drop/
├── README.md                          (This file)
├── START_HERE.md                      (Onboarding guide)
├── docker-compose.yml                 (Infrastructure setup)
│
├── docs/
│   ├── common/                        (OS-agnostic documentation)
│   │   ├── ARCHITECTURE.md
│   │   ├── PROJECT_STRUCTURE.md
│   │   ├── TEAM_SUMMARY.md
│   │   └── API_SPECIFICATION.md
│   │
│   ├── linux/                         (Linux-specific guides)
│   │   ├── QUICKSTART_GUIDE.md
│   │   ├── FRONTEND_SETUP.md
│   │   ├── BACKEND_SETUP.md
│   │   └── DEPLOYMENT.md
│   │
│   └── windows/                       (Windows-specific guides)
│       ├── QUICKSTART_GUIDE.md
│       ├── FRONTEND_SETUP.md
│       ├── BACKEND_SETUP.md
│       └── DEPLOYMENT.md
│
├── frontend/                          (React application)
└── backend/                           (Express API)
```

---

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Web Crypto API** - Browser-native encryption (AES-256-GCM)

### Backend
- **Node.js + Express** - REST API server
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Relational database for metadata
- **MinIO** - Self-hosted object storage (S3-compatible)

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy
- **Git** - Version control

---

## Architecture Overview

```
User Browser (Frontend)
        |
        | 1. Encrypt file with AES-256-GCM
        |
        v
Backend API (Express)
        |
        +-> PostgreSQL (Metadata: filename, size, dates)
        |
        +-> MinIO (Encrypted file storage)
        
Shareable Link Format:
https://yoursite.com/download/FILE_ID#key=ENCRYPTION_KEY
                                      ^
                                      | Never sent to server
```

**Security Principle:** Encryption key is stored in URL fragment (#), which never reaches the server.

---

## Project Timeline

### Week 1: Environment Setup
- Install required tools
- Setup development environment
- Initialize project structure
- Verify all systems operational

### Week 2: Core Features Development
- Frontend: Upload UI and encryption implementation
- Backend: Upload API and storage integration
- Database schema design and implementation

### Week 3: Download Flow & Integration
- Frontend: Download page with decryption
- Backend: Download API and file expiry system
- Integration testing

### Week 4: Testing & Refinement
- Cross-browser testing
- Responsive design implementation
- Error handling and validation
- Bug fixes and optimization

### Week 5: Deployment (Optional)
- Production configuration
- Server deployment
- SSL/TLS setup
- Final production testing

---

## Team Structure

### Frontend Team Responsibilities
- User interface development
- Client-side encryption/decryption
- API integration
- Responsive design

### Backend Team Responsibilities
- REST API development
- Database management
- File storage integration
- Security and rate limiting

---

## Getting Started

### For Frontend Developers
1. Read `docs/[your-os]/FRONTEND_SETUP.md`
2. Follow installation steps
3. Review `docs/common/PROJECT_STRUCTURE.md`

### For Backend Developers
1. Read `docs/[your-os]/BACKEND_SETUP.md`
2. Follow installation steps
3. Review `docs/common/PROJECT_STRUCTURE.md`

---

## Key Features

### Security
- Client-side AES-256-GCM encryption
- Zero-knowledge server architecture
- Encryption keys never transmitted to server
- Automatic file expiration (7 days default)

### User Experience
- No account registration required
- Simple drag-and-drop upload
- One-click link sharing
- Cross-platform compatibility

### Technical
- File size limit: 50MB
- Automatic cleanup of expired files
- Rate limiting for abuse prevention
- Comprehensive error handling

---

## Development Workflow

### Week 1 (23.10.2025)
-Complete setup enviroment steps on ur laptops (I will help u in class if u can't read or have any other disabilities :)


---

## API Endpoints

### Upload
```
POST /api/upload
Content-Type: multipart/form-data
Body: encrypted file
Response: { fileId: "uuid" }
```

### Download
```
GET /api/download/:fileId
Response: encrypted file binary
```

### File Information
```
GET /api/info/:fileId
Response: { filename, size, uploadDate }
```

---

## Security Considerations

### Encryption Implementation
- Algorithm: AES-256-GCM (Galois/Counter Mode)
- Key generation: Cryptographically secure random
- IV (Initialization Vector): Random per file
- Authentication: Built-in with GCM mode

### Server Security
- CORS configuration
- Rate limiting
- Input validation
- Request size limits
- Security headers (Helmet.js)

### Data Privacy
- Server stores only encrypted data
- No access to encryption keys
- Automatic data expiration
- Minimal metadata collection

---

## Testing Requirements

### Frontend Testing
- File selection and validation
- Encryption/decryption verification
- API integration
- Cross-browser compatibility
- Responsive design

### Backend Testing
- API endpoint functionality
- Database operations
- File storage operations
- Error handling
- Rate limiting

### Integration Testing
- End-to-end upload flow
- End-to-end download flow
- Link sharing between browsers
- File expiration
- Various file types and sizes

---

## Deployment

### Requirements
- Linux server (Ubuntu 20.04+ recommended)
- Docker and Docker Compose
- Domain name
- SSL/TLS certificate (Let's Encrypt)

### Process
1. Server preparation
2. Repository clone
3. Environment configuration
4. Docker compose build
5. SSL/TLS setup
6. Application launch
7. Verification testing

Detailed instructions: `docs/[your-os]/DEPLOYMENT.md`

---

## Contributing

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration followed
- Consistent code formatting
- Comprehensive comments

### Pull Request Process
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Submit pull request
5. Code review
6. Merge approval

---

## Troubleshooting

### Common Issues

**Port conflicts:**
- Check port availability: 3000, 5432, 9000, 9001
- Modify ports in configuration if needed

**Docker issues:**
- Verify Docker service running
- Check Docker Compose version
- Review container logs

**Database connection:**
- Verify PostgreSQL container status
- Check environment variables
- Review connection string

**File upload failures:**
- Verify file size limits
- Check MinIO bucket configuration
- Review backend logs

---

## Learning Resources

### Frontend Development
- React Documentation: https://react.dev/learn
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Vite Guide: https://vitejs.dev/guide/
- Tailwind CSS: https://tailwindcss.com/docs

### Backend Development
- Express.js Guide: https://expressjs.com/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- MinIO Documentation: https://min.io/docs/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

### Security
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- OWASP Top 10: https://owasp.org/www-project-top-ten/

---

## Support

For technical questions and issues:
1. Ask AI first, try to fix problem by yourself.
2. Ask/Call Maruf
3. Ask/Call Tom
4. Ask Roman 

---

## Project Contacts

- Project Lead: Roman 
- Frontend Team Lead: Maruf 
- Backend Team Lead: Tom 

---

## Acknowledgments

Built with modern web technologies and security best practices. Designed for educational purposes and production deployment.
