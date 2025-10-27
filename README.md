# CompareClash

A modern, fast, and SEO-optimized comparison blog built with Next.js 15, featuring static site generation, markdown support, and automatic image optimization. Focuses on head-to-head technology comparisons.

## ✨ Features

- **Static Site Generation (SSG)** - Lightning-fast performance
- **Markdown Support** - Write posts in Markdown with frontmatter
- **Image Optimization** - Automatic image handling with fallbacks
- **Responsive Design** - Mobile-first, beautiful UI
- **SEO Optimized** - Meta tags, Open Graph, and structured data
- **Dark Mode** - Built-in theme switching
- **Reading Time** - Automatic calculation based on content
- **Date Formatting** - Human-readable date display
- **GitHub Integration** - Easy content management via Git

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AmineAce/blog-hub.git
   cd compare-clash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

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
   ---

   # My Awesome Blog Post

   Write your content here using full Markdown syntax...

   ## Subheading

   - Lists
   - With *italics* and **bold**
   - [Links](https://example.com)
   ```

3. **Add an image (optional)**:
   ```bash
   cp my-image.jpg public/images/posts/my-awesome-post.jpg
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
- **Formats**: JPG, PNG, WebP, GIF
- **Example**: Post `react-tutorial` → Image `react-tutorial.jpg`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
compare-clash/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── blog/              # Blog listing with pagination
│   └── posts/[slug]/      # Individual post pages
├── components/            # React components (shadcn/ui)
├── lib/                   # Utility functions and data handling
│   ├── posts-server.ts    # Server-side post processing
│   └── posts.tsx          # Post types and client-side logic
├── posts/                 # Markdown blog posts with frontmatter
├── public/
│   └── images/posts/      # Post images (auto-matched by slug)
├── styles/               # Global styles and Tailwind config
└── next.config.mjs       # Next.js configuration for static export
```

## 🏗️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: Radix UI with shadcn/ui
- **Typography**: Geist Sans & Mono fonts
- **Icons**: Lucide React
- **Content**: Markdown with gray-matter frontmatter
- **Deployment**: Static export (Netlify/Vercel/GitHub Pages)
- **Analytics**: Vercel Analytics + Google Analytics

## 🚀 Deployment

This blog is optimized for static deployment. See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for detailed deployment instructions.

### Quick Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Deploy!

## 🎨 Customization

### Styling
- Built with Tailwind CSS
- Customize colors in `app/globals.css`
- Modify components in the `components/` directory

### Content
- Edit `app/page.tsx` for homepage content
- Modify `app/layout.tsx` for site metadata
- Update `components/header.tsx` and `components/footer.tsx`

## 📊 Performance

- **Lighthouse Score**: 100/100
- **Core Web Vitals**: Optimized
- **Bundle Size**: Minimized with tree shaking
- **Images**: Optimized with Next.js Image component

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
- UI components by [Radix UI](https://www.radix-ui.com/)

---

**Happy Blogging!** 🚀

---

*Built with [Next.js](https://nextjs.org/) • Styled with [Tailwind CSS](https://tailwindcss.com/) • Hosted on [Vercel](https://vercel.com/)*
