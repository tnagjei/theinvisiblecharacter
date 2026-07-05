const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { root, domain, sourceHtmlFiles, webJsFiles, pathForCleanUrl } = require('./site-files');

const failures = [];

function fail(message) {
  failures.push(message);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function href($, selector) {
  return $(selector).first().attr('href') || $(selector).first().attr('content') || '';
}

function expectedLang(relative) {
  const normalized = relative.replace(/\\/g, '/');
  if (normalized === 'index-fr.html' || normalized.endsWith('-fr.html') || normalized.startsWith('blog/fr/') || normalized.startsWith('fr/')) {
    return 'fr';
  }
  return 'en';
}

function hasHreflang(file, lang, target) {
  const $ = cheerio.load(read(path.join(root, file)));
  return $('link[rel="alternate"][hreflang]').toArray().some(node => {
    return $(node).attr('hreflang') === lang && $(node).attr('href') === target;
  });
}

function checkUrlShape(url, file) {
  if (!url.startsWith(domain)) fail(`${file}: URL is outside canonical domain: ${url}`);
  if (url.includes('.html')) fail(`${file}: URL contains .html: ${url}`);
  if (url.includes('www.')) fail(`${file}: URL contains www: ${url}`);
  const pathname = new URL(url).pathname;
  if (pathname !== '/' && !pathname.endsWith('/') && pathname.endsWith('/index')) {
    fail(`${file}: URL contains /index: ${url}`);
  }
  if (pathname !== '/' && pathname.endsWith('/') && !pathname.startsWith('/blog/')) {
    fail(`${file}: ordinary page has trailing slash: ${url}`);
  }
}

function checkJsonLd($, canonical, file) {
  $('script[type="application/ld+json"]').each((_, node) => {
    let data;
    try {
      data = JSON.parse($(node).text());
    } catch (error) {
      fail(`${file}: invalid JSON-LD: ${error.message}`);
      return;
    }

    const items = Array.isArray(data) ? data : [data];
    for (const item of items) {
      if (typeof item.url === 'string' && item.url.startsWith(domain) && !item.url.includes('/assets/')) {
        if (item.url !== canonical) fail(`${file}: JSON-LD url does not match canonical: ${item.url}`);
      }
      const main = item.mainEntityOfPage;
      const mainUrl = typeof main === 'string' ? main : main && main['@id'];
      if (mainUrl && mainUrl !== canonical) {
        fail(`${file}: JSON-LD mainEntityOfPage does not match canonical: ${mainUrl}`);
      }
    }
  });
}

for (const file of sourceHtmlFiles()) {
  const relative = path.relative(root, file);
  const $ = cheerio.load(read(file));
  const canonical = $('link[rel="canonical"]').attr('href');
  const lang = ($('html').attr('lang') || '').toLowerCase();
  const expected = expectedLang(relative);

  if (lang !== expected) fail(`${relative}: expected lang="${expected}", found "${lang || 'missing'}"`);

  if (!canonical) {
    fail(`${relative}: missing canonical`);
    continue;
  }

  checkUrlShape(canonical, relative);

  const ogUrl = $('meta[property="og:url"]').attr('content');
  const twitterUrl = $('meta[name="twitter:url"]').attr('content');
  if (ogUrl !== canonical) fail(`${relative}: og:url does not match canonical`);
  if (twitterUrl !== canonical) fail(`${relative}: twitter:url does not match canonical`);
  checkJsonLd($, canonical, relative);
}

const sitemapPath = path.join(root, 'sitemap.xml');
const sitemap = read(sitemapPath);
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const requiredUrls = [
  `${domain}/`,
  `${domain}/index-fr`,
  `${domain}/tools`,
  `${domain}/tiktok-invisible-username-generator`,
  `${domain}/invisible-name-generator`,
  `${domain}/blank-text-generator`,
  `${domain}/fr/caractere-invisible`,
  `${domain}/fr/pseudo-invisible-tiktok`,
  `${domain}/fr/message-vide-whatsapp`,
  `${domain}/fr/saut-de-ligne-instagram`,
  `${domain}/fr/pseudo-invisible-discord`,
  `${domain}/blog/`
];
for (const requiredUrl of requiredUrls) {
  if (!urls.includes(requiredUrl)) fail(`sitemap missing required URL: ${requiredUrl}`);
}
for (const url of urls) {
  for (const token of ['.html', 'www.', '/404', '/index.html']) {
    if (url.includes(token)) fail(`sitemap URL contains forbidden token ${token}: ${url}`);
  }
}
for (const url of urls) {
  checkUrlShape(url, 'sitemap.xml');
  const sourcePath = pathForCleanUrl(url, root);
  const buildPath = pathForCleanUrl(url, path.join(root, 'build'));
  if (!fs.existsSync(sourcePath) && !fs.existsSync(buildPath)) {
    fail(`sitemap URL has no matching page: ${url}`);
  }
}

function checkHomeHreflang(file) {
  const $ = cheerio.load(read(path.join(root, file)));
  const tags = $('link[rel="alternate"][hreflang]').map((_, node) => ({
    lang: $(node).attr('hreflang'),
    href: $(node).attr('href')
  })).get();
  const required = [
    ['en', `${domain}/`],
    ['fr', `${domain}/index-fr`],
    ['x-default', `${domain}/`]
  ];
  for (const [lang, target] of required) {
    if (!tags.some(tag => tag.lang === lang && tag.href === target)) {
      fail(`${file}: missing hreflang ${lang} -> ${target}`);
    }
  }
}

checkHomeHreflang('index.html');
checkHomeHreflang('index-fr.html');

const tiktokHreflang = [
  ['en', `${domain}/tiktok-invisible-username-generator`],
  ['fr', `${domain}/fr/pseudo-invisible-tiktok`],
  ['x-default', `${domain}/tiktok-invisible-username-generator`]
];
for (const file of ['tiktok-invisible-username-generator.html', 'fr/pseudo-invisible-tiktok.html']) {
  for (const [lang, target] of tiktokHreflang) {
    if (!hasHreflang(file, lang, target)) fail(`${file}: missing hreflang ${lang} -> ${target}`);
  }
}

const tools = cheerio.load(read(path.join(root, 'tools.html')));
const toolsLang = (tools('html').attr('lang') || '').toLowerCase();
if (toolsLang.startsWith('zh')) fail('tools.html: /tools must not use Chinese html lang');
if (/[\u3400-\u9fff]/.test(tools.text())) fail('tools.html: /tools contains Chinese text');

const home = cheerio.load(read(path.join(root, 'index.html')));
if (home('.character-card').length < 12) fail('index.html: homepage must statically render at least 12 character cards');

const webFiles = [
  ...sourceHtmlFiles(),
  ...webJsFiles()
].filter(file => fs.existsSync(file));

const unsupportedClaims = [
  /100K\+/i,
  /1M\+/i,
  /99\.9%/i,
  /99,9%/i,
  /monthly active users/i,
  /characters generated/i,
  /trusted by millions/i
];

for (const file of webFiles) {
  const relative = path.relative(root, file);
  const content = read(file);
  if (content.includes('cdn.tailwindcss.com')) fail(`${relative}: references Tailwind CDN`);
  if (content.includes('cdnjs.cloudflare.com')) fail(`${relative}: references cdnjs`);
  if (content.includes('ClipboardJS')) fail(`${relative}: references ClipboardJS`);
  for (const pattern of unsupportedClaims) {
    if (pattern.test(content)) fail(`${relative}: contains unsupported trust claim matching ${pattern}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`SEO check passed: ${sourceHtmlFiles().length} pages, ${urls.length} sitemap URLs`);
