# UNAVAILABLE_FROM_CURRENT_GSC_CONNECTOR

本机全局 GSC 连接器只支持 Search Analytics 的 auth、sites、query 命令。

它不支持 URL Inspection，因此以下字段没有被查询，也不能从 Search Analytics 或源码推断：

* Indexing status
* Last crawl
* Page fetch
* Indexing allowed
* User-declared canonical
* Google-selected canonical
* Referring sitemap
* robots 或 noindex 的 GSC 检查结果

需要在 Search Console 网页端逐个 URL Inspection 后，才能补充本文件。
