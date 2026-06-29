# HackBIOS 3.0 - Where Ideas Boot Into Reality

A high-performance, futuristic hackathon website built with React, Vite, GSAP, and Three.js.

## 🚀 Deployment Guide

### Deploying to Netlify
1. **Connect Repository**: Connect your GitHub/GitLab repository to Netlify.
2. **Build Settings**:
    - **Build Command**: `npm run build`
    - **Publish Directory**: `dist`
3. **Configuration**: The `netlify.toml` file in the root directory handles all SPA routing and security headers automatically.

### Deploying to Vercel
1. **Import Project**: Import your repository into Vercel.
2. **Framework Preset**: Select **Vite** (Vercel should detect this automatically).
3. **Build Settings**:
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
4. **Configuration**: The `vercel.json` file handles the necessary rewrites for SPA support.

## 🛠️ Optimizations
- **Code Splitting**: Dependencies like `three.js` and `gsap` are split into separate vendor chunks for faster initial page loads and better browser caching.
- **Minification**: Production builds use optimized minification settings via Vite.
- **SPA Routing**: Configured fallback mechanisms for clean URLs and sub-path refreshes.

## 📦 Tech Stack
- **Frontend**: React 19 + Vite
- **Animations**: GSAP + Lenis (Smooth Scroll)
- **3D Graphics**: Three.js + React Three Fiber
- **Styling**: Tailwind CSS 4.0

## 🛠️ Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
