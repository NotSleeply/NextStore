# NextStore 线上测试题

请完成线上测试题，要求一天内完成，明天 23:59 前提交 Github 源码链接 和 Vercel 可预览链接

题目要求如下：
使用 Next.js 开发一个简单的购物网站，要求 SEO 友好，包含以下页面：

1. 商品列表页，可以切换商品分类，列表实现滚动到底部自动加载下一页（需要自己处理分页）
2. 商品详情页。页面下方有一个‘加入购物车’按钮，点击后需要验证用户登录状态，并更新右上角购物车的数量图标，商品图片需要支持 lazy load。
3. 购物车页面，包含修改商品数量、删除商品、计算支付金额等功能

源码提交到 github，并部署到 vercel

数据来源：<https://fakestoreapi.com>
GET
/products (get all products)
/products?limit=5 (limit return results )
/products/products/categories (get all categories)
/products/category/jewelery (get all products in specific category)
/products/1 (get specific product based on id)
