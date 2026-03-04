import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostData } from "@/lib/notion";
import NotionBlocks from "../_components/notion-blocks";

export const revalidate = false;

type BlogPostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function PageIcon({ icon, title }: { icon: string; title: string }) {
  if (!icon) return null;

  const isUrl = icon.startsWith("http://") || icon.startsWith("https://");

  if (isUrl) {
    return <img src={icon} alt={`${title} icon`} className="h-8 w-8 rounded border border-[var(--rule)] object-cover" />;
  }

  return <span className="text-2xl">{icon}</span>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const data = await getBlogPostData(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="editorial-shell">
      <article className="editorial-panel px-6 py-8 md:px-10 md:py-10">
        <Link
          href="/blog"
          className="accent-link inline-block cursor-pointer text-sm font-semibold uppercase tracking-[0.16em]"
        >
          ← Back to archive
        </Link>

        <header className="mt-6 border-b border-[var(--rule)] pb-7">
          <div className="flex items-center gap-3">
            <PageIcon icon={data.post.icon} title={data.post.title} />
            <h1 className="editorial-title text-4xl leading-tight md:text-6xl">{data.post.title}</h1>
          </div>

          {data.post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.post.tags.map((tag, index) => (
                <span
                  key={`${data.post.id}-${tag.name}-${index}`}
                  className="border border-[var(--rule)] px-2 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {data.post.cover && (
            <img
              src={data.post.cover}
              alt={data.post.title}
              className="mt-6 h-72 w-full border border-[var(--rule)] object-cover md:h-96"
            />
          )}
        </header>

        <div className="mt-8">
          <NotionBlocks blocks={data.blocks} />
        </div>
      </article>
    </div>
  );
}
