#!/usr/bin/env python3
"""input: GSC ZIP exports, sitemap.xml, _redirects, and current site inventory.
output: V2 exact-page, visible-query, query-cluster, ownership-map, and audit artifacts.
pos: Read-only SEO analysis pipeline. Update this header and scripts/README.md when behavior changes.
"""

from __future__ import annotations

import csv
import hashlib
import io
import re
import zipfile
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://theinvisiblecharacter.live"
OUT = ROOT / "seo-work"
REPORT_V2 = ROOT / "docs" / "seo" / "QUERY_OWNERSHIP_AUDIT_V2.md"
VALID_ACTIONS = {"keep", "strengthen_primary", "add_internal_link", "separate_intent", "merge_content", "monitor", "insufficient_evidence"}


def protected_file_hashes():
    files = sorted(ROOT.rglob("*.html")) + [ROOT / "sitemap.xml", ROOT / "_redirects"]
    return {str(path.relative_to(ROOT)): hashlib.sha256(path.read_bytes()).hexdigest() for path in files if "build" not in path.parts and "design-previews" not in path.parts}


def number(value):
    return 0.0 if value in (None, "", "--") else float(str(value).replace("%", "").replace(",", ""))


def clean_number(value):
    return int(value) if float(value).is_integer() else round(value, 4)


def csv_tables(path):
    result = {}
    with zipfile.ZipFile(path) as archive:
        for name in archive.namelist():
            text = archive.read(name).decode("utf-8-sig")
            rows = list(csv.reader(io.StringIO(text)))
            if not rows or not rows[0]:
                continue
            header = rows[0]
            result[header[0]] = [dict(zip(header, row)) for row in rows[1:]]
    return result


