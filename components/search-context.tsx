"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { SearchButton } from './search-button'
import SearchDialog from './search-dialog'

interface SearchContextType {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextType | null>(null)

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <SearchContext.Provider value={{ searchOpen, setSearchOpen }}>
      {children}
      <SearchDialog />
    </SearchContext.Provider>
  )
}
