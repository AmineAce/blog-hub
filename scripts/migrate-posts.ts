import { writeFileSync } from 'fs';
import { getAllPosts } from '../lib/posts-server';

async function exportPosts() {
  try {
    const posts = await getAllPosts();
    
    const migrationData = posts.map(post => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: { "en-US": post.content }, // Contentful expects locale object
      featuredImage: null, // we'll add manually later
      tags: post.tags || [],
      publishedAt: post.date,
    }));

    writeFileSync('migration-data.json', JSON.stringify(migrationData, null, 2));
    console.log(`Exported ${posts.length} posts to migration-data.json`);
    
    // Log some details for verification
    console.log('\nPost details:');
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.slug})`);
    });
    
  } catch (error) {
    console.error('Error exporting posts:', error);
    process.exit(1);
  }
}

exportPosts();
