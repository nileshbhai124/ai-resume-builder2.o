# 🍃 MongoDB Atlas Setup - Step by Step

## Quick Setup (5 Minutes)

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email
3. Verify your email

### Step 2: Create Free Cluster
1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** (Shared cluster)
3. Provider: **AWS** (recommended)
4. Region: Choose closest to you (e.g., Mumbai for India)
5. Cluster Name: **ResumeCluster**
6. Click **"Create"** (takes 3-5 minutes)

### Step 3: Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `resumeuser`
5. Password: `Resume@123` (or auto-generate)
6. Database User Privileges: **"Atlas admin"**
7. Click **"Add User"**

### Step 4: Whitelist IP Address
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **4.1 or later**
6. Copy the connection string

Example:
```
mongodb+srv://resumeuser:<password>@resumecluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Update .env File
Replace `<password>` with your actual password and update .env:

```env
MONGODB_URI=mongodb+srv://resumeuser:Resume@123@resumecluster.xxxxx.mongodb.net/resumebuilder?retryWrites=true&w=majority
USE_FILE_DB=false
```

### Step 7: Restart Server
```bash
# Stop server (Ctrl+C in terminal)
node server.js
```

## ✅ Verification
You should see:
```
✅ MongoDB Atlas connected successfully
📊 Database: MongoDB Atlas (Cloud)
```

## 🔧 Troubleshooting

### Error: "querySrv ENOTFOUND"
- Check internet connection
- Verify connection string is correct
- Ensure IP is whitelisted (0.0.0.0/0)

### Error: "Authentication failed"
- Verify username and password
- Check if user has correct permissions
- Ensure password doesn't have special characters (or URL encode them)

### Error: "Connection timeout"
- Check firewall settings
- Try different network
- Verify cluster is running (not paused)

## 📝 Current Status
Your app works with **file-based database** (local JSON files). MongoDB is optional but recommended for production.