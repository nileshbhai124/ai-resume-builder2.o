@echo off
echo ========================================
echo   GitHub Push Script
echo   AI Resume Builder
echo ========================================
echo.

echo Step 1: Checking git status...
echo.
git status
echo.

echo Step 2: Adding all files...
git add .
echo Files added successfully!
echo.

echo Step 3: Creating commit...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=feat: Add UI/UX improvements, color selector, and Vercel API endpoints

git commit -m "%commit_msg%"
echo.

echo Step 4: Pushing to GitHub...
echo.
git push
echo.

if errorlevel 1 (
    echo.
    echo ⚠️  Push failed! Trying alternative method...
    echo.
    git push origin main
    
    if errorlevel 1 (
        echo.
        echo ❌ Push failed again!
        echo.
        echo Possible solutions:
        echo 1. Check internet connection
        echo 2. Verify GitHub credentials
        echo 3. Check remote URL: git remote -v
        echo 4. Try: git pull origin main --rebase
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   ✅ Push Successful!
echo ========================================
echo.
echo Your code is now on GitHub!
echo.
echo Next steps:
echo 1. Visit your GitHub repository
echo 2. Verify files are uploaded
echo 3. Deploy to Vercel: vercel --prod
echo 4. Test live site
echo.
echo GitHub URL: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
echo.
pause
