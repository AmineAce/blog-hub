# Debug Info for Rich Text Rendering Issue

## 1. Full `app/blog/[slug]/page.tsx` file

Note: The file is located at `app/posts/[slug]/page.tsx` (not `app/blog/[slug]/page.tsx`).

```typescript
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { ShareButtons } from '@/components/share-buttons'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { getPostBySlug, getPostSlugs } from '@/lib/contentful'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import Script from 'next/script'

// Add ISR configuration
export const revalidate = 300 // Revalidate every 5 minutes

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs(false)
    return slugs.map((slug) => ({
      slug,
    }))
  } catch (error) {
    // Fallback for build time when Contentful credentials are not configured
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    const post = await getPostBySlug(slug, false)
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
        publishedTime: post.publishedAt,
        images: post.featuredImage ? [post.featuredImage] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Post Not Found',
    }
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Check if we're in draft mode
  const { isEnabled } = await import('next/headers').then(m => m.draftMode())
  const preview = isEnabled

  const post = await getPostBySlug(slug, preview)
  if (!post) notFound()

  const { title, excerpt, content, publishedAt, featuredImage } = post

  // Generate structured data
  const articleSchema = generateArticleSchema({
    title,
    description: excerpt,
    author: 'CompareClash',
    datePublished: publishedAt,
    dateModified: publishedAt,
    image: featuredImage || undefined,
    url: `https://compareclash.com/posts/${slug}`,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://compareclash.com' },
    { name: 'Blog', url: 'https://compareclash.com/blog' },
    { name: title, url: `https://compareclash.com/posts/${slug}` },
  ])

  return (
    <>
      {/* Article Schema */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      {/* Breadcrumb Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <article className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back to Blog */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Featured Image */}
        {featuredImage && (
          <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-8">
            <Image
              src={featuredImage}
              alt={title}
              width={1200}
              height={600}
              className="rounded-lg shadow-lg object-cover"
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {documentToReactComponents(content)}
        </div>

        {/* Footer */}
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
```

## 2. Full `components/RichText.tsx` file

Note: This file was created for debugging but removed from the project. Including the last version:

```typescript
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface RichTextProps {
  content: any;
}

export default function RichText({ content }: RichTextProps) {
  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p className="mb-6 leading-relaxed">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: any, children: any) => (
        <h1 className="text-4xl font-bold mb-6 mt-8 text-gray-900 dark:text-gray-100">{children}</h1>
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
        <ul className="list-disc list-inside mb-6 space-y-2 pl-4">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: any) => (
        <ol className="list-decimal list-inside mb-6 space-y-2 pl-4">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
        <li className="leading-relaxed">{children}</li>
      ),
      [BLOCKS.TABLE]: (node: any, children: any) => (
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {children}
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

        if (isInternal) {
          return (
            <Link
              href={uri}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
            >
              {children}
            </Link>
          );
        } else {
          return (
            <Button asChild variant="outline" size="sm" className="inline-flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <a
                href={uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                {children}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </Button>
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
    <div className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-gray-900 dark:prose-code:text-gray-100">
      {documentToReactComponents(content, options)}
    </div>
  );
}
```

## 3. Content Model for `post` type

Based on the code in `lib/contentful.ts`, the `post` content type has the following fields:

- **title** (Text/Short text) - The post title
- **slug** (Text/Short text) - URL slug for the post
- **excerpt** (Text/Long text) - Brief description/summary
- **publishedAt** (Date & time) - Publication date
- **tags** (Array of text) - Tags for categorization
- **body** (Rich Text) - The main content
  - **Allowed embedded types**: entries, assets (images)
- **featuredImage** (Asset/Media) - Hero image

The `body` field is confirmed to be **Rich Text** with support for embedded assets (images).

## 4. Example API JSON for one post

```json
{
  "sys": {
    "id": "example-post-id",
    "type": "Entry",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "environment": {
      "sys": {
        "id": "master",
        "type": "Link",
        "linkType": "Environment"
      }
    },
    "contentType": {
      "sys": {
        "id": "post",
        "type": "Link",
        "linkType": "ContentType"
      }
    }
  },
  "fields": {
    "body": {
      "nodeType": "document",
      "data": {},
      "content": [
        {
          "nodeType": "paragraph",
          "data": {},
          "content": [
            {
              "nodeType": "text",
              "value": "This is a sample paragraph with ",
              "marks": [],
              "data": {}
            },
            {
              "nodeType": "text",
              "value": "bold",
              "marks": [
                {
                  "type": "bold"
                }
              ],
              "data": {}
            },
            {
              "nodeType": "text",
              "value": " and ",
              "marks": [],
              "data": {}
            },
            {
              "nodeType": "text",
              "value": "italic",
              "marks": [
                {
                  "type": "italic"
                }
              ],
              "data": {}
            },
            {
              "nodeType": "text",
              "value": " text.",
              "marks": [],
              "data": {}
            }
          ]
        },
        {
          "nodeType": "heading-1",
          "data": {},
          "content": [
            {
              "nodeType": "text",
              "value": "Sample Heading",
              "marks": [],
              "data": {}
            }
          ]
        },
        {
          "nodeType": "unordered-list",
          "data": {},
          "content": [
            {
              "nodeType": "list-item",
              "data": {},
              "content": [
                {
                  "nodeType": "paragraph",
                  "data": {},
                  "content": [
                    {
                      "nodeType": "text",
                      "value": "List item 1",
                      "marks": [],
                      "data": {}
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "nodeType": "embedded-asset-block",
          "data": {
            "target": {
              "sys": {
                "id": "asset-id",
                "type": "Link",
                "linkType": "Asset"
              }
            }
          },
          "content": []
        }
      ]
    }
  }
}
```

API URL: `https://cdn.contentful.com/spaces/YOUR_SPACE_ID/environments/master/entries?content_type=post&limit=1`

Replace `YOUR_SPACE_ID` with your actual space ID and include your CDA token in the Authorization header.

## 5. Data fetching method used

- [x] App Router (uses `generateStaticParams`)
- [x] SDK (uses `contentful.createClient`)

## 6. Screenshot placeholders

![Broken Page](screenshots/broken-page.png)
![Console Errors](screenshots/console-errors.png)

## 7. Current rendering issues

- Text is truncated (e.g., "breakd" instead of "breakdown")
- Table is misaligned (prices in wrong columns)
- Links are plain text
- No spacing between paragraphs
- Bold/italic not rendering
- Lists not styled
