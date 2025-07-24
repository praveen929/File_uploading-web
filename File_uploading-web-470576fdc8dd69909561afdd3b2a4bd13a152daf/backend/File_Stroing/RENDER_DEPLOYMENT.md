# 🚀 Complete Render.com Deployment Guide

## ✅ Your Backend is Ready for Deployment!

### 📋 Pre-requisites Completed:
- ✅ Production configuration added
- ✅ CORS configured for production
- ✅ Dockerfile created
- ✅ Code pushed to GitHub
- ✅ Render configuration ready

---

## 🌐 Deploy on Render.com (100% Free)

### Step 1: Create Render Account
1. Go to https://render.com/
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `praveen929/File_uploading-web`
3. Select the repository
4. Configure deployment:

**Build & Deploy Settings:**
```
Name: filehub-backend
Environment: Docker
Branch: main
Root Directory: backend/File_Stroing
Build Command: ./mvnw clean package -DskipTests
Start Command: java -Dspring.profiles.active=production -jar target/File_Stroing-0.0.1-SNAPSHOT.jar
```

### Step 3: Set Environment Variables
Add these environment variables in Render dashboard:

```
SPRING_PROFILES_ACTIVE=production
DATABASE_URL=mysql://username:password@host:port/database
FRONTEND_URL=https://filehuub.netlify.app
PORT=8080
```

### Step 4: Get Free Database
**Option A: db4free.net**
1. Go to https://db4free.net/signup.php
2. Create database: `filehub_db`
3. Get connection URL: `mysql://username:password@db4free.net:3306/filehub_db`

**Option B: PlanetScale**
1. Go to https://planetscale.com/
2. Create free database
3. Get connection string

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Get your live URL: `https://filehub-backend.onrender.com`

---

## 🔧 Alternative: Railway (If you have credits)

### Quick Railway Deployment:
```bash
# In backend/File_Stroing directory
railway login
railway init
railway add mysql
railway variables set SPRING_PROFILES_ACTIVE=production
railway up
railway domain
```

---

## 📱 After Deployment:

### Update Frontend API URL:
Replace in your React app:
```javascript
const API_BASE_URL = 'https://your-backend-url.onrender.com';
```

### Test Your Backend:
- Visit: `https://your-backend-url.onrender.com/users`
- Should return JSON response

---

## 🎯 Your Backend URL will be:
- **Render**: `https://filehub-backend.onrender.com`
- **Railway**: `https://filehub-backend-production.railway.app`

## 🆓 Free Tier Limits:
- **Render**: 750 hours/month, sleeps after 15min inactivity
- **Railway**: $5 credit/month
- **Database**: Various free options available

---

## 🚀 Ready to Deploy!
Your backend is fully configured and ready for production deployment!
