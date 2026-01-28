# ⚡ Quick Deployment Reference

## 🎯 3-Step Deployment

### Step 1: Push to GitHub ✅ (Already Done)
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

### Step 2: Deploy Backend on Render 🚀

**Go to**: https://render.com

1. **Sign up/Login** (use GitHub account)
2. Click **"New +"** → **"Web Service"**
3. Connect repo: **`nileshbhai124/ai-resume-builder`**
4. Render auto-detects `render.yaml` ✅
5. **Add Environment Variables**:
   ```
   JWT_SECRET = resume-builder-secret-key-2024-secure
   USE_FILE_DB = true
   NODE_ENV = production
   ```
6. Click **"Create Web Service"**
7. Wait 2-3 minutes ⏳
8. **Copy your URL**: `https://ai-resume-backend.onrender.com`

---

### Step 3: Update Frontend & Deploy to Vercel 🎨

#### 3a. Update Backend URL
Edit `public/config.js` line 6:
```javascript
: 'https://YOUR-BACKEND-NAME.onrender.com';  // ← Paste your Render URL here
```

#### 3b. Push Changes
```bash
git add public/config.js
git commit -m "Update backend URL"
git push origin main
```

#### 3c. Deploy to Vercel
```bash
vercel --prod
```

---

## ✅ Test Everything

### Test Backend:
```bash
curl https://YOUR-BACKEND.onrender.com/api/test
```
Expected: `{"message":"Server is working",...}`

### Test Frontend:
1. Open your Vercel URL
2. Click "Get Started" → "Login"
3. Register new account
4. Login should work ✅

---

## 🔧 If Something Goes Wrong

### 404 on API calls?
- Check Render dashboard - is service running?
- Check `public/config.js` - correct URL?
- Clear browser cache: `Ctrl+Shift+R`

### CORS errors?
- Already fixed in backend
- Check Render logs for errors

### Slow first request?
- Normal! Render free tier sleeps after 15min
- First request takes 30-60 seconds
- Subsequent requests are fast

---

## 📱 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Render Dashboard | https://dashboard.render.com | Manage backend |
| Vercel Dashboard | https://vercel.com/dashboard | Manage frontend |
| GitHub Repo | https://github.com/nileshbhai124/ai-resume-builder | Source code |

---

## 💡 Pro Tips

1. **Bookmark your Render backend URL** - you'll need it
2. **Check Render logs** if something breaks
3. **Free tier sleeps** - first request is slow, that's normal
4. **Always test locally first**: `node server.js`

---

## 🎉 Done!

Your app is now live:
- ✅ Backend on Render (free)
- ✅ Frontend on Vercel (free)
- ✅ Total cost: **$0/month**

---

**Need detailed help?** Read `RENDER_DEPLOYMENT_GUIDE.md`
