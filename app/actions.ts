"use server"

import { getAllPosts } from "@/lib/posts-server"
import MiniSearch from 'minisearch'

let miniSearch: MiniSearch | null = null

export async function initializeSearchIndex() {
  if (miniSearch) return miniSearch

  const posts = getAllPosts()

  miniSearch = new MiniSearch({
    fields: ['title', 'excerpt', 'content', 'tags'], // fields to index
    storeFields: ['title', 'excerpt', 'slug', 'formattedDate', 'tags', 'image'], // fields to store for results
    searchOptions: {
      fuzzy: 0.2, // fuzzy matching
      prefix: true, // prefix matching
      boost: { title: 3, tags: 2, excerpt: 1.5 }, // boost title and tags higher
    }
  })

  // Add posts to the search index
  miniSearch.addAll(posts.map(post => ({
    id: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    tags: post.tags.join(' '),
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
    image: (result as any).image
  }))
}

export async function getFilteredPosts(searchQuery: string, selectedCategory: string) {
  let posts = getAllPosts()

  if (searchQuery) {
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  if (selectedCategory && selectedCategory !== 'all') {
    posts = posts.filter(post => post.tags.includes(selectedCategory))
  }

  return posts // Already sorted by uploadTimestamp desc
}
