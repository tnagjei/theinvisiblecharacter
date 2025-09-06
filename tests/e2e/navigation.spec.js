const { test, expect } = require('@playwright/test');

test.describe('页面导航测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('导航链接测试', async ({ page }) => {
    const navLinks = [
      { text: 'Tools', selector: '#tools' },
      { text: 'Features', selector: '#features' },
      { text: 'About', url: 'about.html' },
      { text: 'Blog', url: 'blog/' },
      { text: 'Help', url: 'help.html' }
    ];

    for (const link of navLinks) {
      const navLink = page.locator(`nav a:has-text("${link.text}")`);
      await expect(navLink).toBeVisible();
      
      if (link.selector) {
        // 测试页面内锚点链接
        await navLink.click();
        await page.waitForTimeout(1000);
        const target = page.locator(link.selector);
        const box = await target.boundingBox();
        expect(box.y).toBeLessThan(200);
      } else if (link.url) {
        // 测试页面跳转链接
        const [newPage] = await Promise.all([
          page.waitForEvent('popup'),
          navLink.click()
        ]);
        await expect(newPage).toHaveURL(new RegExp(link.url));
        await newPage.close();
      }
    }
  });

  test('页脚链接测试', async ({ page }) => {
    // 等待页脚加载
    await page.waitForSelector('#footer-placeholder');
    
    const footerLinks = [
      { text: 'Privacy Policy', url: 'privacy-policy.html' },
      { text: 'Terms of Service', url: 'terms-of-service.html' },
      { text: 'About', url: 'about.html' },
      { text: 'Help', url: 'help.html' }
    ];

    for (const link of footerLinks) {
      const footerLink = page.locator(`footer a:has-text("${link.text}")`);
      await expect(footerLink).toBeVisible();
      
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        footerLink.click()
      ]);
      await expect(newPage).toHaveURL(new RegExp(link.url));
      await newPage.close();
    }
  });

  test('面包屑导航测试', async ({ page }) => {
    // 测试博客页面面包屑
    await page.goto('/blog/');
    await expect(page.locator('nav a:has-text("Blog")')).toBeVisible();
    
    // 测试具体博客页面
    await page.goto('/blog/instagram-invisible-characters.html');
    await expect(page.locator('nav a:has-text("Blog")')).toBeVisible();
  });

  test('返回按钮测试', async ({ page }) => {
    // 导航到子页面
    await page.click('nav a:has-text("About")');
    await page.waitForURL('about.html');
    
    // 浏览器返回
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // 浏览器前进
    await page.goForward();
    await expect(page).toHaveURL(/about\.html$/);
  });

  test('语言切换导航', async ({ page }) => {
    // 切换到法语
    await page.click('#language-toggle');
    await page.click('#language-dropdown a:has-text("Français")');
    
    // 等待页面跳转
    await page.waitForURL('index-fr.html');
    await expect(page).toHaveURL(/index-fr\.html$/);
    
    // 检查法语导航链接
    await expect(page.locator('nav a:has-text("Outils")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Fonctionnalités")')).toBeVisible();
    await expect(page.locator('nav a:has-text("À propos")')).toBeVisible();
    
    // 切换回英语
    await page.click('#language-toggle');
    await page.click('#language-dropdown a:has-text("English")');
    
    await page.waitForURL('/');
    await expect(page).toHaveURL(/\/$/);
  });

  test('404页面测试', async ({ page }) => {
    // 访问不存在的页面
    await page.goto('/nonexistent-page.html');
    
    // 检查404页面内容
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.locator('text=Page Not Found')).toBeVisible();
    await expect(page.locator('a:has-text("Return to Home")')).toBeVisible();
    
    // 测试返回首页链接
    await page.click('a:has-text("Return to Home")');
    await expect(page).toHaveURL('/');
  });

  test('移动端导航测试', async ({ page }) => {
    // 切换到移动端视图
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 打开移动端菜单
    await page.click('#mobile-menu-button');
    await expect(page.locator('#mobile-menu')).toBeVisible();
    
    // 测试移动端导航链接
    const mobileLinks = page.locator('#mobile-menu a');
    await expect(mobileLinks).toHaveCount(7); // 5个主要链接 + 2个语言链接
    
    // 点击链接关闭菜单
    await mobileLinks.first().click();
    await expect(page.locator('#mobile-menu')).toBeHidden();
  });

  test('导航滚动效果测试', async ({ page }) => {
    // 检查初始状态
    const header = page.locator('header');
    await expect(header).not.toHaveClass(/shadow-lg/);
    
    // 滚动页面
    await page.evaluate(() => window.scrollTo(0, 100));
    
    // 检查滚动后的状态
    await expect(header).toHaveClass(/shadow-lg/);
    
    // 滚回顶部
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // 检查滚动回顶部的状态
    await expect(header).not.toHaveClass(/shadow-lg/);
  });

  test('导航活动状态测试', async ({ page }) => {
    // 点击导航链接
    await page.click('nav a:has-text("Tools")');
    await page.waitForTimeout(1000);
    
    // 检查活动状态
    const toolsLink = page.locator('nav a:has-text("Tools")');
    await expect(toolsLink).toHaveClass(/text-blue-600/);
    await expect(toolsLink).toHaveClass(/font-semibold/);
    
    // 点击其他链接
    await page.click('nav a:has-text("Features")');
    await page.waitForTimeout(1000);
    
    // 检查活动状态转移
    await expect(toolsLink).not.toHaveClass(/text-blue-600/);
    await expect(toolsLink).not.toHaveClass(/font-semibold/);
    
    const featuresLink = page.locator('nav a:has-text("Features")');
    await expect(featuresLink).toHaveClass(/text-blue-600/);
    await expect(featuresLink).toHaveClass(/font-semibold/);
  });

  test('外部链接测试', async ({ page }) => {
    // 测试社交媒体链接（如果有）
    const socialLinks = page.locator('footer a[href*="twitter"], footer a[href*="facebook"], footer a[href*="instagram"]');
    
    if (await socialLinks.count() > 0) {
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        socialLinks.first().click()
      ]);
      await expect(newPage).not.toHaveURL(/theinvisiblecharacter\.live/);
      await newPage.close();
    }
  });

  test('导航可访问性测试', async ({ page }) => {
    // 测试键盘导航
    await page.keyboard.press('Tab');
    
    // 检查第一个可聚焦元素
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // 测试Tab键导航
    let tabCount = 0;
    while (tabCount < 10) {
      await page.keyboard.press('Tab');
      tabCount++;
      const currentFocus = page.locator(':focus');
      await expect(currentFocus).toBeVisible();
      
      // 如果回到第一个元素，退出循环
      if (await currentFocus.getAttribute('href') === '/') {
        break;
      }
    }
  });

  test('搜索功能导航测试', async ({ page }) => {
    // 如果有搜索功能，测试搜索后的导航
    const searchInput = page.locator('#character-search');
    if (await searchInput.isVisible()) {
      await searchInput.fill('零宽');
      await page.waitForTimeout(500);
      
      // 检查搜索结果
      const characterCards = page.locator('.character-card');
      await expect(characterCards).toHaveCount(3);
      
      // 清空搜索
      await searchInput.clear();
      await expect(characterCards).toHaveCount(12);
    }
  });
});