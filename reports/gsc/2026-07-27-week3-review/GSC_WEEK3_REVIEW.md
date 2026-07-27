# GSC 2026-07-19 至 2026-07-25 周复盘

站点：<https://theinvisiblecharacter.live/>

生成日期：2026-07-27 Asia/Shanghai

搜索类型：Web

## Executive Summary

Counter:

🚨 “点击增加，所以整站全面改善”不成立。临时等长对比中，点击增加 50.0%，但展示减少 25.1%。新增点击高度集中于法国和法语 TikTok 页面，英语首页、通用查询和 Blank Text 并未同步改善。

- **当前只能做临时结论。** `final` 最大日期为 2026-07-24。正式区间 7 月 19 日至 25 日缺最后一天，本报告用 7 月 19 日至 24 日对比 7 月 12 日至 17 日，均为周日至周五。
- **最强增长来自法语 TikTok。** `/fr/pseudo-invisible-tiktok` 从 4 点击、35 展示增至 24 点击、180 展示。法语 TikTok 查询簇从 4 点击、62 展示增至 21 点击、154 展示。
- **英文 TikTok 有机会，但还不能再次修改。** 专项页展示从 82 增至 129，平均排名从 21.91 改善到 13.16；首页和专项页的所有权分别约为 43.5% 和 42.2%。页面在 7 月 20 日刚修改，本周期混合修改前后。
- **本轮不新增页面。** 所有达到可用证据量的查询意图已有对应页面。WhatsApp 工具页仅首次获得 4 次页面展示，无法支撑重构或新增页。

## 1. Data Completeness

| 项目 | 结果 |
|---|---|
| `final` 最大可用日期 | 2026-07-24 |
| `all` 最大可用日期 | 2026-07-26 |
| `all.firstIncompleteDate` | 2026-07-25 |
| 正式目标区间 | 2026-07-19 至 2026-07-25 |
| 实际分析区间 | 2026-07-19 至 2026-07-24 |
| 匹配对比区间 | 2026-07-12 至 2026-07-17 |
| 状态 | DATA_INCOMPLETE |
| 结论类型 | PROVISIONAL（临时） |

两段均为 6 天，星期结构均为周日至周五。7 月 25 日的 `all` 数据没有进入趋势、页面或查询结论。

## 2. Change Timeline

Git 提交时间只能证明代码合入时间，不能证明 Cloudflare 实际完成部署的时间。

| 日期 | Commit | 页面或系统 | 修改内容 | 对本周期的影响 |
|---|---|---|---|---|
| 2026-07-18 | `05222ae` | Blank、TikTok、Discord、WhatsApp 审计等 | 内容与字符说明更新 | 当前周期基本属于改后，但缺完整 7 天 |
| 2026-07-20 | `2b046d9` | `/index-fr` | 法语首页围绕通用词重写 | 当前周期混合修改前后 |
| 2026-07-20 | `07e254e` | 英文 TikTok 页、sitemap | 功能、内容和描述加强 | 当前周期混合修改前后 |
| 2026-07-20 | `a808334` | 法语通用页、法语 TikTok 页、法语首页 | 收敛法语 TikTok 所有权 | 当前周期混合修改前后 |
| 2026-07-20 | `91521b1` | 首页、英文 TikTok 页、TikTok 指南 | 英文 TikTok 查询集权 | 当前周期混合修改前后 |

## 3. 整站变化：点击增长，覆盖面收缩

| 指标 | 7月12日至17日 | 7月19日至24日 | 变化 |
|---|---:|---:|---:|
| Clicks（点击） | 28 | 42 | +14，+50.0% |
| Impressions（展示） | 1,612 | 1,207 | -405，-25.1% |
| CTR（点击率） | 1.74% | 3.48% | +1.74 个百分点 |
| Average position（平均排名） | 27.58 | 25.10 | -2.48，改善 |

**判断：** Google 减少了大量低点击展示，同时法语前十查询增加，令 CTR 和平均排名改善。不能把它解释为全站覆盖面与全部页面同时增长。

## 4. 重点页面表现

