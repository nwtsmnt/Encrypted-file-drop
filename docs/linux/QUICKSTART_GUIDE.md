# Quick Start Guide - Linux

This guide will help you get started with the project on Linux. Follow the steps for your role (frontend or backend developer).

---

## First: Which Team Are You On?

### Frontend Team
You'll build what users see - the website interface, buttons, upload forms, etc.

**Go to:** `FRONTEND_SETUP.md` in this folder

**Time needed:** About 30-45 minutes

### Backend Team
You'll build the server that handles file storage and database operations.

**Go to:** `BACKEND_SETUP.md` in this folder

**Time needed:** About 45-60 minutes

---

## What You Need to Know

### Basic Linux Commands

If you're new to the command line, here are the essential commands:

```bash
# Navigate to a folder
cd folder-name

# Go back one folder
cd ..

# See what's in current folder
ls

# See your current location
pwd

# Create a new folder
mkdir folder-name

# Open a file in text editor
nano filename
# or
gedit filename
```

### Your Linux Distribution

This guide works for:
- Ubuntu 20.04 or newer
- Debian 11 or newer
- Fedora 35 or newer
- Arch Linux (recent versions)
- Linux Mint
- Pop!_OS

If you're using a different distribution, the commands might be slightly different, but the concepts are the same.

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
3. Docker (to run database and storage)
4. Text Editor (VS Code recommended)

### Check What You Already Have

Open your terminal and run these commands:

```bash
# Check if Node.js is installed
node --version

# Check if Git is installed
git --version

# Check if Docker is installed (backend only)
docker --version
```

If any command says "command not found", don't worry - you'll install it in the setup guide.

---

## Overview of Steps

### Frontend Setup (Short Version)

1. Install Node.js
2. Install Git
3. Install VS Code (or your preferred editor)
4. Clone the project from GitHub
5. Create the frontend folder
6. Install React and other tools
7. Start the development server
8. See your first page in the browser

**Full details:** See `FRONTEND_SETUP.md`

### Backend Setup (Short Version)

1. Install Node.js
2. Install Git
3. Install Docker
4. Install VS Code (or your preferred editor)
5. Clone the project from GitHub
6. Create the backend folder
7. Install Express and other tools
8. Start Docker containers (database + storage)
9. Start the Express server
10. Test that everything works

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
```bash
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

## Common Issues on Linux

### Issue: Permission Denied

**Problem:** You see "Permission denied" when running a command

**Solution:**
```bash
# Some commands need admin rights, use sudo
sudo your-command-here

# For npm/node issues, fix permissions instead
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ~/.config
```

### Issue: Port Already in Use

**Problem:** "Port 3000 (or 5173) already in use"

**Solution:**
```bash
# Find what's using the port
sudo lsof -i :3000

# Kill that process (replace PID with the number you see)
kill -9 PID
```

### Issue: Command Not Found

**Problem:** "command not found: npm" or similar

**Solution:**
- The software isn't installed or not in your PATH
- Follow the installation steps for that tool
- After installing, close and reopen your terminal

---

## Distribution-Specific Notes

### Ubuntu/Debian

Most commands use `apt`:
```bash
sudo apt update
sudo apt install package-name
```

### Fedora

Most commands use `dnf`:
```bash
sudo dnf install package-name
```

### Arch Linux

Most commands use `pacman`:
```bash
sudo pacman -S package-name
```

---

## What's Next?

### Frontend Developers
**Go to:** `FRONTEND_SETUP.md`

This guide will walk you through:
- Installing all required tools
- Setting up React with Vite
- Creating your first component
- Starting the development server

### Backend Developers
**Go to:** `BACKEND_SETUP.md`

This guide will walk you through:
- Installing all required tools
- Setting up Express server
- Starting Docker containers
- Connecting to database

---

## Questions?

- Check the detailed setup guide for your role
- Look at `docs/common/TEAM_SUMMARY.md` for project overview
- Ask in your team chat
- Create a GitHub issue

---

**Remember:** Everyone starts as a beginner. Take it one step at a time, and don't hesitate to ask for help!

Good luck!

