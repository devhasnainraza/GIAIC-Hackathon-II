# CRITICAL FIX: Vercel Root Directory Configuration

## Problem Identified

Aapka backend **500 error** de raha hai kyunki **Vercel ko pata nahi hai ke backend code kahan hai**.

Error: `X-Vercel-Error: FUNCTION_INVOCATION_FAILED`

## Root Cause

Aapki repository structure:
```
E:/Hackathon_II/
├── Phase_I/
└── Phase_II/
    └── backend/          ← Backend code yahan hai
        ├── src/
        ├── api/
        ├── requirements.txt
        └── vercel.json
```

**Problem:** Vercel repository ke root (`E:/Hackathon_II/`) se deploy kar raha hai, lekin backend code `Phase_II/backend/` mein hai.

## SOLUTION: Root Directory Set Karo

### Step 1: Vercel Dashboard Mein Jao

1. Open: https://vercel.com/dashboard
2. Select project: **pure-tasks-backend**
3. Click: **Settings** tab

### Step 2: Root Directory Change Karo

1. Left sidebar mein **General** section mein jao
2. **Root Directory** setting dhundo
3. **Edit** button click karo
4. Enter karo: `Phase_II/backend`
5. **Save** click karo

**Screenshot reference:**
```
┌─────────────────────────────────────┐
│ Root Directory                      │
│ ┌─────────────────────────────────┐ │
│ │ Phase_II/backend                │ │ ← Ye enter karo
│ └─────────────────────────────────┘ │
│ [Save]                              │
└─────────────────────────────────────┘
```

### Step 3: Redeploy Trigger Karo

Root directory change karne ke baad automatically redeploy hoga, ya manually trigger karo:

1. **Deployments** tab par jao
2. Latest deployment par **...** click karo
3. **Redeploy** select karo

### Step 4: Environment Variables (MUST SET)

Agar abhi tak environment variables set nahi kiye, to **Settings → Environment Variables** mein jao aur ye add karo:

**REQUIRED:**
```
DATABASE_URL = postgresql://user:pass@host.neon.tech/db?sslmode=require
JWT_SECRET = your-secret-key-minimum-32-characters-long
CORS_ORIGINS = http://localhost:3000,https://your-frontend.vercel.app
ENVIRONMENT = production
FRONTEND_URL = https://your-frontend.vercel.app
EMAIL_PROVIDER = console
FROM_EMAIL = noreply@puretasks.com
```

**Important:** Har variable ke liye **Production, Preview, Development** teeno select karo!

### Step 5: Wait & Test (2-3 minutes)

Deployment complete hone ke baad:

```bash
# Test 1: Root endpoint
curl https://pure-tasks-backend.vercel.app/

# Expected: {"name":"Pure Tasks API","version":"2.0.0",...}

# Test 2: Health check
curl https://pure-tasks-backend.vercel.app/api/health

# Expected: {"status":"healthy",...}
```

## Why This Fixes It

**Before:**
```
Vercel looks at: E:/Hackathon_II/
Can't find: api/index.py (doesn't exist at root)
Result: FUNCTION_INVOCATION_FAILED ❌
```

**After:**
```
Vercel looks at: E:/Hackathon_II/Phase_II/backend/
Finds: api/index.py ✅
Imports: src/main.py (FastAPI app) ✅
Result: Backend works! ✅
```

## Verification Checklist

- [ ] Vercel Dashboard → Settings → General → Root Directory = `Phase_II/backend`
- [ ] Environment variables set (7 required variables)
- [ ] Redeploy triggered
- [ ] Waited 2-3 minutes
- [ ] Tested endpoints
- [ ] Got 200 OK response

## Alternative: Deploy from Backend Directory Only

Agar aap chahte ho ke sirf backend deploy ho (not the whole repo), to:

1. Vercel mein naya project banao
2. Git repository connect karte waqt **Root Directory** set karo: `Phase_II/backend`
3. Deploy karo

## Quick Test Commands

```bash
# Test if backend is working
curl -I https://pure-tasks-backend.vercel.app/

# Should return: HTTP/1.1 200 OK (not 500)

# Test health endpoint
curl https://pure-tasks-backend.vercel.app/api/health

# Should return JSON with "status": "healthy"
```

## Common Mistakes

❌ **Wrong:** Root Directory = `Phase_II` (missing /backend)
❌ **Wrong:** Root Directory = `backend` (missing Phase_II/)
✅ **Correct:** Root Directory = `Phase_II/backend`

## Still Not Working?

1. **Check Vercel Function Logs:**
   - Deployments → Latest → Function Logs
   - Look for import errors or missing dependencies

2. **Verify File Structure:**
   ```bash
   cd E:/Hackathon_II/Phase_II/backend
   ls -la
   # Should see: api/, src/, requirements.txt, vercel.json
   ```

3. **Test Locally:**
   ```bash
   cd E:/Hackathon_II/Phase_II/backend
   uvicorn src.main:app --reload
   # If local works, Vercel should work too
   ```

---

**CRITICAL ACTION:** Vercel Dashboard mein jao aur Root Directory set karo: `Phase_II/backend`

Ye sabse important step hai! Iske bina backend kabhi nahi chalega.
