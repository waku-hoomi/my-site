import { getPosts } from "@/lib/notion"

export const revalidate = false // 纯静态

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center">My Journey</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">暂无文章</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post: any) => {
            // 获取标题（中文字段"名称"）
            const title = post.properties["名称"]?.title?.[0]?.plain_text || "无标题"

            // 获取标签
            const tags = post.properties["标签"]?.multi_select || []

            // 获取封面图
            const cover = post.cover?.external?.url || post.cover?.file?.url

            // 获取图标
            const icon = post.icon?.emoji || ""

            return (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {icon && <span className="text-2xl">{icon}</span>}
                      <h2 className="text-2xl font-semibold">{title}</h2>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {tags.map((tag: any, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                    >
                      阅读更多 →
                    </a>
                  </div>

                  {cover && (
                    <img
                      src={cover}
                      alt={title}
                      className="w-24 h-24 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}