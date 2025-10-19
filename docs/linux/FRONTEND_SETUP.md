# Frontend Development Setup Guide - Linux

Complete setup instructions for frontend developers using Linux operating systems.

---

## Prerequisites

### System Requirements
- Ubuntu 20.04+ / Debian 11+ / Fedora 35+ / Arch Linux
- 4GB RAM minimum (8GB recommended)
- 10GB free disk space
- Internet connection

### Required Knowledge
- Basic Linux command line
- Basic JavaScript/HTML/CSS
- Git fundamentals

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

#### Arch Linux:
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
```

#### Fedora:
```bash
sudo dnf install git

# Verify installation
git --version
```

#### Arch Linux:
```bash
sudo pacman -S git

# Verify installation
git --version
```

#### Configure Git:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### Step 3: Install Visual Studio Code (Recommended)

#### Ubuntu/Debian:
```bash
# Download and install
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
rm -f packages.microsoft.gpg

sudo apt update
sudo apt install code

# Launch VS Code
code
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
# Install from AUR
yay -S visual-studio-code-bin

# Or use the open-source version
sudo pacman -S code
```

#### Install VS Code Extensions:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

---

### Step 4: Clone Repository

```bash
# Navigate to your projects directory
cd ~/Projects

# Clone the repository (replace with actual URL)
git clone <repository-url> encrypted-file-drop

# Navigate into project
cd encrypted-file-drop

# Create your feature branch
git checkout -b frontend-setup
```

---

### Step 5: Initialize Frontend Project

```bash
# Create frontend directory
mkdir -p frontend
cd frontend

# Initialize Vite project with React and TypeScript
npm create vite@latest . -- --template react-ts

# Answer 'y' to proceed if prompted
# Answer 'y' if asked about existing files
```

---

### Step 6: Install Dependencies

```bash
# Install base dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

# Install Axios for API calls
npm install axios
```

---

### Step 7: Configure Tailwind CSS

#### Edit `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### Edit `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### Step 8: Create Project Structure

```bash
# Create directories
mkdir -p src/components
mkdir -p src/utils
mkdir -p src/api

# Create placeholder files
touch src/components/Upload.tsx
touch src/components/Download.tsx
touch src/components/FileInfo.tsx
touch src/utils/crypto.ts
touch src/api/client.ts
```

---

### Step 9: Test Development Server

```bash
# Start development server
npm run dev

# Server should start on http://localhost:5173
# Press Ctrl+C to stop the server
```

#### Verify in Browser:
Open http://localhost:5173 in your browser. You should see the default Vite + React page.

---

### Step 10: Create Basic Component

#### Edit `src/App.tsx`:
```typescript
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Encrypted File Drop
        </h1>
        <p className="text-gray-600">
          Frontend development environment ready.
        </p>
      </div>
    </div>
  )
}

export default App
```

#### Restart server and verify:
```bash
npm run dev
```

Visit http://localhost:5173 - you should see a styled card with the title.

---

### Step 11: Commit Your Work

```bash
# Go back to project root
cd ..

# Check status
git status

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Frontend: Initial setup with React, Vite, and Tailwind CSS"

# Push to remote
git push origin frontend-setup
```

---

## Project Structure

After setup, your structure should look like:

```
frontend/
├── node_modules/          (auto-generated)
├── public/
├── src/
│   ├── api/
│   │   └── client.ts
│   ├── components/
│   │   ├── Download.tsx
│   │   ├── FileInfo.tsx
│   │   └── Upload.tsx
│   ├── utils/
│   │   └── crypto.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Development Workflow

### Starting Development Server
```bash
cd frontend
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Next Steps

### Immediate Tasks

1. **Create Upload Component** (Week 1-2)
   - File input element
   - Drag-and-drop functionality
   - File size validation (50MB max)
   - Upload progress display

2. **Implement Encryption** (Week 2)
   - Generate AES-256-GCM keys
   - Encrypt files before upload
   - Key management utilities

3. **API Integration** (Week 2-3)
   - Axios configuration
   - Upload endpoint integration
   - Download endpoint integration
   - Error handling

4. **Download Component** (Week 3)
   - URL parsing (extract file ID and key)
   - File download functionality
   - Decryption implementation
   - File save trigger

---

## Common Commands Reference

```bash
# Install new dependency
npm install package-name

# Install dev dependency
npm install -D package-name

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Run linter
npm run lint

# Format code (if prettier configured)
npx prettier --write src/
```

---

## Troubleshooting

### Issue: `npm: command not found`
**Solution:**
```bash
# Verify Node.js installation
which node

# If not found, reinstall Node.js following Step 1
```

### Issue: Port 5173 already in use
**Solution:**
```bash
# Find process using port
sudo lsof -i :5173

# Kill process
kill -9 <PID>

# Or change port in vite.config.ts
```

### Issue: Permission errors during npm install
**Solution:**
```bash
# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ~/.config
```

### Issue: Tailwind classes not working
**Solution:**
1. Verify `tailwind.config.js` content array includes your files
2. Ensure `@tailwind` directives are in `src/index.css`
3. Restart development server

### Issue: TypeScript errors
**Solution:**
```bash
# Check TypeScript configuration
cat tsconfig.json

# Install missing type definitions
npm install -D @types/node
```

---

## Development Best Practices

### Code Organization
- One component per file
- Descriptive file and variable names
- Group related components in subdirectories
- Keep components small and focused

### TypeScript Usage
- Enable strict mode
- Define interfaces for props
- Avoid `any` type
- Use type inference when possible

### Git Workflow
- Create feature branches
- Commit frequently with clear messages
- Pull latest changes before starting work
- Review code before committing

### Performance
- Lazy load components when appropriate
- Optimize images and assets
- Minimize bundle size
- Use React DevTools for profiling

---

## Additional Tools (Optional)

### React DevTools Browser Extension
```bash
# Install Chrome extension from:
# https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
```

### Node Version Manager (nvm)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then install Node.js
nvm install 20
nvm use 20
```

---

## Environment Variables

Create `.env` file in frontend directory:

```bash
VITE_API_URL=http://localhost:3000/api
```

Access in code:
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Testing Setup (Optional)

### Install Testing Libraries
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Run Tests
```bash
npm test
```

---

## Resources

### Official Documentation
- React: https://react.dev/learn
- Vite: https://vitejs.dev/guide/
- TypeScript: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs

### Learning Resources
- TypeScript in 5 Minutes: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- React Tutorial: https://react.dev/learn/tutorial-tic-tac-toe
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API

---

## Support

For technical issues:
1. Check troubleshooting section
2. Review official documentation
3. Search existing GitHub issues
4. Ask team members
5. Create new GitHub issue

---

## Checklist

Setup Complete When:
- [ ] Node.js v20+ installed and verified
- [ ] Git installed and configured
- [ ] VS Code installed with extensions
- [ ] Repository cloned
- [ ] Frontend directory created
- [ ] Dependencies installed
- [ ] Tailwind CSS configured
- [ ] Project structure created
- [ ] Development server runs successfully
- [ ] Test component displays correctly
- [ ] Changes committed and pushed

---

**Estimated Setup Time:** 30-45 minutes

**Next Document:** `docs/common/PROJECT_STRUCTURE.md`

