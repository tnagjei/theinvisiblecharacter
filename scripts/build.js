const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const requiredBuildFiles = [
  'index.html',
  'sitemap.xml',
  '_headers',
  '_redirects',
  'robots.txt'
];

const rootHtmlPages = [
  'index.html',
  'index-fr.html',
  'about.html',
  'about-fr.html',
  'help.html',
  'help-fr.html',
  'tools.html',
  'developer.html',
  'privacy-policy.html',
  'terms-of-service.html',
  'cookie-policy.html',
  'tiktok-invisible-username-generator.html',
  'invisible-name-generator.html',
  'blank-text-generator.html',
  'discord-invisible-name-generator.html',
  'whatsapp-blank-message-generator.html',
  'fortnite-invisible-name-generator.html',
  'instagram-invisible-character-generator.html',
  '404.html'
];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function buildTailwind() {
  const bin = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss');
  if (!fs.existsSync(bin)) {
    throw new Error('Tailwind CLI not found. Run npm ci before npm run build.');
  }

  execFileSync(bin, [
    '-c', path.join(root, 'tailwind.config.js'),
    '-i', path.join(root, 'assets/css/tailwind-input.css'),
    '-o', path.join(buildDir, 'assets/css/tailwind.css'),
    '--minify'
  ], { cwd: root, stdio: 'inherit' });
}

function copyBuildFiles() {
  fs.rmSync(buildDir, { recursive: true, force: true });
  fs.mkdirSync(buildDir, { recursive: true });

  for (const file of rootHtmlPages) {
    copyRecursive(path.join(root, file), path.join(buildDir, file));
  }

  for (const entry of ['assets', 'blog', 'fr']) {
    copyRecursive(path.join(root, entry), path.join(buildDir, entry));
  }

  for (const file of ['sitemap.xml', 'robots.txt', 'llms.txt', 'ads.txt', 'sw.js', '_headers', '_redirects']) {
    copyRecursive(path.join(root, file), path.join(buildDir, file));
  }
}

