import { getAllPosts } from "@/lib/contentful"
import { BlogCard } from "@/components/blog-card"
import { generateBlogSchema } from "@/lib/structured-data"
import Script from "next/script"

export default async function BlogPage() {
  const posts = await getAllPosts()
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
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">All Posts</h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Thoughts, ideas, and insights on technology and design.
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
