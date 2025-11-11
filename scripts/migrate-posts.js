const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Post interface equivalent for this script
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  // More accurate word counting - remove markdown syntax and count actual words
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  const words = cleanContent.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString; // Return original if error
  }
}

function getImagePath(slug) {
  const imagePath = `/images/posts/${slug}.jpg`;
  const fullPath = path.join(process.cwd(), 'public', 'images', 'posts', `${slug}.jpg`);
  
  // Check if image exists
  if (fs.existsSync(fullPath)) {
    return imagePath;
  }
  
  // Check for other common image formats
  const extensions = ['.png', '.webp', '.jpeg', '.gif'];
  for (const ext of extensions) {
    const altPath = path.join(process.cwd(), 'public', 'images', 'posts', `${slug}${ext}`);
    if (fs.existsSync(altPath)) {
      return `/images/posts/${slug}${ext}`;
    }
  }
  
  return undefined;
}

function getPostSlugs() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''));
}

function getPostBySlug(slug) {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileStats = fs.statSync(fullPath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const image = getImagePath(slug);
    const formattedDate = formatDate(data.date || '');
    const time = data.time || '';
    let uploadTimestamp;

    // Use date and time from frontmatter for uploadTimestamp
    if (data.date) {
      try {
        // Normalize date to YYYY-MM-DD format with leading zeros
        const normalizedDate = data.date.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, (match, year, month, day) => `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        const dateTimeString = time ? `${normalizedDate}T${time}:00` : `${normalizedDate}T00:00:00`;
        const parsedDate = new Date(dateTimeString);
        if (!isNaN(parsedDate.getTime())) {
          uploadTimestamp = parsedDate.getTime();
        } else {
          uploadTimestamp = fileStats.mtime.getTime();
        }
      } catch (error) {
        uploadTimestamp = fileStats.mtime.getTime();
      }
    } else {
      uploadTimestamp = fileStats.mtime.getTime();
    }

    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      time,
      excerpt: data.excerpt || '',
      content,
      readTime: calculateReadTime(content),
      image,
      formattedDate,
      uploadTimestamp,
      tags: data.tags || [],
      categories: data.categories || [],
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post) => post !== null)
    .sort((a, b) => {
      // Ensure uploadTimestamp is a valid number; default to 0 if invalid
      const timestampA = typeof a.uploadTimestamp === 'number' && !isNaN(a.uploadTimestamp) ? a.uploadTimestamp : 0;
      const timestampB = typeof b.uploadTimestamp === 'number' && !isNaN(b.uploadTimestamp) ? b.uploadTimestamp : 0;

      // Sort by uploadTimestamp descending (latest first)
      if (timestampA !== timestampB) {
        return timestampB - timestampA;
      }

      // If timestamps are the same, sort by title for consistent ordering
      return a.title.localeCompare(b.title);
    });

  return posts;
}

async function exportPosts() {
  try {
    const posts = getAllPosts();
    
    const migrationData = posts.map(post => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: { "en-US": post.content }, // Contentful expects locale object
      featuredImage: null, // we'll add manually later
      tags: post.tags || [],
      publishedAt: post.date,
    }));

    fs.writeFileSync('migration-data.json', JSON.stringify(migrationData, null, 2));
    console.log(`Exported ${posts.length} posts to migration-data.json`);
    
    // Log some details for verification
    console.log('\nPost details:');
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.slug})`);
    });
    
    // Check for unique slugs
    const slugs = posts.map(p => p.slug);
    const uniqueSlugs = [...new Set(slugs)];
    if (slugs.length !== uniqueSlugs.length) {
      console.log('\n⚠️ Warning: Duplicate slugs detected!');
    } else {
      console.log('\n✅ All slugs are unique');
    }
    
    // Check if slugs are in kebab-case
    const kebabCaseRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const nonKebabCaseSlugs = posts.filter(p => !kebabCaseRegex.test(p.slug));
    if (nonKebabCaseSlugs.length > 0) {
      console.log('\n⚠️ Warning: Some slugs are not in kebab-case:');
      nonKebabCaseSlugs.forEach(p => console.log(`   - ${p.slug}`));
    } else {
      console.log('✅ All slugs are in kebab-case format');
    }
    
  } catch (error) {
    console.error('Error exporting posts:', error);
    process.exit(1);
  }
}

exportPosts();
