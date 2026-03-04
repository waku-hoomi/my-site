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
    return <img src={icon} alt={`${title} icon`} className="w-8 h-8 rounded" />;
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
    <div className="max-w-4xl mx-auto py-20 px-6">
      <Link href="/blog" className="inline-block mb-8 text-blue-600 hover:text-blue-800">
        ← 返回博客列表
      </Link>

      <article className="border border-gray-200 rounded-lg bg-white p-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <PageIcon icon={data.post.icon} title={data.post.title} />
            <h1 className="text-4xl font-bold text-gray-900">{data.post.title}</h1>
          </div>

          {data.post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.post.tags.map((tag, index) => (
                <span
                  key={`${data.post.id}-${tag.name}-${index}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
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
              className="w-full max-h-96 object-cover rounded-lg mt-6"
            />
          )}
        </header>

        <NotionBlocks blocks={data.blocks} />
      </article>
    </div>
  );
}
