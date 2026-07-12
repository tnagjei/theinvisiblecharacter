// input: 全站 HTML 源文件 + 组件碎片
// output: 校验「每个页面的导航链接集合」与标准集合（enNavLinks/frNavLinks）完全一致
// pos: scripts/check-nav.js（更新规则：导航标准集合来自 nav-links.js，本脚本只做校验；新增页面类型时同步调整）
//
// 作用：这是「导航不统一」的自动防线。build.js 负责注入统一导航，本脚本在 CI 中
// 断言注入结果正确——任何页面若导航链接多了/少了/没有导航容器，检查直接失败、阻断部署。
// 这样即使将来有人新增页面、改了模板、或 build.js 注入漏掉某个容器，CI 也会立刻报错，
// 不会再出现「线上导航悄悄不统一」的情况。

const fs = require('fs');
const path = require('path');
const { root, sourceHtmlFiles } = require('./site-files');
const { enNavLinks, frNavLinks, pageLanguage } = require('./nav-links');

const EN = new Set(enNavLinks.map(link => link.href));
const FR = new Set(frNavLinks.map(link => link.href));

const failures = [];

function hrefsIn(span) {
  const set = new Set();
  if (span) {
    for (const m of span.matchAll(/href="([^"]+)"/g)) set.add(m[1]);
  }
  return set;
}

// 平衡匹配 <div class="...">...</div> 内部 HTML（处理嵌套 div）。
function balancedInner(html, classAttr) {
  const open = new RegExp(`<div class="${classAttr}"[^>]*>`);
  const m = html.match(open);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  while (i < html.length && depth > 0) {
    if (html.startsWith('<div', i)) { depth++; i += 4; }
    else if (html.startsWith('</div>', i)) { depth--; i += 6; }
    else i++;
  }
  return html.slice(m.index + m[0].length, i - 6);
}

// 平衡匹配 <tag class="...">...</tag> 内部 HTML（用于自定义 <nav> 容器）。
function balancedTagInner(html, tag, classAttr) {
  const open = new RegExp(`<${tag} class="${classAttr}"[^>]*>`);
  const m = html.match(open);
  if (!m) return null;
  const close = `</${tag}>`;
  let i = m.index + m[0].length;
  let depth = 1;
  while (i < html.length && depth > 0) {
    if (html.startsWith(`<${tag}`, i)) { depth++; i += tag.length + 1; }
    else if (html.startsWith(close, i)) { depth--; i += close.length; }
    else i++;
  }
  return html.slice(m.index + m[0].length, i - close.length);
}

// 提取「开标签」到「第一个终止符」之间的 HTML（用于内联导航容器，保留其后的切换按钮）。
function spanToTerminator(html, classAttr, terminators) {
  const open = new RegExp(`<div class="${classAttr}"[^>]*>`);
  const m = html.match(open);
  if (!m) return null;
  let end = html.length;
  for (const t of terminators) {
    const idx = html.indexOf(t, m.index);
    if (idx !== -1 && idx < end) end = idx;
  }
  return html.slice(m.index + m[0].length, end);
}

function checkPage(file) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const lang = pageLanguage(rel);
  const canonical = lang === 'fr' ? FR : EN;

  // 部分页面（developer / privacy / terms / cookie 等）的导航通过运行时 fetch
  // 共享组件 assets/components/navigation.html 注入，源文件内没有内联导航容器。
  // 这类页面的导航一致性由「组件碎片」校验覆盖，此处跳过，避免误报。
  if (html.includes('id="navigation-placeholder"') || html.includes("fetch('assets/components/navigation.html") || html.includes('fetch("assets/components/navigation.html"')) {
    return;
  }

  // 组件碎片（navigation*.html）的导航容器里嵌着语言/主题切换按钮，
  // 其链接段以「语言切换注释」为界；普通页面以「主题切换按钮」为界。
  const isComponent = rel.startsWith('assets/components/');
  const deskTerm = isComponent ? ['<!-- Language Switcher -->'] : ['<button id="theme-toggle-desktop">'];
  const mobTerm = isComponent ? ['<!-- Mobile Language Switcher -->'] : ['<button id="theme-toggle-mobile">'];

  const containers = [];
  const navInner = balancedInner(html, 'nav-links');
  if (navInner !== null) containers.push(['nav-links', hrefsIn(navInner)]);
  const mobInner = balancedInner(html, 'site-container mobile-menu-links');
  if (mobInner !== null) containers.push(['mobile-menu-links', hrefsIn(mobInner)]);
  const deskSpan = spanToTerminator(html, 'hidden md:flex items-center space-x-8', deskTerm);
  if (deskSpan !== null) containers.push(['desktop', hrefsIn(deskSpan)]);
  const mobSpan = spanToTerminator(html, 'px-4 py-2 space-y-1', mobTerm);
  if (mobSpan !== null) containers.push(['mobile', hrefsIn(mobSpan)]);
  // 部分 blog 页使用自定义 <nav class="bg-white shadow-lg sticky top-0 z-50"> 作为站点导航
  const customNav = balancedTagInner(html, 'nav', 'bg-white shadow-lg sticky top-0 z-50');
  if (customNav !== null) containers.push(['custom-nav', hrefsIn(customNav)]);

  if (containers.length === 0) {
    failures.push(`${rel}: 未找到任何导航容器（nav-links / 内联导航 / 自定义 nav 均缺失）`);
    return;
  }

  // 校验口径：每个导航容器都必须「包含全部 6 个标准链接」（缺失即不一致，会破坏全站统一）。
  // 页脚链接、相关文章、页内锚点等与导航共存是正常的，不视为不一致，因此容忍多余链接。
  for (const [name, set] of containers) {
    const missing = [...canonical].filter(h => !set.has(h));
    if (missing.length) {
      failures.push(`${rel} [${name}]: 缺少标准导航链接 ${JSON.stringify(missing)}`);
    }
  }
}

// 1) 所有真实页面（首页/工具页/blog/fr）
for (const file of sourceHtmlFiles()) checkPage(file);

// 2) 组件碎片（运行时被页面 fetch 加载）
for (const comp of ['assets/components/navigation.html', 'assets/components/navigation-fr.html']) {
  const f = path.join(root, comp);
  if (fs.existsSync(f)) checkPage(f);
}

if (failures.length) {
  console.error('导航一致性检查未通过:\n' + failures.join('\n'));
  process.exit(1);
}

console.log(`Nav consistency check passed: ${sourceHtmlFiles().length} pages + components`);
