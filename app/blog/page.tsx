import Link from "next/link";
import { getBlogIndexData } from "@/lib/notion";
import NotionBlocks from "./_components/notion-blocks";

export const revalidate = false;

function PageIcon({ icon, title }: { icon: string; title: string }) {
  if (!icon) return null;

  const isUrl = icon.startsWith("http://") || icon.startsWith("https://");

  if (isUrl) {
    return <img src={icon} alt={`${title} icon`} className="h-8 w-8 rounded border border-[var(--rule)] object-cover" />;
  }

  return <span className="text-2xl">{icon}</span>;
}

export default async function BlogPage() {
  const { parentPage, parentBlocks, posts } = await getBlogIndexData();
  const hasPageId = Boolean(process.env.NOTION_PAGE_ID);

  return (
    <div className="editorial-shell">
      <div className="editorial-panel editorial-panel-no-border px-6 py-8 md:px-10 md:py-10">
        <header className="border-b border-[var(--rule)] pb-6">
          <p className="editorial-kicker mb-3">Journal Archive</p>
          <div className="flex flex-wrap items-center gap-3">
            {parentPage && <PageIcon icon={parentPage.icon} title={parentPage.title} />}
            <h1 className="editorial-title text-4xl leading-tight md:text-6xl">
              {parentPage?.title || "My Journey"}
            </h1>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--muted)]">
            前路漫漫亦灿灿,往事堪堪亦澜澜
          </p>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="min-w-0">
            {!hasPageId ? (
              <p className="text-base text-[var(--muted)]">
                请先配置环境变量 NOTION_PAGE_ID。
              </p>
            ) : parentBlocks.length > 0 ? (
              <div className="editorial-panel-no-border">
                <NotionBlocks blocks={parentBlocks} />
              </div>
            ) : (
              <p className="text-base text-[var(--muted)]">
                暂无正文内容。
              </p>
            )}
          </article>

          <aside className="border-l border-[var(--rule)] pl-0 lg:pl-6">
            <div className="flex items-end justify-between border-b border-[var(--rule)] pb-3">
              <h2 className="editorial-title text-2xl md:text-3xl">Articles</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {posts.length} posts
              </span>
            </div>

            {posts.length === 0 ? (
              <p className="mt-4 text-base text-[var(--muted)]">暂无文章</p>
            ) : (
              <div className="mt-5 grid gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="card-hover border border-[var(--rule)] bg-[var(--surface)] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <PageIcon icon={post.icon} title={post.title} />
                      <div className="min-w-0 flex-1">
                        <h3 className="editorial-title text-2xl leading-tight">{post.title}</h3>
                        {post.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                              <span
                                key={`${post.id}-${tag.name}-${index}`}
                                className="border border-[var(--rule)] px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                        <Link
                          href={`/blog/${encodeURIComponent(post.id)}`}
                          className="accent-link mt-4 inline-block cursor-pointer text-sm font-semibold uppercase tracking-[0.14em]"
                        >
                          Read article
                        </Link>
                      </div>
                    </div>
                    {post.cover && (
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="mt-4 h-40 w-full border border-[var(--rule)] object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}
