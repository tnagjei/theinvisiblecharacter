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
const forbidden = [
  /https:\/\/theinvisiblecharacter\.live\/[^"'<>\s]*\.html/g,
  /href=["'][^"']*\.html(?:[#?][^"']*)?["']/g,
  /['"`]\/(?:about|about-fr|help|help-fr|tools|developer|index-fr|privacy-policy|terms-of-service|cookie-policy|tiktok-invisible-username-generator)\.html(?:[#?][^'"`]*)?['"`]/g,
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

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Link check passed: ${files.length} web files`);
