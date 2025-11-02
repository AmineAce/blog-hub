"use client"

import Image from "next/image"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  quality = 85,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  placeholder = "empty",
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  // Generate a simple blur data URL if not provided
  const defaultBlurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="#f3f4f6"/>
      <rect x="10" y="10" width="20" height="20" fill="#e5e7eb"/>
    </svg>`
  ).toString("base64")}`

  // If there's a fill prop, use the fill layout WITHOUT width/height props
  if (fill) {
    return (
      <div className="relative overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${className}`}
          priority={priority}
          quality={quality}
          sizes={sizes}
          placeholder={placeholder}
          blurDataURL={blurDataURL || defaultBlurDataURL}
          loading={priority ? "eager" : "lazy"}
          {...props}
        />
      </div>
    )
  }

  // For non-fill mode, ensure we have valid dimensions
  const finalWidth = width || 800
  const finalHeight = height || 450

  return (
    <Image
      src={src}
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      className={className}
      priority={priority}
      quality={quality}
      sizes={sizes}
      placeholder={placeholder}
      blurDataURL={blurDataURL || defaultBlurDataURL}
      loading={priority ? "eager" : "lazy"}
      {...props}
    />
  )
}

// Helper component for blog post images
interface BlogImageProps {
  src: string
  alt: string
  caption?: string
  className?: string
  priority?: boolean
  fill?: boolean
  width?: number
  height?: number
}

export function BlogImage({ 
  src, 
  alt, 
  caption, 
  className = "", 
  priority = false, 
  fill = true,
  width,
  height 
}: BlogImageProps) {
  // Ensure we don't pass width/height when using fill
  const imageProps = fill ? {} : { 
    width: width || 800, 
    height: height || 450 
  }

  return (
    <figure className={`my-8 ${className}`}>
      <div className="relative w-full aspect-video overflow-hidden rounded-lg">
        <OptimizedImage
          src={src}
          alt={alt}
          fill={fill}
          className="rounded-lg shadow-lg"
          priority={priority}
          quality={90}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          {...imageProps}
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Helper component for gallery images
interface GalleryImageProps {
  src: string
  alt: string
  index: number
  onClick: () => void
  className?: string
}

export function GalleryImage({ src, alt, index, onClick, className = "" }: GalleryImageProps) {
  return (
    <div 
      className={`relative aspect-square cursor-pointer group overflow-hidden rounded-lg ${className}`}
      onClick={onClick}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        quality={80}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
    </div>
  )
}
