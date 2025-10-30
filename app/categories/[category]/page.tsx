import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { getAllPosts, getPostsByTag } from "@/lib/posts-server"
import { Clock, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const tags = await getAllPosts()
    .flatMap(post => post.tags)
    .filter((tag, index, arr) => arr.indexOf(tag) === index)
    .map(tag => ({ category: tag }))

  return tags
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} - Compare Clash`,
    description: `Articles tagged with ${category}`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const posts = getPostsByTag(category)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          All posts tagged with "{category}"
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
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
    </div>
  )
}
