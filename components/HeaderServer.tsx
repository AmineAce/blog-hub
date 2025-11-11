import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from './theme-toggle'
import { SearchButton } from './search-button'

export default function HeaderServer() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="Go to homepage">
            <Image src="/logo.png" alt="CompareClash" width={36} height={36} className="h-9 w-9" />
          </Link>
          <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity">
            CompareClash
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Posts
          </Link>
          <SearchButton />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
