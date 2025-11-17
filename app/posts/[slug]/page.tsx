import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { ShareButtons } from "@/components/share-buttons"
import { getPostBySlug, getPostSlugs } from "@/lib/contentful"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/structured-data"
import Script from "next/script"
import { draftMode } from "next/headers"
import { getRelatedPosts } from "@/lib/related-posts"

// Add ISR configuration
export const revalidate = 300 // Revalidate every 5 minutes

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs(false);
    return slugs.map((slug: string) => ({
      slug,
    }));
  } catch (error) {
    // Fallback for build time when Contentful credentials are not configured
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const post = await getPostBySlug(slug, false);
    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    // Enforce SEO best practices
    const title = post.title.length > 60 ? post.title.substring(0, 57) + '...' : post.title;
    const description = post.excerpt.length > 160 ? post.excerpt.substring(0, 157) + '...' : post.excerpt;
    const canonicalUrl = `https://compareclash.netlify.app/posts/${slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'CompareClash',
        type: 'article',
        publishedTime: post.publishedAt,
        images: post.featuredImage ? [{
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: title,
        }] : [],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: post.featuredImage ? [post.featuredImage] : [],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
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

  // Check if we're in draft mode
  const { isEnabled } = await draftMode();
  const preview = isEnabled;

  const post = await getPostBySlug(slug, preview);
  if (!post) notFound();

  const { title, excerpt, content, publishedAt, featuredImage } = post;

  // Get related posts
  const relatedPosts = await getRelatedPosts(post, 3);

  // Generate structured data
  const articleSchema = generateArticleSchema({
    title,
    description: excerpt,
    author: "CompareClash",
    datePublished: publishedAt,
    dateModified: publishedAt,
    image: featuredImage || undefined,
    url: `https://compareclash.netlify.app/posts/${slug}`
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://compareclash.netlify.app" },
    { name: "Blog", url: "https://compareclash.netlify.app/blog" },
    { name: title, url: `https://compareclash.netlify.app/posts/${slug}` }
  ])

  const richTextOptions = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
        const isInsideListItem = node.parent?.nodeType === BLOCKS.LIST_ITEM;
        if (isInsideListItem) {
          return children;
        }
        return (
          <p className="mb-6 leading-relaxed">
            {children}
          </p>
        );
      },
      [BLOCKS.HEADING_1]: (node: any, children: any) => (
        <h2 className="text-3xl font-bold mb-6 mt-8 text-gray-900 dark:text-gray-100">{children}</h2>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: any) => (
        <h2 className="text-3xl font-semibold mb-4 mt-6 text-gray-900 dark:text-gray-100">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: any) => (
        <h3 className="text-2xl font-semibold mb-3 mt-5 text-gray-900 dark:text-gray-100">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node: any, children: any) => (
        <h4 className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-gray-100">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (node: any, children: any) => (
        <h5 className="text-lg font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (node: any, children: any) => (
        <h6 className="text-base font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">{children}</h6>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: any) => (
        <ul className="list-disc mb-6 space-y-2 pl-6">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: any) => (
        <ol className="list-decimal mb-6 space-y-2 pl-6">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
        <li className="leading-relaxed mb-2">{children}</li>
      ),
      [BLOCKS.TABLE]: (node: any, children: any) => (
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <tbody>{children}</tbody>
          </table>
        </div>
      ),
      [BLOCKS.TABLE_ROW]: (node: any, children: any) => (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">{children}</tr>
      ),
      [BLOCKS.TABLE_CELL]: (node: any, children: any) => (
        <td className="border border-gray-300 dark:border-gray-600 p-3 text-left align-top">{children}</td>
      ),
      [BLOCKS.TABLE_HEADER_CELL]: (node: any, children: any) => (
        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left align-top bg-gray-100 dark:bg-gray-700 font-semibold">{children}</th>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { url, title, description } = node.data.target.fields;
        const imageUrl = `https:${url}`;
        return (
          <div className="flex justify-center mb-8">
            <div className="relative max-w-full sm:max-w-2xl">
              <Image
                src={imageUrl}
                alt={title || description || 'Embedded image'}
                width={800}
                height={600}
                className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              />
            </div>
          </div>
        );
      },
      [INLINES.HYPERLINK]: (node: any, children: any) => {
        const { uri } = node.data;
        const isInternal = uri.startsWith('/');
        const isExternal = !isInternal;

        const buttonClass = "inline-block bg-black dark:bg-white text-white dark:text-black text-sm px-3 py-1 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 no-underline";

        if (isInternal) {
          return (
            <Link href={uri} className={buttonClass}>
              {children}
            </Link>
          );
        } else {
          return (
            <a
              href={uri}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClass} inline-flex items-center gap-1`}
            >
              {children}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          );
        }
      },
    },
    renderMark: {
      [MARKS.BOLD]: (text: any) => <strong className="font-semibold">{text}</strong>,
      [MARKS.ITALIC]: (text: any) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text: any) => <u className="underline">{text}</u>,
    },
  };

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
              src={featuredImage}
              alt={title}
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
          {documentToReactComponents(content, richTextOptions)}
        </div>

        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Share this article</p>
            <ShareButtons title={title} slug={slug} />
          </div>
        </footer>

        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/posts/${relatedPost.slug}`} className="group">
                  <Card className="h-full overflow-hidden border-border/50 hover:border-border transition-colors">
                    {relatedPost.featuredImage && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          width={400}
                          height={225}
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold tracking-tight text-balance mb-3 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground text-pretty leading-relaxed mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <time dateTime={relatedPost.publishedAt}>
                          {new Date(relatedPost.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
