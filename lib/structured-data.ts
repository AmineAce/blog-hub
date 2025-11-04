// SEO structured data utilities for rich snippets

// Article schema for blog posts
export function generateArticleSchema(post: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified: string
  image?: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": post.datePublished,
    "dateModified": post.dateModified,
    "image": post.image,
    "url": post.url,
    "publisher": {
      "@type": "Organization",
      "name": "CompareClash Blog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://compareclash.com/logo.png"
      }
    }
  }
}

// Blog schema for main blog page
export function generateBlogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CompareClash Blog",
    "description": "Latest tech reviews, comparisons, and insights",
    "url": "https://compareclash.com",
    "publisher": {
      "@type": "Organization", 
      "name": "CompareClash Blog"
    }
  }
}

// BreadcrumbList schema
export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

// Website schema for homepage
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CompareClash",
    "description": "Tech reviews, comparisons, and insights",
    "url": "https://compareclash.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://compareclash.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
}

// Organization schema
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CompareClash",
    "url": "https://compareclash.com",
    "description": "Tech reviews, comparisons, and insights",
    "sameAs": [
      "https://twitter.com/compareclash",
      "https://linkedin.com/company/compareclash"
    ]
  }
}
