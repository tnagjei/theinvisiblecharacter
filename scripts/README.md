# Scripts

• 用途：构建、SEO（搜索引擎优化）、链接、响应头与本地 GSC（谷歌搜索控制台）审计脚本。
• 关键入口：`build.js`、`check-seo.js`、`seo-query-ownership.py`。
• 边界/依赖：生产构建使用 Node.js；搜索词审计脚本只使用 Python 标准库并读取被 Git 忽略的 `seo-input/`。

> 一旦本目录内容变化，请更新本文件

## Files

• `build.js`：复制静态站后把 Tailwind 结果写入 `build/`，并验证站点地图。
• `check-headers.js`：检查安全响应头配置。
• `check-links.js`：检查站内页面、锚点、本地资源、重复脚本与重定向合同。
• `check-seo.js`：检查 Canonical（规范网址）、Sitemap 与正式页面集合相等及基础 SEO 合同。
• `site-files.js`：维护正式页面文件与公开 URL 映射。
• `seo-query-ownership.py`：扫描 GSC ZIP 字段，严格分离 Property、Exact Page 与 Visible Query 三层指标，并生成 V2 搜索词所有权审计。
