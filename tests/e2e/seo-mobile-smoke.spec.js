// input: 代表性公开 HTML 页面与 375px、430px 手机视口。
// output: 页面无脚本错误、本地资源失败、横向溢出、重复脚本或无效页内锚点。
// pos: CI 轻量移动端 SEO 冒烟门禁（更新规则：页面族变化时同步代表页清单）。

const { test, expect } = require('@playwright/test');

const pages = [
  '/index.html',
  '/blank-text-generator.html',
  '/tiktok-invisible-username-generator.html',
  '/blog/index.html',
  '/blog/fr/index.html',
  '/blog/fortnite-invisible-name.html',
  '/about.html',
  '/404.html'
];

for (const width of [375, 430]) {
  for (const url of pages) {
    test(`${width}px ${url} stays mobile-safe`, async ({ page }) => {
      const pageErrors = [];
      const localFailures = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      page.on('requestfailed', request => {
        if (request.url().startsWith('http://127.0.0.1:8080')) localFailures.push(request.url());
      });
      await page.route('**/*', route => {
        const requestUrl = route.request().url();
        if (requestUrl.startsWith('http://127.0.0.1:8080')) return route.continue();
        return route.abort();
      });

      await page.setViewportSize({ width, height: 820 });
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const state = await page.evaluate(() => {
        const scripts = [...document.scripts]
          .map(script => script.src)
          .filter(src => src && new URL(src).origin === location.origin);
        const duplicateScripts = scripts.filter((src, index) => scripts.indexOf(src) !== index);
        const invalidFragments = [...document.querySelectorAll('a[href^="#"]')]
          .map(link => link.getAttribute('href'))
          .filter(href => href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1))));
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          duplicateScripts,
          invalidFragments,
          h1Count: document.querySelectorAll('h1').length
        };
      });

      expect(pageErrors).toEqual([]);
      expect(localFailures).toEqual([]);
      expect(state.scrollWidth).toBeLessThanOrEqual(state.clientWidth);
      expect(state.duplicateScripts).toEqual([]);
      expect(state.invalidFragments).toEqual([]);
      expect(state.h1Count).toBe(1);
    });
  }
}