function validateBuild() {
  const missing = requiredBuildFiles.filter(file => !fs.existsSync(path.join(buildDir, file)));
  if (missing.length) {
    throw new Error(`Missing build files: ${missing.join(', ')}`);
  }

  const sitemap = fs.readFileSync(path.join(buildDir, 'sitemap.xml'), 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const forbidden = ['.html', 'www.', '/404', '/index.html'];
  for (const loc of locs) {
    const found = forbidden.filter(token => loc.includes(token));
    if (found.length) {
      throw new Error(`Sitemap URL contains forbidden tokens (${found.join(', ')}): ${loc}`);
    }
  }
}

// ===== 统一导航（链接唯一真实来源见 scripts/nav-links.js）=====
// 所有页面在构建时注入同一套导航链接：英文页一套、法语页一套。
// 只替换链接列表，保留各页面原有的外壳（品牌/语言切换/主题按钮/移动菜单结构），避免破坏交互。
// 注意：enNavLinks/frNavLinks/pageLanguage 统一从 nav-links.js 引入，禁止在此文件再写一份。
const { enNavLinks, frNavLinks, pageLanguage } = require('./nav-links');

function navListHtml(links) {
  return links.map(link => `                <a href="${link.href}">${link.label}</a>`).join('\n');
}

// Tailwind 风格链接（内联导航页与组件碎片共用同一套 class）
function twDeskLinks(links) {
  return links.map(link =>
    `                <a href="${link.href}" class="text-apple-gray-600 dark:text-apple-gray-300 hover:text-apple-gray-900 dark:hover:text-white transition-colors" title="${link.label}">${link.label}</a>`
  ).join('\n');
}
function twMobLinks(links) {
  return links.map(link =>
    `                <a href="${link.href}" class="block px-3 py-2 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-colors" title="${link.label}">${link.label}</a>`
  ).join('\n');
}

function isFrenchPage(relPath) {
  return pageLanguage(relPath) === 'fr';
}

// 平衡匹配 <div class="...">...</div>：从开标签起按 <div>/</div> 计数，
// 一直匹配到与开标签配对的闭合标签为止。相比非贪婪正则 [\s\S]*?</div>，
// 它能正确处理导航容器内嵌套 <div> 的情况（如某页 nav-links 内又套了 div），
// 避免只替换到第一个 </div> 而留下旧链接或多余的闭合标签。
function replaceBalancedDiv(html, classAttr, newOpenTag, innerHtml) {
  const open = new RegExp(`<div class="${classAttr}"[^>]*>`);
  const m = html.match(open);
  if (!m) return html;
  let i = m.index + m[0].length;
  let depth = 1;
  while (i < html.length && depth > 0) {
    if (html.startsWith('<div', i)) { depth++; i += 4; }
    else if (html.startsWith('</div>', i)) { depth--; i += 6; }
    else i++;
  }
  return html.slice(0, m.index) + newOpenTag + '\n' + innerHtml + '\n            ' + '</div>' + html.slice(i);
}

// 常规页面：nav-links 旧模板 或 内联 Tailwind 导航。
// 只替换 <a> 链接列表，保留外壳（品牌/主题按钮/移动菜单结构）。
// nav-links / mobile-menu-links 这两个容器只装链接（无嵌套交互控件），用平衡 div 匹配整段替换；
// 内联 Tailwind 桌面/移动导航的容器里还嵌着语言切换器与主题按钮，必须保留，
// 因此只替换「开标签到主题切换按钮之间」的链接段（与 applyNavComponent 处理组件碎片同理）。
function applyNav(html, french) {
  const links = french ? frNavLinks : enNavLinks;
  const label = french ? 'Liens principaux' : 'Main links';
  const list = navListHtml(links);
  const desk = twDeskLinks(links);
  const mob = twMobLinks(links);

  let out = replaceBalancedDiv(html, 'nav-links', `<div class="nav-links" aria-label="${label}">`, list);
  out = replaceBalancedDiv(out, 'site-container mobile-menu-links', `<div class="site-container mobile-menu-links">`, list);
  out = out
    // 内联 Tailwind 桌面导航：链接到主题切换按钮之间整段替换
    .replace(/(<div class="hidden md:flex items-center space-x-8">)[\s\S]*?(<button id="theme-toggle-desktop")/,
      `$1\n${desk}\n                $2`)
    // 内联 Tailwind 移动导航
    .replace(/(<div class="px-4 py-2 space-y-1">)[\s\S]*?(<button id="theme-toggle-mobile")/,
      `$1\n${mob}\n                $2`);
  return out;
}

// 部分 blog 页使用自定义 <nav class="bg-white shadow-lg sticky top-0 z-50"> 作为站点导航，
// 链接是手写且不全（缺标准链接）。把它也纳入统一注入：保留品牌链接与包裹层结构，
// 仅把 items 容器（flex items-center space-x-4）内的导航项整段替换为标准链接，
// item class 从页面现有项自动检测（EN/FR 同模板，class 一致），
// 这样这些 blog 页的「链接集合」与全站一致，且日后随 enNavLinks/frNavLinks 自动同步。
// 注意：同文件里的另一个 <nav> 是文章目录（TOC，页内锚点），绝不可触碰。
function applyNavCustomNav(html, french) {
  const links = french ? frNavLinks : enNavLinks;
  // 仅在含自定义导航签名的文件上处理（避免误改标准页 site-nav / 页脚 nav / TOC）
  const open = html.match(/<nav class="bg-white shadow-lg sticky top-0 z-50">/);
  if (!open) return html;

  // 平衡匹配到配对的 </nav>
  let p = open.index + open[0].length;
  let depth = 1;
  while (p < html.length && depth > 0) {
    if (html.startsWith('<nav', p)) { depth++; p += 4; }
    else if (html.startsWith('</nav>', p)) { depth--; p += 6; }
    else p++;
  }
  const navStart = open.index;
  const navEnd = p;
  const navBlock = html.slice(navStart, navEnd);

  // 找到 items 容器（flex items-center space-x-4）；品牌链接在另一个 flex items-center 容器内，不冲突
  const wrapOpen = navBlock.match(/<div class="flex items-center space-x-4">/);
  if (!wrapOpen) return html; // 结构不符则不动，避免破坏
  let q = wrapOpen.index + wrapOpen[0].length;
  let d = 1;
  while (q < navBlock.length && d > 0) {
    if (navBlock.startsWith('<div', q)) { d++; q += 4; }
    else if (navBlock.startsWith('</div>', q)) { d--; q += 6; }
    else q++;
  }
  const innerStart = wrapOpen.index + wrapOpen[0].length;
  const innerEnd = q - 6;
  const inner = navBlock.slice(innerStart, innerEnd);

  // 从现有项检测 item class（保留原紫色样式），避免写死
  const firstItem = inner.match(/<a\b[^>]*class="([^"]*)"/);
  const itemClass = firstItem ? firstItem[1] : 'text-gray-700 hover:text-purple-600 transition';
  const list = links.map(link =>
    `                    <a href="${link.href}" class="${itemClass}" title="${link.label}">${link.label}</a>`
  ).join('\n');

  // 保留包裹层前后的换行，仅替换 items 内部
  const newNavBlock = navBlock.slice(0, innerStart) + '\n' + list + '\n' + navBlock.slice(innerEnd);
  return html.slice(0, navStart) + newNavBlock + html.slice(navEnd);
}

