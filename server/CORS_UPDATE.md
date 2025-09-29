# Backend CORS Update Instructions

## After Deploying Frontend to Vercel

Once you deploy your frontend to Vercel and get your actual domain (e.g., `https://your-app-name.vercel.app`), you need to update your backend's CORS configuration.

### Option 1: Environment Variable (Recommended)
1. In your Render dashboard, go to your backend service
2. Add environment variable:
   - **Name**: `FRONTEND_URL`
   - **Value**: `https://your-actual-vercel-url.vercel.app`
3. Redeploy your backend

### Option 2: Hardcode in server/index.js
Update the CORS origins array to include your actual Vercel URL:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? [
      'https://ai-ten-alpha-19.vercel.app', // Old URL
      'https://ai-assignment-1-ojix.onrender.com', // Backend URL
      'https://your-actual-vercel-url.vercel.app' // Your new frontend URL
    ]
```

### Current CORS Configuration
✅ **Development**: Allows localhost:5173, localhost:3000, localhost:4173
✅ **Production**: Uses FRONTEND_URL environment variable + fallback URLs

### Testing CORS
After updating:
1. Deploy your frontend to Vercel
2. Update backend CORS with your Vercel URL
3. Test that API calls work from your deployed frontend
4. Check browser console for any CORS errors