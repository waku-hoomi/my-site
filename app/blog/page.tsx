import { getPosts } from "@/lib/notion"

export const revalidate = false // 纯静态

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-3xl mx-auto py-20">
      <h1 className="text-4xl font-bold mb-10">Blog</h1>
      {posts.map((post: any) => (
        <div key={post.id} className="mb-6">
          {post.properties.Title.title[0]?.plain_text}
        </div>
      ))}
    </div>
  )
}