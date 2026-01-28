# 🍃 MongoDB Atlas Setup Guide

## Step 1: Create Free MongoDB Atlas Account
1. Visit: https://www.mongodb.com/atlas
2. Click "Try Free" 
3. Sign up with email
4. Choose "Free Shared" cluster (M0 - Free forever)

## Step 2: Create Database
1. After login, click "Build a Database"
2. Choose "M0 FREE" cluster
3. Select region (closest to you)
4. Cluster name: "ResumeCluster"
5. Click "Create Cluster"

## Step 3: Create Database User
1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Username: `resumeuser`
4. Password: `resumepass123` (or generate strong password)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"

## Step 4: Setup Network Access
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

## Example Connection String:
```
mongodb+srv://resumeuser:<password>@resumecluster.xxxxx.mongodb.net/resumebuilder?retryWrites=true&w=majority
```

## Step 6: Update .env File
Replace the MONGODB_URI in your .env file with the connection string from Atlas.