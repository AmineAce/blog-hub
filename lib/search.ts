import MiniSearch from 'minisearch'
import { getAllPosts } from './posts-static'

let miniSearch: MiniSearch | null = null

export async function initializeSearchIndex() {
  if (miniSearch) return miniSearch

  const posts = getAllPosts()

  miniSearch = new MiniSearch({
    fields: ['title', 'excerpt', 'content', 'tags', 'categories'], // fields to index
    storeFields: ['title', 'excerpt', 'slug', 'formattedDate', 'tags', 'categories', 'image'], // fields to store for results
    searchOptions: {
      fuzzy: 0.2, // fuzzy matching
      prefix: true, // prefix matching
      boost: { title: 3, tags: 2, categories: 2, excerpt: 1.5 }, // boost title, tags and categories higher
    }
  })

  // Add posts to the search index
  miniSearch.addAll(posts.map(post => ({
    id: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    tags: post.tags.join(' '),
    categories: post.categories.join(' '),
    slug: post.slug,
    formattedDate: post.formattedDate,
    image: post.image,
  })))

  return miniSearch
}

export async function searchPosts(query: string, limit = 10) {
  const searchIndex = await initializeSearchIndex()
  const results = searchIndex.search(query)
  return results.slice(0, limit).map(result => ({
    id: result.id,
    title: (result as any).title,
    excerpt: (result as any).excerpt,
    slug: (result as any).slug,
    formattedDate: (result as any).formattedDate,
    tags: (result as any).tags ? (result as any).tags.split(' ') : [],
    categories: (result as any).categories ? (result as any).categories.split(' ') : [],
    image: (result as any).image
  }))
}

export function getFilteredPosts(searchQuery: string, selectedCategory: string) {
  let posts = getAllPosts()

  if (searchQuery) {
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.categories.some(category => category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  if (selectedCategory && selectedCategory !== 'all') {
    posts = posts.filter(post => post.categories.includes(selectedCategory))
  }

  return posts // Already sorted by uploadTimestamp desc
}
