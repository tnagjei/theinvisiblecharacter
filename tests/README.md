# Tests

• 用途：保存站点契约与本地数据管道的自动回归检查。
• 关键入口：`precision-index-contract.test.js`、`test_seo_query_ownership_v2.py`。
• 边界/依赖：JavaScript 测试由 Jest（测试框架）运行；SEO 数据测试读取被 Git 忽略的本地 GSC 导出。

> 一旦本目录内容变化，请更新本文件

## Files

• `precision-index-contract.test.js`：验证公开页面样式与运行时基础合同。
• `test_seo_query_ownership_v2.py`：验证三层 GSC 指标、Coverage 精确匹配、Supporting Page 和报告动作一致性。
• `seo-experiment-2a.test.js`：验证实验页面的任务链接、证据标签、真实查询 FAQ 和禁止承诺。
• `accessibility/`：无障碍测试。
• `e2e/`：端到端浏览器测试。
• `performance/`：性能测试。
• `security/`：安全测试。
• `seo/`：生产页面 SEO 合同测试。
