const { test, expect } = require('@playwright/test');

test.describe('主页功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('页面标题和Meta信息正确', async ({ page }) => {
    await expect(page).toHaveTitle(/Free Invisible Character Generator/);
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toContain('invisible characters');
  });

  test('主要页面元素加载', async ({ page }) => {
    // 检查Hero区域
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=TheInvisibleCharacter.live')).toBeVisible();

    // 检查导航菜单
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Tools')).toBeVisible();
    await expect(page.locator('text=Features')).toBeVisible();

    // 检查工具区域
    await expect(page.locator('#tools')).toBeVisible();
    await expect(page.locator('#generator-tool')).toBeVisible();
    await expect(page.locator('#detector-tool')).toBeVisible();
  });

  test('主题切换功能', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle-desktop');

    // 检查初始状态
    await expect(page.locator('body')).not.toHaveClass(/dark/);

    // 切换到暗色主题
    await themeToggle.click();
    await expect(page.locator('body')).toHaveClass(/dark/);

    // 切换回亮色主题
    await themeToggle.click();
    await expect(page.locator('body')).not.toHaveClass(/dark/);
  });

  test('语言切换功能', async ({ page }) => {
    const languageToggle = page.locator('#language-toggle');

    // 点击语言切换按钮
    await languageToggle.click();

    // 检查下拉菜单
    await expect(page.locator('#language-dropdown')).toBeVisible();
    await expect(page.locator('text=🇺🇸 English')).toBeVisible();
    await expect(page.locator('text=🇫🇷 Français')).toBeVisible();

    // 点击外部关闭菜单
    await page.click('body');
    await expect(page.locator('#language-dropdown')).toBeHidden();
  });

  test('平滑滚动到工具区域', async ({ page }) => {
    // Tools section is now above-the-fold after hero refactor
    // Test navigation link scroll behavior instead of removed CTA
    const toolsNavLink = page.locator('nav a[href="#tools"]').first();
    await toolsNavLink.click();

    // 等待滚动完成
    await page.waitForTimeout(1000);

    // 检查是否滚动到工具区域
    const toolsSection = page.locator('#tools');
    const toolsBox = await toolsSection.boundingBox();
    expect(toolsBox.y).toBeLessThan(200);
  });

  test('响应式导航菜单', async ({ page }) => {
    // 测试桌面端导航
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(page.locator('#mobile-menu-button')).toBeHidden();

    // 切换到移动端视图
    await page.setViewportSize({ width: 375, height: 667 });

    // 检查移动端菜单
    await expect(page.locator('#mobile-menu-button')).toBeVisible();
    await expect(page.locator('#mobile-menu')).toBeHidden();

    // 打开移动端菜单
    await page.locator('#mobile-menu-button').click();
    await expect(page.locator('#mobile-menu')).toBeVisible();

    // 关闭移动端菜单
    await page.locator('#mobile-menu-button').click();
    await expect(page.locator('#mobile-menu')).toBeHidden();
  });
});