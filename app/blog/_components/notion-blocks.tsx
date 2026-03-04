import { type NotionBlock, type NotionRichText } from "@/lib/notion";

type NotionBlocksProps = {
  blocks: NotionBlock[];
};

function RichText({ richText }: { richText?: NotionRichText[] }) {
  if (!Array.isArray(richText) || richText.length === 0) {
    return null;
  }

  return (
    <>
      {richText.map((text, index) => {
        const annotations = text.annotations || {};
        const href = text.text?.link?.url || text.href;
        const classes = [
          annotations.bold ? "font-semibold" : "",
          annotations.italic ? "italic" : "",
          annotations.strikethrough ? "line-through" : "",
          annotations.underline ? "underline" : "",
          annotations.code
            ? "rounded border border-[var(--rule)] bg-[rgba(19,19,19,0.06)] px-1 py-0.5 font-mono text-[0.92em]"
            : "",
        ]
          .filter(Boolean)
          .join(" ");

        const content = <span className={classes || undefined}>{text.plain_text}</span>;

        if (!href) {
          return <span key={index}>{content}</span>;
        }

        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="accent-link"
          >
            {content}
          </a>
        );
      })}
    </>
  );
}

function renderBlock(block: NotionBlock) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="max-w-[72ch] text-[1.03rem] leading-relaxed text-[var(--foreground)]">
          <RichText richText={block.paragraph?.rich_text} />
        </p>
      );

    case "heading_1":
      return (
        <h1 className="editorial-title mt-12 text-4xl leading-tight text-[var(--foreground)] md:text-5xl">
          <RichText richText={block.heading_1?.rich_text} />
        </h1>
      );

    case "heading_2":
      return (
        <h2 className="editorial-title mt-10 text-3xl leading-tight text-[var(--foreground)] md:text-4xl">
          <RichText richText={block.heading_2?.rich_text} />
        </h2>
      );

    case "heading_3":
      return (
        <h3 className="editorial-title mt-8 text-2xl leading-tight text-[var(--foreground)] md:text-3xl">
          <RichText richText={block.heading_3?.rich_text} />
        </h3>
      );

    case "bulleted_list_item":
      return (
        <ul className="max-w-[70ch] list-disc space-y-1 pl-6 text-[1.03rem] leading-relaxed marker:text-[var(--accent-dark)]">
          <li>
            <RichText richText={block.bulleted_list_item?.rich_text} />
          </li>
        </ul>
      );

    case "numbered_list_item":
      return (
        <ol className="max-w-[70ch] list-decimal space-y-1 pl-6 text-[1.03rem] leading-relaxed marker:text-[var(--accent-dark)]">
          <li>
            <RichText richText={block.numbered_list_item?.rich_text} />
          </li>
        </ol>
      );

    case "quote":
      return (
        <blockquote className="max-w-[72ch] border-l-4 border-[var(--accent-dark)] bg-[rgba(236,72,153,0.05)] px-4 py-3 text-[1.05rem] italic leading-relaxed text-[var(--foreground)]">
          <RichText richText={block.quote?.rich_text} />
        </blockquote>
      );

    case "code": {
      const codeText = block.code?.rich_text?.map((t: NotionRichText) => t.plain_text).join("") || "";
      return (
        <pre className="max-w-full overflow-x-auto border border-[var(--rule)] bg-[#161616] p-4 text-sm leading-relaxed text-[#f7f2e8]">
          <code>{codeText}</code>
        </pre>
      );
    }

    case "divider":
      return <hr className="my-9 border-[var(--rule)]" />;

    case "image": {
      const imageUrl = block.image?.external?.url || block.image?.file?.url;
      const caption = block.image?.caption;

      if (!imageUrl) return null;

      return (
        <figure className="my-8">
          <img src={imageUrl} alt="Notion image" className="w-full border border-[var(--rule)] object-cover" />
          {Array.isArray(caption) && caption.length > 0 && (
            <figcaption className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              <RichText richText={caption} />
            </figcaption>
          )}
        </figure>
      );
    }

    case "callout":
      return (
        <div className="my-6 border border-[var(--accent)] bg-[rgba(236,72,153,0.08)] px-4 py-3 text-[var(--foreground)]">
          <div className="flex items-start gap-2">
            {block.callout?.icon?.emoji && <span aria-hidden="true">{block.callout.icon.emoji}</span>}
            <div className="leading-relaxed">
              <RichText richText={block.callout?.rich_text} />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function NotionBlocks({ blocks }: NotionBlocksProps) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}
    </div>
  );
}
