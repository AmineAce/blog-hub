import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { getAllPosts } from "@/lib/posts-static"
import { Clock } from "lucide-react"
import { BlogPageClient } from "@/components/blog-page-client"
import { generateBlogSchema } from "@/lib/structured-data"
import Script from "next/script"

export default function BlogPage() {
  const allPosts = getAllPosts()
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

        {allPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No blogs yet</h3>
              <p className="text-sm text-muted-foreground">
                Check back later for new articles and insights.
              </p>
            </div>
          </div>
        ) : (
          <BlogPageClient posts={allPosts} />
        )}
      </div>
    </>
  )
}
