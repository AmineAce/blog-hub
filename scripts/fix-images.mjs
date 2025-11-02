#!/usr/bin/env node
/**
 * Script to automatically add missing image paths to blog posts
 * Run with: node scripts/fix-images.mjs
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

function findMatchingImage(postSlug) {
  if (!fs.existsSync(IMAGES_DIR)) {
    return null
  }
  
  const files = fs.readdirSync(IMAGES_DIR)
  
  // Try exact match first
  for (const file of files) {
    const fileName = path.parse(file).name
    if (fileName === postSlug) {
      return `/images/posts/${file}`
    }
  }
  
  // Try partial matches
  for (const file of files) {
    const fileName = path.parse(file).name
    if (fileName.includes(postSlug) || postSlug.includes(fileName)) {
      return `/images/posts/${file}`
    }
  }
  
  return null
}

function main() {
  console.log('🔧 Fixing blog post images...\n')
  
  const posts = getAllPosts()
  console.log(`Found ${posts.length} posts\n`)
  
  let updatedPosts = []
  let skippedPosts = []
  
  for (const postSlug of posts) {
    try {
      const fullPath = path.join(POSTS_DIR, `${postSlug}.md`)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      // Check if post already has an image
      if (data.image) {
        console.log(`✓ ${postSlug} already has image: ${data.image}`)
        skippedPosts.push(postSlug)
        continue
      }
      
      // Find matching image
      const imagePath = findMatchingImage(postSlug)
      
      if (imagePath) {
        // Add image to frontmatter
        data.image = imagePath
        
        const updatedContent = matter.stringify(content, data)
        fs.writeFileSync(fullPath, updatedContent)
        
        console.log(`✅ Updated ${postSlug}`)
        console.log(`   Added image: ${imagePath}`)
        updatedPosts.push({ post: postSlug, image: imagePath })
      } else {
        console.log(`⚠️  ${postSlug} - No matching image found`)
      }
      
    } catch (error) {
      console.error(`❌ Error processing post ${postSlug}:`, error.message)
    }
  }
  
  console.log('\n📊 SUMMARY:')
  console.log('=' .repeat(50))
  console.log(`Total posts: ${posts.length}`)
  console.log(`Updated posts: ${updatedPosts.length}`)
  console.log(`Skipped posts: ${skippedPosts.length}`)
  console.log(`Posts needing manual attention: ${posts.length - updatedPosts.length - skippedPosts.length}`)
  
  if (updatedPosts.length > 0) {
    console.log('\n✅ UPDATED POSTS:')
    console.log('=' .repeat(50))
    updatedPosts.forEach(({ post, image }) => {
      console.log(`• ${post}`)
      console.log(`  Image: ${image}`)
    })
  }
  
  console.log('\n🚀 NEXT STEPS:')
  console.log('=' .repeat(50))
  console.log('1. Run "npm run dev" to test the changes')
  console.log('2. Check that images display correctly')
  console.log('3. Consider optimizing images to WebP/AVIF format')
  console.log('4. Add alt text for better accessibility')
}

main().catch(console.error)
