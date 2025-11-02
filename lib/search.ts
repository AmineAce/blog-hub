import MiniSearch from 'minisearch'
import { getAllPosts } from './posts-server'

let miniSearch: MiniSearch | null = null

export function initializeSearchIndex() {
  if (miniSearch) return miniSearch

  const posts = getAllPosts()

  miniSearch = new MiniSearch({
    fields: ['title', 'excerpt', 'content', 'tags', 'categories'], // fields to index
    storeFields: ['title', 'excerpt', 'slug', 'formattedDate', 'tags', 'categories'], // fields to store for results
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
  })))

  return miniSearch
}

export function searchPosts(query: string, limit = 10) {
  const searchIndex = initializeSearchIndex()
  const results = searchIndex.search(query)
  return results.slice(0, limit)
}
