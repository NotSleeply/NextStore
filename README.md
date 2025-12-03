# NextStore - 线上测试题（已实现）

这是一个使用 Next.js（App Router）与 Tailwind CSS 开发的示例购物网站，演示了商品列表、商品详情、购物车、简单登录流以及部署相关配置。

本文档包含：项目简介、快速启动、构建/部署说明，以及在 CI（GitHub Actions）与 Vercel 上常见问题的排查步骤。

---

## 功能概览

- 商品列表页：支持分类切换与滚动加载（分页）
- 商品详情页：懒加载图片、`加入购物车`（需登录验证）与 `立即购买` 功能
- 购物车：修改数量、删除商品、计算总价
- 简单登录状态（演示用）：本地模拟登录，使用 Zustand 持久化购物车
- SEO 友好：使用 App Router 的静态/SSG 页面生成

数据来源：FakeStore API — <https://fakestoreapi.com>

---

## 本地开发（快速开始）

先安装依赖：

```powershell
pnpm install
```

开发模式（带 HMR）：

```powershell
pnpm dev
```

在浏览器打开 <http://localhost:3000>

生产构建（本地模拟 production）：

```powershell
$env:NODE_ENV='production'; pnpm build
```

构建成功后可以预览生成的站点（静态导出时会输出 `out`）：

```powershell
pnpm start
```

---

## 代码结构（重要文件）

- `app/` - Next.js App Router 页面与布局
- `app/products/[id]/page.tsx` - 商品详情路由（服务器组件 + 客户端交互分离）
- `app/products/[id]/ProductDetailClient.tsx` - 商品详情的客户端组件（处理 hooks、路由跳转、购物车）
- `components/` - 公共组件（Header、Footer 等）
- `store/` - Zustand 状态管理（购物车、用户信息）
- `next.config.ts` - Next.js 配置（包含对 GitHub Pages 的兼容配置）

---

## 部署说明

项目支持两种常见部署目标：Vercel（推荐）与 GitHub Pages（静态导出）。

Vercel（推荐）

- 在 Vercel 上新建项目并连接仓库，**不需要**设置 `DEPLOY_TARGET`。
- Vercel 会自动使用 `next build` 并部署。

GitHub Pages（静态导出）

- 我们在 `next.config.ts` 中实现了按环境自动切换 `basePath` 与 `assetPrefix`：只有当环境变量 `DEPLOY_TARGET=github-pages` 时会启用仓库前缀。
- 在 GitHub Actions workflow (`.github/workflows/deploy.yml`) 中已经把 `DEPLOY_TARGET` 设置为 `github-pages`，并使用 `output: 'export'` 生成 `out/` 目录供 `actions/upload-pages-artifact` 上传。

重要：静态导出模式（`output: 'export'`）要求动态路由必须导出 `generateStaticParams()`，且服务器组件中执行（不能与 `"use client"` 同文件中使用）。我已将商品详情拆分为服务器组件（生成静态 params）和客户端组件（交互逻辑）。

---

## 常见问题与排查（CI / Vercel / Pages）

1. 构建错误：`useSearchParams() should be wrapped in a suspense boundary at page "/login"` —— 原因：`useSearchParams()` 为客户端路由 API，需要在客户端组件或包在 `<Suspense>` 中使用。解决方法：将表单逻辑放入客户端组件或在页面中用 `<Suspense>` 包裹。

2. 构建错误：`Page "/products/[id]" is missing "generateStaticParams()" so it cannot be used with "output: export"` —— 原因：开启静态导出时动态路由必须提供 `generateStaticParams()`（服务器组件）。解决方法：在 `app/products/[id]/page.tsx` 中实现 `export async function generateStaticParams()`，并把客户端逻辑拆到 `ProductDetailClient`。

3. CI 中 `tar: out: Cannot open: No such file or directory` —— 原因：Actions 期望 `out/` 目录存在（静态导出），但构建失败或没有使用 `next export`（`output: 'export'`）生成 `out`。检查前面的构建日志并修复构建错误，或确认 workflow 使用正确的构建命令。

4. 404 丢失资源（部署后路径错误）—— 如果你在 GitHub Pages 上看到类似 `/_next/static/... 404`，请确认仓库使用了 `basePath` 与 `assetPrefix`（我们通过 `DEPLOY_TARGET=github-pages` 控制）。在 Vercel 上不要启用 `basePath`。

5. API 返回 HTML（`Unexpected token '<'`）—— 有时 CI 环境对外网络有限制或 API 返回错误页面（例如 403/503）。生成静态参数时已加入回退机制（会使用默认 id 列表），但建议在 CI 中确认对 `https://fakestoreapi.com` 的访问权限。

6. `params` 是 Promise 错误（开发模式下）—— 在最新 App Router 中，route handler 的 `params` 可能为 Promise。在服务器组件中请使用参数解包（例如 `export default function Page({ params }: { params: { id: string } })`）或 `await`。不要在服务器组件中直接使用 `useParams()`（这是客户端 hook）。

7. Source map 警告（`Invalid source map`）—— 这是开发模式下 Turbopack / bundler 的警告，通常不会影响页面功能，但可以通过清理 `.next` 或升级依赖解决。

---

## Useful scripts

- `pnpm dev` - 本地开发
- `pnpm build` - 生产构建
- `pnpm start` - 运行构建产物（如使用 `next start`）

---

## 其他说明

- 图片：为简化导出，`next.config.ts` 中启用了 `images.unoptimized = true`（静态导出时避免默认的 Image 优化）。
- 购物车状态保存在 `localStorage`（Zustand persist），刷新页面购物车仍然保留。

---

如果你需要，我可以：

- 生成一个针对 Vercel / GitHub Actions 的部署检查清单；
- 在你的仓库上运行一次 GitHub Actions 重试并定位最新失败日志（需要你允许我触发或你提供 Actions 输出）；
- 或把 `README` 翻译成英文并补充截图/预览链接。

欢迎告诉我你想要的下一步。
