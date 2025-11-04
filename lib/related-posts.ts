import { Post, getAllPosts } from './posts-static'

interface ScoredPost {
  post: Post
  score: number
}

export function getRelatedPosts(currentPost: Post, limit = 5): Post[] {
  const allPosts = getAllPosts()

  // Remove the current post from consideration
  const otherPosts = allPosts.filter((post: Post) => post.slug !== currentPost.slug)

  // Calculate relevance score based on shared tags
  const postsWithScores: ScoredPost[] = otherPosts.map((post: Post) => {
    const sharedTags = post.tags.filter((tag: string) => currentPost.tags.includes(tag))
    const score = sharedTags.length

    // Boost score for posts with more shared tags
    return { post, score }
  })

  // Sort by score (descending), then by date (descending for tiebreaker)
  postsWithScores.sort((a: ScoredPost, b: ScoredPost) => {
    if (a.score !== b.score) {
      return b.score - a.score
    }
    return b.post.uploadTimestamp - a.post.uploadTimestamp
  })

  // Return top posts (limit to specified or available)
  return postsWithScores.slice(0, limit).map((item: ScoredPost) => item.post)
}
