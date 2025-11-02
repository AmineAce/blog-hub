#!/usr/bin/env node
/**
 * Script to check image existence and dimensions
 * Run with: node scripts/check-images.mjs
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = './posts'
const IMAGES_DIR = './public/images/posts'

function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    return []
  }
  
  const fileNames = fs.readdirSync(POSTS_DIR)
  return fileNames
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''))
}

function checkImageExists(imagePath) {
  const fullPath = path.join(process.cwd(), imagePath)
  return fs.existsSync(fullPath)
}

function getImageDimensions(imagePath) {
  try {
    const fullPath = path.join(process.cwd(), imagePath)
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    // For this simple script, we'll just check file existence
    // In a real scenario, you might use a library like 'image-size'
    const stats = fs.statSync(fullPath)
    return {
      exists: true,
      size: stats.size,
      path: imagePath
    }
  } catch (error) {
    return {
      exists: false,
      path: imagePath
    }
  }
}

async function main() {
  console.log('🔍 Checking blog images...\n')
  
  const posts = getAllPosts()
  console.log(`Found ${posts.length} posts\n`)
  
  let missingImages = []
  let existingImages = []
  
  for (const postSlug of posts) {
    try {
      const fullPath = path.join(POSTS_DIR, `${postSlug}.md`)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      
      if (data.image) {
        const imageInfo = getImageDimensions(data.image)
        
        if (imageInfo.exists) {
          existingImages.push({
            post: postSlug,
            image: data.image,
            ...imageInfo
          })
        } else {
          missingImages.push({
            post: postSlug,
            image: data.image,
            expectedPath: data.image
          })
        }
      }
    } catch (error) {
      console.error(`Error processing post ${postSlug}:`, error.message)
    }
  }
  
  console.log('✅ EXISTING IMAGES:')
  console.log('=' .repeat(50))
  existingImages.forEach(({ post, image, size }) => {
    console.log(`✓ ${post}`)
    console.log(`  Image: ${image}`)
    console.log(`  Size: ${(size / 1024).toFixed(1)} KB`)
    console.log()
  })
  
  console.log('\n❌ MISSING IMAGES:')
  console.log('=' .repeat(50))
  if (missingImages.length === 0) {
    console.log('🎉 All images exist!')
  } else {
    missingImages.forEach(({ post, image, expectedPath }) => {
      console.log(`✗ ${post}`)
      console.log(`  Missing: ${image}`)
      console.log(`  Expected: ${expectedPath}`)
      console.log()
    })
  }
  
  console.log('\n📊 SUMMARY:')
  console.log('=' .repeat(50))
  console.log(`Total posts: ${posts.length}`)
  console.log(`Images checked: ${existingImages.length + missingImages.length}`)
  console.log(`Existing images: ${existingImages.length}`)
  console.log(`Missing images: ${missingImages.length}`)
  
  if (missingImages.length > 0) {
    console.log('\n💡 SOLUTIONS:')
    console.log('=' .repeat(50))
    console.log('1. Copy your images to the public/images/posts/ directory')
    console.log('2. Ensure image names match the slug in your posts')
    console.log('3. Update the image paths in your post frontmatter')
    console.log('4. Use the OptimizedImage component which handles missing images gracefully')
  }
}

// Run the script
main().catch(console.error)
