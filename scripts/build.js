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

// ===== 统一导航（单一真实来源）=====
// 所有页面在构建时注入同一套导航链接：英文页一套、法语页一套。
// 只替换链接列表，保留各页面原有的外壳（品牌/语言切换/主题按钮/移动菜单结构），避免破坏交互。
const enNavLinks = [
  { href: '/', label: 'Generator' },
  { href: '/blank-text-generator', label: 'Blank Text' },
  { href: '/tiktok-invisible-username-generator', label: 'TikTok' },
  { href: '/invisible-name-generator', label: 'Names' },
  { href: '/tools', label: 'Tools' },
  { href: '/blog/', label: 'Blog' }
];

const frNavLinks = [
  { href: '/index-fr', label: 'Accueil' },
  { href: '/fr/caractere-invisible', label: 'Caractère invisible' },
  { href: '/fr/pseudo-invisible-tiktok', label: 'TikTok' },
  { href: '/fr/message-vide-whatsapp', label: 'WhatsApp' },
  { href: '/fr/saut-de-ligne-instagram', label: 'Instagram' },
  { href: '/fr/pseudo-invisible-discord', label: 'Discord' },
  { href: '/blog/fr/', label: 'Blog' }
];

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
  if (/[-]fr\.html$/.test(path.basename(relPath))) return true;
  return relPath.split(path.sep).includes('fr');
}

// 常规页面：nav-links 旧模板 或 内联 Tailwind 导航。
// 只替换 <a> 链接列表，保留外壳（品牌/主题按钮/移动菜单结构）。
function applyNav(html, french) {
  const links = french ? frNavLinks : enNavLinks;
  const label = french ? 'Liens principaux' : 'Main links';
  const list = navListHtml(links);
  const desk = twDeskLinks(links);
  const mob = twMobLinks(links);

  return html
    .replace(/<div class="nav-links"[^>]*>[\s\S]*?<\/div>/,
      `<div class="nav-links" aria-label="${label}">\n${list}\n            </div>`)
    .replace(/<div class="site-container mobile-menu-links">[\s\S]*?<\/div>/,
      `<div class="site-container mobile-menu-links">\n${list}\n            </div>`)
    // 内联 Tailwind 桌面导航：链接到主题切换按钮之间整段替换
    .replace(/(<div class="hidden md:flex items-center space-x-8">)[\s\S]*?(<button id="theme-toggle-desktop")/,
      `$1\n${desk}\n                $2`)
    // 内联 Tailwind 移动导航
    .replace(/(<div class="px-4 py-2 space-y-1">)[\s\S]*?(<button id="theme-toggle-mobile")/,
      `$1\n${mob}\n                $2`);
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

function injectNav() {
  const pages = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'assets') continue; // 组件碎片单独处理，避免改到模板本身
        walk(full);
      } else if (entry.name.endsWith('.html')) {
        pages.push(full);
      }
    }
  };
  walk(buildDir);

  let changed = 0;
  for (const file of pages) {
    const rel = path.relative(buildDir, file);
    const html0 = fs.readFileSync(file, 'utf8');
    // 仅处理含 nav-links 或 内联 Tailwind 桌面导航的页面
    if (!html0.includes('nav-links') && !html0.includes('hidden md:flex items-center space-x-8')) continue;

    const french = isFrenchPage(rel);
    const html = applyNav(html0, french);
    if (html !== html0) {
      fs.writeFileSync(file, html);
      changed += 1;
    }
  }

  // 组件碎片：developer/privacy/terms/cookie 页运行时 fetch 加载，需单独注入
  for (const comp of ['assets/components/navigation.html', 'assets/components/navigation-fr.html']) {
    const file = path.join(buildDir, comp);
    if (!fs.existsSync(file)) continue;
    const html0 = fs.readFileSync(file, 'utf8');
    const french = comp.endsWith('-fr.html');
    const html = applyNavComponent(html0, french);
    if (html !== html0) {
      fs.writeFileSync(file, html);
      changed += 1;
    }
  }

  console.log(`Nav unified across ${changed} built pages`);
}

copyBuildFiles();
injectNav();
buildTailwind();
validateBuild();
console.log(`Build ready: ${path.relative(root, buildDir)}`);
