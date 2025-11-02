#!/usr/bin/env node
/**
 * Script to update blog post image paths to use WebP extensions
 * Run with: node scripts/update-webp-paths.mjs
 */

import fs from 'fs'
import path from 'path'

const POSTS_DIR = './posts'

function updateBlogPostPaths() {
  console.log('🔄 Updating blog post image paths to WebP...\n')
  
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('❌ Posts directory not found')
    return false
  }
  
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
  let updated = 0
  
  for (const file of files) {
    try {
      const filePath = path.join(POSTS_DIR, file)
      let content = fs.readFileSync(filePath, 'utf8')
      
      // Replace image extensions
      const originalContent = content
      
      content = content.replace(/\.jpg/g, '.webp')
      content = content.replace(/\.jpeg/g, '.webp')
      content = content.replace(/\.png/g, '.webp')
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content)
        console.log(`✅ Updated ${file}`)
        updated++
      } else {
        console.log(`⏭️  No changes needed for ${file}`)
      }
    } catch (error) {
      console.log(`❌ Failed to update ${file}:`, error.message)
    }
  }
  
  console.log(`\n📊 Summary: ${updated} posts updated to use WebP`)
  console.log('\n🎯 NEXT STEPS:')
  console.log('1. Convert your images to WebP format using TinyPNG or Squoosh')
  console.log('2. Replace the old images with WebP versions in public/images/posts/')
  console.log('3. Test with: npm run dev')
  
  return updated > 0
}

updateBlogPostPaths()
