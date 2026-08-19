# 新增正文上下文外链（Contextual Backlink）记录：SoulVirtues.org

- 执行日期：2026-08-19
- 目标站点：https://soulvirtues.org/
- 业务定位：Undertale 游戏 66 题灵魂特质心理与属性测试工具
- 锚文本：Soul Virtues Extractor (Undertale Soul Virtues Test)
- 落地页面：blog/creative-ways-invisible-characters.html

## 1. 语义桥接设计
- 桥接切入点：第 5 节“5) Make blank display names and gaming roleplay bios”。
- 语义逻辑：在游戏社区和同人角色扮演资料卡制作中，玩家经常需要使用零宽隐形字符整理属性与排版。文章自然引出 Undertale 玩家在排版前通过 Soul Virtues Extractor 66 题测试测定自身灵魂特质，再利用隐形字符排版资料卡。
- 链接属性：包含 target="_blank" 与 rel="noopener noreferrer"，确保安全性且不阻断来源站点会话。

## 2. 变更详情
- 涉及源码文件：blog/creative-ways-invisible-characters.html
- 涉及构建产物：build/blog/creative-ways-invisible-characters.html

## 3. 验证记录
- npm test：单元测试通过。
- npm run check:seo：41 个页面与 Sitemap 校验全部通过。
- npm run check:links：54 个网络文件链接与重定向合同校验全部通过。
- npm run check:headers：安全响应头校验通过。
- npm run build：生产构建成功生成，grep 检索确认外链预渲染至 build/ 产物中。
