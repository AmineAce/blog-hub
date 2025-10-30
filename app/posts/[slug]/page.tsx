import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock, ArrowLeft } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"
import { getAllPosts, getPostBySlug } from "@/lib/posts-server"
import { MarkdownContent } from "@/components/markdown-content"
import { Card, CardContent } from "@/components/ui/card"
import { getRelatedPosts } from "@/lib/related-posts"

export async function generateStaticParams() {
  const posts = getAllPosts()
  // Return empty array if no posts exist to avoid build errors
  if (posts.length === 0) {
    return [{ slug: 'no-posts' }]
  }
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post, 3)

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={post.date}>{post.formattedDate}</time>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </header>

      {post.image && (
        <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MarkdownContent content={post.content} />
      </div>

      {relatedPosts.length > 0 && (
        <aside className="mt-12 pt-8 border-t border-border">
          <h3 className="text-2xl font-semibold tracking-tight mb-6">Related Posts</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.slug} href={`/posts/${relatedPost.slug}`} className="group">
                <Card className="h-full overflow-hidden border-border/50 hover:border-border transition-colors">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={relatedPost.image || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(relatedPost.title)}`}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <time dateTime={relatedPost.date}>{relatedPost.formattedDate}</time>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{relatedPost.readTime} min</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold tracking-tight text-balance mb-2 group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{relatedPost.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </aside>
      )}

      <footer className="mt-12 pt-8 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Share this article</p>
          <ShareButtons title={post.title} slug={post.slug} />
        </div>
      </footer>
    </article>
  )
}
