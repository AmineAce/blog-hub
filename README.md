# CompareClash

A modern, fast, and SEO-optimized comparison blog built with Next.js 15, featuring static site generation, markdown support, and WebP image optimization. Focuses on head-to-head technology comparisons with a clean, responsive design.

## ✨ Features

- **Static Site Generation (SSG)** - Lightning-fast performance with optimized builds
- **Markdown Support** - Write posts in Markdown with frontmatter parsing
- **WebP Image Optimization** - Modern image format with automatic optimization
- **Responsive Design** - Mobile-first, beautiful UI with shadcn/ui components
- **SEO Optimized** - Meta tags, Open Graph, and structured data
- **Dark Mode** - Built-in theme switching with next-themes
- **Search & Filter** - Client-side search with category filtering
- **Reading Time** - Automatic calculation based on content length
- **Date Formatting** - Human-readable date display
- **Pagination** - Blog post pagination for better performance
- **Share Buttons** - Social media sharing functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AmineAce/blog-hub.git
   cd compare-clash
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 📝 Adding Blog Posts

1. **Create a new markdown file** in the `posts/` directory:
   ```bash
   touch posts/my-awesome-post.md
   ```

2. **Add frontmatter and content**:
   ```markdown
   ---
   title: "My Awesome Blog Post"
   date: "2024-01-20"
   time: "14:30"
   excerpt: "A brief description that appears on the homepage and blog listing pages"
   tags:
     - technology
     - review
   categories:
     - Technology
   image: /images/posts/my-awesome-post.webp
   ---

   # My Awesome Blog Post

   Write your content here using full Markdown syntax...

   ## Subheading

   - Lists
   - With *italics* and **bold**
   - [Links](https://example.com)
   ```

3. **Add a WebP image (recommended)**:
   ```bash
   cp my-image.webp public/images/posts/my-awesome-post.webp
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add new blog post: My Awesome Blog Post"
   git push origin main
   ```

## 🖼️ Image Management

- **Location**: `public/images/posts/`
- **Naming**: Must match post slug exactly
- **Formats**: WebP (recommended), JPG, PNG
- **Example**: Post `react-tutorial` → Image `react-tutorial.webp`
- **Optimization**: Images are automatically optimized by Next.js

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
compare-clash/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page with hero section
│   ├── blog/              # Blog listing with pagination
│   ├── posts/[slug]/      # Individual post pages
│   └── categories/        # Category-based filtering
├── components/            # React components
│   ├── ui/               # shadcn/ui components (minimal set)
│   ├── blog-page-client.tsx
│   ├── blog-pagination.tsx
│   ├── header.tsx
│   ├── footer.tsx
│   └── ...
├── lib/                   # Utility functions
│   ├── posts-server.ts    # Server-side post processing
│   ├── posts.tsx          # Post types and client logic
│   ├── search.ts          # Search functionality
│   └── related-posts.ts   # Related posts algorithm
├── posts/                 # Markdown blog posts with frontmatter
├── public/
│   └── images/posts/      # Post images (WebP format)
└── styles/               # Global styles
```

## 🏗️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: Minimal shadcn/ui components (button, card, input, select, dialog, badge)
- **Icons**: Lucide React
- **Content**: Markdown with gray-matter frontmatter
- **Search**: MiniSearch for client-side search
- **Deployment**: Static export for any static hosting
- **Analytics**: Vercel Analytics

## 🚀 Deployment

This blog is optimized for static deployment to platforms like:

- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting service**

### Build for Production

```bash
npm run build
```

The built files will be in the `out/` directory.

## 🎨 Customization

### Styling
- Built with Tailwind CSS
- Customize colors in `app/globals.css`
- Components use CSS variables for theming

### Content
- Edit `app/page.tsx` for homepage content
- Modify `app/layout.tsx` for site metadata
- Update `components/header.tsx` and `components/footer.tsx`

### Features
- Search functionality: `lib/search.ts`
- Related posts algorithm: `lib/related-posts.ts`
- Post processing: `lib/posts-server.ts`

## 📊 Performance

- **Lighthouse Score**: 100/100 (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimized
- **Bundle Size**: Minimized with tree shaking
- **Images**: WebP format with Next.js optimization
- **Static Generation**: Pre-built pages for instant loading

## 🔧 Configuration

### Next.js Configuration
- Static export enabled in `next.config.mjs`
- WebP and AVIF image formats supported
- Optimized for production builds

### Content Configuration
- Posts are automatically sorted by date
- Search indexes are built at runtime
- Related posts use content similarity algorithm

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)

---

**Happy Blogging!** 🚀

---

*Built with [Next.js](https://nextjs.org/) • Styled with [Tailwind CSS](https://tailwindcss.com/) • Optimized for [Vercel](https://vercel.com/)*
