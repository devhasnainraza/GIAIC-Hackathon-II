# Vercel Deployment Guide for Pure Tasks Backend

## Overview
This guide explains how to deploy the FastAPI backend to Vercel and fix the 500 error.

## Files Created for Vercel Deployment

### 1. `vercel.json` (Root Configuration)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ],
  "env": {
    "ENVIRONMENT": "production"
  }
}
```

### 2. `api/index.py` (Serverless Entry Point)
This file imports the FastAPI app from `src/main.py` and exposes it for Vercel's serverless functions.

## Required Environment Variables on Vercel

You MUST set these environment variables in your Vercel project settings:

### Critical Variables (Required)
1. **DATABASE_URL** - Your Neon PostgreSQL connection string
   ```
   postgresql://user:password@host.neon.tech/database?sslmode=require
   ```

2. **JWT_SECRET** - Secret key for JWT tokens (minimum 32 characters)
   ```
   your-super-secret-jwt-key-at-least-32-characters-long
   ```

3. **CORS_ORIGINS** - Allowed frontend origins (comma-separated)
   ```
   http://localhost:3000,https://your-frontend.vercel.app
   ```

4. **ENVIRONMENT** - Set to production
   ```
   production
   ```

5. **FRONTEND_URL** - Your production frontend URL
   ```
   https://your-frontend.vercel.app
   ```

### Email Configuration (Choose One)

#### Option A: Resend (Recommended)
```
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key_here
```

#### Option B: Gmail SMTP
```
EMAIL_PROVIDER=gmail
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### Optional Variables
```
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=168
LOG_LEVEL=INFO
RATE_LIMIT_PER_MINUTE=60
DATABASE_POOL_SIZE=5
DATABASE_MAX_OVERFLOW=10
FROM_EMAIL=noreply@puretasks.com
```

### Cloudinary (Optional - for image uploads)
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step-by-Step Deployment Instructions

### Step 1: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your backend project: `pure-tasks-backend`
3. Click **Settings** → **Environment Variables**
4. Add each variable listed above
5. Select environments: ✅ Production, ✅ Preview, ✅ Development
6. Click **Save** for each variable

### Step 2: Push Changes to Git

```bash
cd E:/Hackathon_II/Phase_II/backend

# Add the new files
git add vercel.json
git add api/index.py
git add src/api/health.py
git add VERCEL_DEPLOYMENT_GUIDE.md

# Commit changes
git commit -m "Add Vercel deployment configuration and fix serverless compatibility"

# Push to trigger deployment
git push origin 004-ui-ux-branding
```

### Step 3: Verify Deployment

After Vercel redeploys (takes 1-2 minutes):

1. **Test Health Endpoint:**
   ```bash
   curl https://pure-tasks-backend.vercel.app/api/health
   ```
   Should return: `{"status": "healthy", ...}`

2. **Test Root Endpoint:**
   ```bash
   curl https://pure-tasks-backend.vercel.app/
   ```
   Should return: `{"name": "Pure Tasks API", "version": "2.0.0", ...}`

3. **Test CORS:**
   ```bash
   curl -H "Origin: https://your-frontend.vercel.app" /
        -H "Access-Control-Request-Method: GET" /
        -H "Access-Control-Request-Headers: Content-Type,Authorization" /
        -X OPTIONS /
        https://pure-tasks-backend.vercel.app/api/health
   ```
   Should include CORS headers in response.

## Common Issues and Solutions

### Issue 1: 500 Internal Server Error

**Causes:**
- Missing environment variables (especially DATABASE_URL, JWT_SECRET)
- Invalid DATABASE_URL format
- Database connection timeout

**Solution:**
1. Check Vercel logs: `vercel logs pure-tasks-backend --follow`
2. Verify all required environment variables are set
3. Ensure DATABASE_URL includes `?sslmode=require` for Neon
4. Check Neon database is active (not suspended)

### Issue 2: CORS Errors

**Cause:** CORS_ORIGINS doesn't include your frontend URL

**Solution:**
1. Update CORS_ORIGINS in Vercel environment variables
2. Include both localhost and production URLs:
   ```
   http://localhost:3000,https://your-frontend.vercel.app
   ```
3. Redeploy after updating

### Issue 3: Email Validation Error

**Cause:** EMAIL_PROVIDER=console in production

**Solution:**
Set EMAIL_PROVIDER to either:
- `resend` (with RESEND_API_KEY)
- `gmail` (with GMAIL_EMAIL and GMAIL_APP_PASSWORD)

### Issue 4: JWT Secret Too Short

**Cause:** JWT_SECRET less than 32 characters

**Solution:**
Generate a strong secret:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Issue 5: Database Connection Timeout

**Cause:** Neon database cold start or connection pool issues

**Solution:**
- Neon databases auto-suspend after inactivity
- First request after suspension takes longer (cold start)
- Subsequent requests will be fast
- Consider upgrading Neon plan for always-on database

## Vercel Deployment Architecture

```
Request Flow:
1. User → https://pure-tasks-backend.vercel.app/api/health
2. Vercel Edge Network → Routes to serverless function
3. api/index.py → Imports FastAPI app from src/main.py
4. FastAPI app → Processes request
5. Response → Returns to user
```

## Important Notes

1. **Serverless Limitations:**
   - No persistent filesystem (uploads won't persist)
   - 10-second execution timeout
   - Cold starts on first request
   - Limited system metrics (disk usage may not work)

2. **File Uploads:**
   - Use Cloudinary for image storage (already configured)
   - Don't rely on local filesystem

3. **Database Connections:**
   - Connection pooling is configured
   - Neon handles serverless connections well
   - First request may be slow (cold start)

4. **Logs:**
   - View logs: `vercel logs pure-tasks-backend`
   - Or in Vercel Dashboard → Deployments → View Function Logs

## Testing Checklist

After deployment, test these endpoints:

- [ ] `GET /` - Root endpoint
- [ ] `GET /api/health` - Health check
- [ ] `GET /api/health/live` - Liveness probe
- [ ] `GET /api/health/ready` - Readiness probe
- [ ] `POST /api/auth/signup` - User registration
- [ ] `POST /api/auth/signin` - User login
- [ ] `GET /api/tasks` - Get tasks (with auth token)

## Monitoring

Monitor your deployment:
1. Vercel Dashboard → Analytics
2. Vercel Dashboard → Logs
3. Health endpoint: `/api/health`
4. Metrics endpoint: `/api/metrics`

## Support

If issues persist:
1. Check Vercel logs: `vercel logs pure-tasks-backend --follow`
2. Verify environment variables are set correctly
3. Test database connection from local environment
4. Check Neon database status

## Quick Reference

- **Backend URL:** https://pure-tasks-backend.vercel.app
- **Health Check:** https://pure-tasks-backend.vercel.app/api/health
- **API Docs:** Not available in production (security)
- **Vercel CLI:** `npm i -g vercel`
- **View Logs:** `vercel logs pure-tasks-backend`
