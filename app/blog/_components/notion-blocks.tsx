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
        let className = "";

        if (annotations.bold) className += " font-semibold";
        if (annotations.italic) className += " italic";
        if (annotations.strikethrough) className += " line-through";
        if (annotations.underline) className += " underline";
        if (annotations.code) className += " font-mono text-sm bg-gray-100 px-1 py-0.5 rounded";

        const content = (
          <span className={className.trim() || undefined}>{text.plain_text}</span>
        );

        if (!href) {
          return <span key={index}>{content}</span>;
        }

        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
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
        <p className="leading-7 text-gray-800">
          <RichText richText={block.paragraph?.rich_text} />
        </p>
      );

    case "heading_1":
      return (
        <h1 className="text-3xl font-bold mt-10 mb-4 text-gray-900">
          <RichText richText={block.heading_1?.rich_text} />
        </h1>
      );

    case "heading_2":
      return (
        <h2 className="text-2xl font-semibold mt-8 mb-3 text-gray-900">
          <RichText richText={block.heading_2?.rich_text} />
        </h2>
      );

    case "heading_3":
      return (
        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-900">
          <RichText richText={block.heading_3?.rich_text} />
        </h3>
      );

    case "bulleted_list_item":
      return (
        <ul className="list-disc list-inside text-gray-800">
          <li>
            <RichText richText={block.bulleted_list_item?.rich_text} />
          </li>
        </ul>
      );

    case "numbered_list_item":
      return (
        <ol className="list-decimal list-inside text-gray-800">
          <li>
            <RichText richText={block.numbered_list_item?.rich_text} />
          </li>
        </ol>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">
          <RichText richText={block.quote?.rich_text} />
        </blockquote>
      );

    case "code": {
      const codeText = block.code?.rich_text?.map((t: NotionRichText) => t.plain_text).join("") || "";
      return (
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm my-4">
          <code>{codeText}</code>
        </pre>
      );
    }

    case "divider":
      return <hr className="my-8 border-gray-200" />;

    case "image": {
      const imageUrl = block.image?.external?.url || block.image?.file?.url;
      const caption = block.image?.caption;

      if (!imageUrl) return null;

      return (
        <figure className="my-6">
          <img src={imageUrl} alt="Notion image" className="w-full rounded-lg border border-gray-200" />
          {Array.isArray(caption) && caption.length > 0 && (
            <figcaption className="mt-2 text-sm text-gray-500">
              <RichText richText={caption} />
            </figcaption>
          )}
        </figure>
      );
    }

    case "callout":
      return (
        <div className="my-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-gray-800">
          <div className="flex items-start gap-2">
            {block.callout?.icon?.emoji && <span>{block.callout.icon.emoji}</span>}
            <div>
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
