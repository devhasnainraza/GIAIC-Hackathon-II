# 🚀 Hugging Face Deployment Guide

## Overview
Deploy Pure Tasks Backend API to Hugging Face Spaces using Docker.

---

## 📋 Prerequisites

1. **Hugging Face Account** - Sign up at https://huggingface.co/join
2. **GitHub Repository** - Your code should be on GitHub
3. **Neon Database** - PostgreSQL database URL ready

---

## 🎯 Step-by-Step Deployment

### Step 1: Create New Space

1. Go to: https://huggingface.co/spaces
2. Click: **Create new Space**
3. Fill in details:
   - **Space name:** `pure-tasks-backend`
   - **License:** MIT
   - **Select SDK:** Docker
   - **Space hardware:** CPU basic (Free)
   - **Visibility:** Public
4. Click: **Create Space**

### Step 2: Connect GitHub Repository

1. In your new Space, click: **Settings** tab
2. Scroll to: **Repository**
3. Click: **Connect to GitHub**
4. Select repository: `GIAIC-Hackathon-II`
5. Set **Source directory:** `Phase_II/backend`
6. Click: **Save**

### Step 3: Set Environment Variables

In Space Settings → **Variables and secrets**:

Click **New secret** for each variable:

```bash
# Required Variables
DATABASE_URL = postgresql://neondb_owner:npg_lW83steFXOxp@ep-tiny-shadow-ahq6dtsj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET = q-_ohHZKZBbF4GkRwFZRxIpi89nyQU6DSF6B31wwpWE

CORS_ORIGINS = http://localhost:3000,https://your-frontend.vercel.app

ENVIRONMENT = production

FRONTEND_URL = https://your-frontend.vercel.app

EMAIL_PROVIDER = gmail

FROM_EMAIL = developerhasnainraza@gmail.com

GMAIL_EMAIL = developerhasnainraza@gmail.com

GMAIL_APP_PASSWORD = ybli mvar hule saal
```

**Important:** Replace `your-frontend.vercel.app` with your actual frontend URL.

### Step 4: Deploy

1. Go to: **Files** tab
2. Hugging Face will automatically:
   - Detect Dockerfile
   - Build Docker image
   - Deploy to Space
3. Wait 3-5 minutes for build to complete

### Step 5: Verify Deployment

Once deployed, your backend will be available at:
```
https://huggingface.co/spaces/YOUR_USERNAME/pure-tasks-backend
```

Test endpoints:
```bash
# Health check
curl https://YOUR_USERNAME-pure-tasks-backend.hf.space/api/health

# Root endpoint
curl https://YOUR_USERNAME-pure-tasks-backend.hf.space/

# API Documentation
https://YOUR_USERNAME-pure-tasks-backend.hf.space/api/docs
```

---

## 🔧 Configuration Files

### Dockerfile
Located at: `Phase_II/backend/Dockerfile`
- Uses Python 3.11
- Installs dependencies
- Exposes port 7860 (HuggingFace standard)
- Runs uvicorn server

### docker-compose.yml
Located at: `Phase_II/backend/docker-compose.yml`
- For local testing
- Run: `docker-compose up`

### README.md
Located at: `Phase_II/backend/README.md`
- Space description
- Shows on HuggingFace Space page

---

## 🧪 Local Testing (Optional)

Before deploying, test locally:

```bash
# Navigate to backend
cd E:/Hackathon_II/Phase_II/backend

# Build Docker image
docker build -t pure-tasks-backend .

# Run container
docker run -p 7860:7860 --env-file .env pure-tasks-backend

# Test
curl http://localhost:7860/api/health
```

---

## 🔄 Update Deployment

To update your deployed backend:

1. **Make changes** to your code
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push origin 004-ui-ux-branding
   ```
3. **Hugging Face automatically rebuilds** (takes 3-5 minutes)

---

## 📊 Monitoring

### View Logs
1. Go to your Space
2. Click: **Logs** tab
3. See real-time application logs

### Check Status
1. Go to your Space
2. Status indicator shows:
   - 🟢 Running
   - 🟡 Building
   - 🔴 Error

---

## 🐛 Troubleshooting

### Build Fails

**Check:**
1. Dockerfile syntax is correct
2. requirements.txt has all dependencies
3. No syntax errors in Python code

**Solution:**
- View build logs in Space → Logs
- Fix errors and push again

### 500 Error After Deployment

**Check:**
1. All environment variables are set
2. DATABASE_URL is correct
3. Database is accessible from internet

**Solution:**
- Check Space → Logs for error messages
- Verify environment variables in Settings

### CORS Errors

**Check:**
1. CORS_ORIGINS includes your frontend URL
2. No trailing slashes in URLs

**Solution:**
- Update CORS_ORIGINS environment variable
- Restart Space (Settings → Factory reboot)

---

## 🎉 Success Checklist

- [ ] Space created on Hugging Face
- [ ] GitHub repository connected
- [ ] All 9 environment variables set
- [ ] Build completed successfully
- [ ] Health endpoint returns 200 OK
- [ ] API docs accessible
- [ ] Frontend can connect to backend

---

## 📝 Important Notes

1. **Free Tier Limits:**
   - CPU basic (free)
   - Auto-sleeps after 48 hours of inactivity
   - Wakes up on first request (cold start ~30 seconds)

2. **Database:**
   - Use Neon PostgreSQL (free tier)
   - Ensure `sslmode=require` in DATABASE_URL

3. **Port:**
   - Must use port 7860 (HuggingFace standard)
   - Already configured in Dockerfile

4. **Persistence:**
   - No persistent filesystem
   - Use Cloudinary for image uploads
   - Database for all data storage

---

## 🔗 Useful Links

- **Your Space:** https://huggingface.co/spaces/YOUR_USERNAME/pure-tasks-backend
- **HuggingFace Docs:** https://huggingface.co/docs/hub/spaces-sdks-docker
- **Docker Docs:** https://docs.docker.com/
- **FastAPI Docs:** https://fastapi.tiangolo.com/

---

## 🆘 Need Help?

If deployment fails:
1. Check Space logs
2. Verify all environment variables
3. Test Docker build locally
4. Check database connectivity

---

**Backend URL Format:**
```
https://YOUR_USERNAME-pure-tasks-backend.hf.space
```

Replace `YOUR_USERNAME` with your HuggingFace username.

**Example:**
```
https://devhasnainraza-pure-tasks-backend.hf.space
```

---

## ✅ Next Steps After Deployment

1. **Update Frontend:**
   - Change API URL to HuggingFace Space URL
   - Update CORS_ORIGINS to include frontend URL

2. **Test All Endpoints:**
   - Authentication (signup/signin)
   - Tasks CRUD operations
   - User profile
   - Notifications

3. **Monitor:**
   - Check logs regularly
   - Monitor database usage
   - Watch for errors

---

**Deployment is now complete! Your backend is running on HuggingFace Spaces! 🎉**
