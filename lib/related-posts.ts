import { Post, getAllPosts } from './posts-server'

export function getRelatedPosts(currentPost: Post, limit = 5): Post[] {
  const allPosts = getAllPosts()

  // Remove the current post from consideration
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug)

  // Calculate relevance score based on shared tags
  const postsWithScores = otherPosts.map(post => {
    const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag))
    const score = sharedTags.length

    // Boost score for posts with more shared tags
    return { post, score }
  })

  // Sort by score (descending), then by date (descending for tiebreaker)
  postsWithScores.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score
    }
    return b.post.uploadTimestamp - a.post.uploadTimestamp
  })

  // Return top posts (limit to specified or available)
  return postsWithScores.slice(0, limit).map(item => item.post)
}
