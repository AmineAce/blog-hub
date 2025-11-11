// types/search.ts
export interface SearchDocument {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  image?: string;
}

export interface SearchIndex {
  documents: SearchDocument[];
  updatedAt: string;
  version: string;
}
