# CompareClash - Complete Guide

Welcome to CompareClash! This guide will help you understand how to use and customize your blog.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Adding New Blog Posts](#adding-new-blog-posts)
3. [Adding Images to Blog Posts](#adding-images-to-blog-posts)
4. [Adding Ads and Affiliate Links](#adding-ads-and-affiliate-links)
5. [Customizing Your Blog](#customizing-your-blog)
6. [Deployment](#deployment)

---

## Project Structure

\`\`\`
blog-hub/
├── app/
│   ├── page.tsx           # Homepage with hero and recent posts
│   ├── blog/
│   │   └── page.tsx       # Blog list page with pagination
│   └── posts/
│       └── [slug]/
│           └── page.tsx   # Individual post page
├── components/
│   ├── header.tsx         # Navigation header with dark mode toggle
│   ├── footer.tsx         # Footer with affiliate disclosure
│   ├── share-buttons.tsx  # Social sharing buttons
│   └── markdown-content.tsx # Markdown renderer
├── lib/
│   └── posts.tsx          # Blog posts data
└── public/
    └── images/            # Store your images here
\`\`\`

---

## Adding New Blog Posts

All blog posts are stored in `lib/posts.tsx` as TypeScript objects. To add a new post:

1. Open `lib/posts.tsx`
2. Add a new post object to the `postsData` array:

\`\`\`typescript
{
  slug: 'your-post-slug',
  title: 'Your Post Title',
  date: '2024-01-15',
  excerpt: 'A brief description of your post that appears on the blog list page.',
  image: '/placeholder.svg?height=400&width=800',
  content: `
Your full post content goes here in Markdown format.

## You can use headings

- Bullet points
- More bullets

**Bold text** and *italic text*

[Links](https://example.com)

And much more!
  `
}
\`\`\`

### Post Fields Explained:

- **slug**: URL-friendly identifier (e.g., `my-awesome-post`)
- **title**: The post title displayed everywhere
- **date**: Publication date in YYYY-MM-DD format
- **excerpt**: Short description (2-3 sentences) for cards and previews
- **image**: Path to image or placeholder URL
- **content**: Full post content in Markdown format

---

## Adding Images to Blog Posts

### Option 1: Using Placeholder Images (Default)

The blog comes with a placeholder image system that generates images based on descriptions:

\`\`\`markdown
![Alt text](/placeholder.svg?height=400&width=800&query=mountain landscape sunset)
\`\`\`

Parameters:
- `height`: Image height in pixels
- `width`: Image width in pixels
- `query`: Description of the image you want

### Option 2: Using Your Own Images

1. **Add images to the public folder:**
   - Create folders in `public/images/` to organize your images
   - Example: `public/images/blog/my-post-image.jpg`

2. **Reference images in your post:**

\`\`\`markdown
![Alt text describing the image](/images/blog/my-post-image.jpg)
\`\`\`

3. **Update the post's featured image:**

\`\`\`typescript
{
  slug: 'my-post',
  title: 'My Post',
  image: '/images/blog/featured-image.jpg', // Use your image path
  content: `...`
}
\`\`\`

### Image Best Practices:

- **Featured images**: 1200x630px (optimal for social sharing)
- **In-content images**: 800-1200px wide
- **File formats**: JPG for photos, PNG for graphics with transparency
- **Optimization**: Compress images before uploading (use tools like TinyPNG)
- **Alt text**: Always include descriptive alt text for accessibility

---

## Adding Ads and Affiliate Links

### Affiliate Links in Content

Simply add affiliate links in your Markdown content:

\`\`\`markdown
Check out this [amazing product on Amazon](https://amazon.com/your-affiliate-link).

I highly recommend the [XYZ Camera](https://amazon.com/xyz-camera?tag=yourtag).
\`\`\`

### Display Ads in Posts

You can add ad blocks anywhere in your post content using HTML:

\`\`\`markdown
## Your Content Here

Some paragraph text...

<div style="background: #f3f4f6; padding: 1.5rem; border-radius: 0.5rem; text-align: center; margin: 2rem 0;">
  <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">Advertisement</p>
  <!-- Your ad code here (Google AdSense, etc.) -->
  <p style="color: #9ca3af;">Ad Space</p>
</div>

More content continues...
\`\`\`

### Adding Ad Slots to Post Template

To add consistent ad placements in all posts, edit `app/posts/[slug]/page.tsx`:

\`\`\`tsx
// Add after the post title
<div className="my-8 p-6 bg-muted rounded-lg text-center">
  <p className="text-sm text-muted-foreground mb-2">Advertisement</p>
  {/* Your ad code here */}
</div>

<MarkdownContent content={post.content} />

// Add before the share buttons
<div className="my-8 p-6 bg-muted rounded-lg text-center">
  <p className="text-sm text-muted-foreground mb-2">Advertisement</p>
  {/* Your ad code here */}
</div>
\`\`\`

### Affiliate Disclosure

The footer already includes an affiliate disclosure. To customize it, edit `components/footer.tsx`:

\`\`\`tsx
<p className="text-sm text-muted-foreground">
  Your custom disclosure text here.
</p>
\`\`\`

### Inline Product Boxes

Create attractive product recommendation boxes in your posts:

\`\`\`markdown
<div style="border: 2px solid #e5e7eb; border-radius: 0.5rem; padding: 1.5rem; margin: 2rem 0;">
  <h3 style="margin-top: 0;">Recommended Product</h3>
  <p><strong>Product Name</strong> - Brief description of why you recommend it.</p>
  <a href="https://amazon.com/your-affiliate-link" style="display: inline-block; background: #2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; text-decoration: none; margin-top: 0.5rem;">
    View on Amazon →
  </a>
</div>
\`\`\`

---

## Customizing Your Blog

### Changing Colors and Theme

Edit `app/globals.css` to customize your color scheme:

\`\`\`css
@theme inline {
  /* Light mode colors */
  --color-background: 255 255 255;
  --color-foreground: 23 23 23;
  --color-primary: 59 130 246; /* Change primary color */
  
  /* Dark mode colors */
  .dark {
    --color-background: 23 23 23;
    --color-foreground: 250 250 250;
  }
}
\`\`\`

### Changing Blog Name and Branding

1. **Header**: Edit `components/header.tsx`
2. **Footer**: Edit `components/footer.tsx`
3. **Page Title**: Edit `app/layout.tsx` metadata

### Adjusting Posts Per Page

Edit `app/blog/page.tsx` and change the `POSTS_PER_PAGE` constant:

\`\`\`tsx
const POSTS_PER_PAGE = 6 // Change to your preferred number
\`\`\`

### Customizing Social Share Buttons

Edit `components/share-buttons.tsx` to add or remove social platforms.

---

## Deployment

### Static Export (Recommended)

This blog is configured for static export, perfect for hosting on:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Deploy to Vercel (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

Your blog will be live in minutes!

### Manual Static Export

\`\`\`bash
npm run build
\`\`\`

This creates an optimized static version in the `out` folder that you can upload to any hosting service.

### Environment Variables

No environment variables are required for basic functionality. If you add integrations (analytics, comments, etc.), add them in your hosting platform's dashboard.

---

## Tips for Success

### SEO Best Practices

1. **Write descriptive titles** (50-60 characters)
2. **Craft compelling excerpts** (150-160 characters)
3. **Use headings hierarchically** (H1 → H2 → H3)
4. **Add alt text to all images**
5. **Include internal links** between related posts

### Content Strategy

1. **Publish consistently** (weekly or bi-weekly)
2. **Focus on quality** over quantity
3. **Use images** to break up text
4. **Add value** before promoting products
5. **Be transparent** about affiliate relationships

### Performance

1. **Optimize images** before uploading
2. **Keep posts focused** (1000-2000 words ideal)
3. **Test on mobile** devices regularly
4. **Monitor loading speed**

---

## Need Help?

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Markdown syntax guide](https://www.markdownguide.org/)
- Explore [Tailwind CSS docs](https://tailwindcss.com/docs)

Happy blogging! 🚀
