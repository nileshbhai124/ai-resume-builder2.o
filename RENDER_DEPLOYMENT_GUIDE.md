# 🚀 Deploy Express Backend to Render (Free Tier)

## Why Separate Backend Deployment?

Vercel is designed for **static sites and serverless functions**, not long-running Express servers. Your backend has:
- Express routes (`/api/auth/login`, `/api/resume/*`)
- Middleware and models
- File-based database

**Solution**: Deploy backend on Render (free tier) and connect frontend to it.

---

## 📋 Step 1: Prepare for Render Deployment

### 1.1 Create `render.yaml` (Already Created)
This file tells Render how to deploy your backend.

### 1.2 Update Environment Variables
Your backend will use these environment variables on Render:
- `PORT` - Automatically set by Render
- `JWT_SECRET` - Your secret key
- `USE_FILE_DB` - Set to `true` for file-based storage
- `NODE_ENV` - Set to `production`

---

## 🌐 Step 2: Deploy to Render

### Option A: Deploy via GitHub (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare backend for Render deployment"
   git push origin main
   ```

2. **Go to Render Dashboard**:
   - Visit: https://render.com
   - Sign up/Login (use GitHub account for easy integration)

3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `nileshbhai124/ai-resume-builder`
   - Render will auto-detect the `render.yaml` configuration

4. **Configure the Service**:
   - **Name**: `ai-resume-backend` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

5. **Add Environment Variables**:
   Click "Environment" tab and add:
   ```
   JWT_SECRET=resume-builder-secret-key-2024-secure
   USE_FILE_DB=true
   NODE_ENV=production
   ```

6. **Deploy**:
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - You'll get a URL like: `https://ai-resume-backend.onrender.com`

### Option B: Deploy via Render CLI

```bash
# Install Render CLI
npm install -g render-cli

# Login to Render
render login

# Deploy
render deploy
```

---

## 🔗 Step 3: Get Your Backend URL

After deployment completes, Render will provide a URL:
```
https://ai-resume-backend.onrender.com
```

**Test your backend**:
```bash
curl https://ai-resume-backend.onrender.com/api/test
```

Expected response:
```json
{
  "message": "Server is working",
  "timestamp": "2024-01-28T...",
  "version": "2.0"
}
```

---

## 🎨 Step 4: Update Frontend to Use Backend URL

### 4.1 Create Environment Configuration

I've already created `public/config.js` with:
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000'
  : 'https://ai-resume-backend.onrender.com';
```

### 4.2 Update Your Backend URL

**Edit `public/config.js`** and replace with your actual Render URL:
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000'
  : 'https://YOUR-BACKEND-NAME.onrender.com';  // ← Update this
```

### 4.3 Frontend Already Updated

All API calls in `public/unified-app.js` now use `API_BASE_URL`:
- ✅ `/api/auth/login` → `${API_BASE_URL}/api/auth/login`
- ✅ `/api/auth/register` → `${API_BASE_URL}/api/auth/register`
- ✅ All other API endpoints updated

---

## 🚀 Step 5: Deploy Frontend to Vercel

```bash
# Deploy to Vercel
vercel --prod
```

Or use the Vercel dashboard:
1. Go to https://vercel.com
2. Import your GitHub repository
3. Deploy

---

## ✅ Step 6: Test Everything

### Test Backend (Render):
```bash
# Test endpoint
curl https://YOUR-BACKEND.onrender.com/api/test

# Test login (should return error for invalid credentials)
curl -X POST https://YOUR-BACKEND.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

### Test Frontend (Vercel):
1. Open your Vercel URL
2. Click "Get Started" → "Login"
3. Try registering a new account
4. Login should work without 404 errors

---

## 🔧 Troubleshooting

### Issue: Backend returns 404
**Solution**: Check that your Render service is running:
- Go to Render dashboard
- Check "Logs" tab for errors
- Ensure environment variables are set

### Issue: CORS errors
**Solution**: Backend already has CORS enabled in `server.js`:
```javascript
app.use(cors());
```

If you need specific origins:
```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3000']
}));
```

### Issue: Render free tier sleeps after 15 minutes
**Solution**: 
- First request after sleep takes 30-60 seconds (cold start)
- Upgrade to paid tier ($7/month) for always-on
- Or use a service like UptimeRobot to ping your backend every 10 minutes

---

## 💰 Cost Breakdown

| Service | Plan | Cost | Features |
|---------|------|------|----------|
| Render | Free | $0 | 750 hours/month, sleeps after 15min inactivity |
| Vercel | Free | $0 | Unlimited bandwidth, 100GB/month |
| **Total** | | **$0** | Fully functional app |

---

## 🎯 Summary

1. ✅ Backend deployed on Render: `https://YOUR-BACKEND.onrender.com`
2. ✅ Frontend deployed on Vercel: `https://YOUR-APP.vercel.app`
3. ✅ Frontend configured to call backend API
4. ✅ Login, register, and all features working

---

## 📝 Quick Commands

```bash
# Push to GitHub
git add .
git commit -m "Deploy backend to Render"
git push origin main

# Deploy frontend to Vercel
vercel --prod

# Test backend
curl https://YOUR-BACKEND.onrender.com/api/test
```

---

## 🔗 Useful Links

- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs
- Vercel Dashboard: https://vercel.com/dashboard
- Your GitHub Repo: https://github.com/nileshbhai124/ai-resume-builder

---

**Need Help?** Check Render logs in the dashboard or contact support.
