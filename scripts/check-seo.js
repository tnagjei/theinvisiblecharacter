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
  `${domain}/discord-invisible-name-generator`,
  `${domain}/whatsapp-blank-message-generator`,
  `${domain}/fortnite-invisible-name-generator`,
  `${domain}/instagram-invisible-character-generator`,
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

// ─── Regression guards added for seo/tiktok-ranking-push ─────────────────────
// Guard: homepage Title and H1 must remain unchanged
const homeTitle = home('title').text().trim();
const homeH1 = home('h1').first().text().trim();
if (homeTitle !== 'Invisible Character Generator: Copy Blank Unicode Text') {
  fail(`index.html: homepage Title changed — found: "${homeTitle}"`);
}
if (homeH1 !== 'Invisible Character Generator') {
  fail(`index.html: homepage H1 changed — found: "${homeH1}"`);
}

// Guard: TikTok page Title and meta description must be present and non-empty
const tiktokPath = path.join(root, 'tiktok-invisible-username-generator.html');
if (fs.existsSync(tiktokPath)) {
  const tiktok = cheerio.load(read(tiktokPath));
  const tiktokTitle = tiktok('title').text().trim();
  const tiktokDesc = tiktok('meta[name="description"]').attr('content') || '';
  if (!tiktokTitle) fail('tiktok-invisible-username-generator.html: missing <title>');
  if (!tiktokDesc) fail('tiktok-invisible-username-generator.html: missing meta description');

  // Guard: TikTok page must have exactly one H1
  const tiktokH1s = tiktok('h1').length;
  if (tiktokH1s !== 1) {
    fail(`tiktok-invisible-username-generator.html: expected exactly 1 H1, found ${tiktokH1s}`);
  }

  // Guard: TikTok canonical must be the clean URL (no .html)
  const tiktokCanonical = tiktok('link[rel="canonical"]').attr('href') || '';
  const expectedTiktokCanonical = 'https://theinvisiblecharacter.live/tiktok-invisible-username-generator';
  if (tiktokCanonical !== expectedTiktokCanonical) {
    fail(`tiktok-invisible-username-generator.html: canonical mismatch — found: "${tiktokCanonical}"`);
  }
}

// Guard: Blank Text Generator page validation (feat/rebuild-blank-text-generator)
const blankPath = path.join(root, 'blank-text-generator.html');
if (fs.existsSync(blankPath)) {
  const blank = cheerio.load(read(blankPath));
  const blankTitle = blank('title').text().trim();
  const blankH1 = blank('h1').first().text().trim();
  const blankH1s = blank('h1').length;
  const blankCanonical = blank('link[rel="canonical"]').attr('href') || '';
  const bodyText = blank('body').text().toLowerCase();

  // 1. Title matching
  if (blankTitle !== 'Blank Text Generator (Copy & Paste Empty Text)') {
    fail(`blank-text-generator.html: expected Title "Blank Text Generator (Copy & Paste Empty Text)", found "${blankTitle}"`);
  }

  // 2. Single H1 check and content matching
  if (blankH1s !== 1) {
    fail(`blank-text-generator.html: expected exactly 1 H1, found ${blankH1s}`);
  } else if (blankH1 !== 'Blank Text Generator: Copy & Paste Empty Text') {
    fail(`blank-text-generator.html: H1 mismatch — found: "${blankH1}"`);
  }

  // 3. Canonical matching
  const expectedBlankCanonical = 'https://theinvisiblecharacter.live/blank-text-generator';
  if (blankCanonical !== expectedBlankCanonical) {
    fail(`blank-text-generator.html: canonical mismatch — found: "${blankCanonical}"`);
  }

  // 4. Keyword presence check
  const requiredKeywords = ['blank text generator', 'empty text', 'blank character', 'empty character'];
  for (const keyword of requiredKeywords) {
    if (!bodyText.includes(keyword)) {
      fail(`blank-text-generator.html: missing required keyword "${keyword}" in body text`);
    }
  }

  // 5. FAQPage JSON-LD validator
  let foundFaq = false;
  blank('script[type="application/ld+json"]').each((_, node) => {
    try {
      const data = JSON.parse(blank(node).text());
      if (data && data['@type'] === 'FAQPage') {
        foundFaq = true;
        const questions = data.mainEntity || [];
        if (questions.length < 8) {
          fail(`blank-text-generator.html: FAQPage has ${questions.length} items, expected at least 8`);
        }
      }
    } catch (e) {
      // JSON validation error is already checked by checkJsonLd, ignore here
    }
  });
  if (!foundFaq) {
    fail('blank-text-generator.html: missing FAQPage JSON-LD schema');
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`SEO check passed: ${sourceHtmlFiles().length} pages, ${urls.length} sitemap URLs`);