排名变化为当前周期减前一周期，负数代表改善。

| 页面 | 前期点击/展示 | 当前点击/展示 | CTR变化 | 排名变化 | 结论 |
|---|---:|---:|---:|---:|---|
| `/` | 17 / 735 | 5 / 209 | +0.08pp | -2.69 | declining |
| `/index-fr` | 4 / 277 | 1 / 77 | -0.14pp | +3.15 | mixed_pre_post_change_data |
| `/tiktok-invisible-username-generator` | 1 / 82 | 1 / 129 | -0.44pp | -8.76 | mixed_pre_post_change_data |
| `/invisible-name-generator` | 0 / 11 | 0 / 47 | 0.00pp | +23.24 | insufficient_evidence |
| `/blank-text-generator` | 0 / 405 | 0 / 290 | 0.00pp | -3.04 | stable |
| `/whatsapp-blank-message-generator` | 0 / 0 | 0 / 4 | 0.00pp | 新增 33.75 | newly_discovered |
| `/blog/whatsapp-invisible-messages` | 0 / 69 | 0 / 53 | 0.00pp | +2.30 | declining |
| `/fr/pseudo-invisible-tiktok` | 4 / 35 | 24 / 180 | +1.90pp | -0.15 | mixed_pre_post_change_data |
| `/fr/message-vide-whatsapp` | 0 / 0 | 1 / 29 | +3.45pp | 新增 11.34 | newly_discovered |
| `/fr/saut-de-ligne-instagram` | 0 / 0 | 1 / 7 | +14.29pp | 新增 8.86 | newly_discovered |
| `/fr/pseudo-invisible-discord` | 0 / 0 | 3 / 80 | +3.75pp | 新增 8.46 | newly_discovered |
| 旧 `/fr/caractere-invisible-tiktok` | 2 / 12 | 7 / 84 | -8.33pp | -0.44 | insufficient_evidence |

`/fr/caractere-invisible` 当前仍无 Search Analytics 页面数据。0 展示不等于未索引。

## 5. 查询意图变化

查询簇互斥处理，法语平台词不计入英语平台簇。

| 查询簇 | 前期展示/点击 | 当前展示/点击 | CTR变化 | 排名变化 | 证据 | 建议页面 |
|---|---:|---:|---:|---:|---|---|
| 英语通用 Invisible Character | 43 / 0 | 6 / 0 | 0.00pp | +13.50 | Weak | `/` |
| 英语 TikTok | 224 / 9 | 145 / 3 | -1.95pp | +0.80 | Strong | 英文 TikTok 专项页 |
| Blank / Empty | 248 / 0 | 159 / 0 | 0.00pp | -3.78 | Strong | Blank Text 页 |
| Invisible Name | 31 / 0 | 24 / 0 | 0.00pp | +10.20 | Medium | Invisible Name 页 |
| 法语通用 | 101 / 2 | 30 / 0 | -1.98pp | +3.25 | Medium | 法语通用页 |
| 法语 TikTok | 62 / 4 | 154 / 21 | +7.18pp | -1.86 | Strong | 新法语 TikTok 页 |
| 法语 WhatsApp | 0 / 0 | 4 / 0 | 0.00pp | 新增 6.50 | Weak | 法语 WhatsApp 页 |
| 法语 Instagram | 0 / 0 | 4 / 0 | 0.00pp | 新增 10.25 | Weak | 法语 Instagram 页 |
| 法语 Discord | 32 / 1 | 54 / 2 | +0.58pp | -1.69 | Strong | 法语 Discord 页 |
| 英语 WhatsApp 工具 | 28 / 0 | 22 / 0 | 0.00pp | -3.12 | Medium | WhatsApp 工具页 |
| 英语 WhatsApp 指南 | 0 / 0 | 2 / 0 | 0.00pp | 新增 36.50 | Insufficient | WhatsApp 指南页 |

证据等级：Strong 为 50 次及以上，Medium 为 10 至 49，Weak 为 3 至 9，Insufficient 少于 3。

## 6. Query Ownership Map

Page × Query（页面与查询词组合）存在匿名化，因此所有权分母只代表可见组合行，不等于整站展示。

