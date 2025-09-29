# Deployment Guide for Vercel

## Prerequisites
1. Make sure you have a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Have your backend API deployed and get its URL

## Steps to Deploy

### 1. Update Environment Variables
Before deploying, update `.env.production` with your actual backend API URL:
```
VITE_API_BASE_URL=https://your-actual-backend-url.com
```

**Note**: For development, the app automatically uses `http://localhost:9000` as configured in `src/config/api.js`

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Login to Vercel
vercel login

# Deploy (from project root directory)
vercel

# For production deployment
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. Add environment variables in the dashboard:
   - `VITE_API_BASE_URL` = your backend URL
6. Click "Deploy"

### 3. Environment Variables in Vercel Dashboard
Add these environment variables in your Vercel project settings:
- **Variable Name**: `VITE_API_BASE_URL`
- **Value**: `https://your-backend-api-url.com`
- **Environment**: Production

### 4. Backend Considerations
Make sure your backend:
1. Is deployed and accessible via HTTPS
2. Has CORS configured to allow your Vercel domain
3. Accepts requests from your frontend domain

### 5. Testing
After deployment:
1. Visit your Vercel URL
2. Test all features (chat, search, conversations)
3. Check browser console for any errors
4. Verify API calls are going to the correct backend URL

## Automatic Deployments
Once connected to GitHub, Vercel will automatically deploy:
- **Production**: when you push to `main` branch  
- **Preview**: for pull requests and other branches

## Common Issues & Solutions

**API calls failing:**
- Check that `VITE_API_BASE_URL` environment variable is set correctly
- Verify backend CORS settings allow your Vercel domain
- Check browser Network tab for actual URLs being called

**Build failures:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify there are no TypeScript/ESLint errors

**Environment variables not working:**
- Make sure they start with `VITE_`
- They must be set in Vercel dashboard for production
- Redeploy after adding environment variables

## File Structure
```
├── vercel.json          # Vercel configuration
├── .env.production      # Production environment variables only
└── src/
    └── config/
        └── api.js       # API config (fallback to localhost:9000 for dev)
```

Your app is now ready for Vercel deployment! 🚀