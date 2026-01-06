# 🚀 Deployment Guide

This guide provides step-by-step instructions for deploying your portfolio to various hosting platforms.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you've completed these steps:

- [ ] **Optimize Images**: Compress your headshot image (currently 12MB - should be < 500KB)
- [ ] **Test Locally**: Verify all features work in a local server
- [ ] **Update URLs**: Replace placeholder URLs in meta tags with your actual domain
- [ ] **Check Links**: Ensure all project links and social media URLs are correct
- [ ] **Test Dark Mode**: Verify theme persistence works correctly
- [ ] **Validate HTML**: Use [W3C Validator](https://validator.w3.org/)
- [ ] **Check Accessibility**: Test with screen readers and keyboard navigation
- [ ] **Browser Testing**: Test on Chrome, Firefox, Safari, and Edge

## 🖼️ Image Optimization (IMPORTANT)

Your current headshot is **12MB**, which will significantly impact load times. Here's how to optimize:

### Option 1: Using Online Tools
1. Visit [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
2. Upload `New headshot 2.png`
3. Download the compressed version
4. Replace the original file

**Target size**: Under 500KB (ideally 100-200KB)
**Recommended dimensions**: 500x500px or 800x800px

### Option 2: Using Command Line

```bash
# Install ImageMagick (if not installed)
# On macOS: brew install imagemagick
# On Ubuntu: sudo apt-get install imagemagick

# Resize and compress
convert "New headshot 2.png" -resize 800x800 -quality 85 "New headshot 2.png"
```

### Option 3: Using Modern Formats

Convert to WebP for better compression:
```bash
# Install cwebp
# On macOS: brew install webp

# Convert to WebP
cwebp -q 80 "New headshot 2.png" -o headshot.webp
```

Then update your HTML to use WebP with PNG fallback:
```html
<picture>
  <source srcset="headshot.webp" type="image/webp">
  <img src="New headshot 2.png" alt="Professional headshot of Nkeng Sama Mokom" class="logo-image">
</picture>
```

## 🌐 Deployment Options

### 1. GitHub Pages (Recommended for Static Sites)

#### Method A: Via GitHub Website

1. **Create a Repository**
   - Go to [GitHub](https://github.com/new)
   - Name: `portfolio` (or any name)
   - Make it public
   - Don't initialize with README (you already have one)

2. **Push Your Code**
   ```bash
   cd /path/to/your/portfolio
   git init
   git add .
   git commit -m "Initial commit: Portfolio website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings**
   - Scroll to **Pages** section
   - Under "Source", select **main** branch
   - Click **Save**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/portfolio/`

4. **Update URLs in Your Code**
   - In `index.html`, replace all instances of:
     - `https://sama-mokom.github.io/portfolio` with
     - `https://YOUR_USERNAME.github.io/portfolio`
   - In `sitemap.xml`, update the URLs
   - In `robots.txt`, update the Sitemap URL

5. **Wait for Deployment**
   - GitHub Pages usually takes 1-5 minutes to deploy
   - Visit your URL to verify

#### Method B: Using GitHub CLI

```bash
# Install GitHub CLI
# Visit: https://cli.github.com/

# Authenticate
gh auth login

# Create and push repository
gh repo create portfolio --public --source=. --remote=origin --push

# Enable Pages
gh api repos/:owner/portfolio/pages -X POST -f source[branch]=main
```

---

### 2. Netlify (Great for Continuous Deployment)

#### Method A: Drag and Drop

1. Visit [Netlify](https://www.netlify.com/)
2. Sign up or log in
3. Go to **Sites**
4. Drag your entire project folder onto the deploy area
5. Wait for deployment (usually < 1 minute)
6. Your site gets a random URL like `random-name-123.netlify.app`

#### Method B: Git Integration

1. Push your code to GitHub (see GitHub Pages steps)
2. Visit [Netlify](https://app.netlify.com/)
3. Click **Add new site** → **Import an existing project**
4. Connect to GitHub
5. Select your repository
6. Configure settings:
   - Build command: (leave empty)
   - Publish directory: (leave empty or `.`)
7. Click **Deploy site**

**Benefits**:
- Automatic deployments on every push
- Free SSL certificate
- Custom domain support
- Deploy previews for pull requests

#### Custom Domain on Netlify

1. In Netlify dashboard, go to **Domain settings**
2. Click **Add custom domain**
3. Follow DNS configuration instructions
4. SSL certificate is automatic and free

---

### 3. Vercel (Modern, Fast Deployments)

#### Method A: Import from Git

1. Visit [Vercel](https://vercel.com/)
2. Sign up with GitHub
3. Click **New Project**
4. Import your repository
5. Configure:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
6. Click **Deploy**

#### Method B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to your project
cd /path/to/portfolio

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Scope: your account
# - Link to existing project? No
# - Project name: portfolio
# - Directory: ./
# - Override settings? No

# For production deployment
vercel --prod
```

---

### 4. Cloudflare Pages

1. Visit [Cloudflare Pages](https://pages.cloudflare.com/)
2. Sign up or log in
3. Click **Create a project**
4. Connect to GitHub
5. Select your repository
6. Configure:
   - Build command: (leave empty)
   - Build output directory: `.`
7. Click **Save and Deploy**

**Benefits**:
- Excellent global CDN
- Unlimited bandwidth
- Fast deployments
- Free SSL

---

### 5. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
cd /path/to/portfolio
firebase init hosting

# Configure:
# - Create new project or select existing
# - Public directory: .
# - Configure as single-page app? No
# - Set up automatic builds? No
# - Overwrite index.html? No

# Deploy
firebase deploy --only hosting
```

---

## 🔒 Post-Deployment

### 1. Verify Deployment

- [ ] Visit your live URL
- [ ] Test all navigation links
- [ ] Verify projects open in new tabs
- [ ] Test dark mode toggle
- [ ] Check responsive design on mobile
- [ ] Test download CV button
- [ ] Verify social media links

### 2. Test Performance

Run these tests on your deployed site:

1. **Google Lighthouse**
   - Open Chrome DevTools (F12)
   - Go to **Lighthouse** tab
   - Run audit for all categories
   - Target scores: 90+ for all

2. **PageSpeed Insights**
   - Visit [PageSpeed Insights](https://pagespeed.web.dev/)
   - Enter your URL
   - Check both mobile and desktop scores

3. **WebPageTest**
   - Visit [WebPageTest](https://www.webpagetest.org/)
   - Test from multiple locations

### 3. SEO Verification

1. **Google Search Console**
   - Visit [Search Console](https://search.google.com/search-console)
   - Add your property
   - Submit sitemap: `https://your-domain.com/sitemap.xml`
   - Verify ownership

2. **Rich Results Test**
   - Visit [Rich Results Test](https://search.google.com/test/rich-results)
   - Test your URL
   - Verify structured data is recognized

3. **Open Graph Checker**
   - Visit [OpenGraph.xyz](https://www.opengraph.xyz/)
   - Enter your URL
   - Verify social media preview looks good

### 4. Analytics (Optional)

Add Google Analytics for visitor tracking:

```html
<!-- Add before closing </head> tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔄 Continuous Deployment

Once connected to Git (GitHub, GitLab, Bitbucket):

1. Make changes locally
2. Test thoroughly
3. Commit changes:
   ```bash
   git add .
   git commit -m "Update: brief description"
   git push origin main
   ```
4. Your hosting platform automatically deploys

---

## 🆘 Troubleshooting

### Images Not Loading
- Check file paths are relative (no leading `/`)
- Verify image files are committed to Git
- Check case sensitivity (GitHub is case-sensitive)

### CSS/JS Not Loading
- Verify paths in `index.html`
- Check browser console for errors
- Clear browser cache (Ctrl+Shift+R)

### Dark Mode Not Persisting
- Check browser localStorage is enabled
- Verify `script.js` is loading
- Check browser console for errors

### 404 Errors on GitHub Pages
- Ensure repository name matches URL
- Check GitHub Pages settings are correct
- Wait 5 minutes after enabling Pages

### Slow Load Times
- Optimize images (see Image Optimization section)
- Check Lighthouse report
- Consider using WebP format
- Enable CDN caching

---

## 📊 Monitoring

After deployment, monitor your site:

1. **Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com/) - Free monitoring
   - Get alerts if site goes down

2. **Performance Monitoring**
   - [SpeedCurve](https://speedcurve.com/)
   - [Calibre](https://calibreapp.com/)

3. **Error Tracking**
   - Browser console for client-side errors
   - Check hosting platform logs

---

## 🎯 Next Steps

After successful deployment:

1. Share your portfolio on social media
2. Add URL to your resume
3. Include in LinkedIn profile
4. Submit to developer communities
5. Update regularly with new projects

---

## 📞 Support

If you encounter issues:

- **GitHub Pages**: [Documentation](https://docs.github.com/en/pages)
- **Netlify**: [Support Docs](https://docs.netlify.com/)
- **Vercel**: [Documentation](https://vercel.com/docs)
- **Community**: [Stack Overflow](https://stackoverflow.com/)

---

**Good luck with your deployment! 🚀**

*Last updated: December 2024*
