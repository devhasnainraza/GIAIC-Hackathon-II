# Quick Fix for 500 Error

## Problem
Backend build successful hai, lekin runtime pe 500 error aa raha hai kyunki **environment variables missing hain**.

## Immediate Solution

### Step 1: Vercel Dashboard Mein Environment Variables Set Karein

1. **Vercel Dashboard open karein:** https://vercel.com/dashboard
2. **Apna backend project select karein** (pure-tasks-backend)
3. **Settings → Environment Variables** par jao

### Step 2: Ye Variables Add Karein (Copy-Paste Ready)

**CRITICAL - Ye variables MUST set karein:**

```bash
# Variable Name: DATABASE_URL
# Value: (Apna Neon database URL paste karein)
postgresql://username:password@ep-xxx.neon.tech/database?sslmode=require

# Variable Name: JWT_SECRET
# Value: (32+ characters ka random string)
your-super-secret-jwt-key-minimum-32-characters-long-please

# Variable Name: CORS_ORIGINS
# Value: (Apna frontend URL add karein)
http://localhost:3000,https://your-frontend-app.vercel.app

# Variable Name: ENVIRONMENT
# Value:
production

# Variable Name: FRONTEND_URL
# Value: (Apna frontend URL)
https://your-frontend-app.vercel.app

# Variable Name: EMAIL_PROVIDER
# Value:
console

# Variable Name: FROM_EMAIL
# Value:
noreply@puretasks.com
```

**Important:** Har variable ke liye **Production, Preview, Development** teeno select karein!

### Step 3: Redeploy Karein

Environment variables add karne ke baad:

**Option A: Vercel Dashboard se**
1. Deployments tab par jao
2. Latest deployment par **...** (three dots) click karein
3. **Redeploy** select karein

**Option B: Git Push se**
```bash
cd E:/Hackathon_II/Phase_II/backend
git commit --allow-empty -m "Trigger redeploy"
git push origin 004-ui-ux-branding
```

### Step 4: Wait & Test (2-3 minutes)

Deployment complete hone ke baad test karein:

```bash
# Test 1: Health check
curl https://pure-tasks-backend.vercel.app/api/health

# Test 2: Root endpoint
curl https://pure-tasks-backend.vercel.app/

# Expected Response:
# {"name":"Pure Tasks API","version":"2.0.0","status":"running"}
```

## Why 500 Error?

Aapka code sahi hai, build bhi successful hai, lekin:

1. **FastAPI app start hote waqt** `settings = Settings()` run hota hai
2. **Settings class** environment variables read karta hai (DATABASE_URL, JWT_SECRET, etc.)
3. **Agar variables missing hain**, app crash ho jata hai → 500 error
4. **Vercel logs mein** actual error message hoga

## How to Check Actual Error

Vercel Dashboard mein:
1. **Deployments** tab par jao
2. Latest deployment click karein
3. **Function Logs** tab dekho
4. Wahan actual error message dikhega (probably "DATABASE_URL is required")

## Quick Checklist

- [ ] Vercel Dashboard → Settings → Environment Variables
- [ ] DATABASE_URL set kiya (Neon database URL)
- [ ] JWT_SECRET set kiya (32+ characters)
- [ ] CORS_ORIGINS set kiya (frontend URL included)
- [ ] ENVIRONMENT=production set kiya
- [ ] Teeno environments (Production, Preview, Development) select kiye
- [ ] Redeploy trigger kiya
- [ ] 2-3 minutes wait kiya
- [ ] Health endpoint test kiya

## Still Not Working?

Agar phir bhi 500 error aaye:

1. **Check Function Logs:**
   - Vercel Dashboard → Deployments → Latest → Function Logs
   - Actual error message wahan dikhega

2. **Verify Database:**
   - Neon dashboard mein jao
   - Database active hai? (not suspended)
   - Connection string copy karke test karo

3. **Test Locally:**
   ```bash
   cd E:/Hackathon_II/Phase_II/backend
   # Set environment variables in .env file
   uvicorn src.main:app --reload
   # Agar local pe chal raha hai, to Vercel pe bhi chalega
   ```

## Next Steps

1. **Abhi:** Environment variables set karo Vercel mein
2. **Wait:** 2-3 minutes for redeployment
3. **Test:** Health endpoint check karo
4. **Success:** Backend working ho jayega!

---

**Note:** Build successful hai matlab code sahi hai. Sirf environment variables ki zaroorat hai!
