# HuggingFace GitHub Connection - Troubleshooting Guide

## Problem
"Files and versions" tab nahi mil raha hai HuggingFace Space mein.

## Solution - Multiple Methods

---

## Method 1: Settings Tab (Recommended)

### Step-by-Step:

1. **Apne Space par jao:**
   ```
   https://huggingface.co/spaces/YOUR_USERNAME/pure-tasks-backend
   ```

2. **Top navigation mein dekho:**
   ```
   App | Files | Settings | Community
   ```

3. **"Settings" tab par click karo**

4. **Left sidebar mein dekho:**
   ```
   General
   → Repository  ← Yahan click karo
   Secrets
   Hardware
   ```

5. **Repository section mein:**
   - "Connect to GitHub" button dikhega
   - Ya "GitHub repository" field dikhega

6. **Click: "Connect to GitHub"**

7. **GitHub authorization:**
   - GitHub login page khulega
   - Authorize HuggingFace
   - Repository select karo: `GIAIC-Hackathon-II`

8. **Set Source Directory:**
   - Field mein type karo: `Phase_II/backend`
   - Save karo

---

## Method 2: Direct GitHub Connection URL

Agar Settings mein nahi mil raha, to directly yahan jao:

```
https://huggingface.co/spaces/YOUR_USERNAME/pure-tasks-backend/settings
```

Replace `YOUR_USERNAME` with your HuggingFace username.

---

## Method 3: Manual File Upload (Backup Method)

Agar GitHub connection nahi ho raha, to manually files upload kar sakte ho:

### Step 1: Prepare Files Locally

```bash
cd E:/Hackathon_II/Phase_II/backend

# Create a zip of necessary files
# Or prepare to upload individually
```

### Step 2: Upload via Web Interface

1. **Space par jao**
2. **"Files" tab click karo** (top navigation)
3. **"Add file" button click karo**
4. **Upload these files:**
   - `Dockerfile`
   - `requirements.txt`
   - `README.md`
   - Entire `src/` folder
   - `.dockerignore`
   - `docker-compose.yml`

### Step 3: Create Folders

HuggingFace web interface mein:
- Click "Add file" → "Create a new file"
- Filename: `src/main.py` (automatically creates folder)
- Paste content from your local file
- Commit

---

## Method 4: Git Clone and Push (Advanced)

### Step 1: Clone HuggingFace Space

```bash
# Install git-lfs first (if not installed)
git lfs install

# Clone your Space
git clone https://huggingface.co/spaces/YOUR_USERNAME/pure-tasks-backend
cd pure-tasks-backend
```

### Step 2: Copy Backend Files

```bash
# Copy all backend files to Space directory
cp -r E:/Hackathon_II/Phase_II/backend/* .

# Or on Windows:
xcopy E:/Hackathon_II/Phase_II/backend/* . /E /H /C /I
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Add backend files"
git push
```

---

## Common Issues & Solutions

### Issue 1: "Files" tab nahi dikha raha

**Solution:**
- Browser refresh karo (Ctrl+F5)
- Different browser try karo
- Incognito/Private mode mein kholo

### Issue 2: GitHub authorization fail ho raha hai

**Solution:**
1. GitHub → Settings → Applications
2. HuggingFace ko revoke karo
3. Phir se authorize karo

### Issue 3: Repository select nahi ho raha

**Solution:**
- Make sure repository public hai
- HuggingFace ko repository access do:
  - GitHub → Settings → Applications → HuggingFace
  - Repository access → Select repositories
  - Add `GIAIC-Hackathon-II`

### Issue 4: Source directory set nahi ho raha

**Solution:**
- Exact path use karo: `Phase_II/backend`
- No leading or trailing slashes
- Case-sensitive hai

---

## Visual Navigation Guide

### HuggingFace Space Layout:

```
┌─────────────────────────────────────────────┐
│ [Logo] pure-tasks-backend        [Profile]  │
├─────────────────────────────────────────────┤
│ App | Files | Settings | Community          │ ← Top Navigation
├─────────────────────────────────────────────┤
│                                             │
│  [Your Space Content]                       │
│                                             │
└─────────────────────────────────────────────┘
```

### Settings Page Layout:

```
┌──────────────┬──────────────────────────────┐
│ General      │                              │
│ Repository   │  Repository Settings         │ ← Yahan
│ Secrets      │                              │
│ Hardware     │  Connect to GitHub [Button]  │
│              │                              │
└──────────────┴──────────────────────────────┘
```

---

## Quick Checklist

Before connecting GitHub:

- [ ] HuggingFace account verified
- [ ] Space created with Docker SDK
- [ ] GitHub repository is public
- [ ] You have admin access to repository

After connecting:

- [ ] Repository connected successfully
- [ ] Source directory set to `Phase_II/backend`
- [ ] Build started automatically
- [ ] Check Logs tab for build progress

---

## Alternative: Use HuggingFace CLI

### Install HuggingFace CLI:

```bash
pip install huggingface_hub
```

### Login:

```bash
huggingface-cli login
```

### Upload Files:

```bash
cd E:/Hackathon_II/Phase_II/backend

huggingface-cli upload YOUR_USERNAME/pure-tasks-backend . --repo-type=space
```

---

## What to Do Right Now

### Option A: Settings Method (Easiest)
1. Go to: `https://huggingface.co/spaces/YOUR_USERNAME/pure-tasks-backend/settings`
2. Look for "Repository" in left sidebar
3. Click "Connect to GitHub"

### Option B: Manual Upload (If GitHub fails)
1. Go to "Files" tab
2. Click "Add file"
3. Upload Dockerfile first
4. Upload requirements.txt
5. Upload src/ folder files one by one

### Option C: Git Clone Method (Most Reliable)
1. Clone HuggingFace Space
2. Copy backend files
3. Push to HuggingFace

---

## Need More Help?

**Screenshot bhejo:**
- HuggingFace Space ka main page
- Settings page ka screenshot

**Ya batao:**
- Kaunsa tab dikha raha hai?
- Kya error message aa raha hai?
- Browser kaunsa use kar rahe ho?

---

## Quick Test

Agar GitHub connection ho gaya:

1. Check "Files" tab - files dikhengi
2. Check "Logs" tab - build start hoga
3. Wait 5-10 minutes
4. Space "Running" status dikhayega

---

**Try Method 1 (Settings → Repository) first. Agar nahi mila, to screenshot bhejo!**
