const fs = require('fs');
const path = require('path');
const { root, sourceHtmlFiles, webJsFiles } = require('./site-files');

const files = [
  ...sourceHtmlFiles(),
  ...webJsFiles(),
  path.join(root, 'sitemap.xml'),
  path.join(root, 'robots.txt'),
  path.join(root, 'llms.txt')
].filter(file => fs.existsSync(file));

const failures = [];
const redirectsPath = path.join(root, '_redirects');
const cloudflareRedirectsPath = path.join(root, 'cloudflare-config', '_redirects');
const forbidden = [
  /https:\/\/theinvisiblecharacter\.live\/[^"'<>\s]*\.html/g,
  /href=["'][^"']*\.html(?:[#?][^"']*)?["']/g,
  /['"`]\/(?:about|about-fr|help|help-fr|tools|developer|index-fr|privacy-policy|terms-of-service|cookie-policy|tiktok-invisible-username-generator|invisible-name-generator|blank-text-generator)\.html(?:[#?][^'"`]*)?['"`]/g,
  /['"`]\/fr\/[^'"`]*\.html(?:[#?][^'"`]*)?['"`]/g,
  /['"`]\/blog\/[^'"`]*\.html(?:[#?][^'"`]*)?['"`]/g,
  /['"`]\/index\.html['"`]/g,
  /['"`]\/404\.html['"`]/g
];

for (const file of files) {
  const relative = path.relative(root, file);
  const content = fs.readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    const matches = content.match(pattern);
    if (matches) {
      failures.push(`${relative}: forbidden .html URL ${matches[0]}`);
    }
  }
}

if (!fs.existsSync(redirectsPath)) {
  failures.push('_redirects is missing');
} else {
  const redirects = fs.readFileSync(redirectsPath, 'utf8');
  const requiredRedirects = [
    'https://www.theinvisiblecharacter.live/* https://theinvisiblecharacter.live/:splat 301',
    '/index.html / 301',
    '/about.html /about 301',
    '/help.html /help 301',
    '/tools.html /tools 301',
    '/developer.html /developer 301',
    '/index-fr.html /index-fr 301',
    '/privacy-policy.html /privacy-policy 301',
    '/terms-of-service.html /terms-of-service 301',
    '/cookie-policy.html /cookie-policy 301',
    '/blog/index.html /blog/ 301',
    '/blog/fr/index.html /blog/fr/ 301',
    '/blog/tiktok-invisible-characters.html /blog/tiktok-invisible-characters 301',
    '/blog/instagram-invisible-characters.html /blog/instagram-invisible-characters 301',
    '/blog/fortnite-invisible-name.html /blog/fortnite-invisible-name 301',
    '/blog/whatsapp-invisible-messages.html /blog/whatsapp-invisible-messages 301',
    '/blog/discord-invisible-name.html /blog/discord-invisible-name 301',
    '/blog/technical-guide-invisible-characters.html /blog/technical-guide-invisible-characters 301',
    '/blog/creative-ways-invisible-characters.html /blog/creative-ways-invisible-characters 301',
    '/tiktok-invisible-username-generator.html /tiktok-invisible-username-generator 301',
    '/fr/caractere-invisible.html /fr/caractere-invisible 301',
    '/fr/pseudo-invisible-tiktok.html /fr/pseudo-invisible-tiktok 301',
    '/fr/message-vide-whatsapp.html /fr/message-vide-whatsapp 301',
    '/fr/saut-de-ligne-instagram.html /fr/saut-de-ligne-instagram 301',
    '/fr/pseudo-invisible-discord.html /fr/pseudo-invisible-discord 301',
    '/fr/caractere-invisible-tiktok /fr/pseudo-invisible-tiktok 301',
    '/fr/caractere-invisible-tiktok.html /fr/pseudo-invisible-tiktok 301',
    '/invisible-name-generator.html /invisible-name-generator 301',
    '/blank-text-generator.html /blank-text-generator 301'
  ];
  for (const line of requiredRedirects) {
    if (!redirects.includes(line)) failures.push(`_redirects missing required redirect: ${line}`);
  }
}

if (fs.existsSync(redirectsPath) && fs.existsSync(cloudflareRedirectsPath)) {
  const rootRedirects = fs.readFileSync(redirectsPath, 'utf8');
  const cloudflareRedirects = fs.readFileSync(cloudflareRedirectsPath, 'utf8');
  if (rootRedirects !== cloudflareRedirects) failures.push('cloudflare-config/_redirects differs from root _redirects');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Link check passed: ${files.length} web files`);
