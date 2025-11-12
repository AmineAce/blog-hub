# CompareClash - Performance-Optimized Blog with ISR

<div align="center">

![Performance](https://img.shields.io/badge/Performance-95%2B-brightgreen)
![Accessibility](https://img.shields.io/badge/Accessibility-98%2B-brightgreen)
![SEO](https://img.shields.io/badge/SEO-100-brightgreen)
![Bundle](https://img.shields.io/badge/JS%20Bundle-102KB-brightgreen)
![ISR](https://img.shields.io/badge/ISR-Enabled-blue)

**A production-grade, high-performance blog with Incremental Static Regeneration (ISR), built with Next.js 15, Contentful CMS, and enterprise-level optimizations.**

[Live Demo](https://compareclash.netlify.app) • [Features](#-features) • [Getting Started](#-quick-start)

</div>

---

## ✨ Key Features

### 🏎️ **Performance Optimized**
- **Bundle Size**: 102KB shared bundle (excellent baseline)
- **Lighthouse Scores**: Performance 95+, Accessibility 98+, SEO 100
- **ISR Enabled**: 5-minute revalidation for instant content updates
- **Static Generation**: Server-side rendering with SSG
- **Image Optimization**: WebP format with automatic optimization

### 🧠 **Content Management with ISR**
- **Headless CMS**: Contentful integration for content management
- **ISR Webhooks**: Automatic content updates via Contentful webhooks
- **Preview Mode**: Live content preview with draft support
- **Static Search**: Client-side search with optimized search index
- **Rich Content**: Support for rich text content and featured images

### 🚀 **Automatic Content Updates**
- **ISR Implementation**: Content updates within 2-3 minutes of publishing
- **Webhook Integration**: Contentful → Netlify automatic rebuilds
- **Zero Manual Deploys**: Content changes trigger automatic updates
- **Real-time Search**: Search index updates with content changes
- **Cache Revalidation**: Smart cache invalidation for fresh content

### 🎯 **SEO & Discoverability**
- **Dynamic Sitemap**: Auto-generated from Contentful CMS
- **Robots.txt**: Intelligent crawling rules
- **Structured Data**: Organization and website schema
- **Meta Tags**: Comprehensive Open Graph and Twitter Cards
- **Analytics**: Google Analytics and Ahrefs integration

### 🛠️ **Developer Experience**
- **TypeScript**: Full type safety
- **Modern Stack**: Next.js 15.5.4, React 19, Tailwind CSS v4
- **ISR Ready**: Production-grade caching and revalidation
- **Development Tools**: ESLint, TypeScript, bundle analyzer
- **Clean Architecture**: Well-organized, maintainable codebase

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
   CONTENTFUL_ACCESS_TOKEN=your_delivery_token
   CONTENTFUL_PREVIEW_TOKEN=your_preview_token
   CONTENTFUL_PREVIEW_SECRET=your_preview_secret

   # ISR Revalidation (Auto-generated)
   REVALIDATION_SECRET=your_secure_secret

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
│   │   ├── 📁 revalidate/      # ISR revalidation endpoint
│   │   ├── 📁 preview/         # Content preview mode
│   │   ├── 📁 exit-preview/    # Exit preview mode
│   │   └── 📁 log-error/       # Error logging endpoint
│   ├── 📁 blog/                # Blog listing (ISR enabled)
│   ├── 📁 posts/[slug]/        # Individual post pages (ISR enabled)
│   ├── layout.tsx              # Root layout with error tracking
│   ├── page.tsx                # Homepage
│   ├── robots.ts               # SEO robots configuration
│   └── sitemap.ts              # Dynamic sitemap generation
├── 📁 components/              # React Components
│   ├── 📁 ui/                  # shadcn/ui components
│   ├── blog-card.tsx           # Blog post cards
│   ├── search-dialog.tsx       # Modal search (click-outside close)
│   ├── HeaderServer.tsx        # Navigation header
│   └── ...                     # Additional components
├── 📁 lib/                     # Utility Functions
│   ├── contentful.ts           # Contentful CMS integration
│   ├── image.ts                # Image optimization utilities
│   ├── search-static.ts        # Static search logic
│   └── structured-data.ts      # SEO structured data
├── 📁 public/                  # Static Assets
│   ├── 📁 images/              # Optimized images
│   ├── _headers                # Netlify cache configuration
│   └── search-index.json       # Search index
├── 📁 scripts/                 # Development Scripts
│   ├── generate-search-index.ts # Search index generation
│   └── ...                     # Utility scripts
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
npm run build        # Build for production
npm run start        # Start production server
```

### Content Management
```bash
npm run generate-search  # Generate search index
```

---

## 🔄 ISR (Incremental Static Regeneration)

### How It Works
1. **Content Published** in Contentful
2. **Webhook Triggered** → Calls `/api/revalidate`
3. **Cache Revalidated** → Next.js updates cached pages
4. **Content Live** within 2-3 minutes

### ISR Configuration
- **Revalidation Period**: 5 minutes
- **Webhook Endpoint**: `/api/revalidate`
- **Security**: Protected by `REVALIDATION_SECRET`
- **Coverage**: Blog listing and individual post pages

### Contentful Webhook Setup
```json
{
  "secret": "your-revalidation-secret",
  "path": "/blog",
  "tag": "posts"
}
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
3. **Publish** → ISR automatically updates live site
4. **Search index** updates automatically

---

## 📊 Performance

### Current Metrics
| Metric | Value | Status |
|--------|-------|--------|
| **Bundle Size** | 102KB shared | ✅ Excellent |
| **Performance** | 95+ | ✅ Target Met |
| **Accessibility** | 98+ | ✅ Target Met |
| **SEO** | 100 | ✅ Perfect |
| **ISR Updates** | 2-3 minutes | ✅ Fast |
| **Build Time** | 5.3s | ✅ Fast |

### ISR Benefits
- **Instant Publishing**: No rebuild delays
- **Static Performance**: Maintains SSG benefits
- **Automatic Updates**: Webhook-driven revalidation
- **Cost Effective**: No deploy usage for content changes

---

## 🔍 Search & Discovery

### Modal Search Interface
- **Trigger**: Click search button or Cmd/Ctrl + K
- **Modal Design**: Clean, click-outside-to-close behavior
- **Static Index**: Generated at build time for performance
- **Real-time Results**: Instant filtering as you type

### SEO Optimization
- **Dynamic Sitemap**: Auto-generated from Contentful
- **Robots.txt**: Intelligent crawling configuration
- **Meta Tags**: Open Graph, Twitter Cards, JSON-LD
- **Structured Data**: Organization and article schema

---

## 🚀 Deployment

### Netlify (Recommended)
```bash
# Build and deploy
npm run build
netlify deploy --prod
```

**ISR Configuration:**
- **Build Command**: `npm run build`
- **Environment Variables**: Configure `REVALIDATION_SECRET`
- **Webhook URL**: `https://your-site.netlify.app/api/revalidate`

### ISR Webhook Setup
1. **Netlify**: Create build hook URL
2. **Contentful**: Add webhook pointing to Netlify URL
3. **Payload**: Include revalidation secret and paths
4. **Triggers**: Publish, unpublish, update events

---

## 🔧 Configuration

### Environment Variables
```env
# Contentful CMS
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_token
CONTENTFUL_PREVIEW_TOKEN=your_preview_token
CONTENTFUL_PREVIEW_SECRET=your_preview_secret

# ISR Revalidation
REVALIDATION_SECRET=your_secure_secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - React framework with ISR
- **[Contentful](https://www.contentful.com/)** - Headless CMS
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - UI components
- **[Netlify](https://www.netlify.com/)** - Hosting with webhooks

---

<div align="center">

**Built with ❤️ for performance, ISR, and developer experience**

[Website](https://compareclash.netlify.app) • [ISR Documentation](#-isr-incremental-static-regeneration)

</div>
