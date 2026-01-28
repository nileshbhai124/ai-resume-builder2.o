@echo off
echo ========================================
echo   Deploy Backend to Render
echo ========================================
echo.

echo Step 1: Checking Git status...
git status
echo.

echo Step 2: Adding all changes...
git add .
echo.

echo Step 3: Committing changes...
git commit -m "Prepare backend for Render deployment with API config"
echo.

echo Step 4: Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo   Git Push Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Go to https://render.com and sign up/login
echo 2. Click "New +" and select "Web Service"
echo 3. Connect your GitHub repo: nileshbhai124/ai-resume-builder
echo 4. Render will auto-detect render.yaml configuration
echo 5. Add environment variables:
echo    - JWT_SECRET=resume-builder-secret-key-2024-secure
echo    - USE_FILE_DB=true
echo    - NODE_ENV=production
echo 6. Click "Create Web Service"
echo 7. Wait 2-3 minutes for deployment
echo 8. Copy your backend URL (e.g., https://ai-resume-backend.onrender.com)
echo 9. Update public/config.js with your backend URL
echo 10. Run: vercel --prod (to deploy frontend)
echo.
echo ========================================
echo   Read RENDER_DEPLOYMENT_GUIDE.md for detailed instructions
echo ========================================
echo.
pause
