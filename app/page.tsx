import { getAllPosts } from "@/lib/contentful"
import HomePageClient from "./page-client"

export default async function HomePage() {
  const posts = await getAllPosts()

  return <HomePageClient posts={posts} />
}
