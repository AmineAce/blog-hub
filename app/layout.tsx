import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import HeaderServer from "@/components/HeaderServer"
import { Footer } from "@/components/footer"
import { SearchProvider } from "@/components/search-context"
import { Suspense } from "react"
import Script from "next/script"
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/structured-data"
import "./globals.css"
import ErrorBoundary from "@/components/ErrorBoundary"

// Configure fonts
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "CompareClash - Thoughts & Insights",
  description: "A minimalist blog featuring articles on web development, design, and technology",
  generator: "v0.app",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
    {
      rel: "icon",
      url: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      rel: "icon",
      url: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
    {
      rel: "android-chrome-192x192",
      url: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      rel: "android-chrome-512x512",
      url: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()
  
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Analytics Scripts with Environment Variables */}
      {process.env.NEXT_PUBLIC_AHREFS_KEY && (
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key={process.env.NEXT_PUBLIC_AHREFS_KEY} async />
      )}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
      )}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
      )}
      
      {/* Structured Data Scripts */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      {/* Global Error Handler */}
      <Script
        id="global-error-handler"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('error', (e) => {
              console.error('Client Error:', e.error);
              fetch('/api/log-error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  message: e.error?.message || 'Unknown error',
                  stack: e.error?.stack,
                  url: location.href,
                  userAgent: navigator.userAgent,
                  timestamp: new Date().toISOString(),
                }),
              }).catch(err => console.error('Failed to log error:', err));
            });
            
            window.addEventListener('unhandledrejection', (e) => {
              console.error('Unhandled Promise Rejection:', e.reason);
              fetch('/api/log-error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  message: e.reason?.message || 'Unhandled promise rejection',
                  stack: e.reason?.stack,
                  url: location.href,
                  userAgent: navigator.userAgent,
                  timestamp: new Date().toISOString(),
                  type: 'unhandledrejection',
                }),
              }).catch(err => console.error('Failed to log error:', err));
            });
          `,
        }}
      />
      
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            <SearchProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <div className="flex min-h-screen flex-col">
                  <HeaderServer />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </Suspense>
            </SearchProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
