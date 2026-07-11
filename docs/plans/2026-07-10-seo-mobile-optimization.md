# 全站搜索引擎优化与手机端优化实施计划

> **For Codex（给本地编码代理）：** 实施时必须使用 `superpowers:executing-plans`（按计划执行）与 `superpowers:test-driven-development`（测试驱动开发），按任务逐项验证。

**Goal（目标）：** 先消除生产站手机端运行错误、横向裁切和无效导航，再补强抓取、元数据、多语言、结构化数据、内链与持续验证。

**Architecture（架构）：** 保留现有静态 HTML（超文本标记语言）架构，不迁移框架。优先修复共享脚本和样式，再强化构建期静态检查与 Chromium（谷歌开源浏览器）手机冒烟测试，最后处理需要搜索数据支持的内容优化。

**Tech Stack（技术栈）：** 静态 HTML、CSS（层叠样式表）、原生 JavaScript（脚本语言）、Node.js（服务端脚本运行时）、Cheerio（HTML 解析库）、Playwright（浏览器自动化工具）、Cloudflare Pages（静态托管服务）。

## 一、已确认基线

1. **Verifiable（可验证）：** 仓库包含 41 个公开页面与 41 个站点地图网址；现有 `check:seo`、`check:links`、`check:headers` 三项检查通过。
2. **Verifiable（可验证）：** 现有检查没有发现生产中的两条错误法语博客链接、缺失的网站图标、重复脚本、浏览器语法错误、无效页内锚点或手机横向裁切。
3. **Verifiable（可验证）：** 生产站的 `/assets/icons/favicon.svg` 与 `/assets/icons/apple-touch-icon.png` 均返回 404；`/blog/fr/blog/fr/` 返回 404。
4. **Verifiable（可验证）：** `blog/fr/index.html` 与 `blog/fr/fortnite-nom-invisible.html` 各重复加载 `mobile-optimization.js` 六次，`blog/fr/instagram-caracteres-invisibles.html` 重复五次。
5. **Verifiable（可验证）：** 375px 渲染下，法语博客首页布局宽度被撑至 426px；430px 渲染下被撑至 454px，主标题出现裁切。
6. **Verifiable（可验证）：** 旧页面加载 `theme.js` 时出现 `Unexpected token 'export'`（不应出现的导出语法）；重复手机脚本又触发 `MobileOptimizer has already been declared`（手机优化器被重复声明）。
7. **Verifiable（可验证）：** 16 个页面标题不在当前项目采用的 30 到 60 字符范围内，13 个描述不在 120 到 160 字符范围内，26 个页面仍填写了项目约定应为空的 `meta keywords`（元关键词）。
8. **Verifiable（可验证）：** 生产资源使用一年 `immutable`（不可变缓存），但文件名没有内容指纹；服务工作线程又采用长期缓存优先策略，修复发布后存在旧手机资源继续命中的风险。
9. **Counter（反方意见）：** 不能把“已有手机优化脚本”和“现有检查通过”当作完成证据。当前最重要的工作不是继续增加手机功能，而是删除重复执行、错误导航和不必要的全局副作用。

## 二、实施任务

### Task 1：P0 修复手机端运行错误

**Files（文件）：**

1. 修改 `assets/js/theme.js`。
2. 修改 `assets/js/mobile-optimization.js`。
3. 修改 `blog/fr/index.html`、`blog/fr/fortnite-nom-invisible.html`、`blog/fr/instagram-caracteres-invisibles.html`。
4. 测试 `tests/e2e/responsive-design.spec.js`。

**Steps（步骤）：**

