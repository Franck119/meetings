# NexCRM - Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add your Gemini API Key as environment variable:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Then paste your actual Gemini API key when prompted.

5. Redeploy with the environment variable:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Push this code to a GitHub repository

2. Go to [vercel.com](https://vercel.com) and click "New Project"

3. Import your GitHub repository

4. Vercel will auto-detect Vite configuration

5. Add Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your actual Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

6. Click "Deploy"

### Option 3: Deploy via GitHub (Automatic)

1. Create a new repository on GitHub

2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. Connect to Vercel and it will auto-deploy on every push

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the key
4. Add it to Vercel environment variables

## Default Login Credentials

- **Super Admin**
  - Username: `boss`
  - Password: `123`

- **Finance Manager**
  - Username: `jean`
  - Password: `123`

## Project Structure

```
nexcrm-vercel-deploy/
├── components/          # React components
├── services/           # API services (Gemini)
├── App.tsx            # Main app component
├── index.tsx          # Entry point
├── types.ts           # TypeScript types
├── constants.tsx      # App constants
├── package.json       # Dependencies
├── vite.config.ts     # Vite configuration
├── vercel.json        # Vercel configuration
└── index.html         # HTML template
```

## Tech Stack

- React 19.2.4
- TypeScript 5.8.2
- Vite 6.2.0
- Tailwind CSS (via CDN)
- Google Gemini AI
- Recharts

## Support

For issues, check:
- Vercel deployment logs
- Browser console for errors
- Ensure GEMINI_API_KEY is set correctly
