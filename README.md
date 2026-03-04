# Personal Website (Next.js + Notion)

这是一个基于 **Next.js App Router** 的个人网站：
- `/` 首页：个人介绍
- `/blog`：展示 Notion 父页面正文 + 子数据库文章列表
- `/blog/[id]`：站内文章详情页（正文来自 Notion blocks）

---

## 给人看的版本（Human Guide）

## 1) 本地运行

### 前置条件
- Node.js `>= 20`
- npm `>= 10`
- 一个可用的 Notion Integration（需要 `NOTION_API_KEY`）
- 一个 Notion 父页面 ID（需要 `NOTION_PAGE_ID`）

### 安装依赖
```bash
npm install
```

### 配置环境变量
在项目根目录创建 `.env.local`：

```env
NOTION_API_KEY=your_notion_integration_secret
NOTION_PAGE_ID=your_parent_notion_page_id
```

### 启动开发环境
```bash
npm run dev
```
打开：`http://localhost:3000`

### 构建与生产运行
```bash
npm run build
npm run start
```

---

## 2) 你通常要改哪些信息

| 目标 | 文件 | 说明 |
|---|---|---|
| 首页标题、简介、按钮链接 | `app/page.tsx` | 改个人名称、简介、GitHub 链接 |
| 站点 metadata（标题/描述） | `app/layout.tsx` | 改浏览器标题和 SEO 描述 |
| 全局视觉风格（颜色、字体、间距） | `app/globals.css` | 改主题变量和通用样式 |
| 博客页文案与布局 | `app/blog/page.tsx` | 改列表页标题、副标题、卡片样式 |
| 博客详情页文案与布局 | `app/blog/[id]/page.tsx` | 改返回文案、详情页视觉 |
| Notion 字段映射逻辑 | `lib/notion.ts` | 如果你 Notion 数据库字段名不同，在这里改映射 |

---

## 3) Notion 侧需要准备什么

1. 创建 Notion Integration，拿到 `NOTION_API_KEY`。
2. 把父页面分享给这个 Integration。
3. 父页面下放一个 `child_database`（当前逻辑读取第一个子数据库）。
4. 数据库推荐字段：
   - 标题：`名称`（title）
   - 标签：`标签`（multi_select）
   - 封面：Notion page cover（可选）
   - icon：Notion page icon（可选）

> 当前代码有回退逻辑：
> - 标题缺失会回退到第一个 `type=title` 属性
> - 标签缺失会回退为空数组

---

## 4) 配上什么可以直接上线（Vercel）

你至少需要：
- GitHub 仓库
- Vercel 账号
- Notion Integration（含上面两个环境变量）

部署步骤：
1. 把代码推到 GitHub。
2. 在 Vercel 导入该仓库。
3. 在 Vercel Project Settings -> Environment Variables 配置：
   - `NOTION_API_KEY`
   - `NOTION_PAGE_ID`
4. 点击 Deploy。
5. （可选）绑定自定义域名。

### 内容更新说明
- `/blog` 列表页是构建期产物；Notion 新增文章后，通常需要重新部署以更新列表。
- `/blog/[id]` 为按需服务端渲染路由。

---

## 5) 给 AI 的快速版本

请看：[`README.ai.md`](./README.ai.md)

这个文件是专门为 AI/自动化代理准备的极简上下文。