1. 先补浏览器失败用例，要求代表页面在 375px 与 430px 下没有 `pageerror`（页面脚本错误），且同一外部脚本地址最多出现一次。
2. 删除三个法语页面中重复的 `mobile-optimization.js` 引用，每页只保留一个带 `defer`（延迟执行）的引用。
3. 删除 `theme.js` 中浏览器无法解析的条件式 `export`（模块导出）语句；初始化时只赋值 `window.themeManager = new ThemeManager()`，不再读取未声明的 `themeManager` 变量。
4. 给手机初始化增加全局幂等锁，重复调用直接返回。
5. 删除 `preventDoubleTapZoom()`（阻止双击缩放），改由 CSS 的 `touch-action: manipulation`（触摸行为控制）处理点击延迟，保留用户缩放能力。
6. 停止在所有页面动态插入固定底部导航。现有博客页使用原有汉堡菜单；首页保留当前静态顶部入口和页脚入口，不再生成错误的 `#tools`、`#features` 链接。
7. 删除手机脚本中的离线提示、推送、语音、搜索建议、通用弹窗与调试工具等未被当前公开页面调用的分支，避免继续维护 26KB 的全局副作用脚本。
8. 运行手机冒烟测试，预期代表页面脚本错误为 0，重复脚本为 0。

### Task 2：P0 修复手机布局、无效链接与缺失资源

**Files（文件）：**

1. 修改 `blog/fr/index.html`、`about.html`、`about-fr.html`。
2. 修改 `assets/css/style.css` 与 `assets/css/blank-text-generator.css`。
3. 修改 `assets/icons/logo-small.svg`、`assets/icons/logo-main.svg`，新增 `assets/icons/apple-touch-icon.png`。

**Steps（步骤）：**

1. 给法语博客首页的主视觉 flex（弹性布局）子项增加 `width: 100%` 与 `min-width: 0`，给长站名增加 `overflow-wrap: anywhere`（允许长词换行）；禁止使用 `overflow-x: hidden`（隐藏横向溢出）掩盖根因。
2. 为“Explorer les Articles”目标区增加真实的 `id="latest-posts"`，使按钮落到存在的区块。
3. 把法语博客两处 `href="blog/fr/"` 改成绝对站内路径 `/blog/fr/`。
4. 把 `about.html` 中不存在的 `#tools`、`#about` 改成真实页面或真实区块；给 `about-fr.html` 的 `#about` 增加对应区块标识或改成 `/about-fr`。
5. 保留空白文本比较表的桌面表格；小于 640px 时改成纵向比较卡片，不让用户必须横向拖动 520px 表格。若暂不改结构，至少保留局部滚动容器、滚动提示和粘性首列，且页面级宽度不得超出视口。
6. 把两个 SVG（可缩放矢量图）里的非法 `&nbsp;` 实体改成合法字符实体，统一所有页面 favicon（网站图标）引用为 `/assets/icons/logo-small.svg`。
7. 从修复后的 `logo-main.svg` 生成 180×180 的 `apple-touch-icon.png`，并让全部页面与 Article（文章）结构化数据引用真实存在的图标。
8. 运行本地资源检查与生产 `curl`（网址请求工具）检查，预期所有站内资源和链接返回 200 或预期 301。

### Task 3：P1 收紧手机 CSS、缓存与服务工作线程

**Files（文件）：**

1. 修改 `assets/css/mobile-optimization.css`、`assets/css/style.css`。
2. 修改 `sw.js`、`_headers`、`cloudflare-config/_headers`。
3. 修改 `scripts/build.js`。

**Steps（步骤）：**

1. 把手机样式缩减为公开页面真实使用的触控尺寸、网格、表单、菜单、安全区与减少动画规则；删除固定底栏、离线提示、语音、分享、调试等未使用样式。
2. 所有导航、按钮、卡片操作入口达到 44×44px；正文内联链接不强制扩大，但要有可见下划线或清晰对比。
3. 固定元素使用 `env(safe-area-inset-*)`（刘海屏安全区变量），避免遮挡 iPhone 底部区域。
4. 删除手机脚本中的服务工作线程注册。第一版部署把 `sw.js` 改为退役脚本：激活后清理 `tic-` 前缀缓存并注销自己；确认一轮部署后再从构建清单移除。
5. 在资产没有内容指纹前，去掉一年 `immutable`，改为一周浏览器缓存并允许重新验证；后续若构建加入内容哈希，再恢复一年不可变缓存。
6. 调整构建顺序：先复制到 `build/`（构建目录），再把 Tailwind（原子化样式工具）编译结果直接写入 `build/assets/css/tailwind.css`，避免构建命令改写受 Git 管理的源文件。
7. 移除 CSS 中的 Google Fonts（谷歌字体）`@import`（样式内导入）阻塞链。优先使用现有系统字体栈；若品牌必须保留字体，则自托管 WOFF2（网页字体格式）并使用 `font-display: swap`（先显示后替换）。

