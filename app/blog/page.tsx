import Link from "next/link";
import { getBlogIndexData } from "@/lib/notion";
import NotionBlocks from "./_components/notion-blocks";

export const revalidate = false;

function PageIcon({ icon, title }: { icon: string; title: string }) {
  if (!icon) return null;

  const isUrl = icon.startsWith("http://") || icon.startsWith("https://");

  if (isUrl) {
    return <img src={icon} alt={`${title} icon`} className="w-8 h-8 rounded" />;
  }

  return <span className="text-2xl">{icon}</span>;
}

export default async function BlogPage() {
  const { parentPage, parentBlocks, posts } = await getBlogIndexData();
  const hasPageId = Boolean(process.env.NOTION_PAGE_ID);

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <section className="mb-14">
        {parentPage ? (
          <div className="flex items-center gap-3 mb-4">
            <PageIcon icon={parentPage.icon} title={parentPage.title} />
            <h1 className="text-4xl font-bold">{parentPage.title}</h1>
          </div>
        ) : (
          <h1 className="text-4xl font-bold mb-4">My Journey</h1>
        )}

        {!hasPageId ? (
          <p className="text-gray-500">请先配置环境变量 NOTION_PAGE_ID。</p>
        ) : parentBlocks.length > 0 ? (
          <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-white">
            <NotionBlocks blocks={parentBlocks} />
          </div>
        ) : (
          <p className="text-gray-500 mt-2">暂无正文内容。</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">文章列表</h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">暂无文章</p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <PageIcon icon={post.icon} title={post.title} />
                      <h3 className="text-2xl font-semibold">{post.title}</h3>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, index) => (
                          <span
                            key={`${post.id}-${tag.name}-${index}`}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/blog/${encodeURIComponent(post.id)}`}
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                    >
                      阅读更多 →
                    </Link>
                  </div>

                  {post.cover && (
                    <img
                      src={post.cover}
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
