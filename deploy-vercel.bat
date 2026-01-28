@echo off
echo ========================================
echo   Vercel Deployment Script
echo ========================================
echo.

echo Step 1: Checking files...
node quick-verify.js
if errorlevel 1 (
    echo ERROR: File verification failed!
    pause
    exit /b 1
)
echo.

echo Step 2: Git status...
git status
echo.

echo Step 3: Add all files...
git add .
echo.

echo Step 4: Commit changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update: Fix Vercel API endpoints
git commit -m "%commit_msg%"
echo.

echo Step 5: Push to repository...
git push
echo.

echo Step 6: Deploy to Vercel...
echo.
echo Choose deployment option:
echo 1. Deploy to production (vercel --prod)
echo 2. Deploy to preview (vercel)
echo 3. Skip Vercel deployment
echo.
set /p deploy_option="Enter option (1-3): "

if "%deploy_option%"=="1" (
    echo Deploying to production...
    vercel --prod
) else if "%deploy_option%"=="2" (
    echo Deploying to preview...
    vercel
) else (
    echo Skipping Vercel deployment
)

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Visit your Vercel dashboard
echo 2. Check deployment logs
echo 3. Test API endpoints
echo 4. Test login/register functionality
echo.
pause