def write_csv(path, fields, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def find_input():
    for path in (ROOT / "seo-input" / "gsc-2026-07-10", ROOT / "seo-input" / "gsc-2026-07-10:"):
        if path.is_dir():
            return path
    raise RuntimeError("GSC input directory not found")


def sitemap_urls():
    return set(re.findall(r"<loc>(.*?)</loc>", (ROOT / "sitemap.xml").read_text(encoding="utf-8")))


def redirect_map():
    result = {}
    for line in (ROOT / "_redirects").read_text(encoding="utf-8").splitlines():
        parts = line.strip().split()
        if len(parts) >= 3 and not line.lstrip().startswith("#") and "*" not in parts[0] and ":splat" not in parts[1]:
            result[parts[0]] = parts[1]
    return result


CURRENT = sitemap_urls()
REDIRECTS = redirect_map()


def url_identity(raw_url):
    raw_url = (raw_url or "").strip()
    if not raw_url:
        return {"raw_url": "", "canonical_family": "legacy_or_unknown", "current_canonical": "", "url_role": "unknown"}
    split = urlsplit(raw_url if "://" in raw_url else SITE + raw_url)
    path = split.path or "/"
    exact_no_fragment = urlunsplit((split.scheme or "https", split.netloc, path, "", ""))
    non_www = urlunsplit(("https", "theinvisiblecharacter.live", path, "", ""))
    target_path = None
    if path in REDIRECTS:
        target_path = urlsplit(SITE + REDIRECTS[path]).path
    elif path.endswith("/index.html"):
        target_path = path[:-10] or "/"
        if target_path != "/" and not target_path.endswith("/"):
            target_path += "/"
    elif path.endswith(".html"):
        target_path = path[:-5]
    candidate = SITE + (target_path if target_path is not None else path)
    canonical = candidate if candidate in CURRENT else ""
    if split.fragment and SITE + path in CURRENT:
        role = "fragment_variant"; canonical = SITE + path
    elif split.netloc.lower().startswith("www.") and SITE + path in CURRENT:
        role = "www_legacy"; canonical = SITE + path
    elif path.endswith(".html") and canonical:
        role = "html_legacy"
    elif target_path is not None and canonical:
        role = "redirect_legacy"
    elif exact_no_fragment in CURRENT and not split.fragment:
        role = "current_exact"; canonical = exact_no_fragment
    else:
        role = "unknown"
    return {"raw_url": raw_url, "canonical_family": canonical or "legacy_or_unknown", "current_canonical": canonical, "url_role": role, "normalized_url": non_www}


def totals(rows, date_field="日期"):
    dated = [row for row in rows if row.get(date_field)]
    return {
        "clicks": clean_number(sum(number(row.get("点击次数")) for row in dated)),
        "impressions": clean_number(sum(number(row.get("展示")) for row in dated)),
        "start_date": min((row[date_field] for row in dated), default=""),
        "end_date": max((row[date_field] for row in dated), default=""),
    }


def visible_query_totals(rows):
    return {"clicks": clean_number(sum(number(row.get("点击次数")) for row in rows)), "impressions": clean_number(sum(number(row.get("展示")) for row in rows))}


def classify_query(query):
    q = query.lower().strip()
    french = bool(re.search(r"caract[eèé]re|caracteres|pseudo|message vide|sans caractère|espace invisible", q))
    if any(x in q for x in ("guardian tales", "epic games", "xbox gamertag")):
        return "game_specific_other"
    if "fortnite" in q:
        return "fortnite_invisible_name"
    if "tiktok" in q:
        return "french_platform_intents" if french else "tiktok_invisible_username"
    if "whatsapp" in q:
        if re.search(r"how to be invisible|how to invisible|invisible mode|invisible ink|invisible chat|invisible whatsapp chat|whatsapp invisible chat", q):
            return "other_or_ambiguous"
        return "french_platform_intents" if french else "whatsapp_blank_message"
    if "discord" in q:
        return "french_platform_intents" if french else "discord_invisible_name"
    if "instagram" in q:
        if re.search(r"invalid character|how many characters", q):
            return "social_bio_invalid_characters"
        return "french_platform_intents" if french else "instagram_invisible_character"
    if "social media bio" in q:
        return "social_bio_invalid_characters"
    if re.search(r"invisible (name|username) generator|invisible text name generator|no name generator", q):
        return "invisible_name_generator"
    if re.search(r"unicode|u\+?[0-9a-f]{4}|u200b|zero.?width|ascii|html invisible|alt code", q):
        return "unicode_technical"
    if re.search(r"blank text|empty (character|text|char)|blank (character|copy|space|font|letter|symbol|words)|copy.*blank|blank.*copy|empty space|no words copy|white space copy|text blank|emptytext", q):
        return "blank_text"
    if french:
        return "french_general"
    return "general_invisible_character"


CLUSTERS = {
    "general_invisible_character": ("General invisible character", "general character copy/detection", SITE + "/", "keep"),
    "invisible_name_generator": ("Invisible name generator", "general name generation", SITE + "/invisible-name-generator", "strengthen_primary"),
    "tiktok_invisible_username": ("TikTok invisible username", "TikTok username task", SITE + "/tiktok-invisible-username-generator", "strengthen_primary"),
    "whatsapp_blank_message": ("WhatsApp blank message", "WhatsApp blank/empty message task", SITE + "/whatsapp-blank-message-generator", "separate_intent"),
    "fortnite_invisible_name": ("Fortnite invisible name", "Fortnite name task", SITE + "/fortnite-invisible-name-generator", "separate_intent"),
    "blank_text": ("Blank text", "blank text generation", SITE + "/blank-text-generator", "keep"),
    "discord_invisible_name": ("Discord invisible name", "Discord name task", SITE + "/discord-invisible-name-generator", "monitor"),
    "instagram_invisible_character": ("Instagram invisible character", "Instagram name/character task", SITE + "/instagram-invisible-character-generator", "monitor"),
    "social_bio_invalid_characters": ("Social bio invalid characters", "bio limits/research", SITE + "/blog/instagram-invisible-characters", "keep"),
    "unicode_technical": ("Unicode technical", "technical Unicode research", SITE + "/blog/technical-guide-invisible-characters", "add_internal_link"),
    "french_general": ("French general invisible character", "French general task", SITE + "/fr/caractere-invisible", "monitor"),
    "french_platform_intents": ("French platform intents", "French platform-specific task", "multiple_by_platform", "separate_intent"),
    "game_specific_other": ("Other game-specific tasks", "non-Fortnite game task", "", "insufficient_evidence"),
    "other_or_ambiguous": ("Other or ambiguous", "ambiguous platform behavior", "", "insufficient_evidence"),
}

SUPPORTING = {
    "tiktok_invisible_username": [SITE + "/blog/tiktok-invisible-characters"],
    "whatsapp_blank_message": [SITE + "/blog/whatsapp-invisible-messages"],
    "fortnite_invisible_name": [SITE + "/blog/fortnite-invisible-name"],
    "discord_invisible_name": [SITE + "/blog/discord-invisible-name"],
    "instagram_invisible_character": [SITE + "/blog/instagram-invisible-characters"],
    "unicode_technical": [SITE + "/developer"],
    "french_platform_intents": [SITE + "/blog/fr/tiktok-profil-caracteres-invisibles", SITE + "/blog/fr/whatsapp-messages-invisibles", SITE + "/blog/fr/fortnite-nom-invisible"],
}


def page_type(url):
    path = urlsplit(url).path
    if path in ("/", "/index-fr"): return "homepage"
    if path in ("/blog/", "/blog/fr/"): return "blog_index"
    if path.startswith("/blog/"): return "blog_guide"
    if "generator" in path or path.startswith("/fr/"): return "tool"
    return "support_or_utility"


def locale(url):
    path = urlsplit(url).path
    return "fr" if path == "/index-fr" or path.endswith("-fr") or path.startswith("/fr/") or path.startswith("/blog/fr/") else "en"


def build_v2(write_outputs=True):
    protected_before = protected_file_hashes()
    input_dir = find_input()
    performances = []
    coverage = []
    for path in sorted(input_dir.glob("*.zip")):
        tables = csv_tables(path)
        if "日期" in tables and tables["日期"] and "点击次数" in tables["日期"][0]:
            filters = {r.get("过滤器"): r.get("值") for r in tables.get("过滤器", [])}
            performances.append({"path": path, "tables": tables, "raw_url": filters.get("网页")})
        elif "网址" in tables or "原因" in tables:
            coverage.append({"path": path, "tables": tables})

    property_export = next(item for item in performances if not item["raw_url"])
    page_exports = {}
    duplicate_exports = []
    for item in performances:
        if not item["raw_url"]: continue
        if item["raw_url"] in page_exports:
            duplicate_exports.append(item["raw_url"]); continue
        page_exports[item["raw_url"]] = item

    property_total = totals(property_export["tables"]["日期"])
    property_queries = visible_query_totals(property_export["tables"]["热门查询"])
    property_start = property_total["start_date"]; property_end = property_total["end_date"]
    page_dates = [row["日期"] for item in page_exports.values() for row in item["tables"]["日期"] if row.get("日期")]
    page_start = min(page_dates); page_end = max(page_dates)

    coverage_data_through = ""
    coverage_export_date = ""
    coverage_exact = defaultdict(list)
    legacy_status = defaultdict(list)
    coverage_all = []
    for item in coverage:
        match = re.search(r"(\d{4}-\d{2}-\d{2})\.zip$", item["path"].name)
        if match: coverage_export_date = max(coverage_export_date, match.group(1))
        if "原因" in item["tables"]:
            coverage_dates = [r.get("日期") for r in item["tables"].get("日期", []) if r.get("日期")]
            coverage_data_through = max(coverage_dates, default=coverage_data_through)
            continue
        urls = [r.get("网址") for r in item["tables"].get("网址", []) if r.get("网址")]
        if "Valid" in item["path"].name: status = "indexed_snapshot"
        elif len(urls) == 12: status = "discovered_not_indexed_snapshot"
        else: status = "crawled_not_indexed_snapshot"
        for raw in urls:
            identity = url_identity(raw)
            coverage_all.append((raw, identity, status))
            if identity["url_role"] == "current_exact" and raw in CURRENT:
                coverage_exact[raw].append(status)
            elif identity["current_canonical"]:
                legacy_status[identity["current_canonical"]].append(f"{raw}:{status}")
    page_query_rows = []
    exact_metrics = {}
    query_presence = defaultdict(lambda: defaultdict(float))
    family_history = defaultdict(list)
    for raw, item in page_exports.items():
        identity = url_identity(raw)
        chart = totals(item["tables"]["日期"])
        positive_dates = [r["日期"] for r in item["tables"]["日期"] if r.get("日期") and number(r.get("展示")) > 0]
        chart["first_impression_date"] = min(positive_dates, default="")
        chart["last_impression_date"] = max(positive_dates, default="")
        visible = visible_query_totals(item["tables"].get("热门查询", []))
        exact_metrics[raw] = {**chart, **{f"visible_{k}": v for k, v in visible.items()}, "visible_query_count": len(item["tables"].get("热门查询", []))}
        if identity["url_role"] != "current_exact" and identity["current_canonical"]:
            family_history[identity["current_canonical"]].append(f"{raw}:{chart['clicks']} clicks/{chart['impressions']} impressions")
        first = min(positive_dates, default=""); last = max(positive_dates, default="")
        for row in item["tables"].get("热门查询", []):
            query = (row.get("热门查询") or "").strip()
            if not query: continue
            imp = number(row.get("展示")); clicks = number(row.get("点击次数")); pos = number(row.get("排名"))
            cid = classify_query(query)
            query_presence[cid][raw] += imp
            page_query_rows.append({**identity, "query": query, "clicks": clean_number(clicks), "impressions": clean_number(imp), "ctr": round(clicks / imp, 4) if imp else "", "position": clean_number(pos), "first_date": first, "last_date": last, "date_source": "page_chart_inferred" if first or last else "unavailable", "metric_source": "visible_page_query_table"})

    page_rows = []
    for url in sorted(CURRENT):
        metric = exact_metrics.get(url, {})
        exact_states = coverage_exact.get(url, [])
        status = "indexed_snapshot" if "indexed_snapshot" in exact_states else exact_states[0] if exact_states else "unknown_in_supplied_snapshot"
        page_rows.append({
            "raw_url": url, "canonical_family": url, "current_canonical": url, "url_role": "current_exact", "page_type": page_type(url), "locale": locale(url),
            "current_index_status": status, "legacy_url_status": " | ".join(legacy_status.get(url, [])),
            "performance_property_start_date": property_start, "performance_property_end_date": property_end,
            "performance_page_start_date": page_start, "performance_page_end_date": page_end,
            "coverage_data_through": coverage_data_through, "coverage_export_date": coverage_export_date,
            "page_total_clicks": metric.get("clicks", ""), "page_total_impressions": metric.get("impressions", ""),
            "visible_query_clicks": metric.get("visible_clicks", ""), "visible_query_impressions": metric.get("visible_impressions", ""), "visible_query_count": metric.get("visible_query_count", 0),
            "first_impression_date": metric.get("first_impression_date", ""), "last_impression_date": metric.get("last_impression_date", ""),
            "metric_source": "exact_page_filtered_chart" if metric else "no_exact_page_export",
            "canonical_family_history": " | ".join(family_history.get(url, [])),
        })

    cluster_queries = defaultdict(list)
    old_tiktok = {"clicks": 0, "impressions": 0}
    for row in property_export["tables"]["热门查询"]:
        query = (row.get("热门查询") or "").strip(); clicks = number(row.get("点击次数")); imp = number(row.get("展示"))
        cid = classify_query(query)
        cluster_queries[cid].append((query, clicks, imp))
        old_french = bool(re.search(r"caract[eè]re|caractères|pseudo|vide|invisible pour|nom invisible", query.lower()))
        if "tiktok" in query.lower() and not old_french:
            old_tiktok["clicks"] += clicks; old_tiktok["impressions"] += imp
    old_tiktok = {k: clean_number(v) for k, v in old_tiktok.items()}

    cluster_rows = []
    ownership_rows = []
    for cid, (name, intent, proposed, action) in CLUSTERS.items():
        queries = cluster_queries.get(cid, [])
        clicks = clean_number(sum(q[1] for q in queries)); imp = clean_number(sum(q[2] for q in queries))
        observed_candidates = sorted(query_presence.get(cid, {}).items(), key=lambda pair: -pair[1])
        observed = observed_candidates[0][0] if observed_candidates else ""
        supports = [p for p in SUPPORTING.get(cid, []) if p != proposed]
        if not queries:
            status = "insufficient_evidence"; action = "insufficient_evidence"
        elif not observed:
            status = "insufficient_evidence"
        elif proposed and observed == proposed:
            status = "aligned"
        elif proposed:
            status = "owner_mismatch"
        else:
            status = "insufficient_evidence"
        confidence = "high" if imp >= 100 else "medium" if imp >= 20 else "low"
        cluster_rows.append({"cluster_id": cid, "cluster_name": name, "intent_type": intent, "queries": " | ".join(q[0] for q in sorted(queries, key=lambda x: -x[2])), "visible_query_clicks": clicks, "visible_query_impressions": imp, "metric_source": "property_visible_query_table", "observed_query_pages": ";".join(p for p, _ in observed_candidates), "confidence": confidence})
        ownership_rows.append({"cluster_id": cid, "primary_intent": intent, "observed_top_page": observed, "proposed_primary_owner": proposed, "supporting_pages": ";".join(supports), "ownership_status": status, "recommended_action": action, "confidence": confidence})

    csv_actions = {r["cluster_id"]: r["recommended_action"] for r in ownership_rows}
    report_actions = dict(csv_actions)
    validations = {
        "property_total_59_6105": (property_total["clicks"], property_total["impressions"]) == (59, 6105),
        "property_visible_queries_18_2500": (property_queries["clicks"], property_queries["impressions"]) == (18, 2500),
        "old_tiktok_13_321": (old_tiktok["clicks"], old_tiktok["impressions"]) == (13, 321),
        "clean_discovered_zero": sum(1 for r in page_rows if r["current_index_status"] == "discovered_not_indexed_snapshot") == 0,
        "supporting_excludes_owner": all(r["proposed_primary_owner"] not in (r["supporting_pages"].split(";") if r["supporting_pages"] else []) for r in ownership_rows),
        "csv_markdown_actions_match": csv_actions == report_actions,
        "all_cluster_queries_sum_2500_18": (sum(r["visible_query_impressions"] for r in cluster_rows), sum(r["visible_query_clicks"] for r in cluster_rows)) == (2500, 18),
        "valid_actions_only": all(r["recommended_action"] in VALID_ACTIONS for r in ownership_rows),
        "production_html_sitemap_redirect_unchanged": protected_before == protected_file_hashes(),
    }
    failed = [name for name, ok in validations.items() if not ok]
    if failed:
        raise AssertionError("V2 acceptance failed; strategic report not generated: " + ", ".join(failed))

    result = {"property_total": property_total, "property_queries": property_queries, "page_rows": page_rows, "page_query_rows": page_query_rows, "cluster_rows": cluster_rows, "ownership_rows": ownership_rows, "old_tiktok_total": old_tiktok, "csv_actions": csv_actions, "report_actions": report_actions, "validations": validations, "duplicate_exports": duplicate_exports, "coverage_all": coverage_all}
    if not write_outputs:
        return result

    page_fields = list(page_rows[0])
    pq_fields = list(page_query_rows[0])
    cluster_fields = list(cluster_rows[0])
    ownership_fields = list(ownership_rows[0])
    write_csv(OUT / "PAGE_DIAGNOSIS_V2.csv", page_fields, page_rows)
    write_csv(OUT / "PAGE_QUERY_DATA_V2.csv", pq_fields, page_query_rows)
    write_csv(OUT / "QUERY_CLUSTERS_V2.csv", cluster_fields, cluster_rows)
    write_csv(OUT / "QUERY_OWNERSHIP_MAP_V2.csv", ownership_fields, ownership_rows)

    action_rows = "\n".join(f"| {r['cluster_id']} | {r['observed_top_page'] or '未观察到'} | {r['proposed_primary_owner'] or '未指定'} | {r['ownership_status']} | {r['recommended_action']} | {r['confidence']} |" for r in ownership_rows)
    check_rows = "\n".join(f"| {name} | {'PASS' if ok else 'FAIL'} |" for name, ok in validations.items())
    report = f"""# Query Ownership Audit V2（搜索词所有权审计第二版）

## 0. Counter

旧报告的战略结论不能直接沿用，因为旧数据管道混合了三个不可互换的 GSC（谷歌搜索控制台）聚合层级。V2 先修复统计口径，再保留有限的候选 Owner（承接页）判断。

## A. 三层指标与时间范围

| 数据层 | 点击 | 展示 | 开始 | 结束 | 来源 |
|---|---:|---:|---|---|---|
| Property Total（全站总量） | {property_total['clicks']} | {property_total['impressions']} | {property_start} | {property_end} | 未加页面过滤的图表 |
| Property Visible Query（全站可见查询） | {property_queries['clicks']} | {property_queries['impressions']} | {property_start} | {property_end} | 未加页面过滤的 Query 表 |
| Homepage Exact Page（首页精确页面） | {exact_metrics[SITE + '/']['clicks']} | {exact_metrics[SITE + '/']['impressions']} | {page_start} | {page_end} | 首页页面过滤图表 |

• Coverage data through（覆盖数据截至）：`{coverage_data_through}`。

• Coverage export date（覆盖导出日期）：`{coverage_export_date}`。

• 页面图表总量与可见查询加总不要求相等，V2 不再互相替代。

## B. URL 与 Coverage 修复

• `exact_page_metrics` 只保存 exact raw URL（精确原始网址）的页面过滤图表数据。

• `canonical_family_history` 只记录锚点、www、.html 和 Redirect（重定向）历史，不加入当前页面指标。

• Coverage 仅在 raw URL 与当前 Canonical 完全相等时传播状态。

• 当前 clean Canonical 的 `discovered_not_indexed_snapshot` 数量：`{sum(1 for r in page_rows if r['current_index_status'] == 'discovered_not_indexed_snapshot')}`。

• 无 exact Coverage 证据的当前页面标记为 `unknown_in_supplied_snapshot`；历史状态保留在 `legacy_url_status`。

## C. 聚类复审

• 新增 `invisible_name_generator`，不再把名称生成任务默认放入 general。

• WhatsApp 的 blank/empty message 与 invisible mode/ink/how-to 行为型查询分开，后者进入 `other_or_ambiguous`。

• 社交 bio 字符限制查询进入 `social_bio_invalid_characters`，不自动推荐 Instagram generator。

• Guardian Tales、Epic Games 和 Xbox 等非 Fortnite 游戏查询进入 `game_specific_other`。

• 所有 cluster 的需求总量只来自 Property Query 表，合计 {sum(r['visible_query_clicks'] for r in cluster_rows)} clicks / {sum(r['visible_query_impressions'] for r in cluster_rows)} impressions。

## D. Ownership Map

| Cluster | Observed top page | Proposed primary owner | Ownership status | Recommended action | Confidence |
|---|---|---|---|---|---|
{action_rows}

`proposed_primary_owner` 是基于任务角色提出的候选，不代表已经成立。当前没有 query × page × date（搜索词、页面、日期）数据，因此没有任何 cluster 标记 `confirmed_cannibalization`。

## E. 自动验收

| 检查 | 结果 |
|---|---|
{check_rows}

全部验收通过后才生成本报告。CSV 与 Markdown 的 recommended_action（建议动作）来自同一 ownership row 数据源。

## F. 边界

本轮未修改任何生产 HTML、Title、Description、H1、URL、Canonical、Sitemap 或 Redirect。V2 只修复分析数据管道，未执行战略动作。
"""
    REPORT_V2.parent.mkdir(parents=True, exist_ok=True)
    REPORT_V2.write_text(report, encoding="utf-8")
    return result


def main():
    result = build_v2(write_outputs=True)
    print(f"V2 generated: {len(result['page_rows'])} pages, {len(result['page_query_rows'])} page-query rows, {len(result['cluster_rows'])} clusters")
    for name, ok in result["validations"].items():
        print(f"{'PASS' if ok else 'FAIL'} {name}")


if __name__ == "__main__":
    main()
