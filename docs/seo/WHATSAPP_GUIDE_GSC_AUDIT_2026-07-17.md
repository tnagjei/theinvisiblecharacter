<!-- input: GSC final data, URL Inspection results, live responses, repository history, and current page source -->
<!-- output: WhatsApp guide CTR diagnosis, experiment attribution boundary, and prioritized optimization queue -->
<!-- pos: Target-page GSC audit report（更新规则：刷新数据或执行建议后需同步本报告与 docs/seo/README.md） -->

# WhatsApp 指南页 GSC 审计

生成时间：2026-07-17，Asia/Shanghai（亚洲上海时区）

目标页面：`https://theinvisiblecharacter.live/blog/whatsapp-invisible-messages`

GSC 资源：`sc-domain:theinvisiblecharacter.live`

数据状态：`final`（已定稿数据）

最新完整日期：2026-07-15

执行边界：本轮只新增 GSC 项目绑定、被 Git 忽略的原始数据和本报告；未修改页面、Title（标题）、Description（摘要）、H1（主标题）、URL、Canonical（规范网址）、Sitemap（站点地图）或 Redirect（重定向）。

## 1. Counter（反方意见）

“有曝光但点击低，所以应该立即改标题”不是当前证据支持的最优动作。

• Verifiable（可验证）：最近 28 天页面平均排名为 27.99，大部分可见搜索词仍在 30 位以后。

• Verifiable（可验证）：指南页最后抓取时间是 2026-05-07，早于 2026-07-11 的 SEO（搜索引擎优化）实验 2A。

• Verifiable（可验证）：专项工具页已被 Google 发现，但尚未抓取和收录。

• Judgment（判断）：应先让 Google 重新抓取指南页并首次抓取工具页，再评价 2A 或改搜索摘要。

• Confidence ≠ Correctness（自信不等于正确）：URL Inspection（网址检查）没有返回工具页不收录的具体原因，不能把 `Discovered - currently not indexed`（已发现但当前未收录）直接解释为内容质量处罚。

## 2. 核心裁决

页面表现正在变好，但样本仍小，且 Google 看到的还是 5 月旧版本。

• 最近 28 天曝光比前一个 28 天增加 57.94%。

• 平均排名从 31.62 改善到 27.99，前进约 3.63 位。

• 点击从 0 增至 1，点击率从 0% 增至 0.59%。

• 90 天只有 2 次点击，2026 年截至 7 月 15 日只有 4 次点击，不能进行高置信度 CTR（点击率）归因。

• 专项工具页截至 2026-07-15 仍是 0 曝光、0 点击。

当前第一优先级不是重写 Title（标题），而是索引刷新。

## 3. 三层 GSC 指标

### 3.1 Property Total（全站总量）

| 窗口 | 点击 | 曝光 | CTR（点击率） | 平均排名 |
|---|---:|---:|---:|---:|
| 2026-06-18 至 2026-07-15 | 56 | 3,483 | 1.61% | 24.85 |
| 2026-05-21 至 2026-06-17 | 7 | 805 | 0.87% | 22.65 |

解释：全站曝光增长 332.67%，页面曝光增长 57.94%。页面在增长，但增长速度低于全站。全站覆盖扩张也使全站平均排名从 22.65 变为 24.85，不能把这个变化归因于目标页。

### 3.2 Exact Page Total（页面精确总量）

| 窗口 | 点击 | 曝光 | CTR（点击率） | 平均排名 |
|---|---:|---:|---:|---:|
| 最近 28 天 | 1 | 169 | 0.59% | 27.99 |
| 前一个 28 天 | 0 | 107 | 0% | 31.62 |
| 最近 90 天 | 2 | 445 | 0.45% | 29.08 |
| 2026-01-10 至 2026-07-15 | 4 | 818 | 0.49% | 25.53 |

### 3.3 Visible Query Rows（可见搜索词行）

| 窗口 | 可见搜索词数 | 可见点击 | 可见曝光 | 页面总曝光 | 未显示曝光 |
|---|---:|---:|---:|---:|---:|
| 最近 28 天 | 33 | 0 | 76 | 169 | 93 |
| 前一个 28 天 | 28 | 0 | 60 | 107 | 47 |
| 最近 90 天 | 39 | 0 | 197 | 445 | 248 |
| 2026-01-10 至 2026-07-15 | 45 | 0 | 287 | 818 | 531 |

