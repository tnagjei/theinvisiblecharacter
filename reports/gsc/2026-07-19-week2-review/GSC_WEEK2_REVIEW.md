# GSC 第2周复盘

* 站点：https://theinvisiblecharacter.live/
* 搜索类型：Web
* 正确的第2周范围：2026-07-12 至 2026-07-17
* 数据状态：DATA_INCOMPLETE
* 数据源：本机只读 GSC Search Analytics API，data-state=all
* 生成日期：2026-07-18 Asia/Shanghai

## 1. Executive Summary

Counter:

“整站展示上涨，所以本轮优化成功”不成立。P2 的展示、点击和平均排名都优于同长度 P1，但首页平均排名从10.74变为14.12，TikTok 专项查询仍主要落到首页，法语专项查询仍主要落到 /index-fr。

### Verifiable 可验证

* 正确的当周截止日期是2026-07-17。2026-07-18尚未结束，不应计入本周。
* all 数据最大到2026-07-17，但 metadata.firstIncompleteDate 是2026-07-16；final 数据最大到2026-07-15。
* P1 对 P2 的临时等长对照中，点击从9升至22，展示从927升至1,478，平均排名从33.85改善至27.38。
* TikTok 专项页没有接管 TikTok 查询。P2 可见 Query + Page 展示中，首页占71.07%，专项页占15.29%。
* Blank Text Generator 承接98.06%的 blank/empty 可见展示，但排名约67、点击为0。
* /fr/pseudo-invisible-tiktok 获得13次页面展示，开始被测试；其余4个新法语专项页仍无页面展示。

### Judgment 主观判断

最高优先级仍是等待 final 数据并补齐网页端索引证据。当前信号不足以支持立即修改任何页面。

### Confidence ≠ Correctness 自信不等于正确

Search Analytics 的0展示不等于未索引。当前连接器不能查询 URL Inspection、Sitemap Inspection 或 Page indexing。

## 2. Data Completeness

| 项目 | 结果 |
|---|---:|
| GSC all 最大可用日期 | 2026-07-17 |
| GSC all 首个不完整日期 | 2026-07-16 |
| GSC final 最大可用日期 | 2026-07-15 |
| 状态 | DATA_INCOMPLETE |
| 是否需要重新运行 | 是 |

正式周定义：

| 周期 | 区间 | 说明 |
|---|---|---|
| 第0周 | 2026-06-28 至 2026-07-04 | 完整7天 |
| 第1周 | 2026-07-05 至 2026-07-11 | 完整7天 |
| 第2周 | 2026-07-12 至 2026-07-17 | 截至昨天的6天，7月16日至17日为不完整数据 |

PROVISIONAL 临时对照段：

| 对照段 | 区间 | 天数 | 星期结构 |
|---|---|---:|---|
| P0 | 2026-06-28 至 2026-07-03 | 6 | 周日至周五 |
| P1 | 2026-07-05 至 2026-07-10 | 6 | 周日至周五 |
| P2 | 2026-07-12 至 2026-07-17 | 6 | 周日至周五 |

所有变化值只来自 P2 对 P1 或 P0 的6天等长比较。由于 P2 后2天不完整，任何临时改善均不能写成最终周结论。

## 3. Change Timeline

Git 只能证明合入 main 的提交时间，不能证明 Cloudflare 实际完成部署的时间。本轮没有查询远程部署记录，因此“实际部署日期”标为未提供。

| 提交日期 | Commit | 页面或系统 | 修改内容 | 可能影响的数据周期 |
|---|---|---|---|---|
| 2026-07-05 | 0f22db2 | 首页、TikTok、Invisible Name、Blank、/index-fr、tools | 工具意图与双语页面调整 | 第1周混合修改前后数据 |
| 2026-07-05 | 070214e | 首页 | 标题与描述精简 | 第1周混合修改前后数据 |
| 2026-07-05 | 57f0cae | 5个新法语专项页 | 法语意图页上线 | 第1周混合修改前后数据 |
| 2026-07-05 | 91afe19 | French canonical、redirect、sitemap | 法语规范网址迁移 | 第1周混合修改前后数据 |
| 2026-07-10 | 61e13eb | TikTok 页、首页、Invisible Name、tools、TikTok guide | TikTok 意图与内链加强 | P2 为改后数据，但含2天不完整 |
| 2026-07-10 | c6c2b1d | Blank Text Generator | 功能与内容重构 | P2 为改后数据，但含2天不完整 |
| 2026-07-10 | 662fdfb | CI/CD 与 Cloudflare 部署流程 | 部署流程改为 wrangler 工作流 | 不能从 GSC 归因 |
| 2026-07-11 | 65fb53d | deploy、headers、/index-fr | 部署和移动检查加强 | P2 为改后数据，但含2天不完整 |
| 2026-07-12 | 7c05b94 | 全站导航和重点页 | 构建时统一 EN/FR 导航和内链 | P2 首日部分混合 |

