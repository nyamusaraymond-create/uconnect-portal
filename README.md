UConnect Portal — Static (clean) deployment package
===============================================

What this package contains
- index.html  — Main static page (login + admin user management)
- styles.css  — Simple blue & white theme
- script.js   — Client-side logic (localStorage-backed users, invite links)
- README.md   — This file

Design choices
- Clean start: no demo users included (you requested a clean version)
- Logo text: stylized as **U•Connect** in the header
- No "Forgot Password" button included (per your request)
- Users are stored in browser localStorage (demo). For production you should replace client-side storage with a secure server + database, hashed passwords, and proper authentication flows.

How to deploy to Vercel (recommended)
1. Create a new GitHub repository and push these files.
   - git init
   - git add .
   - git commit -m "Initial UConnect Portal static site"
   - push to GitHub
2. Sign in to Vercel (https://vercel.com) and click "New Project" → Import Git Repository → select your repo.
3. Vercel will detect a static site; hit Deploy. You'll get a URL like https://uconnect-portal.vercel.app
4. In Vercel settings you can set a custom name (uconnect-portal) to get the exact URL above (if available).

Alternate: Deploy to Netlify (drag & drop)
- Go to https://app.netlify.com/drop and drop the folder contents. Netlify will provide a live link quickly.

Production checklist (next steps)
- Implement server-side auth (Node/Express, Django, etc.). Store passwords hashed (bcrypt).
- Create single-use invite tokens stored server-side and delivered via email.
- Use HTTPS, secure cookies, and set up CORS and rate limiting.
- Connect role-based dashboards and real data sources (universities, agents, applications).

If you want, I can also:
- Create a GitHub repo and push these files for you (if you grant access details), or
- Walk you through the Vercel import step-by-step and watch the deployment together.
