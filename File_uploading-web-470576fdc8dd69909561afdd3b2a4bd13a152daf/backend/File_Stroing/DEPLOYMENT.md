# Backend Deployment Guide - Railway

## 🚀 Quick Deployment Steps

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Navigate to Backend Directory
```bash
cd backend/File_Stroing
```

### 4. Initialize Railway Project
```bash
railway init
```
- Choose: "Empty Project"
- Name: "filehub-backend" (or your preferred name)

### 5. Add MySQL Database
```bash
railway add mysql
```

### 6. Set Environment Variables
```bash
railway variables set SPRING_PROFILES_ACTIVE=production
railway variables set FRONTEND_URL=https://filehuub.netlify.app
```

### 7. Deploy Backend
```bash
railway up
```

### 8. Get Your Live URL
```bash
railway domain
```

## 🔧 Environment Variables Set Automatically by Railway:
- `DATABASE_URL` - MySQL connection string
- `PORT` - Server port (usually 8080)

## 🌐 Your Backend Will Be Live At:
- `https://your-project-name.railway.app`

## 📝 Update Frontend API URL:
After deployment, update your frontend to use the new backend URL:
```javascript
const API_BASE_URL = 'https://your-project-name.railway.app';
```

## 🔍 Troubleshooting:
- Check logs: `railway logs`
- Check variables: `railway variables`
- Redeploy: `railway up --detach`

## 💰 Railway Free Tier:
- $5 free credit monthly
- Free MySQL database included
- Automatic SSL certificates
- Custom domains available
