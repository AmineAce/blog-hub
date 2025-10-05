import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readTime: number
  image?: string
  formattedDate: string
}

const postsDirectory = path.join(process.cwd(), 'posts')

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  // More accurate word counting - remove markdown syntax and count actual words
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
  
  const words = cleanContent.split(/\s+/).filter(word => word.length > 0).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString // Return original if invalid
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString // Return original if error
  }
}

function getImagePath(slug: string): string | undefined {
  const imagePath = `/images/posts/${slug}.jpg`
  const fullPath = path.join(process.cwd(), 'public', 'images', 'posts', `${slug}.jpg`)
  
  // Check if image exists
  if (fs.existsSync(fullPath)) {
    return imagePath
  }
  
  // Check for other common image formats
  const extensions = ['.png', '.webp', '.jpeg', '.gif']
  for (const ext of extensions) {
    const altPath = path.join(process.cwd(), 'public', 'images', 'posts', `${slug}${ext}`)
    if (fs.existsSync(altPath)) {
      return `/images/posts/${slug}${ext}`
    }
  }
  
  return undefined
}

function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''))
}

function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    const image = getImagePath(slug)
    const formattedDate = formatDate(data.date || '')
    
    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      excerpt: data.excerpt || '',
      content,
      readTime: calculateReadTime(content),
      image,
      formattedDate,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

// Server-side functions
export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      // Sort by date descending (newest first)
      if (dateA !== dateB) {
        return dateB - dateA
      }
      // If dates are the same, sort by title for consistent ordering
      return a.title.localeCompare(b.title)
    })

  return posts
}

export { getPostBySlug }
