import pkg from 'contentful-management';
import * as fs from 'fs';
import * as path from 'path';

const { createClient } = pkg;

// Read the migration data
const migrationDataPath = path.join(process.cwd(), 'migration-data.json');
const posts = JSON.parse(fs.readFileSync(migrationDataPath, 'utf8'));

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
});

async function importPosts() {
  try {
    console.log('🚀 Starting Contentful import...');
    
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    console.log(`📍 Connected to space: ${space.name}`);
    console.log(`🌍 Environment: ${process.env.CONTENTFUL_ENVIRONMENT || 'master'}`);
    console.log(`📝 Importing ${posts.length} posts...`);
    
    // Import each post
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      console.log(`\n📄 Processing ${i + 1}/${posts.length}: ${post.title}`);
      
      try {
        // Create entry
        const entry = await env.createEntry('post', {
          fields: {
            title: { 'en-US': post.title },
            slug: { 'en-US': post.slug },
            excerpt: { 'en-US': post.excerpt },
            body: post.body,
            tags: { 'en-US': post.tags },
            publishedAt: { 'en-US': post.publishedAt },
          },
        });

        // Publish entry
        const publishedEntry = await entry.publish();
        console.log(`✅ Published: ${post.title} (ID: ${publishedEntry.sys.id})`);
        
      } catch (error) {
        console.error(`❌ Error importing "${post.title}":`, error);
        continue;
      }
    }
    
    console.log('\n🎉 Import completed! Check your Contentful dashboard to verify all posts.');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importPosts();
