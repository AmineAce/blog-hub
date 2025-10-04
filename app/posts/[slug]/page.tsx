import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock, ArrowLeft } from "lucide-react"
import { ShareButtons } from "@/components/share-buttons"
import { getAllPosts, getPostBySlug } from "@/lib/posts-server"
import { MarkdownContent } from "@/components/markdown-content"

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

      <footer className="mt-12 pt-8 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Share this article</p>
          <ShareButtons title={post.title} slug={post.slug} />
        </div>
      </footer>
    </article>
  )
}