## 4. Week-over-Week Site Comparison

正式周表不计算第2周变化，因为第2周仅6天且最后2天不完整。

| 指标 | 第0周完整7天 | 第1周完整7天 | 第2周当前6天 all | 第2周较第1周变化 | 第2周较第0周变化 |
|---|---:|---:|---:|---|---|
| Clicks | 14 | 13 | 22 | 不可比 | 不可比 |
| Impressions | 680 | 1,177 | 1,478 | 不可比 | 不可比 |
| CTR | 2.06% | 1.10% | 1.49% | 不可比 | 不可比 |
| Average position | 12.72 | 34.18 | 27.38 | 不可比 | 不可比 |

PROVISIONAL 等长6天对照：

| 指标 | P0 | P1 | P2 | P2 较 P1 | P2 较 P0 |
|---|---:|---:|---:|---:|---:|
| Clicks | 12 | 9 | 22 | +13，+144.4% | +10，+83.3% |
| Impressions | 562 | 927 | 1,478 | +551，+59.4% | +916，+163.0% |
| CTR | 2.14% | 0.97% | 1.49% | +0.52 个百分点 | -0.65 个百分点 |
| Average position | 13.06 | 33.85 | 27.38 | -6.47，改善 | +14.32，恶化 |

结论：P2 相对 P1 的短期改善是真实观测，但相对 P0 仍明显更差。最可信的解释是 Google 扩大了低排名查询测试范围，而不是整体排名已恢复。

## 5. Page Performance

第1周完整7天只作背景。CTR和排名变化只比较 P1 与 P2 的同长度6天段。排名变化为 P2 减 P1，负数代表改善。

| 页面 | 第1周完整点击/展示 | P1 点击/展示 | P2 点击/展示 | CTR变化 | 排名变化 | 结论 |
|---|---:|---:|---:|---:|---|---|
| / | 9 / 491 | 6 / 388 | 16 / 688 | +0.78pp | +3.38 | mixed_pre_post_change_data |
| /index-fr | 2 / 125 | 1 / 98 | 4 / 272 | +0.45pp | +0.57 | stable |
| /tools | 0 / 2 | 0 / 0 | 0 / 12 | 0.00pp | n/a | newly_discovered |
| /tiktok-invisible-username-generator | 1 / 89 | 1 / 78 | 1 / 71 | +0.13pp | +1.02 | stable |
| /invisible-name-generator | 0 / 12 | 0 / 12 | 0 / 10 | 0.00pp | +4.73 | insufficient_evidence |
| /blank-text-generator | 0 / 442 | 0 / 352 | 0 / 363 | 0.00pp | -1.17 | stable |
| /whatsapp-blank-message-generator | 0 / 0 | 0 / 0 | 0 / 0 | n/a | n/a | no_data |
| /fr/caractere-invisible | 0 / 0 | 0 / 0 | 0 / 0 | n/a | n/a | no_data |
| /fr/pseudo-invisible-tiktok | 0 / 0 | 0 / 0 | 0 / 13 | 0.00pp | n/a | newly_discovered |
| /fr/message-vide-whatsapp | 0 / 0 | 0 / 0 | 0 / 0 | n/a | n/a | no_data |
| /fr/saut-de-ligne-instagram | 0 / 0 | 0 / 0 | 0 / 0 | n/a | n/a | no_data |
| /fr/pseudo-invisible-discord | 0 / 0 | 0 / 0 | 0 / 0 | n/a | n/a | no_data |
| /fr/caractere-invisible-tiktok 旧 URL | 0 / 0 | 0 / 0 | 1 / 5 | n/a | n/a | insufficient_evidence |

## 6. Query Cluster Performance

证据等级按 P2 展示：Strong 为50及以上，Medium 为10至49，Weak 为3至9，Insufficient 为少于3。

