const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const domain = 'https://theinvisiblecharacter.live';

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
  'instagram-invisible-character-generator.html'
];

function walk(dir, predicate, output = []) {
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, output);
    } else if (predicate(fullPath)) {
      output.push(fullPath);
    }
  }
  return output;
}

function sourceHtmlFiles() {
  const files = rootHtmlPages
    .map(file => path.join(root, file))
    .filter(file => fs.existsSync(file));
  return files
    .concat(walk(path.join(root, 'blog'), file => file.endsWith('.html')))
    .concat(walk(path.join(root, 'fr'), file => file.endsWith('.html')));
}

function webJsFiles() {
  const files = walk(path.join(root, 'assets/js'), file => file.endsWith('.js'));
  const serviceWorker = path.join(root, 'sw.js');
  if (fs.existsSync(serviceWorker)) files.push(serviceWorker);
  return files;
}

function cleanRouteFromFile(file) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative.replace(/\.html$/, '')}`;
}

function pathForCleanUrl(url, baseDir = root) {
  const parsed = new URL(url);
  let pathname = parsed.pathname;
  if (pathname === '/') return path.join(baseDir, 'index.html');
  if (pathname.endsWith('/')) return path.join(baseDir, pathname, 'index.html');
  return path.join(baseDir, `${pathname}.html`);
}

module.exports = {
  root,
  domain,
  sourceHtmlFiles,
  webJsFiles,
  cleanRouteFromFile,
  pathForCleanUrl,
  walk
};