### Task 4：P1 重写搜索引擎优化与手机端质量门禁

**Files（文件）：**

1. 修改 `scripts/check-seo.js`、`scripts/check-links.js`、`scripts/site-files.js`。
2. 修改 `tests/e2e/responsive-design.spec.js`、`playwright.config.js`。
3. 修改 `package.json`、`.github/workflows/deploy.yml` 与对应目录 README（说明文件）。

**Steps（步骤）：**

1. `check-seo` 对全部公开页面检查唯一 H1、标题与描述范围、Canonical（规范网址）、Open Graph（社交分享元数据）、Twitter Card（推特分享卡片）、结构化数据解析与语言网址一致性。
2. 站点地图改为集合相等校验：每个可索引公开页面必须出现一次，站点地图中的每个网址也必须有源页面。
3. `check-links` 真正解析全部站内链接、页内锚点、脚本、样式、图标和结构化数据资源，发现 404、错误相对路径、重复脚本时失败。
4. 增加多语言互链的自引用与双向校验；不允许只在一侧声明。
5. 删除旧测试对 Tailwind 类名、固定菜单数量和已删除 DOM（文档对象模型）结构的断言，改成用户可见行为断言。
6. 手机测试固定覆盖 375px 与 430px，并覆盖首页、工具页、空白文本页、一个平台生成器、英法博客首页、长文章、开发者页、信任页和 404 页。
7. 手机门禁要求：页面级横向溢出为 0，脚本错误为 0，本地资源失败为 0，重复脚本为 0，无效页内锚点为 0，关键触控目标不小于 44×44px。
8. 新增 `npm run check:mobile`（运行手机检查）并并入 `check:all`；持续集成只安装 Chromium，运行轻量代表页冒烟测试，不运行六浏览器全量套件。

### Task 5：P2 完善元数据、多语言与结构化数据

**Files（文件）：**

1. 修改 41 个公开 HTML 页面的 `<head>`（头部元信息），通过校验脚本控制一致性。
2. 修改博客文章与平台工具的结构化数据。
3. 修改站点地图与对应校验。

**Steps（步骤）：**

1. 重写已超范围的 16 个标题与 13 个描述，核心意图靠前，删除描述首尾装饰性勾号；不改已锁定的英文首页标题和 H1。
2. 清空 26 个非空 `meta keywords`，并加入回归检查。Google 不使用该字段，本项是项目规范与代码清理，不宣称排名收益。
3. 为确认等价的页面组补齐 `hreflang`（多语言替代页）：About（关于页）、Help（帮助页）、英法博客首页、Discord 工具、WhatsApp 工具、Instagram 工具；每组包含英文、法文、自引用与 `x-default`（默认语言页）。不把仅主题相近但意图不同的页面强行配对。
4. 所有法文结构化数据增加 `inLanguage: "fr"`，英文增加 `inLanguage: "en"`；网址与当前 Canonical 完全一致。
5. Article 结构化数据统一补作者网址、真实可访问的 publisher logo（发布者图标）、准确的 `dateModified`（修改日期）与实际字数；删除公开页面中的占位验证代码。
6. 给博客文章增加可见 Breadcrumb（面包屑导航）及对应 `BreadcrumbList`（面包屑结构化数据）。
7. 保留内容真实一致的 FAQPage（常见问题结构化数据），但不继续为了富结果批量增加。Google 目前只经常向权威政府和健康站点展示 FAQ 富结果。

