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
    '-o', path.join(root, 'assets/css/tailwind.css'),
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

buildTailwind();
copyBuildFiles();
validateBuild();
console.log(`Build ready: ${path.relative(root, buildDir)}`);
