# NextStore - 在线购物商城

基于 Next.js 开发的在线购物网站，SEO 友好，使用 TypeScript 和 Tailwind CSS。

## 功能特性

### ✅ 已实现功能

1. **商品列表页** (`/`)
   - 显示所有商品
   - 分类筛选功能
   - 滚动到底部自动加载更多（无限滚动）
   - 响应式网格布局
   - SEO 友好的元数据

2. **商品详情页** (`/products/[id]`)
   - 商品详细信息展示
   - 图片懒加载 (Lazy Loading)
   - 加入购物车功能
   - 登录状态验证
   - 动态 SEO 元数据

3. **购物车页面** (`/cart`)
   - 查看购物车商品
   - 修改商品数量（增加/减少）
   - 删除商品
   - 自动计算总价
   - 清空购物车
   - 结算功能

4. **用户登录** (`/login`)
   - 简单的登录验证
   - 登录状态持久化
   - 未登录自动跳转

5. **全局功能**
   - 响应式设计
   - 购物车数量徽章实时更新
   - 状态管理 (Zustand)
   - 数据持久化

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand
- **图标**: Heroicons
- **数据源**: [FakeStore API](https://fakestoreapi.com)

## 项目结构

```text
nextstore/
├── app/
│   ├── cart/               # 购物车页面
│   ├── login/              # 登录页面
│   ├── products/[id]/      # 商品详情页面
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页（商品列表）
│   └── globals.css         # 全局样式
├── components/
│   ├── Header.tsx          # 顶部导航栏
│   └── Footer.tsx          # 底部
├── lib/
│   └── api.ts              # API 封装
├── store/
│   ├── authStore.ts        # 用户认证状态
│   └── cartStore.ts        # 购物车状态
├── types/
│   └── product.ts          # 类型定义
└── package.json
```

## 快速开始

### 安装依赖

```bash
cd nextstore
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 生产构建

```bash
npm run build
npm start
```

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. Vercel 会自动检测 Next.js 项目并部署

或使用 Vercel CLI:

```bash
npm i -g vercel
vercel
```

## 主要功能说明

### 1. 无限滚动加载

使用 Intersection Observer API 实现，当用户滚动到页面底部时自动加载更多商品。

### 2. 图片懒加载

商品详情页的图片使用 Next.js Image 组件的 `loading="lazy"` 属性实现懒加载。

### 3. 状态管理

使用 Zustand 进行状态管理，并通过 `persist` 中间件实现本地持久化：

- `authStore`: 管理用户登录状态
- `cartStore`: 管理购物车数据

### 4. SEO 优化

- 使用 Next.js Metadata API
- 动态生成页面标题和描述
- 语义化 HTML 标签
- 响应式图片优化

### 5. 登录验证

在加入购物车和访问购物车页面时会验证用户登录状态，未登录会跳转到登录页面。

## API 接口

使用 [FakeStore API](https://fakestoreapi.com):

- `GET /products` - 获取所有商品
- `GET /products/categories` - 获取所有分类
- `GET /products/category/:category` - 获取特定分类的商品
- `GET /products/:id` - 获取商品详情

## 演示账号

登录页面接受任意用户名和至少 6 位的密码即可登录（演示用途）。

## 开发说明

### 环境要求

- Node.js 18+
- npm 或 yarn

### 代码规范

项目使用 TypeScript 和 ESLint 确保代码质量。

## License

MIT
