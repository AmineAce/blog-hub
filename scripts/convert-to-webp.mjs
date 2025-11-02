#!/usr/bin/env node
/**
 * Script to convert images to WebP format and update blog posts
 * Run with: node scripts/convert-to-webp.mjs
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const IMAGES_DIR = './public/images/posts'
const POSTS_DIR = './posts'

// Check if images are actually accessible
function checkImageAccessibility() {
  console.log('🔍 Checking image accessibility...\n')
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('❌ Images directory not found:', IMAGES_DIR)
    return false
  }
  
  const files = fs.readdirSync(IMAGES_DIR)
  console.log(`Found ${files.length} files in images directory\n`)
  
  let accessible = 0
  let inaccessible = []
  
  files.forEach(file => {
    const filePath = path.join(IMAGES_DIR, file)
    const stats = fs.statSync(filePath)
    
    if (stats.size > 0) {
      accessible++
      console.log(`✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`)
    } else {
      inaccessible.push(file)
      console.log(`❌ ${file} (empty file)`)
    }
  })
  
  if (inaccessible.length > 0) {
    console.log('\n⚠️  Empty files found:', inaccessible)
  }
  
  console.log(`\n📊 Summary: ${accessible} accessible, ${inaccessible.length} issues`)
  return inaccessible.length === 0
}

// Convert images to WebP (if ImageMagick is available)
function convertToWebP() {
  console.log('\n🔄 Converting images to WebP...\n')
  
  // Check if ImageMagick is available
  try {
    execSync('magick -version', { stdio: 'ignore' })
    console.log('✅ ImageMagick found')
  } catch (error) {
    console.log('⚠️  ImageMagick not found. Trying alternative methods...')
    
    // Check for alternative tools
    try {
      execSync('cwebp -version', { stdio: 'ignore' })
      console.log('✅ libwebp found')
    } catch {
      console.log('❌ No WebP conversion tools found')
      console.log('\n📦 To install ImageMagick:')
      console.log('  Windows: Download from https://imagemagick.org/script/download.php')
      console.log('  macOS: brew install imagemagick')
      console.log('  Linux: sudo apt-get install imagemagick')
      return false
    }
  }
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('❌ Images directory not found')
    return false
  }
  
  const files = fs.readdirSync(IMAGES_DIR)
  let converted = 0
  let skipped = 0
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue
    
    const inputPath = path.join(IMAGES_DIR, file)
    const baseName = path.parse(file).name
    const webpPath = path.join(IMAGES_DIR, `${baseName}.webp`)
    
    // Skip if WebP already exists and is newer
    if (fs.existsSync(webpPath)) {
      const inputTime = fs.statSync(inputPath).mtime
      const webpTime = fs.statSync(webpPath).mtime
      
      if (webpTime > inputTime) {
        console.log(`⏭️  Skipping ${file} (WebP already exists)`)
        skipped++
        continue
      }
    }
    
    try {
      // Convert to WebP with high quality
      execSync(`magick "${inputPath}" -quality 85 "${webpPath}"`)
      
      const originalSize = fs.statSync(inputPath).size
      const webpSize = fs.statSync(webpPath).size
      const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1)
      
      console.log(`✅ Converted ${file} → ${baseName}.webp`)
      console.log(`   Size: ${(originalSize / 1024).toFixed(1)}KB → ${(webpSize / 1024).toFixed(1)}KB (${savings}% smaller)`)
      converted++
    } catch (error) {
      console.log(`❌ Failed to convert ${file}:`, error.message)
    }
  }
  
  console.log(`\n📊 Conversion Summary:`)
  console.log(`Converted: ${converted}`)
  console.log(`Skipped: ${skipped}`)
  return converted > 0
}

// Update blog posts to use WebP versions
function updateBlogPosts() {
  console.log('\n📝 Updating blog posts to use WebP...\n')
  
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('❌ Posts directory not found')
    return
  }
  
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
  let updated = 0
  
  for (const file of files) {
    try {
      const filePath = path.join(POSTS_DIR, file)
      let content = fs.readFileSync(filePath, 'utf8')
      
      // Replace .jpg and .png references with .webp
      const originalContent = content
      
      content = content.replace(/\.jpg/g, '.webp')
      content = content.replace(/\.jpeg/g, '.webp')
      content = content.replace(/\.png/g, '.webp')
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content)
        console.log(`✅ Updated ${file}`)
        updated++
      }
    } catch (error) {
      console.log(`❌ Failed to update ${file}:`, error.message)
    }
  }
  
  console.log(`\n📊 Update Summary: ${updated} posts updated`)
}

// Test if WebP is supported by browser
function testWebPSupport() {
  console.log('\n🌐 Testing WebP support...\n')
  
  // Basic WebP detection
  const testData = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  
  const img = new Image()
  img.onload = function() {
    if (img.width === 1) {
      console.log('✅ Browser supports WebP')
    } else {
      console.log('❌ Browser does not support WebP')
    }
  }
  img.onerror = function() {
    console.log('❌ Browser does not support WebP')
  }
  img.src = testData
}

function main() {
  console.log('🚀 WebP Conversion and Troubleshooting Tool\n')
  console.log('=' .repeat(50))
  
  // Step 1: Check current status
  const accessible = checkImageAccessibility()
  
  if (!accessible) {
    console.log('\n🔧 FIXING ISSUES FIRST...')
    // You might need to manually copy images to the correct location
    console.log('Please ensure your images are in:', IMAGES_DIR)
  }
  
  // Step 2: Convert to WebP
  const converted = convertToWebP()
  
  if (converted) {
    // Step 3: Update blog posts
    updateBlogPosts()
    
    console.log('\n🎉 SUCCESS! Your blog is now optimized with WebP images')
    console.log('\n📋 NEXT STEPS:')
    console.log('1. Refresh your browser to see the changes')
    console.log('2. Check that all images are displaying correctly')
    console.log('3. Run "npm run build" to test production build')
  } else {
    console.log('\n💡 MANUAL CONVERSION OPTIONS:')
    console.log('1. Install ImageMagick and run this script again')
    console.log('2. Use online tools like TinyPNG for conversion')
    console.log('3. Convert manually and update post frontmatter')
  }
  
  console.log('\n🌐 Browser WebP Support Test:')
  testWebPSupport()
}

main()
