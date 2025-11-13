import { getAllPosts } from "@/lib/contentful"
import HomePageClient from "./page-client"

export const revalidate = 300 // Revalidate every 5 minutes

export default async function HomePage() {
  const posts = await getAllPosts()

  return <HomePageClient posts={posts} />
}
