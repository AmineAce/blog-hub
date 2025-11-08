import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { ShareButtons } from "@/components/share-buttons"
import { client } from "@/lib/contentful"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Card, CardContent } from "@/components/ui/card"
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/structured-data"
import Script from "next/script"

export async function generateStaticParams() {
  try {
    const entries = await client.getEntries({ content_type: 'post' });
    return entries.items.map((entry: any) => ({
      slug: entry.fields.slug,
    }));
  } catch (error) {
    // Fallback for build time when Contentful credentials are not configured
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const entries = await client.getEntries({
      content_type: 'post',
      'fields.slug': slug,
    });

    const post = entries.items[0] as any;
    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    return {
      title: post.fields.title,
      description: post.fields.excerpt,
      openGraph: {
        title: post.fields.title,
        description: post.fields.excerpt,
        type: 'article',
        publishedTime: post.fields.publishedAt,
        images: post.fields.featuredImage ? [`https:${post.fields.featuredImage.fields.file.url}`] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Post Not Found',
    }
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const entries = await client.getEntries({
    content_type: 'post',
    'fields.slug': slug,
  });

  const post = entries.items[0] as any;
  if (!post) notFound();

  const { title, excerpt, body, featuredImage, publishedAt } = post.fields;

  // Generate structured data
  const articleSchema = generateArticleSchema({
    title,
    description: excerpt,
    author: "CompareClash",
    datePublished: publishedAt,
    dateModified: publishedAt,
    image: featuredImage ? `https:${featuredImage.fields.file.url}` : undefined,
    url: `https://compareclash.com/posts/${slug}`
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://compareclash.com" },
    { name: "Blog", url: "https://compareclash.com/blog" },
    { name: title, url: `https://compareclash.com/posts/${slug}` }
  ])

  return (
    <>
      {/* Article Schema */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Breadcrumb Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl mb-4">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        {featuredImage && (
          <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-8">
            <Image
              src={`https:${featuredImage.fields.file.url}`}
              alt={featuredImage.fields.title || title}
              width={1200}
              height={600}
              className="rounded-lg shadow-lg object-cover"
              priority={true}
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            />
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {documentToReactComponents(body)}
        </div>

        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Share this article</p>
            <ShareButtons title={title} slug={slug} />
          </div>
        </footer>
      </article>
    </>
  )
}
