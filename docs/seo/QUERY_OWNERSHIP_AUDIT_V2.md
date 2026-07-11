# Query Ownership Audit V2（搜索词所有权审计第二版）

## 0. Counter

旧报告的战略结论不能直接沿用，因为旧数据管道混合了三个不可互换的 GSC（谷歌搜索控制台）聚合层级。V2 先修复统计口径，再保留有限的候选 Owner（承接页）判断。

## A. 三层指标与时间范围

| 数据层 | 点击 | 展示 | 开始 | 结束 | 来源 |
|---|---:|---:|---|---|---|
| Property Total（全站总量） | 59 | 6105 | 2026-01-09 | 2026-07-08 | 未加页面过滤的图表 |
| Property Visible Query（全站可见查询） | 18 | 2500 | 2026-01-09 | 2026-07-08 | 未加页面过滤的 Query 表 |
| Homepage Exact Page（首页精确页面） | 35 | 2715 | 2026-01-10 | 2026-07-09 | 首页页面过滤图表 |

• Coverage data through（覆盖数据截至）：`2026-06-29`。

• Coverage export date（覆盖导出日期）：`2026-07-10`。

• 页面图表总量与可见查询加总不要求相等，V2 不再互相替代。

## B. URL 与 Coverage 修复

• `exact_page_metrics` 只保存 exact raw URL（精确原始网址）的页面过滤图表数据。

• `canonical_family_history` 只记录锚点、www、.html 和 Redirect（重定向）历史，不加入当前页面指标。

• Coverage 仅在 raw URL 与当前 Canonical 完全相等时传播状态。

• 当前 clean Canonical 的 `discovered_not_indexed_snapshot` 数量：`0`。

• 无 exact Coverage 证据的当前页面标记为 `unknown_in_supplied_snapshot`；历史状态保留在 `legacy_url_status`。

## C. 聚类复审

• 新增 `invisible_name_generator`，不再把名称生成任务默认放入 general。

• WhatsApp 的 blank/empty message 与 invisible mode/ink/how-to 行为型查询分开，后者进入 `other_or_ambiguous`。

• 社交 bio 字符限制查询进入 `social_bio_invalid_characters`，不自动推荐 Instagram generator。

• Guardian Tales、Epic Games 和 Xbox 等非 Fortnite 游戏查询进入 `game_specific_other`。

• 所有 cluster 的需求总量只来自 Property Query 表，合计 18 clicks / 2500 impressions。

## D. Ownership Map

| Cluster | Observed top page | Proposed primary owner | Ownership status | Recommended action | Confidence |
|---|---|---|---|---|---|
| general_invisible_character | https://theinvisiblecharacter.live/ | https://theinvisiblecharacter.live/ | aligned | keep | high |
| invisible_name_generator | https://theinvisiblecharacter.live/ | https://theinvisiblecharacter.live/invisible-name-generator | owner_mismatch | strengthen_primary | medium |
| tiktok_invisible_username | https://theinvisiblecharacter.live/ | https://theinvisiblecharacter.live/tiktok-invisible-username-generator | owner_mismatch | strengthen_primary | high |
| whatsapp_blank_message | https://theinvisiblecharacter.live/blog/whatsapp-invisible-messages | https://theinvisiblecharacter.live/whatsapp-blank-message-generator | owner_mismatch | separate_intent | high |
| fortnite_invisible_name | https://theinvisiblecharacter.live/blog/fortnite-invisible-name | https://theinvisiblecharacter.live/fortnite-invisible-name-generator | owner_mismatch | separate_intent | high |
| blank_text | https://theinvisiblecharacter.live/blank-text-generator | https://theinvisiblecharacter.live/blank-text-generator | aligned | keep | high |
| discord_invisible_name | https://theinvisiblecharacter.live/ | https://theinvisiblecharacter.live/discord-invisible-name-generator | owner_mismatch | monitor | low |
| instagram_invisible_character | https://theinvisiblecharacter.live/ | https://theinvisiblecharacter.live/instagram-invisible-character-generator | owner_mismatch | monitor | low |
| social_bio_invalid_characters | https://theinvisiblecharacter.live/blog/instagram-invisible-characters | https://theinvisiblecharacter.live/blog/instagram-invisible-characters | aligned | keep | medium |
| unicode_technical | https://theinvisiblecharacter.live/ | https://theinvisiblecharacter.live/blog/technical-guide-invisible-characters | owner_mismatch | add_internal_link | medium |
| french_general | https://theinvisiblecharacter.live/index-fr | https://theinvisiblecharacter.live/fr/caractere-invisible | owner_mismatch | monitor | medium |
| french_platform_intents | https://theinvisiblecharacter.live/index-fr | multiple_by_platform | owner_mismatch | separate_intent | medium |
| game_specific_other | https://www.theinvisiblecharacter.live/blog/fortnite-invisible-name | 未指定 | insufficient_evidence | insufficient_evidence | medium |
| other_or_ambiguous | https://theinvisiblecharacter.live/blog/whatsapp-invisible-messages | 未指定 | insufficient_evidence | insufficient_evidence | medium |

`proposed_primary_owner` 是基于任务角色提出的候选，不代表已经成立。当前没有 query × page × date（搜索词、页面、日期）数据，因此没有任何 cluster 标记 `confirmed_cannibalization`。

## E. 自动验收

| 检查 | 结果 |
|---|---|
| property_total_59_6105 | PASS |
| property_visible_queries_18_2500 | PASS |
| old_tiktok_13_321 | PASS |
| clean_discovered_zero | PASS |
| supporting_excludes_owner | PASS |
| csv_markdown_actions_match | PASS |
| all_cluster_queries_sum_2500_18 | PASS |
| valid_actions_only | PASS |
| production_html_sitemap_redirect_unchanged | PASS |

全部验收通过后才生成本报告。CSV 与 Markdown 的 recommended_action（建议动作）来自同一 ownership row 数据源。

## F. 边界

本轮未修改任何生产 HTML、Title、Description、H1、URL、Canonical、Sitemap 或 Redirect。V2 只修复分析数据管道，未执行战略动作。
