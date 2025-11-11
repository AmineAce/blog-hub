// scripts/generate-search-index.ts
import { writeFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { getAllPosts } from '../lib/contentful';

// Load environment variables from .env.local
config({ path: '.env.local' });

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
  image?: string;
}

interface SearchIndex {
  documents: Post[];
  updatedAt: string;
  version: string;
}

async function generateSearchIndex() {
  try {
    console.log('🔍 Fetching posts from Contentful...');
    
    // Fetch all posts (preview=false for build time)
    const posts = await getAllPosts(false);
    
    console.log(`📝 Found ${posts.length} posts`);
    
    // Transform posts into search documents
    const documents: Post[] = posts.map((post: any) => ({
      id: post.slug, // Use slug as unique ID
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      tags: post.tags || [],
      image: post.featuredImage || undefined,
    }));
    
    // Create the search index structure
    const index: SearchIndex = {
      documents,
      updatedAt: new Date().toISOString(),
      version: '1.0.0', // For future migrations
    };
    
    // Write to public directory
    const outputPath = join(process.cwd(), 'public', 'search-index.json');
    writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf8');
    
    console.log(`✅ Search index generated successfully!`);
    console.log(`📁 Location: ${outputPath}`);
    console.log(`📊 Documents: ${documents.length}`);
    console.log(`🕒 Updated: ${index.updatedAt}`);
    
    // Log sample document for verification
    if (documents.length > 0) {
      console.log('📄 Sample document:', {
        title: documents[0].title,
        excerpt: documents[0].excerpt.substring(0, 100) + '...',
        tags: documents[0].tags
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to generate search index:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateSearchIndex();
}

export { generateSearchIndex };
