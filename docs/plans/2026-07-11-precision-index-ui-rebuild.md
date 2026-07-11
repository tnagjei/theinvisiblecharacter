# Precision Index UI Rebuild Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将所有公开页面统一为用户已选择的 A「精密索引」视觉系统，同时保持现有工具、链接、语言和 SEO 内容可用。

**Architecture:** 新增一份项目级 `DESIGN.md` 和一份后加载的共享 CSS。公开 HTML 通过相对路径加载该 CSS，以覆盖两套历史样式而不重写工具逻辑。以静态契约测试、现有 SEO/链接检查和真实浏览器截图证明改动未破坏站点。

**Tech Stack:** 静态 HTML、CSS、原生 JavaScript、Jest、Playwright。

---

### Task 1: 建立全站样式加载契约

**Files:**

- Create: `tests/precision-index-contract.test.js`
- Create: `assets/css/precision-index.css`
- Modify: `scripts/site-files.js` 所列 41 个公开 HTML

**Step 1:** 写失败测试，要求每个公开 HTML 都加载 `precision-index.css`。

**Step 2:** 运行 `npx jest tests/precision-index-contract.test.js --runInBand`，确认在新样式尚不存在时失败。

**Step 3:** 创建共享样式并把正确相对路径插入每个公开 HTML 的原有 `style.css` 后面。

**Step 4:** 重跑同一测试，确认通过。

### Task 2: 实现 A「精密索引」共享视觉系统

**Files:**

- Modify: `assets/css/precision-index.css`
- Modify: `assets/css/mobile-optimization.css`

**Step 1:** 先扩展契约测试，要求不再加载会插入固定底部导航的旧手机脚本。

**Step 2:** 运行测试，确认失败。

**Step 3:** 实现暖纸色令牌、直角工具组件、统一导航/页脚、博客与长文阅读样式、可访问焦点和双主题，并移除旧脚本引用。

**Step 4:** 重跑契约测试及 `npm run check:links`。

### Task 3: 验证工具和页面族

**Files:**

- Modify: `tests/e2e/precision-index-ui.spec.js`

**Step 1:** 写浏览器测试，覆盖首页、工具页、空白文本页、一个平台工具、英法博客、说明页与 404 页的样式加载、可见导航、无横向溢出和 375px/430px 菜单。

**Step 2:** 运行该测试，确认它在旧界面断裂处失败。

**Step 3:** 仅以共享样式或必要的小型页面修复使测试通过，不改业务流程。

**Step 4:** 运行 `npm run build`、`npm run check:seo`、`npm run check:links`、`npm run check:headers`。

### Task 4: 两轮视觉审查与交付

**Files:**

- Modify: 仅在截图明确指出问题时修改对应 CSS 或 HTML。

**Step 1:** 第一轮截图：1440px、375px、430px，至少覆盖首页、工具页、英法博客和长文。

**Step 2:** 记录艺术、工程、甲方和读者四个视角各一项问题。

**Step 3:** 只修复记录的 3–5 项问题并重新截图。

**Step 4:** 运行全部静态检查、目标 E2E、`git diff --check`，交付文件清单、验证结果和未验证风险。
