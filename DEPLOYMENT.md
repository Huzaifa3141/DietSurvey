# 🚀 GitHub Pages Deployment Guide for Diet Survey Website

## 📋 **Prerequisites**
- Your React app is built (`npm run build` completed)
- You need a GitHub account (free)
- Your backend server is ready for production

## 🌟 **GitHub Pages Deployment (Recommended - Free)**

### **Step 1: Create GitHub Account**
1. **Go to [github.com](https://github.com)**
2. **Click "Sign up"**
3. **Enter your email, create password, choose username**
4. **Verify your email** (check your inbox)

### **Step 2: Create New Repository**
1. **After signing in, click the "+" icon** (top right)
2. **Select "New repository"**
3. **Repository name**: `diet-survey` (or whatever you prefer)
4. **Make it Public** (required for free GitHub Pages)
5. **Don't initialize with README** (we'll push existing code)
6. **Click "Create repository"**

### **Step 3: Push Your Code to GitHub**

Once you have your repository, run these commands in your project folder:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit: Diet Survey with dark mode"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/diet-survey.git

# Push to GitHub
git push -u origin main
```

### **Step 4: Enable GitHub Pages**
1. **Go to your repository on GitHub**
2. **Click "Settings" tab**
3. **Scroll down to "Pages" section** (left sidebar)
4. **Under "Source", select "Deploy from a branch"**
5. **Choose "main" branch** and `/ (root)` folder
6. **Click "Save"**

### **Step 5: Configure for GitHub Pages**

Your `package.json` already has the necessary configuration:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/diet-survey",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

**Important**: Replace `YOUR_USERNAME` with your actual GitHub username!

### **Step 6: Deploy to GitHub Pages**

```bash
# Install gh-pages dependency
npm install gh-pages --save-dev

# Deploy to GitHub Pages
npm run deploy
```

### **Step 7: Get Your URL**
- **Your site will be available at**: `https://YOUR_USERNAME.github.io/diet-survey`
- **It may take a few minutes to become active**

---

## 🔧 **Backend Deployment Options**

### **Option A: Railway (Free Tier)**
1. **Go to [railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Deploy your Node.js backend**
4. **Get a production URL**

### **Option B: Render (Free Tier)**
1. **Go to [render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your backend repository**
4. **Deploy with auto-scaling**

### **Option C: Heroku (Paid)**
1. **Go to [heroku.com](https://heroku.com)**
2. **Create a new app**
3. **Connect your repository**
4. **Deploy with `git push heroku main`**

---

## ⚙️ **Configuration Updates**

### **Update Backend URL**
After deploying your backend, update `client/src/config.ts`:

```typescript
production: {
  apiUrl: 'https://your-actual-backend-url.com', // Update this!
},
```

### **Update Homepage in package.json**
Make sure to update the homepage field with your actual GitHub username:

```json
"homepage": "https://YOUR_ACTUAL_USERNAME.github.io/diet-survey"
```

### **Rebuild and Redeploy**
```bash
npm run build
npm run deploy
```

---

## 🌍 **Custom Domain Setup (Optional)**

### **GitHub Pages Custom Domain**
1. **Go to your repository Settings > Pages**
2. **Under "Custom domain", enter your domain**
3. **Create a CNAME file** in your repository root:
   ```
   yourdomain.com
   ```
4. **Update DNS records** (CNAME to `YOUR_USERNAME.github.io`)

---

## 📱 **Testing Your Deployment**

### **Frontend Test**
1. **Visit your GitHub Pages URL**
2. **Test the survey form**
3. **Test dark/light mode toggle**
4. **Test admin view**

### **Backend Test**
1. **Test API endpoints**
2. **Verify database connections**
3. **Check CORS settings**

---

## 🚨 **Common Issues & Solutions**

### **CORS Errors**
Add to your backend:
```typescript
app.use(cors({
  origin: ['https://YOUR_USERNAME.github.io', 'http://localhost:3000']
}));
```

### **Environment Variables**
Create `.env` file in backend:
```env
DATABASE_URL="your-production-database-url"
PORT=5000
NODE_ENV=production
```

### **Build Errors**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **GitHub Pages Not Working**
1. **Check repository is public**
2. **Verify Pages source is set to main branch**
3. **Wait 5-10 minutes for deployment**
4. **Check Actions tab for deployment status**

---

## 💰 **Cost Breakdown**

### **Free Tier Options**
- **GitHub Pages**: Free hosting, custom domains
- **Railway**: Free backend hosting
- **Render**: Free backend hosting

### **Paid Options**
- **Custom Domain**: ~$10-15/year
- **Premium Hosting**: $20-50/month
- **Database**: $5-20/month

---

## 🎯 **Recommended Setup**

### **For Students/Personal Use**
1. **Frontend**: GitHub Pages (Free)
2. **Backend**: Railway (Free)
3. **Database**: SQLite (Free) or PostgreSQL on Railway
4. **Total Cost**: $0/month

### **For Professional Use**
1. **Frontend**: GitHub Pages (Free)
2. **Backend**: Railway Pro ($20/month)
3. **Database**: PostgreSQL on Railway
4. **Custom Domain**: $10-15/year
5. **Total Cost**: ~$30/month

---

## 📞 **Need Help?**

### **GitHub Support**
- [GitHub Pages Documentation](https://pages.github.com/)
- [GitHub Community](https://github.com/orgs/community/discussions)

### **Railway Support**
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

---

## 🎉 **You're Ready to Deploy!**

Your survey website is now production-ready with:
- ✅ Responsive design
- ✅ Dark/light mode
- ✅ Production build
- ✅ GitHub Pages configuration
- ✅ Deployment guide

**Create your GitHub account and deploy!** 🚀

---

## 📝 **Quick Deployment Checklist**

- [ ] Create GitHub account
- [ ] Create new repository
- [ ] Update `package.json` homepage field
- [ ] Push code to GitHub
- [ ] Enable GitHub Pages
- [ ] Install gh-pages dependency
- [ ] Run `npm run deploy`
- [ ] Test your live website
- [ ] Deploy backend (Railway/Render)
- [ ] Update backend URL in config
- [ ] Redeploy frontend
