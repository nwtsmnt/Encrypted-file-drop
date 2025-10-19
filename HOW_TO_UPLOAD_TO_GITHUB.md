# How to Upload This Project to GitHub

Step-by-step guide for uploading your project to GitHub.

---

## Prerequisites

You need:
- A GitHub account (create one at https://github.com if you don't have it)
- Git installed on your computer
- This project on your computer

---

## Step 1: Configure Git (First Time Only)

If this is your first time using Git on this computer, you need to tell Git who you are:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

**Example:**
```bash
git config --global user.name "John Smith"
git config --global user.email "john.smith@university.edu"
```

**Note:** Use the same email you used to create your GitHub account.

To verify it worked:
```bash
git config --global user.name
git config --global user.email
```

---

## Step 2: Check Repository Status

See what files are ready to upload:

```bash
cd /home/new_testament/Projects/encrypted_file_drop_app/Encrypted-file-drop
git status
```

This shows:
- Modified files (files you changed)
- Untracked files (new files not yet added to Git)

---

## Step 3: Add Files to Git

Add all the new documentation files:

```bash
git add .
```

The dot (`.`) means "add all files". This stages all changes for commit.

To verify what will be committed:
```bash
git status
```

You should see files listed under "Changes to be committed".

---

## Step 4: Commit Changes

Save your changes with a descriptive message:

```bash
git commit -m "Add complete student-friendly documentation

- Organized guides by OS (Linux/Windows) and role (Frontend/Backend)
- Removed emojis for professional tone
- Added comprehensive setup instructions
- Included troubleshooting sections
- Created quick start guides
- Added docker-compose.yml for infrastructure"
```

**Tip:** The commit message should describe WHAT you changed and WHY.

---

## Step 5: Push to GitHub

Upload your changes to GitHub:

```bash
git push origin main
```

or if your default branch is called "master":

```bash
git push origin master
```

**What this does:**
- `git push` = upload to GitHub
- `origin` = the GitHub repository (default name)
- `main` = the branch name

---

## If This Is a New Repository

If you haven't connected this project to GitHub yet, follow these steps:

### Option A: Create Repository on GitHub First

1. **Go to GitHub** (https://github.com)
2. **Click the "+" icon** in top right corner
3. **Select "New repository"**
4. **Fill in details:**
   - Repository name: `encrypted-file-drop` (or whatever you want)
   - Description: "Secure file sharing with client-side encryption"
   - Choose Public or Private
   - Do NOT initialize with README (you already have files)
5. **Click "Create repository"**

6. **Connect your local project to GitHub:**

   GitHub will show you commands. Use these:

   ```bash
   cd /home/new_testament/Projects/encrypted_file_drop_app/Encrypted-file-drop
   git remote add origin https://github.com/YOUR-USERNAME/encrypted-file-drop.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR-USERNAME` with your actual GitHub username.

### Option B: Repository Already Exists

If the repository already exists on GitHub:

```bash
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git push -u origin main
```

---

## Verify Upload

1. Go to your GitHub repository in your browser
2. Refresh the page
3. You should see all your files:
   - README.md
   - GETTING_STARTED.md
   - docs/ folder
   - docker-compose.yml
   - etc.

---

## Share with Your Team

Once uploaded, your team members can clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/encrypted-file-drop.git
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## Common Issues

### Issue: "Permission denied (publickey)"

**Problem:** GitHub doesn't recognize your computer.

**Solution:** You need to set up SSH keys or use HTTPS with a personal access token.

**Easiest fix:** Use HTTPS with personal access token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Give it a name and select "repo" scope
4. Copy the token
5. When pushing, use the token as your password

**Or switch to HTTPS:**
```bash
git remote set-url origin https://github.com/YOUR-USERNAME/REPO-NAME.git
```

### Issue: "Updates were rejected"

**Problem:** GitHub has changes you don't have locally.

**Solution:** Pull first, then push:
```bash
git pull origin main
git push origin main
```

### Issue: "fatal: not a git repository"

**Problem:** You're not in the right directory.

**Solution:**
```bash
cd /home/new_testament/Projects/encrypted_file_drop_app/Encrypted-file-drop
```

### Issue: "Please tell me who you are"

**Problem:** Git doesn't know your name/email.

**Solution:** Run Step 1 above to configure Git.

---

## Quick Reference

### Daily Workflow

```bash
# 1. See what changed
git status

# 2. Add changes
git add .

# 3. Commit with message
git commit -m "Describe what you changed"

# 4. Push to GitHub
git push origin main
```

### Before Starting Work

```bash
# Get latest changes from team
git pull origin main
```

### Create a Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature-name

# Work on your changes...

# Push your branch
git push origin feature-name
```

---

## For Team Members

### Clone the Repository (First Time)

```bash
cd ~/Projects
git clone https://github.com/YOUR-USERNAME/encrypted-file-drop.git
cd encrypted-file-drop
```

### Get Latest Changes

```bash
git pull origin main
```

### Make Changes and Upload

```bash
# See what you changed
git status

# Add your changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push origin main
```

---

## Best Practices

### Good Commit Messages

**Bad:**
- "update"
- "fix"
- "changes"

**Good:**
- "Add file upload component with drag-and-drop"
- "Fix database connection error in backend"
- "Update documentation with troubleshooting section"

### Commit Often

- Commit after completing a small feature
- Don't wait until end of day
- Each commit should be one logical change

### Pull Before Push

Always get latest changes before uploading yours:
```bash
git pull origin main
git push origin main
```

### Use Branches for Features

```bash
# Create feature branch
git checkout -b add-encryption

# Work on feature...

# Push branch
git push origin add-encryption

# Create Pull Request on GitHub
# After review, merge to main
```

---

## Repository Structure on GitHub

After uploading, your GitHub repository will look like:

```
encrypted-file-drop/
├── README.md
├── GETTING_STARTED.md
├── START_HERE.md
├── PROJECT_OVERVIEW.md
├── HOW_TO_UPLOAD_TO_GITHUB.md
├── docker-compose.yml
├── .gitignore
└── docs/
    ├── common/
    │   └── TEAM_SUMMARY.md
    ├── linux/
    │   ├── QUICKSTART_GUIDE.md
    │   ├── FRONTEND_SETUP.md
    │   └── BACKEND_SETUP.md
    └── windows/
        ├── QUICKSTART_GUIDE.md
        ├── FRONTEND_SETUP.md
        └── BACKEND_SETUP.md
```

---

## Sharing with Your Team

### Send Team Members This Link:

```
https://github.com/YOUR-USERNAME/encrypted-file-drop
```

### Tell Them To:

1. Click the green "Code" button
2. Copy the HTTPS URL
3. Run in terminal:
   ```bash
   git clone <paste-url-here>
   ```
4. Then follow GETTING_STARTED.md

---

## Next Steps After Upload

1. **Share repository link** with your team
2. **Team members clone** the repository
3. **Everyone follows** their OS-specific setup guide
4. **Start daily standups** to coordinate work
5. **Use branches** for features
6. **Create Pull Requests** for code review

---

## Questions?

- Check Git documentation: https://git-scm.com/doc
- Check GitHub documentation: https://docs.github.com
- Ask your team
- Search Stack Overflow

---

**Good luck with your project!**

---

Last Updated: 2025-10-19

