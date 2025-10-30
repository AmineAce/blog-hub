"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Clock, Search, ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { searchPosts } from "@/app/actions"
import Image from "next/image"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SearchResult {
  id: string
  title: string
  excerpt: string
  slug: string
  formattedDate: string
  tags: string[]
  image?: string
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Clear results when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
    }
  }, [open])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const searchResults = await searchPosts(query, 6) // Limit to 6 results for dialog
        setResults(searchResults.map(result => ({
          id: result.id,
          title: (result as any).title || '',
          excerpt: (result as any).excerpt || '',
          slug: (result as any).slug || '',
          formattedDate: (result as any).formattedDate || '',
          tags: Array.isArray(result.tags) ? result.tags : ((result as any).tags ? (result as any).tags.split(' ') : []),
          image: (result as any).image
        })))
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      }
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleResultClick = (slug: string) => {
    onOpenChange(false)
    router.push(`/posts/${slug}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      // Navigate to first result on Enter
      handleResultClick(results[0].slug)
    } else if (e.key === 'Escape') {
      onOpenChange(false)
      setQuery("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden p-0" showCloseButton={false}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Search Posts</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 h-12 text-base"
              autoFocus
            />

          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-0">
          {query.trim() && (
            <div className="mb-4 text-sm text-muted-foreground">
              {isLoading ? (
                "Searching..."
              ) : (
                results.length === 0 ?
                  "No results found. Try different keywords." :
                  `${results.length} result${results.length !== 1 ? 's' : ''} found`
              )}
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/posts/${result.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="block group hover:bg-muted/50 rounded-lg p-3 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-12 rounded overflow-hidden bg-muted">
                        <Image
                          src={result.image || `/placeholder.svg?height=48&width=64&query=${encodeURIComponent(result.title)}`}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors mb-1">
                        {result.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {result.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {result.formattedDate}
                        {result.tags.length > 0 && (
                          <span>•</span>
                        )}
                        {result.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                        <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}


            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
