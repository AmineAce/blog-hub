"use client"

import { useState, useEffect, useMemo } from "react";
import { Search, ArrowRight } from "lucide-react";
import { SearchDocument } from "../types/search";
import { useSearch } from "./search-context";
import Image from "next/image";

export default function SearchDialog() {
  const { searchOpen, setSearchOpen } = useSearch();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Load index once
  useEffect(() => {
    fetch('/search-index.json')
      .then(r => r.json())
      .then(data => {
        setIndex(data.documents);
        setLoading(false);
      });
  }, []);

  // Reset query when dialog closes
  useEffect(() => {
    if (!searchOpen) {
      setQuery('');
    }
  }, [searchOpen]);

  // Close on escape key and click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Close if clicked on the backdrop (not on the search card)
      if (target.closest('.search-dialog-card') === null) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return index.filter(post =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [query, index]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-start justify-center pt-20 overflow-y-auto">
      <div className="search-dialog-card relative w-full max-w-2xl mx-4 bg-background border rounded-lg shadow-2xl my-8">
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 h-12 text-base rounded-lg border bg-background"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-3 animate-pulse">
                  <div className="w-16 h-12 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-6 space-y-4">
              {results.map((post) => (
                <a
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className="block group hover:bg-muted/50 rounded-lg p-3 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-12 rounded overflow-hidden bg-muted">
                        <Image
                          src={post.image || `/placeholder.svg?height=48&width=64&query=${encodeURIComponent(post.title)}`}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                        <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-6 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords or check your spelling.
              </p>
            </div>
          )}

          {!loading && !query && (
            <div className="p-6 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Start typing to search</h3>
              <p className="text-muted-foreground">
                Find posts by title, content, or tags.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
