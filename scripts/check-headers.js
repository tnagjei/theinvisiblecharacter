const fs = require('fs');
const path = require('path');
const { root, sourceHtmlFiles } = require('./site-files');

const failures = [];
const rootHeaders = path.join(root, '_headers');
const buildHeaders = path.join(root, 'build', '_headers');
const cloudflareHeaders = path.join(root, 'cloudflare-config', '_headers');

function fail(message) {
  failures.push(message);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

for (const file of [rootHeaders, buildHeaders, cloudflareHeaders]) {
  if (!fs.existsSync(file)) fail(`${path.relative(root, file)} is missing`);
}

if (fs.existsSync(rootHeaders) && fs.existsSync(buildHeaders)) {
  const rootContent = read(rootHeaders);
  const buildContent = read(buildHeaders);
  if (rootContent !== buildContent) fail('build/_headers differs from root _headers');
}

if (fs.existsSync(rootHeaders) && fs.existsSync(cloudflareHeaders)) {
  const rootContent = read(rootHeaders);
  const cloudflareContent = read(cloudflareHeaders);
  if (rootContent !== cloudflareContent) fail('cloudflare-config/_headers differs from root _headers');
}

const headers = fs.existsSync(buildHeaders) ? read(buildHeaders) : fs.existsSync(rootHeaders) ? read(rootHeaders) : '';
const csp = (headers.match(/Content-Security-Policy:\s*([^\n]+)/) || [])[1] || '';

if (!csp) fail('Content-Security-Policy is missing');
if (csp.includes('script-src *')) fail('CSP uses script-src *');
for (const blocked of ['cdn.tailwindcss.com', 'cdnjs.cloudflare.com']) {
  if (headers.includes(blocked)) fail(`_headers still allows ${blocked}`);
}

const html = sourceHtmlFiles().map(read).join('\n');
const css = fs.existsSync(path.join(root, 'assets/css/style.css')) ? read(path.join(root, 'assets/css/style.css')) : '';
const needs = [];
if (html.includes('clarity.ms')) {
  needs.push(['script-src', 'https://www.clarity.ms']);
  needs.push(['connect-src', 'https://*.clarity.ms']);
}
if (html.includes('pagead2.googlesyndication.com')) {
  needs.push(['script-src', 'https://pagead2.googlesyndication.com']);
  needs.push(['script-src', 'https://googleads.g.doubleclick.net']);
  needs.push(['frame-src', 'https://googleads.g.doubleclick.net']);
  needs.push(['frame-src', 'https://tpc.googlesyndication.com']);
}
if (html.includes('googletagmanager.com')) {
  needs.push(['script-src', 'https://www.googletagmanager.com']);
}
if (html.includes('google-analytics.com')) {
  needs.push(['connect-src', 'https://www.google-analytics.com']);
}
if (html.includes('fonts.googleapis.com') || css.includes('fonts.googleapis.com')) {
  needs.push(['style-src', 'https://fonts.googleapis.com']);
  needs.push(['font-src', 'https://fonts.gstatic.com']);
}

function directiveContains(name, value) {
  const match = csp.match(new RegExp(`${name} ([^;]+)`));
  return match ? match[1].includes(value) : false;
}

for (const [directive, source] of needs) {
  if (!directiveContains(directive, source)) {
    fail(`CSP missing ${source} in ${directive}`);
  }
}

const preloadMatches = [...headers.matchAll(/Link:\s*<([^>]+)>;\s*rel=preload/g)];
for (const match of preloadMatches) {
  const assetPath = match[1].replace(/^\//, '');
  if (!fs.existsSync(path.join(root, assetPath)) && !fs.existsSync(path.join(root, 'build', assetPath))) {
    fail(`_headers preloads missing file: ${match[1]}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Header check passed: ${needs.length} CSP source requirements`);
