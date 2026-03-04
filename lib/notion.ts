import { Client } from "@notionhq/client";

// 确保环境变量存在
const apiKey = process.env.NOTION_API_KEY;
if (!apiKey) throw new Error("Missing NOTION_API_KEY");

const notion = new Client({ auth: apiKey });

export { notion };

// 获取页面内容
export async function getPage(pageId: string) {
  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Notion Error:", error);
    return null;
  }
}

// 获取页面中的子块（包括数据库）
export async function getPageBlocks(pageId: string) {
  try {
    const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Notion Error:", error);
    return [];
  }
}

// 获取数据库内容
export async function getDatabase(databaseId: string) {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // 可以根据需要添加过滤和排序
      }),
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Notion Error:", error);
    return [];
  }
}

// 保留原有的 getPosts 函数以兼容现有代码
export async function getPosts() {
  const pageId = process.env.NOTION_PAGE_ID;
  if (!pageId) return [];

  try {
    // 首先获取页面的子块，找到数据库
    const blocks = await getPageBlocks(pageId);

    // 查找类型为 child_database 的块
    const databaseBlock = blocks.find((block: any) => block.type === 'child_database');

    if (!databaseBlock) {
      console.log("No database found in page");
      return [];
    }

    // 获取数据库 ID
    const databaseId = databaseBlock.id;

    if (!databaseId) {
      console.log("No database ID found");
      return [];
    }

    console.log("Found database:", databaseId);

    // 获取数据库内容
    const posts = await getDatabase(databaseId);

    console.log("Posts count:", posts.length);

    return posts;

  } catch (error) {
    console.error("Notion Error:", error);
    return [];
  }
}