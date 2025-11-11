import { getAllPosts } from '@/lib/contentful'
import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://compareclash.netlify.app/'

interface ContentfulPost {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  tags?: string[];
  content: any;
  featuredImage?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts: ContentfulPost[] = await getAllPosts()

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      priority: 1.0,
      changeFrequency: 'daily',
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: 'daily',
    },
    ...postEntries,
  ]
}
