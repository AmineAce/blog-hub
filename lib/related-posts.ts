import { getAllPosts } from './contentful'

interface ContentfulPost {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  tags?: string[];
}

interface ScoredPost {
  post: ContentfulPost
  score: number
}

export async function getRelatedPosts(currentPost: ContentfulPost, limit = 5): Promise<ContentfulPost[]> {
  const allPosts = await getAllPosts()

  // Remove the current post from consideration
  const otherPosts = allPosts.filter((post: ContentfulPost) => post.slug !== currentPost.slug)

  // Calculate relevance score based on shared tags
  const postsWithScores: ScoredPost[] = otherPosts.map((post: ContentfulPost) => {
    const sharedTags = post.tags && currentPost.tags ?
      post.tags.filter((tag: string) => currentPost.tags!.includes(tag)) : []
    const score = sharedTags.length

    // Boost score for posts with more shared tags
    return { post, score }
  })

  // Sort by score (descending), then by date (descending for tiebreaker)
  postsWithScores.sort((a: ScoredPost, b: ScoredPost) => {
    if (a.score !== b.score) {
      return b.score - a.score
    }
    return new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime()
  })

  // Return top posts (limit to specified or available)
  return postsWithScores.slice(0, limit).map((item: ScoredPost) => item.post)
}
