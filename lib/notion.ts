// lib/notion.ts
import { Client } from "@notionhq/client";

export const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 如果类型报错，用 any
export async function getPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  const response = await (notion.databases as any).query({
    database_id: databaseId,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [{ property: "Created", direction: "descending" }],
  });
  return response.results;
}