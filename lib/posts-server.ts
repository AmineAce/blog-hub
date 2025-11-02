import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Post {
  slug: string
  title: string
  date: string
  time: string
  excerpt: string
  content: string
  readTime: number
  image?: string
  formattedDate: string
  uploadTimestamp: number
  tags: string[]
  categories: string[]
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

    const fileStats = fs.statSync(fullPath)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const image = getImagePath(slug)
    const formattedDate = formatDate(data.date || '')
    const time = data.time || ''
    let uploadTimestamp: number

    // Use date and time from frontmatter for uploadTimestamp
    if (data.date) {
      try {
        // Normalize date to YYYY-MM-DD format with leading zeros
        const normalizedDate = data.date.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, (match: string, year: string, month: string, day: string) => `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
        const dateTimeString = time ? `${normalizedDate}T${time}:00` : `${normalizedDate}T00:00:00`
        const parsedDate = new Date(dateTimeString)
        if (!isNaN(parsedDate.getTime())) {
          uploadTimestamp = parsedDate.getTime()
        } else {
          uploadTimestamp = fileStats.mtime.getTime()
        }
      } catch (error) {
        uploadTimestamp = fileStats.mtime.getTime()
      }
    } else {
      uploadTimestamp = fileStats.mtime.getTime()
    }

    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      time,
      excerpt: data.excerpt || '',
      content,
      readTime: calculateReadTime(content),
      image,
      formattedDate,
      uploadTimestamp,
      tags: data.tags || [],
      categories: data.categories || [],
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

// Server-side functions
export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => {
      // Ensure uploadTimestamp is a valid number; default to 0 if invalid
      const timestampA = typeof a.uploadTimestamp === 'number' && !isNaN(a.uploadTimestamp) ? a.uploadTimestamp : 0;
      const timestampB = typeof b.uploadTimestamp === 'number' && !isNaN(b.uploadTimestamp) ? b.uploadTimestamp : 0;

      // Sort by uploadTimestamp descending (latest first)
      if (timestampA !== timestampB) {
        return timestampB - timestampA;
      }

      // If timestamps are the same, sort by title for consistent ordering
      return a.title.localeCompare(b.title);
    });

  // Log for debugging
  console.log(
    'Sorted posts:',
    posts.map((p) => ({
      title: p.title,
      uploadTimestamp: p.uploadTimestamp,
      timestampReadable: p.uploadTimestamp ? new Date(p.uploadTimestamp).toISOString() : 'Invalid timestamp',
    }))
  );

  return posts;
}

export { getPostBySlug }

// Server-side functions for categories/tags
export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts()
  return posts.filter((post) => post.tags.includes(tag))
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = new Set<string>()
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
}

// Category-specific functions
export function getPostsByCategory(category: string): Post[] {
  const posts = getAllPosts()
  return posts.filter((post) => post.categories.includes(category))
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = new Set<string>()
  posts.forEach(post => {
    post.categories.forEach(category => categories.add(category))
  })
  return Array.from(categories).sort()
}
