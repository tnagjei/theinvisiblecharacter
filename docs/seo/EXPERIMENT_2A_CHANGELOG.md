# SEO Experiment 2A Changelog（SEO 实验 2A 变更记录）

## 版本记录

• 2A 原始提交 SHA：`a79753a`。

• 2A.1 修正提交 SHA：本次一致性修正提交完成后，由后续仅含本记录 SHA 的元数据提交写入。

• 正式观察起始日期：`2026-07-11`。

• 2A.1 修正原因：让版本控制、GitHub Actions（持续集成）、平台证据状态、早期工具链接和静态回归测试保持一致；这不是新一轮 SEO 优化。

• 明确没有修改的 SEO 变量：Title、Meta Description、H1、URL、Canonical、Sitemap、Redirect、公开页面数量。

• CI 限制：`tests/test_seo_query_ownership_v2.py` 依赖被忽略的本地 `seo-input/`，本轮不加入 GitHub Actions。若未来加入 CI，必须先建立匿名化、最小化 fixture（测试样本）；本轮未创建该样本，也未提交真实 GSC 数据或 `seo-work/` CSV。

## 0. 实验边界

• 数据依据：`QUERY_OWNERSHIP_AUDIT_V2.md`、`PAGE_DIAGNOSIS_V2.csv`、`PAGE_QUERY_DATA_V2.csv`。

• Proposed Primary Owner（候选主要承接页）仅作为实验假设，不视为已经成立的事实。

• 未新增公开页面，未合并页面，未执行 Redirect（重定向），未修改 Sitemap（站点地图）。

• 本轮所有 Title（页面标题）、Description（页面描述）和 H1（一级标题）均保持不变，因为现有内容已经准确描述页面任务。

## 1. `/blank-text-generator`

• 修改前角色：已有展示的 Blank Text（空白文本）生成工具，首屏提供字符选择、数量、生成和复制。

• 修改后角色：角色不迁移；强化为同一 blank text / empty text / blank character / empty character / copy blank text 任务的统一工具页。

• 修改前 Title：`Blank Text Generator (Copy & Paste Empty Text)`。

• 修改后 Title：不变。

• 修改前 H1：`Blank Text Generator: Copy & Paste Empty Text`。

• 修改后 H1：不变。

• 具体修改：在操作步骤前增加一段真实查询语言的任务桥接；保留首屏工具；将 WhatsApp 的“最可靠”说法改为 `reported`（报告中）且明确本站未验证当前接受情况；删除 U+2800 更难被过滤的无证据排序。

• 为什么修改：112 个可见查询集中在同一生成与复制任务，适合由一个工具页完整承接，不适合拆近义页面。

• 明确没有修改：工具逻辑、字符选项、URL、Canonical、Title、Description、H1。

• 实验假设：更清晰地连接真实查询语言和现有操作流程，有助于搜索用户立即确认页面能完成任务，同时不制造关键词堆砌。

• 风险：内容增强不能保证排名或点击提升；平台仍可能过滤字符。

## 2. `/tiktok-invisible-username-generator`

• 修改前角色：TikTok 专项复制工具，已经区分部分字段并提供三个字符，但证据状态分散。

• 修改后角色：TikTok 专项任务的候选主要承接页；明确本地工具能力与 TikTok 平台行为的证据边界。

• 修改前 Title：`Invisible TikTok Username Generator (Copy Blank Names)`。

• 修改后 Title：不变。

• 修改前 H1：`Invisible TikTok Username Generator`。

• 修改后 H1：不变。

• 具体修改：把字段说明重构为 `Verified on this page`（本站已验证）、`Reported`（报告中）、`Disputed`（有争议）、`Unknown`（未知）；明确 username、display name、nickname、bio、captions、comments 必须逐字段测试；增加来自 GSC 的 “How do I get a blank name on TikTok?” 和 “Can I use an invisible nickname on TikTok?” FAQ。

• 为什么修改：专项页已有 66 impressions（展示）和 1 click（点击），但首页仍是该意图的 observed top page（当前观察页）。本轮只培养专项页，不削弱首页。

• 明确没有修改：复制按钮、字符值、首页 TikTok 内容、URL、Canonical、Title、Description、H1。

• 实验假设：专项页比首页更清楚地回答复制、字段差异、使用步骤和失败处理后，可能逐步获得更明确的专项任务信号。