### Task 6：P2 优化内链与数据门禁下的内容

**Files（文件）：**

1. 修改英法博客索引与平台工具页。
2. 修改相关博客文章。
3. 不默认新增页面。

**Steps（步骤）：**

1. 把通用的 “Read More” 与 “Lire la suite” 改成能独立说明目标页面的锚文本，例如 “Instagram invisible character guide”。
2. 每个生成器页链接到对应指南，每个指南在首屏后链接回对应生成器，保持“工具承接操作意图，指南承接信息意图”的分工。
3. 先导出 Google Search Console（谷歌搜索控制台）最近 16 个月的页面、查询、点击、展示与平均排名，再决定内容扩写、合并或删除。
4. 重点复核三个偏离核心主题且内容较薄的法语页面：`guide-hashtags-instagram`、`optimisation-stories-instagram`、`strategies-croissance-instagram`。有稳定搜索需求则重写为与隐形字符直接相关的指南；无流量、无外链且无独立意图时，把有用内容合并到 Instagram 主指南，再按意图相似度选择 301 或 410，不做无关强跳转。
5. `invisible-name-generator` 内容约 235 词，只在搜索数据证明查询覆盖不足时补兼容性、失败原因和真实常见问题；禁止为了字数机械填充。

## 三、验证与上线门槛

1. 运行 `npm run build`，预期只写入 `build/`，`git status --short` 不出现生成样式噪声。
2. 运行 `npm run check:seo`、`npm run check:links`、`npm run check:headers`、`npm run check:mobile`，全部通过。
3. 检查 375px、430px、768px、1440px；手机端必须无页面级横向滚动、无标题裁切、无固定元素遮挡、无英语导航混入法语页。
4. 浏览器控制台必须没有 `pageerror`，本地资源请求不得出现 404。
5. 生产部署后回读首页、英法博客、平台生成器、robots、sitemap、404、图标和旧 `.html` 网址；确认状态码、跳转、Canonical 与响应头一致。
6. 用户提供 PageSpeed Insights API（网页速度洞察接口）密钥后，对首页、空白文本工具、一个平台生成器、英法博客首页各跑一次手机测试。验收目标为移动端 LCP（最大内容绘制）不高于 2.5 秒、INP（交互到下次绘制）不高于 200 毫秒、CLS（累积布局偏移）不高于 0.1；最终以真实用户第 75 百分位数据为准。
7. 上线后观察 Search Console 的索引、抓取、网页体验、富结果与查询变化至少 28 天；没有数据前不承诺排名提升。

## 四、回滚

1. 每个 Task（任务）独立提交，不把手机运行修复、元数据批改和内容重写混在一个提交。
2. Task 1 与 Task 2 出现回归时，先回滚对应共享脚本或页面提交，不回滚已经验证正确的链接与图标修复。
3. 服务工作线程退役分两次发布，第一版负责清缓存与注销，第二版才删除文件，避免旧客户端长期被历史缓存控制。
4. 内容页发生展示或点击下降时，只回滚该页面标题、描述或正文，不撤销技术门禁。

## 五、假设与边界

1. 本计划不迁移到 React（前端组件框架）、Next.js（全栈框架）或其他新框架，不新增运行时依赖。
2. 当前没有 Google Search Console、真实用户核心网页指标、日志或竞品数据；相关结论标记为数据门禁，不作为已验证事实。
3. 当前没有 PageSpeed Insights API 密钥，因此未生成完整线上性能分数。
4. 抓取与索引、手机端内容一致性以 [Google 移动优先索引规范](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing) 为准；内链以 [Google 可抓取链接规范](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) 为准；核心网页指标以 [web.dev Web Vitals](https://web.dev/articles/vitals) 为准。

## 最终裁决

即使经过审计，我认为当前代码在以下方面依然错误：把“有手机优化脚本”当成“手机端已优化”，把“现有检查通过”当成“链接与资源无错误”，以及在没有真实搜索数据时把批量扩写内容当成排名方案。