// 组件碎片（assets/components/navigation*.html）：保留语言切换器与主题按钮，
// 仅替换两组 <a> 链接（锚点为 Language Switcher 注释，避免误删切换器）。
function applyNavComponent(html, french) {
  const links = french ? frNavLinks : enNavLinks;
  const desk = twDeskLinks(links);
  const mob = twMobLinks(links);

  return html
    .replace(/(<div class="hidden md:flex items-center space-x-8">)[\s\S]*?(<!-- Language Switcher -->)/,
      `$1\n${desk}\n\n                $2`)
    .replace(/(<div class="px-4 py-2 space-y-1">)[\s\S]*?(<!-- Mobile Language Switcher -->)/,
      `$1\n${mob}\n\n                $2`);
}

// 部署说明（关键）：Cloudflare Pages 的连接方式直接发布仓库「源文件夹」，
// 并不会运行 npm run build 后再发 build/。因此导航注入必须写回源文件，
// 否则线上永远拿到的是未注入的旧导航。链接定义仍只在 enNavLinks/frNavLinks 一处维护。
function injectNav(baseDir, label) {
  const pages = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // 跳过资源目录与构建/依赖目录：导航只注入到页面与组件源文件
        if (['assets', 'build', 'node_modules', '.git'].includes(entry.name)) continue;
        walk(full);
      } else if (entry.name.endsWith('.html')) {
        pages.push(full);
      }
    }
  };
  walk(baseDir);

  let changed = 0;
  for (const file of pages) {
    const rel = path.relative(baseDir, file);
    const html0 = fs.readFileSync(file, 'utf8');
    // 处理含 nav-links、内联 Tailwind 桌面导航、或自定义紫色导航（bg-white shadow-lg sticky）的页面
    if (!html0.includes('nav-links') && !html0.includes('hidden md:flex items-center space-x-8') && !html0.includes('bg-white shadow-lg sticky top-0 z-50')) continue;

    const french = isFrenchPage(rel);
    const html = applyNav(applyNavCustomNav(html0, french), french);
    if (html !== html0) {
      fs.writeFileSync(file, html);
      changed += 1;
    }
  }

  // 组件碎片：developer/privacy/terms/cookie 页运行时 fetch 加载，需单独注入
  for (const comp of ['assets/components/navigation.html', 'assets/components/navigation-fr.html']) {
    const file = path.join(baseDir, comp);
    if (!fs.existsSync(file)) continue;
    const html0 = fs.readFileSync(file, 'utf8');
    const french = comp.endsWith('-fr.html');
    const html = applyNavComponent(html0, french);
    if (html !== html0) {
      fs.writeFileSync(file, html);
      changed += 1;
    }
  }

  console.log(`Nav unified across ${changed} ${label} pages`);
}

// 1) 先把统一导航写回源文件（线上部署的就是源文件）
injectNav(root, 'source');
// 2) 再拷贝源文件到 build/（保留 build/ 供本地校验/预览使用）
copyBuildFiles();
// 3) build/ 已是注入后的源文件副本，再跑一次保证一致（幂等）
injectNav(buildDir, 'built');
buildTailwind();
validateBuild();
console.log(`Build ready: ${path.relative(root, buildDir)}`);
