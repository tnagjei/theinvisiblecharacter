// input: 技术 SEO 修复涉及的链接、资源、构建、缓存与 Service Worker 配置。
// output: 阻止错误路径、缺失图标、旧手机资源和长期无指纹缓存回归。
// pos: 技术 SEO 计划回归合同（更新规则：技术交付策略变化时同步本测试与 tests/README.md）。

const fs = require('fs');
const path = require('path');
const { root, sourceHtmlFiles } = require('../scripts/site-files');

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

describe('技术 SEO 修复合同', () => {
  test('法语导航与 About 锚点使用有效目标', () => {
    expect(read('blog/fr/index.html')).not.toContain('href="blog/fr/"');
    expect(read('about-fr.html')).not.toContain('href="blog/fr/"');
    expect(read('about.html')).not.toMatch(/href="#(?:tools|about)"/);
    expect(read('about-fr.html')).not.toContain('href="#about"');
    expect(read('blog/fr/index.html')).toContain('id="latest-posts"');
  });

  test('Apple touch icon 是存在的 180x180 PNG', () => {
    const file = path.join(root, 'assets/icons/apple-touch-icon.png');
    expect(fs.existsSync(file)).toBe(true);
    const data = fs.readFileSync(file);
    expect(data.subarray(1, 4).toString()).toBe('PNG');
  });

  test('公开页面与构建配置不再依赖旧手机资源', () => {
    for (const file of sourceHtmlFiles()) {
      const html = fs.readFileSync(file, 'utf8');
      expect(html).not.toMatch(/mobile-optimization\.(?:js|css)/);
    }
    expect(fs.existsSync(path.join(root, 'assets/js/mobile-optimization.js'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'assets/css/mobile-optimization.css'))).toBe(false);
  });

  test('Service Worker 是退役脚本且不再缓存请求', () => {
    const sw = read('sw.js');
    expect(sw).toContain('registration.unregister()');
    expect(sw).toContain("cacheName.startsWith('tic-')");
    expect(sw).not.toContain("addEventListener('fetch'");
    expect(read('assets/js/performance.js')).not.toContain("serviceWorker.register('/sw.js')");
  });

  test('无内容指纹资产不使用一年 immutable 缓存', () => {
    for (const file of ['_headers', 'cloudflare-config/_headers']) {
      const headers = read(file);
      expect(headers).not.toContain('max-age=31536000, immutable');
      expect(headers).toContain('max-age=604800, must-revalidate');
    }
  });

  test('Tailwind 构建只写入 build 目录', () => {
    const build = read('scripts/build.js');
    expect(build).toContain("path.join(buildDir, 'assets/css/tailwind.css')");
    expect(build.indexOf('copyBuildFiles();')).toBeLessThan(build.indexOf('buildTailwind();', build.indexOf('copyBuildFiles();')));
  });

  test('轻量移动检查接入 npm 与 GitHub Actions', () => {
    const packageJson = JSON.parse(read('package.json'));
    expect(packageJson.scripts['check:mobile']).toBe('playwright test --config=playwright.mobile.config.js');
    expect(packageJson.scripts['check:all']).toContain('npm run check:mobile');
    const workflow = read('.github/workflows/deploy.yml');
    expect(workflow).toContain('npm run check:mobile');
    expect(workflow.indexOf('npm run check:mobile')).toBeGreaterThan(workflow.indexOf('npm test -- --runInBand'));
  });
});