| 查询簇 | P1展示/点击 | P2展示/点击 | CTR变化 | 排名变化 | 证据 | 建议主要页面 |
|---|---:|---:|---:|---:|---|---|
| A 英语通用 Invisible Character | 36 / 0 | 34 / 0 | 0.00pp | +19.91 | Medium | / |
| B 英语 TikTok | 153 / 4 | 198 / 7 | +0.93pp | -2.01 | Strong | /tiktok-invisible-username-generator |
| C Blank / Empty Text | 251 / 0 | 258 / 0 | 0.00pp | -2.14 | Strong | /blank-text-generator |
| D Invisible Name | 36 / 0 | 30 / 0 | 0.00pp | +3.12 | Medium | /invisible-name-generator |
| E 法语通用 | 14 / 0 | 97 / 2 | +2.06pp | +2.10 | Strong | /fr/caractere-invisible |
| F 法语 TikTok | 9 / 0 | 43 / 1 | +2.33pp | -0.49 | Medium | /fr/pseudo-invisible-tiktok |
| G 法语 WhatsApp | 0 / 0 | 0 / 0 | n/a | n/a | Insufficient | /fr/message-vide-whatsapp |
| H 法语 Instagram | 0 / 0 | 0 / 0 | n/a | n/a | Insufficient | /fr/saut-de-ligne-instagram |
| I 法语 Discord | 0 / 0 | 32 / 1 | +3.13pp | n/a | Medium | /fr/pseudo-invisible-discord |

Page Query 数据不包含全部匿名化查询，因此 Query、Page 与 Page Query 总数不要求相等。

## 7. Query Ownership Map

方法：以 P2 的可见 Page + Query 数据判断所有权；URL 锚点例如 /#faq 归并为首页 /。当前占比不是整站展示占比。

| 查询意图 | 当前主要页面 | 建议主要页面 | 当前占比 | 状态 | 证据等级 | 推荐动作 |
|---|---|---|---:|---|---|---|
| 英语通用 | / | / | 88.24% | aligned | Medium | 观察通用词排名，不写入专项意图 |
| 英语 TikTok | / | /tiktok-invisible-username-generator | 71.07% | owner_mismatch | Strong | 继续观察专项页是否提升份额 |
| Blank / Empty | /blank-text-generator | /blank-text-generator | 98.06% | aligned | Strong | 观察排名进入前40前不改页面 |
| Invisible Name | / | /invisible-name-generator | 70.97% | owner_mismatch | Medium | 观察专项页是否获得多数展示 |
| 法语通用 | /index-fr | /fr/caractere-invisible | 100.00% | owner_mismatch | Strong | 不强化 /index-fr 的专项词 |
| 法语 TikTok | /index-fr | /fr/pseudo-invisible-tiktok | 81.40% | owner_mismatch | Medium | 观察新页的13.95%份额 |
| 法语 WhatsApp | 无 | /fr/message-vide-whatsapp | 0 | insufficient_evidence | Insufficient | 继续观察 |
| 法语 Instagram | 无 | /fr/saut-de-ligne-instagram | 0 | insufficient_evidence | Insufficient | 继续观察 |
| 法语 Discord | /index-fr | /fr/pseudo-invisible-discord | 100.00% | owner_mismatch | Medium | 继续观察，不新增页面 |

## 8. Position 8–20 Opportunities

以下行位于建议专项页且达到排名8至20、展示至少3，但均为 Weak 证据，不能立即用 TDK 方法冲前10：

| 页面 | 查询 | 点击 | 展示 | CTR | 排名 | 证据等级 | 是否值得冲前10 |
|---|---|---:|---:|---:|---:|---|---|
| /tiktok-invisible-username-generator | invisible username tiktok | 0 | 4 | 0.00% | 8.75 | Weak | 否，先观察 |
| /tiktok-invisible-username-generator | invisible name tiktok generator | 0 | 3 | 0.00% | 9.00 | Weak | 否，先观察 |
| /tiktok-invisible-username-generator | invisible username tiktok generator free | 0 | 3 | 0.00% | 9.33 | Weak | 否，先观察 |

内容或功能机会在20名以后：

