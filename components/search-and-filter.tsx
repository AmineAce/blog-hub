"use client"

import { useState, useMemo, useEffect, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { getFilteredStaticPosts, type StaticSearchResult } from "@/lib/search-static"

interface ContentfulPost {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  tags?: string[];
}

interface SearchAndFilterProps {
  posts: ContentfulPost[]
  onFilteredPosts: (filtered: ContentfulPost[]) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export function SearchAndFilter({
  posts,
  onFilteredPosts,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}: SearchAndFilterProps) {
  const [isPending, startTransition] = useTransition()
  const [filteredResults, setFilteredResults] = useState<StaticSearchResult[]>([])

  // Note: Categories not implemented in Contentful yet
  const allCategories = useMemo(() => {
    return [] // Empty for now
  }, [])

  // Fetch filtered posts when filters change
  useEffect(() => {
    startTransition(async () => {
      try {
        const filtered = await getFilteredStaticPosts(searchQuery, selectedCategory)
        setFilteredResults(filtered)
        
        // Convert back to ContentfulPost format for compatibility
        // Note: We're using current date as fallback since StaticSearchResult doesn't have raw publishedAt
        const convertedPosts: ContentfulPost[] = filtered.map(post => ({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          publishedAt: new Date().toISOString(), // Use current date as fallback
          tags: post.tags
        }))
        
        onFilteredPosts(convertedPosts)
      } catch (error) {
        console.error('Error filtering posts:', error)
        // Fallback to original posts on error
        onFilteredPosts(posts)
      }
    })
  }, [searchQuery, selectedCategory, onFilteredPosts, posts])

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Performance indicator */}
      <div className="text-xs text-muted-foreground hidden sm:block">
        ⚡ Static Search
      </div>
    </div>
  )
}