查询层未显示的搜索词、设备和国家写作：**未提供（API未返回）**。

最近 28 天唯一的 1 次点击没有出现在可见 Query（搜索词）、Device（设备）或 Country（国家）行中，因此不能声称它来自某个关键词、设备或国家。

## 4. 最近 28 天主要搜索词

| Query（搜索词） | 中文意图 | 点击 | 曝光 | 平均排名 |
|---|---|---:|---:|---:|
| `invisible chat` | 隐形聊天，含义偏宽 | 0 | 9 | 56.44 |
| `empty character whatsapp` | WhatsApp 空白字符 | 0 | 7 | 41.43 |
| `blank message for whatsapp` | WhatsApp 空白消息 | 0 | 6 | 46.00 |
| `invisible messages` | 隐形消息，含义偏宽 | 0 | 5 | 57.40 |
| `invisible whatsapp chat` | WhatsApp 隐形聊天 | 0 | 3 | 30.67 |
| `empty message in whatsapp` | WhatsApp 空消息 | 0 | 3 | 35.33 |
| `blank whatsapp message` | WhatsApp 空白消息 | 0 | 3 | 40.33 |
| `whatsapp invisible` | WhatsApp 隐形内容 | 0 | 2 | 8.50 |
| `invisible text whatsapp` | WhatsApp 隐形文本 | 0 | 2 | 24.00 |

判断：

• `whatsapp invisible` 平均排名 8.50，但只有 2 次曝光，不足以据此重写全页。

• 有稳定曝光的 blank / empty（空白或空消息）词仍主要位于 35 至 46 位，主要问题是排名，而不是第一页高曝光低点击。

• Transactional intent（操作型意图）仍由指南页承接，因为专项工具页尚未收录。

## 5. URL Inspection（网址检查）

### 5.1 指南页

| 字段 | API 返回 |
|---|---|
| Verdict（结论） | `PASS`（通过） |
| Coverage（覆盖状态） | `Submitted and indexed`（已提交并已收录） |
| Robots（抓取规则） | `ALLOWED`（允许） |
| Indexing（索引权限） | `INDEXING_ALLOWED`（允许索引） |
| Page fetch（页面抓取） | `SUCCESSFUL`（成功） |
| Google Canonical（Google 规范网址） | 与用户 Canonical 一致 |
| Last crawl（最后抓取） | 2026-05-07 14:42:49 UTC（协调世界时） |
| Crawled as（抓取类型） | `MOBILE`（移动设备） |
| Rich results（富媒体结果） | `PASS`（通过），检测到 Breadcrumbs（面包屑） |

关键边界：最后抓取早于 2A，因此 7 月 11 日的正文、证据标签和新 CTA（行动入口）不能视为已被 Google 处理。

### 5.2 WhatsApp 专项工具页

| 字段 | API 返回 |
|---|---|
| Verdict（结论） | `NEUTRAL`（中性） |
| Coverage（覆盖状态） | `Discovered - currently not indexed`（已发现但当前未收录） |
| Sitemap（站点地图） | 已发现于 `/sitemap.xml` |
| Last crawl（最后抓取） | 未提供（API未返回） |
| Page fetch（页面抓取） | 未提供（API未返回） |
| Google Canonical（Google 规范网址） | 未提供（API未返回） |

当前线上检查显示该工具页返回 HTTP 200（网页正常响应）、自引用 Canonical（规范网址），并已从首页、Tools（工具页）、Blank Text（空白文本页）和指南页等入口链接。没有证据支持继续增加一批重复内链或重写整页。

## 6. 2A 实验是否有效

当前答案：**未验证。**

### 前后各 5 天，仅作方向观察

| 窗口 | 点击 | 曝光 | CTR（点击率） | 平均排名 |
|---|---:|---:|---:|---:|
| 2026-07-06 至 2026-07-10 | 1 | 30 | 3.33% | 22.07 |
| 2026-07-11 至 2026-07-15 | 0 | 70 | 0% | 27.29 |

不能写成“实验导致曝光增长或排名下降”，原因有三：

• 每个窗口只有 5 天。

• 点击基线只有 1 次。

