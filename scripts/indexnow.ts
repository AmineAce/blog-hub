import { getAllPosts } from '../lib/contentful'
import { writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://compareclash.netlify.app'
const INDEXNOW_KEY = process.env.INDEXNOW_KEY
const ENABLE_INDEXNOW = process.env.ENABLE_INDEXNOW !== 'false' // Default to true, can be disabled

interface ContentfulPost {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  tags?: string[];
  content: any;
  featuredImage?: string | null;
}

function generateOrGetIndexNowKey(): string {
  // If key is provided via environment, use it
  if (INDEXNOW_KEY) {
    return INDEXNOW_KEY
  }

  // Otherwise, generate a random key and save it
  const keyFile = join(process.cwd(), '.indexnow-key')
  if (existsSync(keyFile)) {
    return require('fs').readFileSync(keyFile, 'utf8').trim()
  }

  // Generate a new key (32 bytes = 64 hex characters)
  const key = randomBytes(32).toString('hex')
  writeFileSync(keyFile, key, 'utf8')
  console.log(`Generated new IndexNow key: ${key}`)
  return key
}

function createIndexNowVerificationFile(key: string) {
  try {
    // Create the verification file at public/{key}.txt
    const filePath = join(process.cwd(), 'public', `${key}.txt`)
    writeFileSync(filePath, key, 'utf8')
    console.log(`IndexNow verification file created: public/${key}.txt`)
    console.log(`Verification URL: https://compareclash.netlify.app/${key}.txt`)
  } catch (error) {
    console.error('Error creating IndexNow verification file:', error)
  }
}

async function submitToIndexNow(urls: string[], key: string) {
  // Validate key format (should be 8-128 characters)
  if (key.length < 8 || key.length > 128) {
    console.error('IndexNow key must be between 8 and 128 characters')
    return
  }

  const payload = {
    host: 'compareclash.netlify.app',
    key: key,
    urlList: urls.slice(0, 10000) // IndexNow allows up to 10,000 URLs per request
  }

  // Submit to multiple search engines
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://search.seznam.cz/indexnow'
  ]

  for (const endpoint of endpoints) {
    try {
      console.log(`Submitting to ${endpoint}...`)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        console.log(`✅ Successfully submitted ${urls.length} URLs to ${endpoint}`)
      } else {
        const errorText = await response.text()
        console.error(`❌ Failed to submit to ${endpoint}:`, response.status, response.statusText, errorText)
      }
    } catch (error) {
      console.error(`❌ Error submitting to ${endpoint}:`, error)
    }
  }
}

async function generateAndSubmitSitemap() {
  // Check if IndexNow is enabled
  if (!ENABLE_INDEXNOW) {
    console.log('IndexNow is disabled. Set ENABLE_INDEXNOW=true to enable.')
    return
  }

  console.log('🚀 Starting IndexNow process...')

  // Generate or get IndexNow key
  const key = generateOrGetIndexNowKey()

  // Create IndexNow verification file (always needed for verification)
  createIndexNowVerificationFile(key)

  // Only submit if we have Contentful credentials
  let urls: string[] = []
  try {
    const posts: ContentfulPost[] = await getAllPosts()
    urls = [
      SITE_URL,
      `${SITE_URL}/blog`,
      ...posts.map(post => `${SITE_URL}/posts/${post.slug}`)
    ]
  } catch (error) {
    console.log('Contentful not configured, skipping URL submission. Verification file created.')
    return
  }

  // Submit to IndexNow
  await submitToIndexNow(urls, key)

  console.log(`✅ IndexNow process completed for ${urls.length} URLs`)
}

// Run if called directly
if (require.main === module) {
  generateAndSubmitSitemap()
}

export { generateAndSubmitSitemap }

// Function to submit only new/changed URLs
export async function submitNewUrls(urls: string[]) {
  if (!ENABLE_INDEXNOW) {
    console.log('IndexNow is disabled for new URLs.')
    return
  }

  console.log('🚀 Submitting new URLs to IndexNow...')

  const key = generateOrGetIndexNowKey()
  createIndexNowVerificationFile(key) // Ensure file exists

  await submitToIndexNow(urls, key)
  console.log(`✅ Submitted ${urls.length} new URLs to IndexNow`)
}
