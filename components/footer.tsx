export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground leading-relaxed">
          As an Amazon Associate, I earn from qualifying purchases.
        </p>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Blog Hub. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
