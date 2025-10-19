# Quick Start Guide - Windows

This guide will help you get started with the project on Windows 10/11. Follow the steps for your role (frontend or backend developer).

---

## First: Which Team Are You On?

### Frontend Team
You'll build what users see - the website interface, buttons, upload forms, etc.

**Go to:** `FRONTEND_SETUP.md` in this folder

**Time needed:** About 30-45 minutes

### Backend Team
You'll build the server that handles file storage and database operations.

**Go to:** `BACKEND_SETUP.md` in this folder

**Time needed:** About 45-60 minutes (plus time for Windows updates if needed)

---

## What You Need to Know

### Basic Windows Commands

If you're new to PowerShell or Command Prompt, here are the essential commands:

**PowerShell / Command Prompt:**
```powershell
# Navigate to a folder
cd folder-name

# Go back one folder
cd ..

# See what's in current folder
dir  # or "ls" in PowerShell

# See your current location
cd

# Create a new folder
mkdir folder-name

# Create an empty file (PowerShell)
New-Item filename.txt

# Create an empty file (Command Prompt)
type nul > filename.txt
```

### How to Open PowerShell or Command Prompt

**Option 1:**
- Press `Windows Key + R`
- Type `powershell` or `cmd`
- Press Enter

**Option 2:**
- Click Start Menu
- Type "PowerShell" or "Command Prompt"
- Click on the result

**Tip:** Use PowerShell - it's more modern and powerful than Command Prompt

---

## Before You Start

### Required Tools (You'll Install These)

**For Frontend Developers:**
1. Node.js (to run JavaScript on your computer)
2. Git (to manage code versions)
3. Text Editor (VS Code recommended, but any will work)

**For Backend Developers:**
1. Node.js
2. Git
3. Docker Desktop (to run database and storage)
4. Text Editor (VS Code recommended)

### Check What You Already Have

Open PowerShell and run these commands:

```powershell
# Check if Node.js is installed
node --version

# Check if Git is installed
git --version

# Check if Docker is installed (backend only)
docker --version
```

If any command says "not recognized", don't worry - you'll install it in the setup guide.

---

## Overview of Steps

### Frontend Setup (Short Version)

1. Download and install Node.js
2. Download and install Git
3. Download and install VS Code (or your preferred editor)
4. Clone the project from GitHub
5. Create the frontend folder
6. Install React and other tools
7. Start the development server
8. See your first page in the browser

**Full details:** See `FRONTEND_SETUP.md`

### Backend Setup (Short Version)

1. Download and install Node.js
2. Download and install Git
3. Enable WSL 2 (for Docker)
4. Download and install Docker Desktop
5. Download and install VS Code (or your preferred editor)
6. Clone the project from GitHub
7. Create the backend folder
8. Install Express and other tools
9. Start Docker containers (database + storage)
10. Start the Express server
11. Test that everything works

**Full details:** See `BACKEND_SETUP.md`

---

## Tips for Success

### When You Get Stuck

1. **Read the error message** - It usually tells you what's wrong
2. **Google the error** - Copy and paste it into Google
3. **Check the troubleshooting section** in your setup guide
4. **Ask your teammates** - They might have solved the same problem
5. **Ask your team lead** - That's what they're there for

### Good Habits

**Save your work often:**
```powershell
# After making changes that work, save them
git add .
git commit -m "Describe what you did"
git push
```

**Test frequently:**
- Don't write a lot of code before testing
- Make small changes, test, then continue
- This makes it easier to find bugs

**Ask questions:**
- No question is too simple
- If you're confused, others probably are too
- Asking questions helps everyone learn

---

## Common Issues on Windows

### Issue: Command Not Recognized

**Problem:** "'node' is not recognized as an internal or external command"

**Solution:**
- The software isn't installed or not in your PATH
- After installing Node.js/Git, close and reopen PowerShell
- Restart your computer if still not working

### Issue: PowerShell Execution Policy

**Problem:** "cannot be loaded because running scripts is disabled"

**Solution:**
```powershell
# Run PowerShell as Administrator (right-click, "Run as administrator")
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Port Already in Use

**Problem:** "Port 3000 (or 5173) already in use"

**Solution:**
```powershell
# Find what's using the port
netstat -ano | findstr :3000

# Kill that process (replace PID with the number you see)
taskkill /PID <PID> /F
```

### Issue: Docker Won't Start

**Problem:** Docker Desktop shows error or won't start

**Solution:**
1. Make sure WSL 2 is installed (see backend setup guide)
2. Enable Virtualization in BIOS (if needed)
3. Restart Windows
4. Try running Docker Desktop as Administrator

### Issue: Line Ending Warnings in Git

**Problem:** Git warnings about CRLF/LF line endings

**Solution:**
```powershell
# Configure Git to handle line endings automatically
git config --global core.autocrlf true
```

---

## Windows-Specific Tips

### File Paths

Windows uses backslashes in paths:
```
C:\Users\YourName\Documents\Projects
```

But in code, you can use forward slashes (they work everywhere):
```javascript
const path = "folder/file.txt";  // This works on Windows, Mac, and Linux
```

### Administrator Rights

Some installations require administrator rights:
1. Right-click on installer or PowerShell
2. Choose "Run as administrator"
3. Click "Yes" when Windows asks for permission

### Windows Defender

If Windows Defender blocks an installation:
1. Click "More info"
2. Click "Run anyway"
3. Only do this for software from trusted sources (Node.js, Git, etc.)

---

## What's Next?

### Frontend Developers
**Go to:** `FRONTEND_SETUP.md`

This guide will walk you through:
- Downloading and installing all required tools
- Setting up React with Vite
- Creating your first component
- Starting the development server

### Backend Developers
**Go to:** `BACKEND_SETUP.md`

This guide will walk you through:
- Downloading and installing all required tools
- Setting up WSL 2 for Docker
- Setting up Express server
- Starting Docker containers
- Connecting to database

---

## Useful Windows Tools

### Windows Terminal (Recommended)

Better than Command Prompt or PowerShell:
- Install from Microsoft Store (search "Windows Terminal")
- Supports tabs and modern features
- Makes development easier

### Windows Subsystem for Linux (WSL)

Backend developers will install this for Docker:
- Lets you run Linux on Windows
- Required for Docker Desktop
- Installation covered in backend setup guide

---

## Questions?

- Check the detailed setup guide for your role
- Look at `docs\common\TEAM_SUMMARY.md` for project overview
- Ask in your team chat
- Create a GitHub issue

---

**Remember:** Everyone starts as a beginner. Take it one step at a time, and don't hesitate to ask for help!

Good luck!

