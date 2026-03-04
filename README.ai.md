# README.ai.md

AI quick context for this repository.

## 0) Goal
Personal website with Notion-powered blog:
- `/` homepage
- `/blog` parent Notion page content + child database post list
- `/blog/[id]` in-site post detail (Notion blocks)

## 1) Stack
- Next.js 16 (App Router)
- React 19 + TypeScript (strict)
- Tailwind v4

## 2) Required env
```env
NOTION_API_KEY=
NOTION_PAGE_ID=
```

## 3) Run
```bash
npm install
npm run dev
npm run build
npm run start
```

## 4) Core files
- Notion data layer: `lib/notion.ts`
  - `getBlogIndexData()`
  - `getBlogPostData(postId)`
- Blog list page: `app/blog/page.tsx`
- Blog detail page: `app/blog/[id]/page.tsx`
- Notion blocks renderer: `app/blog/_components/notion-blocks.tsx`
- Global theme styles: `app/globals.css`
- Site metadata/fonts: `app/layout.tsx`
- Homepage copy/CTA: `app/page.tsx`

## 5) Notion assumptions
- Parent page contains at least one `child_database` (first one is used).
- Preferred properties:
  - title: `名称`
  - tags: `标签` (multi_select)
- Fallbacks exist for missing title/tags.

## 6) Deployment (Vercel)
1. Import GitHub repo into Vercel.
2. Set env vars: `NOTION_API_KEY`, `NOTION_PAGE_ID`.
3. Deploy.
4. Re-deploy after new Notion posts if `/blog` list must refresh.

## 7) Music player assets (vinyl)
- Global floating player component: `app/_components/vinyl-player.tsx`
- Mounted in: `app/layout.tsx`
- Static assets root: `public/music/`
  - playlist: `public/music/playlist.json`
  - audio files: `public/music/tracks/*`
  - cover files (optional): `public/music/covers/*`

`playlist.json` schema (fixed):
```json
{
  "version": 1,
  "tracks": [
    {
      "id": "city-night",
      "title": "City Night",
      "artist": "Armin",
      "src": "/music/tracks/city-night.mp3",
      "cover": "/music/covers/city-night.jpg"
    }
  ]
}
```

Quick add-track flow:
1. Put audio file into `public/music/tracks/`
2. (Optional) put cover into `public/music/covers/`
3. Append one track object in `public/music/playlist.json`
4. No extra music env vars needed on Vercel

## 8) Guardrails for edits
- Keep Notion behavior working:
  - `/blog` must show parent content + posts
  - post links must stay in-site (`/blog/[id]`)
  - invalid post id must return 404
- Avoid touching unrelated files.
- Do not commit local logs/cache files.
