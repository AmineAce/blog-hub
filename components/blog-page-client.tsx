"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { BlogPagination } from "@/components/blog-pagination"

import { useState, useMemo } from "react"
interface ContentfulPost {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  tags?: string[];
  content: any;
  featuredImage?: string | null;
}

interface BlogPageClientProps {
  posts: ContentfulPost[]
}

const POSTS_PER_PAGE = 6

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredPosts, setFilteredPosts] = useState<ContentfulPost[]>(posts)

  // Reset to page 1 when filters change
  const displayPosts = useMemo(() => {
    setCurrentPage(1)
    return filteredPosts
  }, [filteredPosts])

  const totalPages = Math.ceil(displayPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = displayPosts.slice(startIndex, endIndex)

  return (
    <>
      {/* SearchAndFilter temporarily disabled for Contentful migration */}
      {/* <SearchAndFilter
        posts={posts}
        onFilteredPosts={setFilteredPosts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      /> */}

      {displayPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentPosts.map((post: ContentfulPost, index: number) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="group">
                <Card className="h-full overflow-hidden border-border/50 hover:border-border transition-colors">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.featuredImage || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(post.title)}`}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      priority={index < 3} // Prioritize first 3 images
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
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
      )}
    </>
  )
}
