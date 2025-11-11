const pkg = require('contentful-management');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') }); // Load .env.local explicitly

const { createClient } = pkg;

// Read the migration data
const migrationDataPath = path.join(process.cwd(), 'migration-data.json');
const posts = JSON.parse(fs.readFileSync(migrationDataPath, 'utf8'));

// Convert markdown text to Contentful RichText format
function markdownToRichText(markdownText) {
  // Simple conversion to RichText JSON structure
  // In a production environment, you might want to use a proper markdown-to-rich-text converter
  const paragraphs = markdownText
    .split('\n\n')
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => ({
      nodeType: 'paragraph',
      content: [{
        nodeType: 'text',
        value: para,
        marks: [],
        data: {}
      }],
      data: {}
    }));

  return {
    nodeType: 'document',
    content: paragraphs,
    data: {}
  };
}

// Convert date string to Contentful Date format
function convertToContentfulDate(dateString) {
  // Convert "2024-10-01" to proper date format
  return new Date(dateString).toISOString();
}

// Debug: Log environment variables (masked for security)
console.log('🔍 Environment check:');
console.log('CONTENTFUL_SPACE_ID:', process.env.CONTENTFUL_SPACE_ID ? '✓ Set' : '❌ Missing');
console.log('CONTENTFUL_ENVIRONMENT:', process.env.CONTENTFUL_ENVIRONMENT || 'master (default)');
console.log('CONTENTFUL_MANAGEMENT_TOKEN:', process.env.CONTENTFUL_MANAGEMENT_TOKEN ? '✓ Set (masked)' : '❌ Missing');
console.log('Posts to import:', posts.length);

if (!process.env.CONTENTFUL_SPACE_ID) {
  console.error('❌ Missing CONTENTFUL_SPACE_ID environment variable');
  process.exit(1);
}

if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
  console.error('❌ Missing CONTENTFUL_MANAGEMENT_TOKEN environment variable');
  process.exit(1);
}

const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function importPosts() {
  try {
    console.log('\n🚀 Starting Contentful import...');
    
    // Get space and environment
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    console.log(`📍 Connected to space: ${space.name}`);
    console.log(`🌍 Environment: ${process.env.CONTENTFUL_ENVIRONMENT || 'master'}`);
    console.log(`📝 Importing ${posts.length} posts...\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Import each post
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      console.log(`📄 Processing ${i + 1}/${posts.length}: ${post.title}`);
      
      try {
        // Check if post with this slug already exists
        const existingEntries = await env.getEntries({
          'fields.slug': post.slug,
          content_type: 'post',
          limit: 1
        });
        
        if (existingEntries.items.length > 0) {
          console.log(`⏭️  Skipping "${post.title}" - already exists (ID: ${existingEntries.items[0].sys.id})`);
          continue;
        }
        
        // Convert content to proper Contentful formats
        const bodyRichText = markdownToRichText(post.body['en-US']);
        const publishedDate = convertToContentfulDate(post.publishedAt);
        
        // Create entry with proper field types
        const entry = await env.createEntry('post', {
          fields: {
            title: { 'en-US': post.title },
            slug: { 'en-US': post.slug },
            excerpt: { 'en-US': post.excerpt },
            body: { 'en-US': bodyRichText },
            featuredImage: { 'en-US': post.featuredImage },
            tags: { 'en-US': post.tags },
            publishedAt: { 'en-US': publishedDate },
          },
        });

        // Publish entry
        const publishedEntry = await entry.publish();
        console.log(`✅ Published: ${post.title} (ID: ${publishedEntry.sys.id})`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Error importing "${post.title}":`, error.message);
        errorCount++;
        continue;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} posts`);
    console.log(`❌ Failed to import: ${errorCount} posts`);
    console.log('\n🎉 Import process completed!');
    console.log('📋 Next steps:');
    console.log('   1. Visit your Contentful dashboard at https://app.contentful.com');
    console.log('   2. Go to Content > Content types > post');
    console.log('   3. Verify all posts are visible and published');
    console.log('   4. Check that slugs match the kebab-case format');
    console.log('   5. Verify that rich text content renders correctly');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

importPosts();
