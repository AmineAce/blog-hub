import { getAllPosts } from "@/lib/posts-server"
import HomePageClient from "./page-client"

export default function HomePage() {
  const posts = getAllPosts()

  return <HomePageClient posts={posts} />
}
