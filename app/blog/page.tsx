import { getAllPosts } from "@/lib/contentful"
import { BlogCard } from "@/components/blog-card"
import { generateBlogSchema } from "@/lib/structured-data"
import Script from "next/script"

interface ContentfulPost {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  tags?: string[];
  content: any;
  featuredImage?: string | null;
}

// Add ISR configuration
export const revalidate = 300 // Revalidate every 5 minutes

export default async function BlogPage() {
  const posts: ContentfulPost[] = await getAllPosts()
  const blogSchema = generateBlogSchema()

  return (
    <>
      {/* Blog Schema */}
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">Tech Product Comparisons</h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Unbiased reviews and comparisons of the latest tech products to help you make informed decisions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  )
}
