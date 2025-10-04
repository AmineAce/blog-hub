"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { BlogPagination } from "@/components/blog-pagination"
import { useState } from "react"
import { Post } from "@/lib/posts"

interface BlogPageClientProps {
  posts: Post[]
}

const POSTS_PER_PAGE = 6

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = posts.slice(startIndex, endIndex)

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="group">
            <Card className="h-full overflow-hidden border-border/50 hover:border-border transition-colors">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.image || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(post.title)}`}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <time dateTime={post.date}>{post.formattedDate}</time>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-balance mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <BlogPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  )
}
