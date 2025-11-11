// lib/search-static.ts
// Zero-JS static search implementation

export interface StaticSearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  formattedDate: string;
  tags: string[];
  categories: string[];
  image?: string;
}

export interface StaticSearchIndex {
  documents: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    tags: string[];
    image?: string;
  }[];
  updatedAt: string;
  version: string;
}

// Cache for the search index
let searchIndex: StaticSearchIndex | null = null;
let isLoading = false;

// Load the search index from the static file
async function loadSearchIndex(): Promise<StaticSearchIndex> {
  if (searchIndex) {
    return searchIndex;
  }

  if (isLoading) {
    // Wait for the current loading to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return searchIndex!;
  }

  isLoading = true;
  
  try {
    const response = await fetch('/search-index.json');
    if (!response.ok) {
      throw new Error(`Failed to load search index: ${response.statusText}`);
    }
    
    searchIndex = await response.json();
    return searchIndex!;
  } catch (error) {
    console.error('Failed to load search index:', error);
    throw new Error('Search functionality is temporarily unavailable. Please try again later.');
  } finally {
    isLoading = false;
  }
}

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Simple string similarity scoring
function calculateScore(query: string, text: string, field: 'title' | 'excerpt' | 'tags'): number {
  if (!query || !text) return 0;
  
  const queryLower = query.toLowerCase().trim();
  const textLower = text.toLowerCase();
  
  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    switch (field) {
      case 'title': return 100;
      case 'tags': return 75;
      case 'excerpt': return 50;
      default: return 25;
    }
  }
  
  // Word boundary matches
  const words = queryLower.split(/\s+/);
  let score = 0;
  
  for (const word of words) {
    if (word.length > 1 && textLower.includes(word)) {
      switch (field) {
        case 'title': score += 20;
        case 'tags': score += 15;
        case 'excerpt': score += 10;
      }
    }
  }
  
  return score;
}

// Search function with fuzzy matching
export async function searchStaticPosts(query: string, limit = 10): Promise<StaticSearchResult[]> {
  try {
    if (!query || typeof query !== 'string') {
      return [];
    }

    const index = await loadSearchIndex();
    const queryLower = query.toLowerCase().trim();
    
    if (!queryLower) {
      return [];
    }

    // Score and sort results
    const scoredResults = index.documents
      .map(doc => {
        const titleScore = calculateScore(query, doc.title, 'title');
        const excerptScore = calculateScore(query, doc.excerpt, 'excerpt');
        const tagsScore = calculateScore(query, doc.tags.join(' '), 'tags');
        
        const totalScore = titleScore + excerptScore + tagsScore;
        
        return {
          ...doc,
          score: totalScore,
          formattedDate: formatDate(doc.publishedAt)
        };
      })
      .filter(result => result.score > 0) // Only include results with some relevance
      .sort((a, b) => b.score - a.score) // Sort by relevance score
      .slice(0, limit) // Limit results
      .map(({ score, ...result }) => ({
        id: result.id,
        title: result.title,
        excerpt: result.excerpt,
        slug: result.slug,
        formattedDate: result.formattedDate,
        tags: result.tags,
        categories: [], // No categories in current data
        image: result.image
      }));

    return scoredResults;
  } catch (error) {
    console.error('Static search operation failed:', error);
    throw new Error('Search encountered an error. Please check your connection and try again.');
  }
}

// Get trending/popular posts (for empty search state)
export async function getTrendingPosts(limit = 6): Promise<StaticSearchResult[]> {
  try {
    const index = await loadSearchIndex();
    
    // Return most recent posts as "trending"
    const recentPosts = index.documents
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit)
      .map(doc => ({
        id: doc.id,
        title: doc.title,
        excerpt: doc.excerpt,
        slug: doc.slug,
        formattedDate: formatDate(doc.publishedAt),
        tags: doc.tags,
        categories: [],
        image: doc.image
      }));

    return recentPosts;
  } catch (error) {
    console.error('Failed to get trending posts:', error);
    return [];
  }
}

// Filter posts by search query and category (for compatibility with search-and-filter)
export async function getFilteredStaticPosts(searchQuery: string, selectedCategory: string): Promise<StaticSearchResult[]> {
  try {
    const index = await loadSearchIndex();
    let filtered = index.documents;

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(queryLower) ||
        doc.excerpt.toLowerCase().includes(queryLower) ||
        doc.tags.some(tag => tag.toLowerCase().includes(queryLower))
      );
    }

    // Note: Categories not implemented in Contentful yet, so we skip category filtering
    // if (selectedCategory && selectedCategory !== 'all') {
    //   filtered = filtered.filter(post => post.categories.includes(selectedCategory));
    // }

    // Return all matching posts sorted by published date (newest first)
    return filtered
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .map(doc => ({
        id: doc.id,
        title: doc.title,
        excerpt: doc.excerpt,
        slug: doc.slug,
        formattedDate: formatDate(doc.publishedAt),
        tags: doc.tags,
        categories: [],
        image: doc.image
      }));
  } catch (error) {
    console.error('Failed to filter posts:', error);
    return [];
  }
}

// Warm up the search index (preload for instant search)
export async function preloadSearchIndex(): Promise<void> {
  try {
    await loadSearchIndex();
  } catch (error) {
    console.warn('Failed to preload search index:', error);
    // Don't throw - this is just a performance optimization
  }
}
