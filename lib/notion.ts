import { Client } from "@notionhq/client";

// 确保环境变量存在
const apiKey = process.env.NOTION_API_KEY;
if (!apiKey) throw new Error("Missing NOTION_API_KEY");

const notion = new Client({ auth: apiKey });

export { notion };

export async function getPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) return [];

  try {
    // 使用标准的 fetch API 直接调用 Notion API
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: "Published",
          checkbox: { equals: true },
        },
        sorts: [{ property: "Created", direction: "descending" }],
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