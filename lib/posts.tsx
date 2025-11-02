export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readTime: number
  image?: string
  formattedDate: string
  tags: string[]
  categories: string[]
}

// Client-side functions - return empty array since we only want server-side posts
export function getAllPostsClient(): Post[] {
  return []
}

export function getPostBySlugClient(slug: string): Post | null {
  return null
}
