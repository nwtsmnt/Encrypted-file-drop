# Getting Started - Read This First

Welcome to the Encrypted File Drop project! This document will point you to the right guides based on your operating system and role.

---

## Quick Navigation

### Step 1: Choose Your Operating System

**Linux Users (Ubuntu, Debian, Fedora, Arch, etc.)**
- Go to folder: `docs/linux/`
- Start with: `docs/linux/QUICKSTART_GUIDE.md`

**Windows Users (Windows 10 or 11)**
- Go to folder: `docs/windows/`
- Start with: `docs/windows/QUICKSTART_GUIDE.md`

###Step 2: Choose Your Role

**Frontend Developer** (Building the user interface)
- Linux: `docs/linux/FRONTEND_SETUP.md`
- Windows: `docs/windows/FRONTEND_SETUP.md`

**Backend Developer** (Building the server)
- Linux: `docs/linux/BACKEND_SETUP.md`
- Windows: `docs/windows/BACKEND_SETUP.md`

---

## Documentation Structure

```
encrypted-file-drop/
├── README.md                      (Project overview)
├── START_HERE.md                  (Detailed onboarding)
├── GETTING_STARTED.md            (This file - quick navigation)
├── docker-compose.yml            (Docker configuration)
│
└── docs/
    ├── common/
    │   └── TEAM_SUMMARY.md       (What we're building - read this!)
    │
    ├── linux/
    │   ├── QUICKSTART_GUIDE.md   (Start here if on Linux)
    │   ├── FRONTEND_SETUP.md     (Complete frontend setup)
    │   └── BACKEND_SETUP.md      (Complete backend setup)
    │
    └── windows/
        ├── QUICKSTART_GUIDE.md   (Start here if on Windows)
        ├── FRONTEND_SETUP.md     (Complete frontend setup)
        └── BACKEND_SETUP.md      (Complete backend setup)
```

---

## Recommended Reading Order

### For All Team Members

1. **GETTING_STARTED.md** (This file)
2. **docs/common/TEAM_SUMMARY.md** (Understand what we're building)
3. **docs/[your-os]/QUICKSTART_GUIDE.md** (Quick overview)
4. **docs/[your-os]/[FRONTEND or BACKEND]_SETUP.md** (Detailed instructions)

### For Project Leads

1. README.md (Complete project overview)
2. START_HERE.md (Onboarding strategy)
3. docs/common/TEAM_SUMMARY.md (Share with team)
4. Review setup guides for both teams

---

## What Each Document Contains

### TEAM_SUMMARY.md (Everyone should read this!)
- What the project does
- How it works (simple explanation)
- Technologies we're using and why
- Timeline (week by week)
- What each team will build
- Common questions answered

### QUICKSTART_GUIDE.md (OS-specific)
- Quick overview for your operating system
- Basic commands you'll need
- Common issues and solutions
- What to do next

### FRONTEND_SETUP.md (OS-specific)
- Step-by-step installation of Node.js, Git, VS Code
- Creating the React project
- Installing dependencies
- Testing your setup
- Troubleshooting
- Next steps

### BACKEND_SETUP.md (OS-specific)
- Step-by-step installation of Node.js, Git, Docker, VS Code
- Creating the Express server
- Setting up PostgreSQL and MinIO with Docker
- Testing your setup
- Troubleshooting
- Next steps

---

## Time Estimates

**Frontend Setup:**
- Reading docs: 10 minutes
- Installation and setup: 30-45 minutes
- Total: About 1 hour

**Backend Setup:**
- Reading docs: 15 minutes
- Installation and setup: 45-60 minutes
- Total: About 1-1.5 hours

---

## Support and Help

### If You Get Stuck

1. **Check the troubleshooting section** in your setup guide
2. **Read the error message carefully** - it usually tells you what's wrong
3. **Google the error** - copy/paste into Google search
4. **Ask your teammates** - someone might have solved it
5. **Ask your team lead**
6. **Create a GitHub issue** with details about the problem

### Good Resources

**For Learning:**

- Any AI
- React: https://react.dev/learn
- Node.js: https://nodejs.org/docs/
- JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript

**For Problems:**

- Any AI
- Stack Overflow: https://stackoverflow.com/
- GitHub Issues: (in this repository)
- Team chat (Slack/Discord/etc.)

---

## Important Notes

### For Students

This project is designed for learning. It's okay if:
- You've never used these technologies before
- You don't understand everything immediately
- You need to ask lots of questions
- You make mistakes

**That's how learning works!**

n 1903+) or Windows 11

### Before You Begin

Make sure you have:
- [ ] Stable internet connection
- [ ] Administrator access on your computer
- [ ] About 1-2 hours of uninterrupted time
- [ ] A code editor installed (or will install VS Code)
- [ ] Git account (create one at github.com if you don't have it)

---

## Quick Start (Very Short Version)

### Linux - Frontend
```bash
# Install Node.js and Git (see linux/FRONTEND_SETUP.md for commands)
git clone <repo-url>
cd encrypted-file-drop
mkdir frontend && cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm run dev
```

### Linux - Backend
```bash
# Install Node.js, Git, Docker (see linux/BACKEND_SETUP.md)
git clone <repo-url>
cd encrypted-file-drop
docker compose up -d
mkdir backend && cd backend
npm init -y
npm install express cors dotenv
npm run dev
```

### Windows - Frontend
```powershell
# Install Node.js and Git (download from websites)
git clone <repo-url>
cd encrypted-file-drop
mkdir frontend
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm run dev
```

### Windows - Backend
```powershell
# Install Node.js, Git, Docker Desktop (download from websites)
git clone <repo-url>
cd encrypted-file-drop
docker compose up -d
mkdir backend
cd backend
npm init -y
npm install express cors dotenv
npm run dev
```

**Note:** These are extremely simplified. Please read the full setup guides for detailed instructions!

---

## Next Steps

1. **Read docs/common/TEAM_SUMMARY.md** to understand the project
2. **Go to docs/[your-os]/QUICKSTART_GUIDE.md** for OS-specific info
3. **Follow docs/[your-os]/[role]_SETUP.md** for complete setup
4. **Join your team's communication channel**
5. **Attend the first team meeting**

---

## Questions?

- Check the documentation for your OS and role
- Read docs/common/TEAM_SUMMARY.md for project overview
- Ask in team chat
- Create a GitHub issue
- Contact your team lead

---

**Good luck with the project! You've got this!**

---

Last Updated: 2025-10-13
Version: 1.0