• 风险：TikTok 规则会变化；没有外部实测，因此不能承诺任何字段接受字符。

## 3. `/`

• 修改前角色：通用 Invisible Character Generator（隐形字符生成器），保留 TikTok 等平台入口。

• 修改后角色：角色不变；其中一个 TikTok 链接改为更自然的任务型入口。

• 修改前 Title：`Invisible Character Generator: Copy Blank Unicode Text`。

• 修改后 Title：不变。

• 修改前 H1：`Invisible Character Generator`。

• 修改后 H1：不变。

• 具体修改：把 `Invisible TikTok Username Generator` 锚文本改为 `Copy an invisible character for a TikTok username`。

• 为什么修改：让用户从通用工具自然进入专项任务，而不是删除首页已有 TikTok 内容。

• 明确没有修改：首页正文、现有 TikTok 关键词、核心工具、Title、Description、H1。

• 实验假设：清晰的任务链接能帮助用户和搜索引擎理解首页与专项工具页的关系。

• 风险：单一内链变化可能没有可测量效果。

## 4. WhatsApp 工具与指南

### `/whatsapp-blank-message-generator`

• 修改前角色：立即复制、生成并完成 WhatsApp 空白消息测试的工具页。

• 修改后角色：不变。

• Title：`WhatsApp Blank Message Generator: Copy Empty Text`，前后不变。

• H1：`WhatsApp Blank Message Generator`，前后不变。

• 具体修改：无。审查确认导航和 Related（相关内容）区域已经自然链接 `/blog/whatsapp-invisible-messages`。

### `/blog/whatsapp-invisible-messages`

• 修改前角色：解释、步骤、限制和失败原因的指南页，但底部 CTA（行动入口）指向通用首页且包含无数据用户数量声明。

• 修改后角色：指南角色不变；底部 CTA 明确回链 WhatsApp 专项工具。

• Title：`WhatsApp Invisible Messages - TheInvisibleCharacter.live Guide`，前后不变。

• H1：`WhatsApp Invisible Messages`，前后不变。

• 具体修改：CTA 指向 `/whatsapp-blank-message-generator`；文案说明工具负责立即复制，指南负责步骤、限制和排错；删除“数千用户信任”及跨设备完全兼容等无数据声明，以 reported / unknown（报告中 / 未知）边界替代。

• 实验假设：双向链接能明确“完成任务”与“理解任务”的页面角色，而不迁移整个搜索词簇。

• 风险：指南仍可能继续获得工具型查询；本轮不强制迁移。

## 5. Fortnite 工具与指南

### `/fortnite-invisible-name-generator`

• 修改前角色：复制字符并测试 Fortnite / Epic display name（显示名称）的工具页。

• 修改后角色：不变。

• Title：`Fortnite Invisible Name Generator: Copy Blank Characters`，前后不变。

• H1：`Fortnite Invisible Name Generator`，前后不变。

• 具体修改：无。审查确认导航、首屏和 Related 区域已经链接 `/blog/fortnite-invisible-name`。

### `/blog/fortnite-invisible-name`

• 修改前角色：步骤、限制、安全和排错指南；底部 CTA 指向通用首页。

• 修改后角色：指南角色不变；底部 CTA 明确回链 Fortnite 专项测试工具。

• Title：`Fortnite Invisible Name - TheInvisibleCharacter.live Gamer Guide`，前后不变。

• H1：`Gamer's Guide: Setting Blank Names in Fortnite`，前后不变。

• 具体修改：CTA 指向 `/fortnite-invisible-name-generator`；文案明确工具负责复制，指南负责步骤、限制和排错；删除 “perfect / safe, tested / most reliable” 等无证据表达并标记当前 Epic 接受情况未验证。

• 实验假设：自然双向链接能区分工具任务与指南任务，不需要合并或重定向。

• 风险：现有六个月汇总数据不能证明 cannibalization（关键词竞争），因此只做连接、不做所有权迁移。

## 6. 自动回归合同

新增 `tests/seo-experiment-2a.test.js`，验证：

• 首页存在自然 TikTok 任务链接。

• Blank Text 覆盖真实任务表达且没有两条已识别的无证据兼容性排序。

• TikTok 显示四类证据状态并覆盖真实查询 FAQ。

• WhatsApp 和 Fortnite 工具与指南形成双向链接。

• WhatsApp 指南不再包含无数据用户数量声明。
