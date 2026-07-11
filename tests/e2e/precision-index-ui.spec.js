// input: 已发布页面族与精密索引共享样式。
// output: 防止移动端标题裁切、旧底部导航和页面横向溢出的浏览器回归测试。
// pos: UI 重构 E2E 门禁（更新规则：新增页面族或响应式规则时同步扩展代表页面）。

const { test, expect } = require('@playwright/test');

test.describe('精密索引 UI 回归', () => {
  test('法语博客 Hero 在 430px 保持完整可读', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto('/blog/fr/');

    const metrics = await page.evaluate(() => {
      const heading = document.querySelector('main h1');
      const hero = document.querySelector('main section.min-h-screen');
      return {
        headingClientWidth: heading.clientWidth,
        headingScrollWidth: heading.scrollWidth,
        pageClientWidth: document.documentElement.clientWidth,
        pageScrollWidth: document.documentElement.scrollWidth,
        heroMinHeight: getComputedStyle(hero).minHeight,
        heroAnimationName: getComputedStyle(hero.querySelector('.animate-fade-in')).animationName,
        bottomNavigationCount: document.querySelectorAll('.bottom-nav').length
      };
    });

    expect(metrics.headingScrollWidth).toBeLessThanOrEqual(metrics.headingClientWidth);
    expect(metrics.headingClientWidth).toBeGreaterThan(350);
    expect(metrics.pageScrollWidth).toBe(metrics.pageClientWidth);
    expect(metrics.heroMinHeight).toBe('0px');
    expect(metrics.heroAnimationName).toBe('none');
    expect(metrics.bottomNavigationCount).toBe(0);
  });

  test('代表页面族在 375px 与 430px 不溢出且不注入旧底部导航', async ({ page }) => {
    const paths = [
      '/',
      '/tools.html',
      '/blank-text-generator.html',
      '/discord-invisible-name-generator.html',
      '/blog/',
      '/blog/technical-guide-invisible-characters.html',
      '/developer.html',
      '/privacy-policy.html',
      '/404.html'
    ];

    for (const width of [375, 430]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of paths) {
        await page.goto(path);
        const metrics = await page.evaluate(() => ({
          hasPrecisionStylesheet: Boolean(document.querySelector('link[href*="precision-index.css"]')),
          pageClientWidth: document.documentElement.clientWidth,
          pageScrollWidth: document.documentElement.scrollWidth,
          bottomNavigationCount: document.querySelectorAll('.bottom-nav').length,
          headingCount: document.querySelectorAll('h1').length
        }));

        expect(metrics.hasPrecisionStylesheet).toBe(true);
        expect(metrics.pageScrollWidth).toBe(metrics.pageClientWidth);
        expect(metrics.bottomNavigationCount).toBe(0);
        expect(metrics.headingCount).toBeGreaterThan(0);
      }
    }
  });

  test('首页主题切换同步精密索引浏览器主题色', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.locator('#theme-toggle-desktop').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#20201d');
  });

  test('遗留博客页面没有脚本解析错误', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/blog/fr/');
    expect(errors).toEqual([]);
  });
});
