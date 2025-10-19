# Frontend Development Setup Guide - Windows

Complete setup instructions for frontend developers using Windows 10/11 operating systems.

---

## Prerequisites

### System Requirements
- Windows 10 (version 1903 or higher) or Windows 11
- 4GB RAM minimum (8GB recommended)
- 10GB free disk space
- Internet connection
- Administrator access

### Required Knowledge
- Basic Windows command line (Command Prompt or PowerShell)
- Basic JavaScript/HTML/CSS
- Git fundamentals

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
   Open PowerShell or Command Prompt and run:
   ```powershell
   node --version
   npm --version
   ```
   Should display v20.x.x and 10.x.x respectively.

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
   Open PowerShell or Command Prompt:
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

4. Verify installation:
   ```powershell
   git --version
   ```

---

### Step 3: Install Visual Studio Code (Recommended)

1. Download VS Code:
   - Visit: https://code.visualstudio.com/
   - Click "Download for Windows"
   - Download the User Installer (VSCodeUserSetup-x64-x.x.x.exe)

2. Run the installer:
   - Double-click the downloaded file
   - Accept the license agreement
   - Check "Add to PATH" option
   - Check "Register Code as an editor for supported file types"
   - Check "Add 'Open with Code' action to context menu"
   - Click "Install"
   - Click "Finish"

3. Install Extensions:
   Open VS Code, then open the terminal (Terminal → New Terminal) and run:
   ```powershell
   code --install-extension dbaeumer.vscode-eslint
   code --install-extension esbenp.prettier-vscode
   code --install-extension bradlc.vscode-tailwindcss
   ```

---

### Step 4: Clone Repository

Open PowerShell or Command Prompt:

```powershell
# Navigate to your projects directory (create if it doesn't exist)
cd C:\Users\YourUsername\Documents
mkdir Projects
cd Projects

# Clone the repository (replace with actual URL)
git clone <repository-url> encrypted-file-drop

# Navigate into project
cd encrypted-file-drop

# Create your feature branch
git checkout -b frontend-setup
```

---

### Step 5: Initialize Frontend Project

```powershell
# Create frontend directory
mkdir frontend
cd frontend

# Initialize Vite project with React and TypeScript
npm create vite@latest . -- --template react-ts

# Answer 'y' to proceed if prompted
```

---

### Step 6: Install Dependencies

```powershell
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
Open the file in VS Code and update:
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

#### Edit `src\index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### Step 8: Create Project Structure

```powershell
# Create directories
mkdir src\components
mkdir src\utils
mkdir src\api

# Create placeholder files
New-Item src\components\Upload.tsx
New-Item src\components\Download.tsx
New-Item src\components\FileInfo.tsx
New-Item src\utils\crypto.ts
New-Item src\api\client.ts
```

Alternative using Command Prompt:
```cmd
md src\components src\utils src\api
type nul > src\components\Upload.tsx
type nul > src\components\Download.tsx
type nul > src\components\FileInfo.tsx
type nul > src\utils\crypto.ts
type nul > src\api\client.ts
```

---

### Step 9: Test Development Server

```powershell
# Start development server
npm run dev

# Server should start on http://localhost:5173
# Press Ctrl+C to stop the server
```

#### Verify in Browser:
Open http://localhost:5173 in your browser. You should see the default Vite + React page.

---

### Step 10: Create Basic Component

#### Edit `src\App.tsx`:
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
```powershell
npm run dev
```

Visit http://localhost:5173 - you should see a styled card with the title.

---

### Step 11: Commit Your Work

```powershell
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
frontend\
├── node_modules\          (auto-generated)
├── public\
├── src\
│   ├── api\
│   │   └── client.ts
│   ├── components\
│   │   ├── Download.tsx
│   │   ├── FileInfo.tsx
│   │   └── Upload.tsx
│   ├── utils\
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
```powershell
cd frontend
npm run dev
```

### Building for Production
```powershell
npm run build
```

### Preview Production Build
```powershell
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

```powershell
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
- Verify Node.js installation in Control Panel → Programs
- Restart PowerShell/Command Prompt
- Check PATH environment variable includes Node.js

### Issue: Port 5173 already in use
**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :5173

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in vite.config.ts
```

### Issue: PowerShell Execution Policy Error
**Solution:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Git not recognized
**Solution:**
- Restart Command Prompt/PowerShell after Git installation
- Verify Git in PATH: `echo %PATH%` (CMD) or `$env:PATH` (PowerShell)
- Reinstall Git with "Add to PATH" option checked

### Issue: Tailwind classes not working
**Solution:**
1. Verify `tailwind.config.js` content array includes your files
2. Ensure `@tailwind` directives are in `src\index.css`
3. Restart development server

### Issue: TypeScript errors
**Solution:**
```powershell
# Check TypeScript configuration
type tsconfig.json

# Install missing type definitions
npm install -D @types/node
```

### Issue: Line ending warnings
**Solution:**
```powershell
# Configure Git to handle line endings
git config --global core.autocrlf true
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

### Windows Terminal (Recommended)
1. Install from Microsoft Store: "Windows Terminal"
2. Provides better terminal experience than Command Prompt
3. Supports multiple tabs and profiles

### React DevTools Browser Extension
- Install from Chrome Web Store or Firefox Add-ons
- Search for "React Developer Tools"
- Provides React component inspection and debugging

### Git GUI Tools
- GitHub Desktop: https://desktop.github.com/
- GitKraken: https://www.gitkraken.com/
- SourceTree: https://www.sourcetreeapp.com/

---

## Environment Variables

Create `.env` file in frontend directory:

```
VITE_API_URL=http://localhost:3000/api
```

Access in code:
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Testing Setup (Optional)

### Install Testing Libraries
```powershell
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Run Tests
```powershell
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

## Windows-Specific Notes

### File Paths
- Windows uses backslashes (`\`) for file paths
- Git and Node.js accept forward slashes (`/`)
- Use forward slashes in code for cross-platform compatibility

### Line Endings
- Windows uses CRLF (`\r\n`)
- Linux/Mac use LF (`\n`)
- Git handles conversion automatically with proper configuration

### Case Sensitivity
- Windows file system is case-insensitive
- Git is case-sensitive
- Use consistent casing for files and folders

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

**Next Document:** `docs\common\PROJECT_STRUCTURE.md`