| 查询意图 | 当前主要页面 | 建议页面 | 建议页占比 | 状态 | 推荐动作 |
|---|---|---|---:|---|---|
| 英语通用 | Blank Text 页 | 首页 | 14.3% | insufficient_evidence | 仅 7 次可见组合展示，不判断 |
| 英语 TikTok | 首页 | 英文 TikTok 专项页 | 42.2% | potential_conflict | 等 7 月 20 日改后完整窗口 |
| Blank / Empty | Blank Text 页 | Blank Text 页 | 100.0% | aligned | 不改 TDK，观察排名 |
| Invisible Name | 首页与 Blank 页并列 | Invisible Name 页 | 16.7% | owner_mismatch | 后续优化现有页，不新增页 |
| 法语通用 | `/index-fr` | `/fr/caractere-invisible` | 0.0% | owner_mismatch | 等法语改后完整窗口 |
| 法语 TikTok | 新法语 TikTok 页 | 新法语 TikTok 页 | 66.2% | potential_conflict | 观察旧 URL 迁移 |
| 法语 WhatsApp | 法语 WhatsApp 页 | 同页 | 100.0% | insufficient_evidence | 仅 4 次展示 |
| 法语 Instagram | 法语 Instagram 页 | 同页 | 100.0% | insufficient_evidence | 仅 4 次展示 |
| 法语 Discord | 法语 Discord 页 | 同页 | 96.3% | aligned | 保持不动 |
| 英语 WhatsApp 工具 | WhatsApp 指南页 | WhatsApp 工具页 | 4.5% | owner_mismatch | 等工具页抓取和测试 |
| 英语 WhatsApp 指南 | 两页各 50% | WhatsApp 指南页 | 50.0% | insufficient_evidence | 仅 2 次展示 |

## 7. 排名 8 至 20 的可执行机会

| 页面 | 查询 | 点击 | 展示 | CTR | 排名 | 判断 |
|---|---|---:|---:|---:|---:|---|
| `/` | `invisible username tiktok generator` | 2 | 59 | 3.39% | 8.68 | 所有权错位，不优化首页 |
| 英文 TikTok 页 | `invisible username tiktok generator` | 0 | 14 | 0.00% | 11.07 | 首要候选，先等完整改后窗口 |
| `/index-fr` | `caractère invisible` | 0 | 15 | 0.00% | 8.87 | 所有权错位，不继续强化首页 |
| 法语 Discord 页 | `caractère invisible discord` | 1 | 14 | 7.14% | 10.14 | 已对齐，保持 |
| 新法语 TikTok 页 | `caractère invisible pour pseudo tiktok` | 1 | 10 | 10.00% | 8.40 | 已对齐，保持 |
| `/` | `invisible name generator` | 0 | 10 | 0.00% | 8.30 | 所有权错位，不优化首页 |

**TDK/CTR 机会：** 英文 TikTok 专项页最接近可执行条件，但 7 月 20 日刚改，当前不能重复修改。

**内容/功能机会：** Blank Text 页正确承接 100% 可见查询，但平均排名 63.84。后续应检查功能、用例和内容覆盖，不应只改标题。

**观察机会：** WhatsApp 工具、法语 WhatsApp、法语 Instagram。每个正确查询只有 4 次或更少展示。

## 8. 页面专项判断

### 首页

- 页面展示从 735 降至 209，点击从 17 降至 5。
- 平均排名从 14.34 改善至 11.65，但这来自展示结构收缩，不是通用词整体前移。
- 首页仍承接 43.5% 的英语 TikTok 可见组合展示，以及 41.7% 的 Invisible Name 展示。

结论：首页整体不应继续承接专项词。也不应通过增加专项词密度来挽回展示。

### 英文 TikTok 页

- 页面展示增长 57.3%，排名改善 8.76 位。
- 页面当前平均第 13.16 名，进入可优化区。
- 目标查询 `invisible username tiktok generator` 为 14 展示、0 点击、平均第 11.07 名。
- 首页在同一查询获得 59 展示、2 点击、平均第 8.68 名。

