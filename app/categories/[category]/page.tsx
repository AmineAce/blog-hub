import { notFound } from "next/navigation"

export async function generateStaticParams() {
  // Temporarily disabled - categories not implemented in Contentful yet
  return []
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} - Compare Clash`,
    description: `Articles in the ${category} category`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  // Temporarily disabled - categories not implemented in Contentful yet
  notFound()
}