• Google 最后抓取仍是 2026-05-07，实验内容尚未进入索引版本。

## 7. 优化队列

### P0：立即执行，先处理抓取与收录

1. 在 GSC 中对指南页执行 Request indexing（请求编入索引），推动 Google 抓取 7 月 11 日后的版本。

2. 对专项工具页执行 Request indexing（请求编入索引），推动首次抓取。

3. 等 URL Inspection（网址检查）出现新的抓取时间，并确认工具页从 `Discovered - currently not indexed`（已发现但当前未收录）发生变化。

4. 不使用 Indexing API（索引接口）提交普通网页；该接口不是普通内容页的通用提交工具。

### P1：新抓取后观察 14 至 28 天

继续分开记录：

• 指南页 Exact Page Total（页面精确总量）。

• 工具页 Exact Page Total（页面精确总量）。

• Query × Page（搜索词与页面）可见行。

• 未显示数据继续写“未提供（API未返回）”。

通过条件：

• 工具页开始获得曝光。

• `generator / copy / empty character`（生成器、复制、空白字符）逐步由工具页承接。

• 指南页保留 `how to / troubleshooting / why`（怎么做、排错、为什么）意图。

### P2：只有重新抓取后仍表现弱，才改指南页搜索文案

候选 Title（标题），50 个字符：

`WhatsApp Blank Message: How to Send Invisible Text`

候选 H1（主标题）：

`How to Send a Blank Message on WhatsApp`

候选 Description（摘要），142 个字符：

`Learn how to send a blank message on WhatsApp using invisible Unicode text. Copy a character, test it, and fix common paste or display issues.`

禁止项：

• 不把指南页也改成 `generator`（生成器）页。

• 不新增第三个 WhatsApp 空白消息页面。

• 不根据 2 次曝光、1 次匿名点击决定整页方向。

### P3：后续技术正确性修复

• 当前 Article Schema（文章结构化数据）的 `dateModified`（修改日期）仍是 2024-12-01，但页面在 2026-07-11 已修改。

• Schema（结构化数据）的 `wordCount`（字数）写 2500，当前正文估算约 1296 词。

• 页面中的“Privacy Protection（隐私保护）”表述容易让用户误以为隐形字符等于加密，应改为格式测试，不应声称增加隐私。

• `www` 与非 `www` 当前都返回 HTTP 200（网页正常响应）。这是站点级规范化风险，但不是本页当前低点击的首要原因。

## 8. 当前不应执行的动作

• 不立即覆盖 2A 的 Title（标题）、Description（摘要）和 H1（主标题）。

• 不根据 5 天数据宣布实验成功或失败。

• 不把页面总量 169 次曝光替换为可见 Query（搜索词）加总 76 次曝光。

• 不把工具页 0 曝光直接写成“内容差”。

• 不继续批量增加重复内链，当前线上入口已经存在。

## 9. 原始证据

原始数据目录：`seo-input/gsc-api/`，该目录被 Git 忽略。

关键文件：

• `2026-07-17-property-28d-final.json`：最近 28 天全站总量。

• `2026-07-17-property-prev28d-final.json`：前一个 28 天全站总量。

• `2026-07-17-whatsapp-guide-28d-total-final.json`：指南页最近 28 天总量。

• `2026-07-17-whatsapp-guide-prev28d-total-final.json`：指南页前一个 28 天总量。

• `2026-07-17-whatsapp-guide-28d-queries-final.json`：指南页最近 28 天可见搜索词。

• `2026-07-17-whatsapp-guide-daily-final.json`：指南页 7 月逐日数据。

• `2026-07-17-whatsapp-intent-28d-query-page-final.json`：WhatsApp 意图 Query × Page（搜索词与页面）。

• `2026-07-17-whatsapp-tool-all-total-final.json`：专项工具页截至 7 月 15 日总量。

• `2026-07-17-whatsapp-url-inspection.json`：两个 URL 的网址检查结果。

## 10. 最终裁决

即使经过讨论，我认为你在以下方面依然错误：把这个问题主要定义成“曝光有但点击低”。当前最强证据是 **Google 仍使用 5 月抓取的指南版本，专项工具页尚未收录，且大多数查询排名仍在 30 位以后**。在重新抓取与收录完成前改标题，会增加变量，却不会解决当前最明确的阻断。