结论：有真实机会，但 7 月 20 日修改尚未形成完整 7 天窗口。

### Blank Text

- Blank / Empty 查询 159 次展示，100% 可见所有权在正确页面。
- 平均排名从 67.62 改善至 63.84，仍为第七页附近。
- 0 点击不是 CTR 文案问题，主要问题是排名过低。

结论：意图正确，现阶段不改 TDK。等待进入前 40 或连续两个完整周期再做内容与功能加强。

### Invisible Name

- 查询簇 24 次展示，0 点击，平均排名恶化至 44.46。
- 专项页只获得 16.7% 的可见所有权，首页和 Blank Text 页各 41.7%。
- 专项页页面总展示 47，但目标查询本身只有 4 次落到该页。

结论：尚未形成独立搜索意图。应优化现有页的意图边界，不新增第二个 Name 页面。

### WhatsApp 工具与指南

- 工具页首次获得 4 次页面展示，平均第 33.75 名。
- 可见查询包括 `blank whatsapp messages` 和 `how to send a blank message on whatsapp`，各 1 次展示。
- 指南页有 53 次页面展示，但英语 WhatsApp 工具词仍有 95.5% 落到指南页。

结论：Google 已开始测试工具页。当前证据太少，先让抓取和所有权迁移继续发生，不改页面。

### 法语页面

- 新法语 TikTok 页 180 展示、24 点击、平均第 6.65 名。
- 法语 Discord 页 80 展示、3 点击、平均第 8.46 名。
- 法语 WhatsApp 页和 Instagram 页获得首次页面数据。
- 法语通用查询仍全部由 `/index-fr` 承接，`/fr/caractere-invisible` 未出现页面数据。
- 旧法语 TikTok URL 仍有 84 展示、7 点击，但线上已验证为 301 跳转到新页。

结论：法语专项页已经被发现并测试，TikTok 和 Discord 已形成可见价值。旧 URL 展示可能是 Google 迁移期归因，不能仅凭 Search Analytics 判定重定向失败。

## 9. 设备和国家

### 设备

| 设备 | 前期点击/展示 | 当前点击/展示 | CTR变化 | 排名变化 |
|---|---:|---:|---:|---:|
| Mobile（移动端） | 24 / 558 | 37 / 553 | +2.39pp | -0.48 |
| Desktop（桌面端） | 4 / 1,044 | 4 / 647 | +0.24pp | +1.80 |
| Tablet（平板） | 0 / 10 | 1 / 7 | +14.29pp | -1.20 |

移动端贡献 88.1% 点击。桌面端仍是高展示、低点击率，当前 CTR 仅 0.62%。

### 前十国家

| 国家 | 前期点击/展示 | 当前点击/展示 | CTR变化 | 排名变化 |
|---|---:|---:|---:|---:|
| France（法国） | 12 / 320 | 32 / 389 | +4.48pp | -0.68 |
| United States（美国） | 3 / 541 | 4 / 263 | +0.97pp | +8.49 |
| United Kingdom（英国） | 3 / 84 | 0 / 93 | -3.57pp | +18.17 |
| Vietnam（越南） | 0 / 42 | 0 / 61 | 0.00pp | -3.54 |
| Canada（加拿大） | 1 / 67 | 1 / 37 | +1.21pp | -8.34 |
| Philippines（菲律宾） | 1 / 48 | 0 / 36 | -2.08pp | +4.85 |
| India（印度） | 0 / 37 | 0 / 19 | 0.00pp | -30.35 |
| Australia（澳大利亚） | 1 / 39 | 1 / 18 | +2.99pp | -7.19 |
| Germany（德国） | 0 / 24 | 0 / 15 | 0.00pp | +11.90 |
| Indonesia（印度尼西亚） | 0 / 27 | 0 / 13 | 0.00pp | -11.53 |

法国净增 20 个点击，而整站只净增 14 个点击。这证明其他市场合计减少了 6 个点击，整站增长高度集中。

## 10. 索引和 Sitemap 状态

