"use client"

import { Button } from "@/components/ui/button"
import { Facebook } from "lucide-react"

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const url = typeof window !== "undefined" ? `${window.location.origin}/posts/${slug}` : ""

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, "_blank", "noopener,noreferrer")
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={shareOnTwitter} aria-label="Share on X (Twitter)">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </Button>
      <Button variant="outline" size="icon" onClick={shareOnFacebook} aria-label="Share on Facebook">
        <Facebook className="h-4 w-4" />
      </Button>
    </div>
  )
}
