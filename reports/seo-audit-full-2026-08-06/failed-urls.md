# Failed URLs

审计日期：2026-08-06

没有因抓取或页面基础脚本失败而缺失单页报告的 URL。PageSpeed 的 `error` 单独保存在原始 JSON 和 findings.csv，不等同于页面抓取失败。

最终重试后 PageSpeed `error` 为 0。三个页面的首次 500/503 原始错误保留在对应 `check-pagespeed.attempt-1.*` 文件中。