| 页面 | 查询 | 展示 | 排名 | 判断 |
|---|---|---:|---:|---|
| / | invisible character | 22 | 48.77 | 通用词机会，不可误用 TikTok 方法 |
| /blank-text-generator | empty character | 22 | 70.09 | 正确意图，但远未到 TDK 阶段 |
| /blank-text-generator | blank character | 21 | 69.57 | 正确意图，但远未到 TDK 阶段 |
| /blank-text-generator | empty text | 19 | 66.37 | 正确意图，但远未到 TDK 阶段 |
| /blank-text-generator | blank text | 18 | 67.94 | 正确意图，但远未到 TDK 阶段 |

观察机会：所有低于10展示的 TikTok 前10词、/fr/pseudo-invisible-tiktok 的新测试，以及旧法语 TikTok URL。

## 9. Homepage Analysis

* 首页 P1 到 P2 的点击从6升至16、展示从388升至688、CTR 从1.55%升至2.33%，但平均排名从10.74恶化至14.12。
* 英语通用查询由首页承接88.24%，所有权正确；但簇排名从29.53恶化至49.44。
* 首页仍承接71.07%的英语 TikTok 查询和70.97%的 Invisible Name 查询。
* 首页 CTR 上升不证明 Title 更好。移动端占主要点击，且 TikTok、法语查询组合变化明显。

结论：首页不能被说成继续接近前10。它只在部分专项词附近前10，整体页面和通用词均不支持该判断。

## 10. TikTok Page Analysis

* 英语 TikTok 查询簇从153次展示、4次点击变为198次展示、7次点击，排名从14.22改善至12.21，属于 Strong。
* TikTok 专项页自身从78次展示、1次点击、22.46名变为71次展示、1次点击、23.48名。
* 专项 Query + Page 可见展示占比15.29%，首页占71.07%。首页在同簇的平均排名为8.49，专项页为28.11。
* 有3个专项页查询进入前10附近，但每个只有3至4次展示，均为 Weak。

结论：TikTok 页尚未接管查询。查询簇改善主要仍由首页承接，不能把它归因为专项页优化成功。

## 11. Blank Text Analysis

* Blank / Empty 查询簇从251次展示增至258次，排名从69.99改善至67.85。
* Blank Text Generator 获得98.06%的可见 Query + Page 展示，主要查询为 empty character、blank character、empty text、blank text。
* 页面展示从352变为363、排名从68.53改善到67.36，但仍无点击。

结论：正确查询正在稳定出现，但排名约67，重构后又含2天不完整数据。该页是 early_observation，不可宣布成功或失败。

## 12. Invisible Name Analysis

* Invisible Name 查询簇从36次展示降至30次，平均排名从27.25恶化至30.37，仍无点击。
* 70.97%的可见展示在首页，Invisible Name Generator 没有独立主导权。
* 页面总展示仅10，且排名值可能来自非目标查询，不能用它证明独立意图已成立。

结论：状态为 insufficient_evidence。

## 13. French Page Analysis

* 法语通用簇从14次展示增至97次，法语 TikTok 从9次增至43次，法语 Discord 首次出现32次展示和1次点击。
* /fr/pseudo-invisible-tiktok 获得13次展示、平均排名7.15，属于 newly_discovered。它在法语 TikTok Query + Page 可见展示中只占13.95%。
* /fr/caractere-invisible、/fr/message-vide-whatsapp、/fr/saut-de-ligne-instagram、/fr/pseudo-invisible-discord 仍为0展示。
* /index-fr 仍承接100%的法语通用、81.40%的法语 TikTok、100%的法语 Discord 查询。
* 旧 URL /fr/caractere-invisible-tiktok 有5次展示、1次点击、平均7名，但此前周期为0，不能认定持续增长或重定向失败。

结论：Google 已开始测试一个新法语专项页，但尚未出现两页以上的专项发现证据。法语扩张包条件不成立。

## 14. Device and Country Analysis

设备数据为同长度 P1 对 P2：

| 设备 | P1点击 | P2点击 | 展示变化 | CTR变化 | 排名变化 |
|---|---:|---:|---:|---:|---:|
| Mobile | 8 | 19 | +218，+77.0% | +0.96pp | -1.16 |
| Desktop | 1 | 3 | +326，+50.9% | +0.15pp | -7.34 |
| Tablet | 0 | 0 | +7，+233.3% | 0.00pp | -0.13 |

移动端仍是主要点击来源。桌面端有967次展示但仅3次点击、CTR 0.31%、平均37.04名，展示增长主要来自低排名查询。

