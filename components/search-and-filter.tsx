"use client"

import { useState, useMemo, useEffect, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { Post } from "@/lib/posts-server"
import { getFilteredPosts } from "@/app/actions"

interface SearchAndFilterProps {
  posts: Post[]
  onFilteredPosts: (filtered: Post[]) => void
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
  const [filteredResults, setFilteredResults] = useState<Post[]>(posts.slice(1)) // Initial recent posts

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = new Set<string>()
    posts.forEach(post => {
      post.tags.forEach(tag => categories.add(tag))
    })
    return Array.from(categories).sort()
  }, [posts])

  // Fetch filtered posts when filters change
  useEffect(() => {
    startTransition(async () => {
      try {
        const filtered = await getFilteredPosts(searchQuery, selectedCategory)
        setFilteredResults(filtered)
        onFilteredPosts(filtered)
      } catch (error) {
        console.error('Error filtering posts:', error)
      }
    })
  }, [searchQuery, selectedCategory, onFilteredPosts])

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
    </div>
  )
}
