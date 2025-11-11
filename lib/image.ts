import sharp from 'sharp'
import { getPlaiceholder } from 'plaiceholder'

export interface OptimizedImage {
  src: string
  blurDataURL?: string
  width: number
  height: number
  format: 'webp' | 'avif' | 'jpeg' | 'png'
  size: number
}

/**
 * Optimizes an image for web delivery with blur placeholder
 */
export async function getOptimizedImage(
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpeg'
    blurPlaceholder?: boolean
  } = {}
): Promise<OptimizedImage> {
  const {
    width = 800,
    height,
    quality = 80,
    format = 'webp',
    blurPlaceholder = true
  } = options

  try {
    // Fetch the image
    const response = await fetch(src)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    
    const buffer = await response.arrayBuffer()
    const inputBuffer = Buffer.from(buffer)

    // Get image metadata
    const metadata = await sharp(inputBuffer).metadata()
    
    // Calculate dimensions
    const aspectRatio = metadata.width ? metadata.width / (metadata.height || 1) : 1
    const finalHeight = height || Math.round(width / aspectRatio)

    // Generate blur placeholder if requested
    let blurDataURL: string | undefined
    if (blurPlaceholder) {
      try {
        const { base64 } = await getPlaiceholder(inputBuffer, { size: 16 })
        blurDataURL = base64
      } catch (blurError) {
        console.warn('Failed to generate blur placeholder:', blurError)
      }
    }

    // Optimize the image
    const optimizedBuffer = await sharp(inputBuffer)
      .resize(width, finalHeight, {
        fit: 'cover',
        position: 'center'
      })
      .toFormat(format, {
        quality,
        progressive: true
      })
      .toBuffer()

    const optimizedSrc = `data:image/${format};base64,${optimizedBuffer.toString('base64')}`

    return {
      src: optimizedSrc,
      blurDataURL,
      width,
      height: finalHeight,
      format,
      size: optimizedBuffer.length
    }
  } catch (error) {
    console.error('Image optimization failed:', error)
    // Return original image on error
    return {
      src,
      width: options.width || 800,
      height: options.height || 600,
      format: 'jpeg' as const,
      size: 0
    }
  }
}

/**
 * Converts any image format to WebP with optimization
 */
export async function convertToWebP(
  src: string,
  options: {
    quality?: number
    width?: number
    height?: number
  } = {}
): Promise<string> {
  const { quality = 80, width = 1200, height } = options

  try {
    const response = await fetch(src)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    
    const buffer = await response.arrayBuffer()
    const inputBuffer = Buffer.from(buffer)

    // Get original dimensions for aspect ratio
    const metadata = await sharp(inputBuffer).metadata()
    const aspectRatio = metadata.width ? metadata.width / (metadata.height || 1) : 1
    const finalHeight = height || Math.round(width / aspectRatio)

    // Convert to WebP
    const webpBuffer = await sharp(inputBuffer)
      .resize(width, finalHeight, {
        fit: 'cover',
        position: 'center'
      })
      .webp({
        quality
      })
      .toBuffer()

    return `data:image/webp;base64,${webpBuffer.toString('base64')}`
  } catch (error) {
    console.error('WebP conversion failed:', error)
    return src // Return original on error
  }
}

/**
 * Generates a responsive image set for different screen sizes
 */
export async function generateResponsiveImages(
  src: string,
  sizes: number[] = [400, 800, 1200, 1600]
): Promise<OptimizedImage[]> {
  const results: OptimizedImage[] = []

  for (const size of sizes) {
    const optimized = await getOptimizedImage(src, {
      width: size,
      quality: 75,
      format: 'webp',
      blurPlaceholder: size === sizes[0] // Only generate blur for smallest size
    })
    results.push(optimized)
  }

  return results
}

/**
 * Validates if an image meets Contentful requirements
 */
export function validateImageForContentful(imageBuffer: Buffer): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // This is a placeholder for image validation
  // In a real implementation, you would check:
  // - File size (< 2MB)
  // - Dimensions (800-1600px width)
  // - Format (webp, jpeg, png)
  // - Aspect ratio

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}