- 当前全局 GSC 命令只支持 Search Analytics、站点列表和授权。
- URL Inspection（网址检查）、Page indexing（网页索引）和 Sitemap API 数据：`UNAVAILABLE_FROM_CURRENT_GSC_CONNECTOR`。
- 线上实时检查确认：
  - 旧 `/fr/caractere-invisible-tiktok` 返回 301，并最终到 `/fr/pseudo-invisible-tiktok`。
  - 新法语 TikTok 页、WhatsApp 工具页和 WhatsApp 指南页均返回 200。
- Search Analytics 的 0 展示不能用于判断未索引。

## 11. 对抗式审查

| 风险 | 数据证据 | 是否影响结论 | 降低误判 |
|---|---|---|---|
| 点击增长被误判为全面改善 | 展示下降 25.1% | 是 | 同时看原始点击、展示和国家结构 |
| 平均排名改善来自查询结构收缩 | 展示减少 405 | 是 | 用 Query × Page 和查询簇拆解 |
| CTR 提升被误判为 Title 变好 | 法国点击贡献超过整站净增 | 是 | 分国家、语言和页面比较 |
| 点击集中于少数页面 | 法语 TikTok 新页 24 点击 | 是 | 报告页面贡献，不只看整站 |
| 英文 TikTok 被法语数据污染 | 简单 `tiktok` 聚类会混入法语 | 是 | 使用互斥语言分簇 |
| 7 月 20 日修改被提前归因 | 当前周期含修改前后 | 是 | 观察 7 月 21 日起完整 7 天 |
| 旧 URL 展示被误判为 301 失效 | 线上 301 正常 | 是 | 后续用 URL Inspection 查规范页 |
| WhatsApp 首次展示被过度解释 | 工具页只有 4 次页面展示 | 是 | 达到 10 次以上再判断方向 |
| Page、Query、Page Query 总数不一致 | GSC 会匿名化低量查询 | 否 | 各维度不交叉相加 |
| 想继续优化导致过度动作 | 多个页面 7 月 20 日刚改 | 是 | 冻结页面直至完整改后窗口 |

## 12. 新建页面与优化裁决

| 对象 | 裁决 | 原因 |
|---|---|---|
| 英文 TikTok 页 | `refresh_existing` 候选 | 排名 13.16，所有权仍分裂，但刚修改 |
| Blank Text 页 | `refresh_existing` 候选 | 意图正确，排名过低，需内容与功能而非 TDK |
| Invisible Name 页 | `refresh_existing` 候选 | 独立所有权未形成 |
| WhatsApp 工具页 | `monitor_only` | 首次 4 次展示 |
| 法语 TikTok 页 | `monitor_only` | 已进入前十且刚修改 |
| 法语 Discord 页 | `monitor_only` | 查询与页面已对齐 |
| 法语 WhatsApp、Instagram | `monitor_only` | 新发现但证据弱 |
| 新页面 | `do_not_create` | 没有无对应页面的中等或强查询簇 |

## 13. Final Decision

唯一最高优先级动作包：**继续观察至完整定稿窗口。**

不是因为没有机会，而是英文 TikTok 最值得优化的页面刚在 7 月 20 日修改，且本周缺 7 月 25 日 `final` 数据。立即修改会让下一轮仍无法判断效果。

具体门槛和触发动作见 [ACTION_PACKAGE.md](./ACTION_PACKAGE.md)。

## 14. Next Review Date

- 2026-07-28 10:00：补齐 7 月 19 日至 25 日正式周数据。
- 2026-07-30 10:00：检查 7 月 21 日至 27 日完整改后窗口，并决定是否执行英文 TikTok 现有页优化。

## 15. 数据来源与限制

原始 CSV 位于 `seo-input/gsc-api/2026-07-27-week3-review/`：

- `01_SITE_TOTALS.csv`
- `02_PAGES.csv`
- `03_QUERIES.csv`
- `04_PAGE_QUERY.csv`
- `05_DEVICES.csv`
- `06_COUNTRIES.csv`

所有平均排名按展示次数加权。CTR 使用总点击除以总展示，不对明细 CTR 做简单平均。

