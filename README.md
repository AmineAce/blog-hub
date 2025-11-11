# CompareClash - Performance-Optimized Blog

<div align="center">

![Performance](https://img.shields.io/badge/Performance-95%2B-brightgreen)
![Accessibility](https://img.shields.io/badge/Accessibility-98%2B-brightgreen)
![SEO](https://img.shields.io/badge/SEO-100-brightgreen)
![Bundle](https://img.shields.io/badge/JS%20Bundle-102KB-brightgreen)
![LCP](https://img.shields.io/badge/LCP-1.8s-brightgreen)

**A production-grade, high-performance blog built with Next.js 15, Contentful CMS, and enterprise-level optimizations.**

[Live Demo](https://compareclash.netlify.app) • [Performance Report](#-performance) • [Features](#-features) • [Getting Started](#-quick-start)

</div>

---

## ✨ Key Features

### 🏎️ **Performance Optimized**
- **Bundle Size**: 102KB shared bundle (excellent baseline)
- **Lighthouse Scores**: Performance 95+, Accessibility 98+, SEO 100
- **LCP**: 1.8s (optimized with WebP + LQIP)
- **Static Generation**: Server-side rendering with SSG
- **Image Optimization**: WebP format with automatic optimization

### 🧠 **Content Management**
- **Headless CMS**: Contentful integration for content management
- **Preview Mode**: Live content preview with draft support
- **Static Search**: Client-side search with optimized search index
- **Rich Content**: Support for rich text content and featured images

### 🚀 **Enterprise Monitoring**
- **Error Tracking**: Zero-cost error logging via console + Netlify Function logs
- **Performance Audits**: Lighthouse CI with automated assertions
- **Uptime Monitoring**: UptimeRobot free tier integration
- **Cache Strategy**: Production-grade Netlify cache headers

### 🎯 **SEO & Discoverability**
- **Dynamic Sitemap**: Auto-generated from Contentful CMS
- **Robots.txt**: Intelligent crawling rules
- **Structured Data**: Organization and website schema
- **Meta Tags**: Comprehensive Open Graph and Twitter Cards
- **Analytics**: Google Analytics and Ahrefs integration

### 🛠️ **Developer Experience**
- **TypeScript**: Full type safety
- **Modern Stack**: Next.js 15.5.4, React 19, Tailwind CSS v4
- **Development Tools**: ESLint, TypeScript, bundle analyzer
- **Migration Scripts**: Content import/export utilities

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **pnpm**
- **Contentful Account** (for content management)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AmineAce/blog-hub.git
   cd compare-clash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your Contentful credentials:
   ```env
   # Contentful Configuration
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ENVIRONMENT=master
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   CONTENTFUL_PREVIEW_TOKEN=your_preview_token
   CONTENTFUL_PREVIEW_SECRET=your_preview_secret
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   
   # Optional: Analytics
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_AHREFS_KEY=your_ahrefs_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Visit your site**
   Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Architecture

```
compare-clash/
├── 📁 app/                     # Next.js App Router
│   ├── 📁 api/                 # API Routes
│   │   ├── 📁 preview/         # Content preview mode
│   │   ├── 📁 exit-preview/    # Exit preview mode
│   │   └── 📁 log-error/       # Error logging endpoint
│   ├── 📁 blog/                # Blog listing
│   ├── 📁 posts/[slug]/        # Individual post pages
│   ├── 📁 categories/          # Category filtering
│   ├── layout.tsx              # Root layout with error tracking
│   ├── page.tsx                # Homepage
│   ├── robots.ts               # SEO robots configuration
│   └── sitemap.ts              # Dynamic sitemap generation
├── 📁 components/              # React Components
│   ├── 📁 ui/                  # shadcn/ui components
│   ├── blog-card.tsx           # Blog post cards
│   ├── search-and-filter.tsx   # Search functionality
│   ├── theme-toggle.tsx        # Dark/light mode
│   └── ...                     # Additional components
├── 📁 lib/                     # Utility Functions
│   ├── contentful.ts           # Contentful CMS integration
│   ├── image.ts                # Image optimization utilities
│   ├── search-static.ts        # Static search logic
│   ├── related-posts.ts        # Related posts algorithm
│   └── structured-data.ts      # SEO structured data
├── 📁 public/                  # Static Assets
│   ├── 📁 images/              # Optimized images
│   ├── _headers                # Netlify cache configuration
│   └── search-index.json       # Search index
├── 📁 scripts/                 # Development Scripts
│   ├── generate-search-index.ts # Search index generation
│   ├── import-to-contentful.ts # Content import
│   ├── migrate-posts.ts        # Content migration
│   └── ...                     # Utility scripts
├── lighthouserc.js             # Lighthouse CI configuration
├── next.config.mjs             # Next.js configuration
├── tailwind.config.mjs         # Tailwind CSS configuration
└── package.json                # Dependencies and scripts
```

---

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Building
```bash
npm run build        # Build for production
npm run start        # Start production server
npm run analyze      # Analyze bundle size
```

### Content Management
```bash
npm run generate-search  # Generate search index
npm run lhci            # Run Lighthouse CI
```

### Contentful Migration
```bash
# Import content to Contentful
npm run import:content

# Export content from local posts
npm run export:posts

# Fix post slugs
npm run fix:slugs

# Rename images
npm run rename:images
```

---

## 🎨 Content Management with Contentful

### Content Types
Your Contentful space should have a **"post"** content type with these fields:

- **title** (Text) - Post title
- **slug** (Text) - URL-friendly identifier
- **excerpt** (Text) - Brief description
- **body** (Rich Text) - Post content
- **tags** (Array) - Content tags
- **publishedAt** (Date) - Publication date
- **featuredImage** (Asset) - Hero image

### Content Workflow
1. **Create posts** in Contentful dashboard
2. **Preview mode** for draft content: `?preview=true`
3. **Publish** to make content live
4. **Search index** updates automatically on build

### Migration Scripts
- **Import to Contentful**: Convert markdown/local content to Contentful
- **Export from Contentful**: Backup content to local files
- **Content Migration**: Move between Contentful spaces

---

## 📊 Performance

### Current Metrics
| Metric | Value | Status |
|--------|-------|--------|
| **Bundle Size** | 102KB shared | ✅ Excellent |
| **Performance** | 95+ | ✅ Target Met |
| **Accessibility** | 98+ | ✅ Target Met |
| **SEO** | 100 | ✅ Perfect |
| **LCP** | 1.8s | ✅ Fast |
| **Build Time** | 5.3s | ✅ Fast |

### Optimization Features
- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: WebP format with LQIP
- **Code Splitting**: Automatic route-based splitting
- **Static Generation**: Pre-rendered pages
- **Bundle Analysis**: Built-in bundle analyzer

---

## 🔍 Search & Discovery

### Static Search
- **Index**: Generated at build time (`search-index.json`)
- **Search UI**: Keyboard shortcut (Cmd/Ctrl + K)
- **Filter**: Category and tag-based filtering
- **Performance**: Instant results, no external dependencies

### SEO Optimization
- **Dynamic Sitemap**: Auto-generated from Contentful
- **Robots.txt**: Intelligent crawling configuration
- **Meta Tags**: Open Graph, Twitter Cards, JSON-LD
- **Structured Data**: Organization and article schema
- **Analytics**: Google Analytics and Ahrefs integration

---

## 🛡️ Monitoring & Error Handling

### Error Tracking (Zero-Cost)
- **Global Error Handler**: Captures JS errors and promise rejections
- **API Logging**: `/api/log-error` endpoint for client errors
- **Netlify Logs**: All errors logged to Function logs
- **No External Dependencies**: Console + Netlify integration

### Performance Monitoring
- **Lighthouse CI**: Automated performance audits
- **UptimeRobot**: Free tier uptime monitoring
- **Bundle Analysis**: Built-in bundle size tracking
- **Cache Headers**: Optimized static asset caching

### Health Checks
- **API Endpoints**: `/api/log-error` for error testing
- **Search Functionality**: Client-side search validation
- **Image Loading**: WebP optimization verification

---

## 🚀 Deployment

### Netlify (Recommended)
```bash
# Build and deploy
npm run build
netlify deploy --prod
```

**Configuration:**
- **Build Command**: `npm run build`
- **Publish Directory**: `.next` (Netlify handles this)
- **Environment Variables**: Configure in Netlify dashboard
- **Cache Headers**: Configured via `public/_headers`

### Vercel
```bash
# Deploy to Vercel
npx vercel
```

### Other Platforms
- **GitHub Pages**: Static export compatible
- **AWS S3**: Static hosting ready
- **Firebase Hosting**: Fully supported

---

## 🔧 Configuration

### Environment Variables
```env
# Contentful CMS
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_token
CONTENTFUL_PREVIEW_TOKEN=your_preview_token
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token
CONTENTFUL_ENVIRONMENT=master

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://compareclash.netlify.app

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_AHREFS_KEY=your_ahrefs_key

# Error Tracking
GITHUB_TOKEN=ghp_your_token
```

### Next.js Configuration
- **Image Optimization**: WebP, AVIF support
- **Static Export**: Enabled for static hosting
- **Bundle Analysis**: Available via `npm run analyze`
- **Experimental Features**: Optimized package imports

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Content Guidelines
- **Write high-quality content** with clear comparisons
- **Include proper meta descriptions** for SEO
- **Use relevant tags** and categories
- **Optimize featured images** for web (WebP format)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - React framework with app router
- **[Contentful](https://www.contentful.com/)** - Headless CMS for content management
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Lucide Icons](https://lucide.dev/)** - Icon library
- **[Netlify](https://www.netlify.com/)** - Static site hosting and deployment

---

## 📈 Performance Reports

View detailed performance reports and optimization history:

- **[Latest Performance Report](DAY7-FINAL-PERFORMANCE-REPORT.md)** - Complete optimization audit
- **[Lighthouse Reports](https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/)** - Automated CI results
- **[Bundle Analysis](https://bundle-analyzer.vercel.app/)** - Size breakdown

---

<div align="center">

**Built with ❤️ for performance and developer experience**

[Website](https://compareclash.netlify.app) • [Issues](https://github.com/AmineAce/blog-hub/issues) • [Discussions](https://github.com/AmineAce/blog-hub/discussions)

</div>
