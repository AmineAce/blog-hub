"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { useState, useMemo } from "react"
import { Post } from "@/lib/posts-server"

interface HomePageClientProps {
  posts: Post[]
}

export default function HomePageClient({ posts }: HomePageClientProps) {
  const featuredPost = posts[0]
  const allRecentPosts = posts.slice(1, 10) // Get more for filtering

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredRecentPosts, setFilteredRecentPosts] = useState(allRecentPosts.slice(0, 3))

  const displayRecentPosts = useMemo(() => {
    if (searchQuery || selectedCategory !== "all") {
      return filteredRecentPosts.slice(0, 3) // Limit to 3 for display
    }
    return allRecentPosts.slice(0, 3) // Default to first 3 when no filter
  }, [searchQuery, selectedCategory, filteredRecentPosts, allRecentPosts])

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mb-20">
        <div className="mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Welcome to Compare Clash
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty max-w-2xl">
            Which technology truly wins? We test, compare, and reveal what matters.
          </p>
        </div>

        {featuredPost && (
          <Link href={`/posts/${featuredPost.slug}`} className="block">
            <Card className="overflow-hidden border-border/50 hover:border-border hover:shadow-md transition-all cursor-pointer">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="relative aspect-video md:aspect-auto">
                  <Image
                    src={featuredPost.image || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(featuredPost.title)}`}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <CardContent className="flex flex-col justify-center p-6 md:p-8">
                  <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
                    <time dateTime={featuredPost.date}>{featuredPost.formattedDate}</time>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{featuredPost.readTime} min read</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-balance mb-3">{featuredPost.title}</h2>
                  <p className="text-muted-foreground text-pretty mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                  <span className="text-sm font-medium text-primary">Read Article →</span>
                </CardContent>
              </div>
            </Card>
          </Link>
        )}
      </section>

      {/* Recent Posts */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Posts</h2>
          {posts.length > 0 && (
            <Link href="/blog">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          )}
        </div>



        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No blogs yet</h3>
              <p className="text-sm text-muted-foreground">
                Check back later for new articles and insights.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayRecentPosts.map((post) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="block">
                <Card className="h-full overflow-hidden border-border/50 hover:border-border hover:shadow-md transition-all cursor-pointer">
                  <div className="relative aspect-video">
                    <Image
                      src={post.image || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(post.title)}`}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-6">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <time dateTime={post.date}>{post.formattedDate}</time>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime} min</span>
                    </div>
                  </div>
                    <h3 className="text-lg font-semibold tracking-tight text-balance mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground text-pretty leading-relaxed mb-4">{post.excerpt}</p>
                    <span className="text-sm font-medium text-primary">Read more →</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
