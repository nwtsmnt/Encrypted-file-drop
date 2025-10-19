# Project Summary - Encrypted File Drop

A clear explanation of what we're building and how it works.

---

## What Are We Building?

We're creating a secure file-sharing website similar to WeTransfer or Dropbox, but with an important difference: files are encrypted on the user's computer BEFORE they're sent to the server. This means the server never sees the actual file content - it's completely private.

### Main Features

**For Users:**
- Upload any file up to 50MB
- Get a shareable link
- No account needed - completely anonymous
- Files automatically delete after 7 days

**How It's Secure:**
- Your browser encrypts the file before uploading
- The server stores only the encrypted version
- The decryption key is in the URL (after the # symbol)
- The server never sees the decryption key

---

## How It Works (Simple Explanation)

### Uploading a File

1. User opens the website and selects a file
2. **Browser creates a secret key** (encryption key)
3. **Browser encrypts the file** using that key
4. Browser uploads the ENCRYPTED file to our server
5. Server saves it and returns a file ID
6. Browser creates a link like: `https://site.com/download/FILE_ID#key=SECRET_KEY`
7. User shares this link with anyone

**Important:** The part after `#` (the key) never goes to the server!

### Downloading a File

1. Someone clicks the shared link
2. Browser reads the file ID and the key from the URL
3. Browser requests the encrypted file from server
4. Server sends the encrypted file (still can't read it!)
5. **Browser decrypts the file** using the key from the URL
6. User downloads the original file

**Result:** The server stored the file but could never read its contents!

---

## Technology Stack (What We're Using)

### Frontend (What Users See)

**React**
- A popular library for building user interfaces
- Makes it easy to create interactive websites
- Used by Facebook, Instagram, Netflix

**TypeScript**
- JavaScript with extra safety features
- Catches mistakes before they become bugs
- Makes code easier to understand

**Vite**
- A super fast tool that helps us develop and build the website
- Automatically refreshes the page when we make changes
- Much faster than older tools like Webpack

**Tailwind CSS**
- A styling framework that makes websites look good
- Instead of writing CSS from scratch, we use pre-made classes
- Easy to make responsive (mobile-friendly) designs

**Web Crypto API**
- Built into all modern browsers
- Handles encryption and decryption
- Very secure and fast

### Backend (The Server)

**Node.js + Express**
- JavaScript running on the server (not in browser)
- Express makes it easy to create API endpoints
- Same language as frontend, so everyone can understand both sides

**PostgreSQL**
- A database that stores information ABOUT files
- Stores: filename, size, upload date, expiry date
- Does NOT store the actual file content

**MinIO**
- Stores the actual (encrypted) files
- Works like Amazon S3 but we host it ourselves
- Can handle large files efficiently

**Docker**
- Packages our database and storage into "containers"
- Makes it easy to run PostgreSQL and MinIO on any computer
- Everyone on the team uses the same setup

---

## Project Timeline

### Week 1: Setup
**Goal:** Everyone has a working development environment

**Frontend Team:**
- Install Node.js, Git, and VS Code
- Create a React project with Vite
- Get the development server running
- See a simple page in the browser

**Backend Team:**
- Install Node.js, Git, Docker, and VS Code
- Create an Express server
- Get Docker running (PostgreSQL + MinIO)
- Test that the server responds to requests

### Week 2: Core Features
**Goal:** Upload a file successfully

**Frontend Team:**
- Create the upload page with a file picker
- Implement file encryption
- Send the encrypted file to the backend

**Backend Team:**
- Create API endpoint to receive files
- Save files to MinIO
- Save file information to PostgreSQL
- Return a file ID to the frontend

### Week 3: Download and Integration
**Goal:** Complete the full upload and download cycle

**Frontend Team:**
- Create the download page
- Extract file ID and key from URL
- Download and decrypt files
- Make it look nice and user-friendly

**Backend Team:**
- Create API endpoint to send files
- Check if files have expired
- Delete old files automatically
- Add rate limiting (prevent abuse)

### Week 4: Testing and Polish
**Goal:** Make sure everything works perfectly

**Both Teams:**
- Test with different file types (images, PDFs, videos)
- Test on different browsers (Chrome, Firefox, Safari)
- Test on mobile devices
- Fix any bugs we find
- Improve error messages

### Week 5: Deployment (Optional)
**Goal:** Put it on a real server

**Both Teams:**
- Setup a server on the internet
- Deploy our application
- Configure a domain name
- Enable HTTPS

---

## Team Organization

### Frontend Team Responsibilities

**What You'll Build:**
- The user interface (what people see and click)
- File upload form with drag-and-drop
- Encryption logic (making files unreadable)
- Download page with decryption
- Link generation and sharing

**Languages/Tools:**
- HTML, CSS, JavaScript/TypeScript
- React framework
- Browser developer tools

**Main Files You'll Work On:**
- `frontend/src/components/Upload.tsx`
- `frontend/src/components/Download.tsx`
- `frontend/src/utils/crypto.ts`
- `frontend/src/api/client.ts`

### Backend Team Responsibilities

**What You'll Build:**
- The API (how frontend talks to backend)
- File storage system
- Database operations
- Security features (rate limiting, validation)
- Automatic cleanup of old files

**Languages/Tools:**
- JavaScript/TypeScript (Node.js)
- Express framework
- PostgreSQL database
- MinIO storage
- Docker

**Main Files You'll Work On:**
- `backend/src/index.ts`
- `backend/src/routes/upload.ts`
- `backend/src/routes/download.ts`
- `backend/src/config/database.ts`
- `backend/src/config/minio.ts`

---

## How Frontend and Backend Work Together

### API Endpoints (How They Communicate)

**Upload Endpoint**
```
Frontend sends:
POST /api/upload
Body: encrypted file data

Backend responds:
{
  "fileId": "a1b2c3d4-e5f6-7890-..."
}
```

**Download Endpoint**
```
Frontend sends:
GET /api/download/a1b2c3d4-e5f6-7890-...

Backend responds:
The encrypted file data
```

**File Info Endpoint**
```
Frontend sends:
GET /api/info/a1b2c3d4-e5f6-7890-...

Backend responds:
{
  "filename": "vacation-photo.jpg",
  "size": 2457600,
  "uploadDate": "2025-10-19T10:30:00Z"
}
```

---

## Security Explained (Simple Version)

### Why Encryption in the Browser?

**Scenario 1: Without Encryption (Bad)**
- User uploads `secret-document.pdf`
- Server receives `secret-document.pdf` (can read it!)
- If server is hacked, attacker reads `secret-document.pdf`

**Scenario 2: With Encryption (Good)**
- User uploads `secret-document.pdf`
- Browser encrypts it → becomes random gibberish
- Server receives gibberish (cannot read it!)
- If server is hacked, attacker only sees gibberish

### The Magic of URL Fragments

When you visit: `https://site.com/download/FILE_ID#key=ENCRYPTION_KEY`

**What the server sees:**
- `https://site.com/download/FILE_ID`

**What the server NEVER sees:**
- `#key=ENCRYPTION_KEY`

The part after `#` is called a "fragment" and browsers never send it to the server. It stays completely in the browser. That's why our system is secure - the server can never decrypt the files!

---

## Development Workflow

### Daily Routine

**Morning:**
- Pull latest code from Git: `git pull origin main`
- Check what you're working on today
- Start development server

**During Development:**
- Make small changes
- Test them in browser
- Commit when something works: `git commit -m "Added feature X"`

**End of Day:**
- Push your code: `git push origin your-branch-name`
- Update the team on what you completed

### Working with Git

**Basic Git Commands You'll Use:**
```bash
# Get latest code
git pull origin main

# Create a new branch for your feature
git checkout -b add-upload-button

# Check what files you changed
git status

# Add files to commit
git add .

# Save your changes
git commit -m "Clear description of what you did"

# Send your code to GitHub
git push origin add-upload-button
```

### Team Communication

**Daily Standup (15 minutes, every morning):**
- What did you finish yesterday?
- What will you work on today?
- Are you stuck on anything?

**Weekly Meeting (1 hour, every Friday):**
- Demo what you built this week
- Discuss how frontend and backend will connect
- Plan next week's tasks
- Help each other with problems

---

## Common Questions

**Q: I've never used React/Node.js before. Can I still do this?**
A: Yes! That's the point of this project - to learn. Follow the setup guides step-by-step. Ask questions when you're confused. That's how learning works.

**Q: What if I break something?**
A: You won't break anything permanently. Git saves everything. If something goes wrong, you can always go back to a previous version. Don't be afraid to experiment!

**Q: How do I know if I'm doing it right?**
A: If your code runs without errors and does what it's supposed to do, you're doing it right. Ask teammates to review your code - learning from each other is valuable.

**Q: Frontend and backend seem to need each other. How do we develop separately?**
A: Good question! 
- Week 1-2: Work completely separately
- Week 2: Agree on API format (what data to send/receive)
- Week 3: Connect and test together
- Frontend can use "fake data" until backend is ready

**Q: What if my computer doesn't have enough RAM/storage?**
A: Minimum requirements: 4GB RAM, 10GB free space. If you don't have this, pair up with a teammate who does. Pair programming (two people, one computer) is actually a great way to learn!

**Q: I'm stuck and don't know what to do. Help?**
A: Perfect! This is normal. Here's what to do:
1. Read the error message carefully
2. Google the error (seriously, this is what professionals do)
3. Ask a teammate
4. Ask your team lead
5. Create a GitHub issue describing the problem

---

## What You'll Learn

By the end of this project, you'll understand:

**Programming Skills:**
- Modern JavaScript/TypeScript
- React (frontend) or Node.js (backend)
- Working with databases
- API design and integration
- Git version control

**Web Security:**
- How encryption works
- Why client-side encryption matters
- Secure file handling
- Privacy protection

**Professional Skills:**
- Working in a team
- Code reviews
- Project planning
- Problem-solving
- Communication

**Real-World Experience:**
- Building a complete application from scratch
- Integrating multiple technologies
- Testing and debugging
- Deployment (making it live on the internet)

This will look great on your resume and you'll actually understand what you built!

---

## Next Steps

### If You're on Frontend Team:

**Linux:** Read `docs/linux/FRONTEND_SETUP.md`
**Windows:** Read `docs/windows/FRONTEND_SETUP.md`

### If You're on Backend Team:

**Linux:** Read `docs/linux/BACKEND_SETUP.md`
**Windows:** Read `docs/windows/BACKEND_SETUP.md`

---

## Important Reminders

**For Students:**
- It's okay to not understand everything at first
- Google is your friend - use it!
- Asking questions makes you smart, not dumb
- Making mistakes is how you learn
- Everyone starts as a beginner

**For the Team:**
- Help each other out
- Share what you learn
- Celebrate small victories
- Don't compare your progress to others
- Focus on learning, not perfection

**You can do this! Good luck!**

---

Last Updated: 2025-10-19

