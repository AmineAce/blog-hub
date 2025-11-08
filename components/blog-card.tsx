import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface BlogCardProps {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: string;
    tags?: string[];
  }
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group">
      <Card className="h-full overflow-hidden border-border/50 hover:border-border transition-colors">
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
