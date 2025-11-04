import { getAllPosts } from '@/lib/posts-static'
import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://compareclash.netlify.app/'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.uploadTimestamp),
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
