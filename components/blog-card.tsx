import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { getOptimizedImage } from "@/lib/image"

interface BlogCardProps {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: string;
    tags?: string[];
    featuredImage?: string | null;
  }
}

export async function BlogCard({ post }: BlogCardProps) {
  // Optimize the featured image with WebP and blur placeholder
  const optimizedImage = post.featuredImage 
    ? await getOptimizedImage(post.featuredImage, {
        width: 800,
        quality: 75,
        format: 'webp',
        blurPlaceholder: true
      })
    : null

  return (
    <Link href={`/posts/${post.slug}`} className="group">
      <Card className="h-full overflow-hidden border-border/50 hover:border-border transition-colors">
        {optimizedImage && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={optimizedImage.src}
              alt={post.title}
              width={800}
              height={450}
              className="object-cover transition-transform group-hover:scale-105"
              placeholder="blur"
              blurDataURL={optimizedImage.blurDataURL}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold tracking-tight text-balance mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground text-pretty leading-relaxed mb-3">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-muted rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