国家表按 P2 可见展示排序，可能受匿名化影响，不能相加冒充整站：

| 国家 | P1点击/展示 | P2点击/展示 | CTR变化 | 排名变化 |
|---|---:|---:|---:|---:|
| 美国 USA | 2 / 391 | 3 / 482 | +0.11pp | -5.56 |
| 法国 FRA | 1 / 99 | 7 / 293 | +1.38pp | -0.44 |
| 英国 GBR | 2 / 38 | 3 / 79 | -1.46pp | -1.30 |
| 加拿大 CAN | 0 / 27 | 1 / 58 | +1.72pp | +4.58 |
| 印度 IND | 0 / 39 | 0 / 37 | 0.00pp | -0.26 |
| 菲律宾 PHL | 0 / 18 | 1 / 47 | +2.13pp | -0.39 |
| 德国 DEU | 2 / 26 | 0 / 24 | -7.69pp | -6.29 |
| 澳大利亚 AUS | 0 / 13 | 1 / 37 | +2.70pp | -0.03 |
| 越南 VNM | 0 / 7 | 0 / 40 | 0.00pp | +7.01 |
| 荷兰 NLD | 0 / 24 | 0 / 19 | 0.00pp | +0.58 |

法国增长与法语查询增长一致，但 Page Query 显示主承接仍是 /index-fr，不能直接归因于新法语专项页。

## 15. Indexing and Sitemap Status

状态：UNAVAILABLE_FROM_CURRENT_GSC_CONNECTOR。

详见：

* 08_INDEXING_STATUS.md
* 09_SITEMAP_STATUS.md

没有 URL Inspection 或 Sitemap Inspection 数据时，不能判断核心页是否被索引、最后抓取时间、Google canonical、Sitemap 发现、已抓取未索引数量或旧 URL 的重定向状态。

Search appearance 在3个6天临时段均返回0行，详见 07_SEARCH_APPEARANCE.csv。

## 16. Adversarial Review

| 风险 | 数据证据 | 是否影响结论 | 如何降低误判 |
|---|---|---|---|
| 展示增长只是低排名查询 | P2较P0展示+163.0%，平均排名仍恶化14.32 | 是 | 等 final 后重跑，拆分查询簇 |
| 平均排名改善来自测试扩大 | P1到P2改善6.47名，但桌面仍37.04名 | 是 | 不把均值改善写成页面质量提升 |
| CTR变化来自查询组合 | 移动 CTR 升0.96pp，桌面仅0.31%，TikTok和法语词变化大 | 是 | 逐簇、逐设备复核，不直接评价 Title |
| 点击增长集中在偶然词 | TikTok 簇7次点击，占P2总点击约31.8%，但非单一词 | 部分 | 样本小，观察下一个 final 周期 |
| TikTok 是否真正接管 | 首页71.07%，专项页15.29% | 是 | Page + Query 所有权优先于查询簇均值 |
| Blank 是否混入重构前版本 | 重构7月10日，P2最后2天不完整 | 是 | 标记 early_observation，等待 final |
| 新法语页数据是否太少 | 仅1个新页13展示，其余4个为0 | 是 | 不把 /index-fr 增长归给专项页 |
| 明细总数不一致 | GSC 匿名化和维度聚合不同 | 是 | 整站只用 01_SITE_TOTALS.csv |
| 相关性被误判为因果 | 7月5日至12日集中发生内容、导航、CI改动 | 是 | 不归因到单一提交 |
| 想继续优化而过度解释 | 仅3个专项前10词，均 Weak；索引接口不可用 | 是 | 选择继续观察 |

## 17. Final Decision

选择唯一动作包：E. 继续观察。

不选择 TikTok 冲前10包，因为专项页的前10词全部是 Weak，专项页总体排名约23.48且所有权只有15.29%。

不选择法语扩张包，因为只有一个新法语专项页获得展示，且主查询仍由 /index-fr 承接。

不选择 Blank Text 加强包，因为正确归属已存在，但排名约67且无点击。

不选择技术索引修复包，因为旧 URL 只出现一个临时周期，且 Inspection 数据不可用。

动作细节见 ACTION_PACKAGE.md。

## 18. Next Review Date

不早于2026-07-22重新运行。

前置条件：GSC final 最大日期达到2026-07-17。若未达到，延后而不是把 all 数据写成最终结论。
