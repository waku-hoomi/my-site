import { Client } from "@notionhq/client";

// 确保环境变量存在
const apiKey = process.env.NOTION_API_KEY;
if (!apiKey) throw new Error("Missing NOTION_API_KEY");

const notion = new Client({ auth: apiKey });

export { notion };

type NotionListResponse<T> = {
  results: T[];
  has_more: boolean;
  next_cursor: string | null;
};

export type NotionRichText = {
  plain_text: string;
  href: string | null;
  type?: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  text?: {
    content?: string;
    link?: { url: string } | null;
  };
};

export type NotionBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  [key: string]: any;
};

type NotionTag = {
  id?: string;
  name: string;
  color?: string;
};

type NotionPageProperties = Record<string, any>;

export type NotionPost = {
  id: string;
  url: string;
  title: string;
  tags: NotionTag[];
  cover: string | null;
  icon: string;
  properties: NotionPageProperties;
  raw: any;
};

export type BlogIndexData = {
  parentPage: NotionPost | null;
  parentBlocks: NotionBlock[];
  posts: NotionPost[];
};

export type BlogPostData = {
  post: NotionPost;
  blocks: NotionBlock[];
};

async function fetchNotion<T>(url: string, init: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, init);

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Notion Error:", error);
    return null;
  }
}

function getNotionHeaders() {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };
}

async function getPageBlocksPage(blockId: string, startCursor?: string): Promise<NotionListResponse<NotionBlock>> {
  const query = startCursor ? `?start_cursor=${encodeURIComponent(startCursor)}` : "";
  const data = await fetchNotion<NotionListResponse<NotionBlock>>(
    `https://api.notion.com/v1/blocks/${blockId}/children${query}`,
    {
      method: "GET",
      headers: getNotionHeaders(),
    }
  );

  return {
    results: data?.results || [],
    has_more: data?.has_more || false,
    next_cursor: data?.next_cursor || null,
  };
}

async function getDatabasePage(databaseId: string, startCursor?: string): Promise<NotionListResponse<any>> {
  const body: Record<string, any> = {
    page_size: 100,
  };

  if (startCursor) {
    body.start_cursor = startCursor;
  }

  const data = await fetchNotion<NotionListResponse<any>>(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: "POST",
      headers: getNotionHeaders(),
      body: JSON.stringify(body),
    }
  );

  return {
    results: data?.results || [],
    has_more: data?.has_more || false,
    next_cursor: data?.next_cursor || null,
  };
}

function richTextToPlainText(richText?: NotionRichText[]): string {
  if (!Array.isArray(richText)) return "";
  return richText.map((item) => item?.plain_text || "").join("").trim();
}

function extractTitleFromProperties(properties: NotionPageProperties = {}): string {
  const preferredTitle = richTextToPlainText(properties["名称"]?.title);
  if (preferredTitle) return preferredTitle;

  const titleProperty = Object.values(properties).find((value: any) => value?.type === "title");
  const fallbackTitle = richTextToPlainText(titleProperty?.title);

  return fallbackTitle || "无标题";
}

function extractTagsFromProperties(properties: NotionPageProperties = {}): NotionTag[] {
  const tags = properties["标签"]?.multi_select;
  return Array.isArray(tags) ? tags : [];
}

function extractCover(page: any): string | null {
  return page?.cover?.external?.url || page?.cover?.file?.url || null;
}

function extractIcon(page: any): string {
  const icon = page?.icon;

  if (!icon) return "";
  if (icon.type === "emoji") return icon.emoji || "";
  if (icon.type === "external") return icon.external?.url || "";
  if (icon.type === "file") return icon.file?.url || "";

  return "";
}

function normalizePost(page: any): NotionPost {
  const properties: NotionPageProperties = page?.properties || {};

  return {
    id: page?.id || "",
    url: page?.url || "",
    title: extractTitleFromProperties(properties),
    tags: extractTagsFromProperties(properties),
    cover: extractCover(page),
    icon: extractIcon(page),
    properties,
    raw: page,
  };
}

// 获取页面内容
export async function getPage(pageId: string) {
  if (!pageId) return null;

  return await fetchNotion<any>(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "GET",
    headers: getNotionHeaders(),
  });
}

// 获取页面中的子块（单页）
export async function getPageBlocks(pageId: string) {
  const data = await getPageBlocksPage(pageId);
  return data.results;
}

// 获取数据库内容（单页）
export async function getDatabase(databaseId: string) {
  const data = await getDatabasePage(databaseId);
  return data.results;
}

// 获取 block 的所有子块（处理分页）
export async function getAllBlockChildren(blockId: string) {
  const allBlocks: NotionBlock[] = [];
  let cursor: string | undefined;

  while (true) {
    const page = await getPageBlocksPage(blockId, cursor);
    allBlocks.push(...page.results);

    if (!page.has_more || !page.next_cursor) break;
    cursor = page.next_cursor;
  }

  return allBlocks;
}

// 获取数据库全部行（处理分页）
export async function queryAllDatabaseRows(databaseId: string) {
  const allRows: any[] = [];
  let cursor: string | undefined;

  while (true) {
    const page = await getDatabasePage(databaseId, cursor);
    allRows.push(...page.results);

    if (!page.has_more || !page.next_cursor) break;
    cursor = page.next_cursor;
  }

  return allRows;
}

// 统一博客首页数据
export async function getBlogIndexData(): Promise<BlogIndexData> {
  const pageId = process.env.NOTION_PAGE_ID;
  if (!pageId) {
    return {
      parentPage: null,
      parentBlocks: [],
      posts: [],
    };
  }

  const [parentPageRaw, parentBlocks] = await Promise.all([
    getPage(pageId),
    getAllBlockChildren(pageId),
  ]);

  const parentPage = parentPageRaw ? normalizePost(parentPageRaw) : null;
  const databaseBlock = parentBlocks.find((block) => block.type === "child_database");

  if (!databaseBlock?.id) {
    return {
      parentPage,
      parentBlocks,
      posts: [],
    };
  }

  const rows = await queryAllDatabaseRows(databaseBlock.id);

  return {
    parentPage,
    parentBlocks,
    posts: rows.map(normalizePost),
  };
}

// 获取单篇博客详情
export async function getBlogPostData(postId: string): Promise<BlogPostData | null> {
  if (!postId) return null;

  const page = await getPage(postId);
  if (!page || page.object !== "page") return null;

  const blocks = await getAllBlockChildren(postId);

  return {
    post: normalizePost(page),
    blocks,
  };
}

// 保留原有的 getPosts 函数以兼容现有代码
export async function getPosts() {
  const pageId = process.env.NOTION_PAGE_ID;
  if (!pageId) return [];

  try {
    const blocks = await getAllBlockChildren(pageId);
    const databaseBlock = blocks.find((block: NotionBlock) => block.type === "child_database");

    if (!databaseBlock?.id) {
      return [];
    }

    return await queryAllDatabaseRows(databaseBlock.id);
  } catch (error) {
    console.error("Notion Error:", error);
    return [];
  }
}
