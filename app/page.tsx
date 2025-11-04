import { getAllPosts } from "@/lib/posts-static"
import HomePageClient from "./page-client"

export default function HomePage() {
  const posts = getAllPosts()

  return <HomePageClient posts={posts} />
}
