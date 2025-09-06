const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Mobile Large', width: 414, height: 896 }
];

test.describe('响应式设计测试', () => {
  viewports.forEach(viewport => {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      });

      test('页面布局正确显示', async ({ page }) => {
        // 检查主要容器
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('header')).toBeVisible();
        
        // 检查内容区域
        const heroSection = page.locator('.min-h-screen');
        await expect(heroSection).toBeVisible();
        
        // 检查工具区域
        await expect(page.locator('#tools')).toBeVisible();
      });

      test('导航响应式显示', async ({ page }) => {
        const desktopNav = page.locator('nav .hidden.md\\:flex');
        const mobileMenu = page.locator('#mobile-menu');
        const mobileButton = page.locator('#mobile-menu-button');
        
        if (viewport.width >= 768) {
          // 桌面端：显示桌面导航，隐藏移动菜单
          await expect(desktopNav).toBeVisible();
          await expect(mobileButton).toBeHidden();
          await expect(mobileMenu).toBeHidden();
        } else {
          // 移动端：隐藏桌面导航，显示移动菜单按钮
          await expect(desktopNav).toBeHidden();
          await expect(mobileButton).toBeVisible();
          await expect(mobileMenu).toBeHidden();
        }
      });

      test('移动端菜单功能', async ({ page }) => {
        if (viewport.width < 768) {
          const mobileButton = page.locator('#mobile-menu-button');
          const mobileMenu = page.locator('#mobile-menu');
          
          // 打开菜单
          await mobileButton.click();
          await expect(mobileMenu).toBeVisible();
          await expect(mobileButton).toHaveAttribute('aria-expanded', 'true');
          
          // 检查菜单项
          const menuItems = mobileMenu.locator('a');
          await expect(menuItems).toHaveCount(7); // 5个主要链接 + 2个语言链接
          
          // 点击菜单项关闭菜单
          await menuItems.first().click();
          await expect(mobileMenu).toBeHidden();
          await expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
        }
      });

      test('字符网格响应式布局', async ({ page }) => {
        await page.waitForSelector('#character-grid');
        const grid = page.locator('#character-grid');
        const cards = grid.locator('.character-card');
        
        await expect(cards).toHaveCount(12);
        
        // 检查网格布局类
        const gridClasses = await grid.getAttribute('class');
        if (viewport.width >= 1280) {
          // XL屏幕：4列
          expect(gridClasses).toContain('xl:grid-cols-4');
        } else if (viewport.width >= 1024) {
          // LG屏幕：3列
          expect(gridClasses).toContain('lg:grid-cols-3');
        } else if (viewport.width >= 640) {
          // SM屏幕：2列
          expect(gridClasses).toContain('sm:grid-cols-2');
        } else {
          // XS屏幕：1列
          expect(gridClasses).toContain('grid-cols-1');
        }
      });

      test('按钮和输入框响应式', async ({ page }) => {
        // 检查搜索和筛选区域
        const searchContainer = page.locator('.flex.flex-col.sm\\:flex-row');
        await expect(searchContainer).toBeVisible();
        
        // 检查按钮响应式
        const buttons = page.locator('button');
        for (let i = 0; i < await buttons.count(); i++) {
          const button = buttons.nth(i);
          await expect(button).toBeVisible();
          
          // 检查按钮是否可点击
          const box = await button.boundingBox();
          if (box) {
            expect(box.width).toBeGreaterThan(0);
            expect(box.height).toBeGreaterThan(0);
          }
        }
      });

      test('文本可读性', async ({ page }) => {
        // 检查主要文本元素
        const headings = page.locator('h1, h2, h3');
        const paragraphs = page.locator('p');
        
        for (let i = 0; i < await headings.count(); i++) {
          const heading = headings.nth(i);
          await expect(heading).toBeVisible();
          
          // 检查文本是否被截断
          const box = await heading.boundingBox();
          const textContent = await heading.textContent();
          if (box && textContent) {
            expect(box.width).toBeGreaterThan(50);
          }
        }
        
        for (let i = 0; i < await paragraphs.count(); i++) {
          const paragraph = paragraphs.nth(i);
          await expect(paragraph).toBeVisible();
          
          // 检查段落文本
          const textContent = await paragraph.textContent();
          if (textContent && textContent.trim().length > 0) {
            const box = await paragraph.boundingBox();
            if (box) {
              expect(box.width).toBeGreaterThan(50);
            }
          }
        }
      });

      test('图片和图标响应式', async ({ page }) => {
        // 检查SVG图标
        const icons = page.locator('svg');
        for (let i = 0; i < await icons.count(); i++) {
          const icon = icons.nth(i);
          await expect(icon).toBeVisible();
          
          const box = await icon.boundingBox();
          if (box) {
            expect(box.width).toBeGreaterThan(0);
            expect(box.height).toBeGreaterThan(0);
          }
        }
      });

      test('滚动行为', async ({ page }) => {
        // 检查页面是否需要滚动
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
        const viewportHeight = viewport.height;
        
        if (bodyHeight > viewportHeight) {
          // 测试滚动
          await page.evaluate(() => window.scrollTo(0, 500));
          await page.waitForTimeout(500);
          
          // 检查滚动后元素是否仍然可见
          await expect(page.locator('header')).toBeVisible();
          
          // 滚回顶部
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(500);
        }
      });

      test('触摸交互', async ({ page }) => {
        if (viewport.width < 768) {
          // 测试触摸友好的交互元素
          const touchTargets = page.locator('button, .clickable, a');
          
          for (let i = 0; i < await touchTargets.count(); i++) {
            const target = touchTargets.nth(i);
            const box = await target.boundingBox();
            
            if (box) {
              // 检查触摸目标大小（至少44x44像素）
              expect(box.width).toBeGreaterThanOrEqual(44);
              expect(box.height).toBeGreaterThanOrEqual(44);
            }
          }
        }
      });

      test('主题切换响应式', async ({ page }) => {
        const themeToggleDesktop = page.locator('#theme-toggle-desktop');
        const themeToggleMobile = page.locator('#theme-toggle-mobile');
        
        if (viewport.width >= 768) {
          await expect(themeToggleDesktop).toBeVisible();
          await expect(themeToggleMobile).toBeHidden();
          
          // 测试桌面端主题切换
          await themeToggleDesktop.click();
          await expect(page.locator('body')).toHaveClass(/dark/);
          await themeToggleDesktop.click();
          await expect(page.locator('body')).not.toHaveClass(/dark/);
        } else {
          await expect(themeToggleDesktop).toBeHidden();
          await expect(themeToggleMobile).toBeVisible();
          
          // 测试移动端主题切换
          await themeToggleMobile.click();
          await expect(page.locator('body')).toHaveClass(/dark/);
          await themeToggleMobile.click();
          await expect(page.locator('body')).not.toHaveClass(/dark/);
        }
      });

      test('语言切换响应式', async ({ page }) => {
        const languageToggle = page.locator('#language-toggle');
        const languageDropdown = page.locator('#language-dropdown');
        
        await expect(languageToggle).toBeVisible();
        await expect(languageDropdown).toBeHidden();
        
        // 测试语言切换下拉菜单
        await languageToggle.click();
        await expect(languageDropdown).toBeVisible();
        
        // 检查下拉菜单位置
        const toggleBox = await languageToggle.boundingBox();
        const dropdownBox = await languageDropdown.boundingBox();
        
        if (toggleBox && dropdownBox) {
          // 下拉菜单应该在切换按钮下方
          expect(dropdownBox.x).toBeCloseTo(toggleBox.x, 10);
          expect(dropdownBox.y).toBeGreaterThan(toggleBox.y);
        }
        
        // 关闭下拉菜单
        await page.click('body');
        await expect(languageDropdown).toBeHidden();
      });

      test('表单元素响应式', async ({ page }) => {
        // 检查输入框
        const inputs = page.locator('input, textarea, select');
        for (let i = 0; i < await inputs.count(); i++) {
          const input = inputs.nth(i);
          await expect(input).toBeVisible();
          
          const box = await input.boundingBox();
          if (box) {
            expect(box.width).toBeGreaterThan(50);
            expect(box.height).toBeGreaterThan(20);
          }
        }
        
        // 检查字符检测器输入框
        const detectorInput = page.locator('#detector-input');
        if (await detectorInput.isVisible()) {
          await detectorInput.fill('Test responsive input');
          await expect(detectorInput).toHaveValue('Test responsive input');
        }
      });

      test('加载状态和动画', async ({ page }) => {
        // 检查是否有加载动画
        const animatedElements = page.locator('.animate-fade-in, .animate-slide-up');
        
        for (let i = 0; i < await animatedElements.count(); i++) {
          const element = animatedElements.nth(i);
          await expect(element).toBeVisible();
        }
      });

      test('错误状态响应式', async ({ page }) => {
        // 测试404页面响应式
        await page.goto('/nonexistent-page.html');
        
        await expect(page.locator('h1')).toContainText('404');
        await expect(page.locator('text=Page Not Found')).toBeVisible();
        
        // 检查返回按钮在不同屏幕尺寸下的显示
        const backButton = page.locator('a:has-text("Return to Home")');
        await expect(backButton).toBeVisible();
        
        const box = await backButton.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThan(100);
          expect(box.height).toBeGreaterThan(30);
        }
      });
    });
  });

  test.describe('屏幕方向变化测试', () => {
    test('横屏模式测试', async ({ page }) => {
      await page.goto('/');
      
      // 切换到横屏模式
      await page.setViewportSize({ width: 896, height: 414 });
      await page.waitForLoadState('networkidle');
      
      // 检查布局是否适应横屏
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      
      // 检查字符网格
      const grid = page.locator('#character-grid');
      await expect(grid).toBeVisible();
      
      const gridClasses = await grid.getAttribute('class');
      expect(gridClasses).toContain('grid-cols-1');
    });

    test('竖屏模式测试', async ({ page }) => {
      await page.goto('/');
      
      // 切换到竖屏模式
      await page.setViewportSize({ width: 414, height: 896 });
      await page.waitForLoadState('networkidle');
      
      // 检查布局是否适应竖屏
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      
      // 检查移动端菜单
      const mobileButton = page.locator('#mobile-menu-button');
      await expect(mobileButton).toBeVisible();
    });
  });
});