const { test, expect } = require('@playwright/test');

test.describe('隐形字符生成器测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#character-grid');
  });

  test('字符库正确加载', async ({ page }) => {
    const characterCards = page.locator('.character-card');
    await expect(characterCards).toHaveCount(12);
  });

  test('字符选择功能', async ({ page }) => {
    const firstCard = page.locator('.character-card').first();
    const copyButton = firstCard.locator('.copy-character-btn');
    
    // 选择第一个字符
    await firstCard.click();
    await expect(firstCard).toHaveClass(/ring-2/);
    await expect(firstCard).toHaveClass(/ring-blue-500/);
    
    // 检查选择计数器
    const counter = page.locator('#selection-counter');
    await expect(counter).toBeVisible();
    await expect(counter.locator('span')).toHaveText('1');
    
    // 取消选择
    await firstCard.click();
    await expect(firstCard).not.toHaveClass(/ring-2/);
    await expect(counter).toBeHidden();
  });

  test('批量选择功能', async ({ page }) => {
    const selectAllBtn = page.locator('#select-all');
    const clearSelectionBtn = page.locator('#clear-selection');
    const counter = page.locator('#selection-counter');
    
    // 选择所有字符
    await selectAllBtn.click();
    await expect(counter).toBeVisible();
    await expect(counter.locator('span')).toHaveText('12');
    
    // 检查所有字符都被选中
    const characterCards = page.locator('.character-card');
    const selectedCards = characterCards.locator('.ring-2');
    await expect(selectedCards).toHaveCount(12);
    
    // 清除选择
    await clearSelectionBtn.click();
    await expect(counter).toBeHidden();
    await expect(selectedCards).toHaveCount(0);
  });

  test('搜索功能', async ({ page }) => {
    const searchInput = page.locator('#character-search');
    const characterCards = page.locator('.character-card');
    
    // 搜索"零宽"
    await searchInput.fill('零宽');
    await expect(characterCards).toHaveCount(3); // 应该找到3个包含"零宽"的字符
    
    // 清空搜索
    await searchInput.clear();
    await expect(characterCards).toHaveCount(12);
    
    // 搜索Unicode
    await searchInput.fill('U+200B');
    await expect(characterCards).toHaveCount(1);
  });

  test('分类筛选功能', async ({ page }) => {
    const filterSelect = page.locator('#character-filter');
    const characterCards = page.locator('.character-card');
    
    // 筛选"Zero Width"分类
    await filterSelect.selectOption('zero-width');
    await expect(characterCards).toHaveCount(3);
    
    // 筛选"Directional"分类
    await filterSelect.selectOption('directional');
    await expect(characterCards).toHaveCount(4);
    
    // 显示所有分类
    await filterSelect.selectOption('');
    await expect(characterCards).toHaveCount(12);
  });

  test('字符复制功能', async ({ page }) => {
    const firstCard = page.locator('.character-card').first();
    const copyButton = firstCard.locator('.copy-character-btn');
    
    // 点击复制按钮
    await copyButton.click();
    
    // 检查复制反馈
    const feedback = firstCard.locator('.absolute');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveText('已复制!');
    
    // 等待反馈消失
    await page.waitForTimeout(2000);
    await expect(feedback).toBeHidden();
  });

  test('批量复制功能', async ({ page }) => {
    const selectAllBtn = page.locator('#select-all');
    const copySelectedBtn = page.locator('#copy-selected');
    
    // 选择所有字符
    await selectAllBtn.click();
    
    // 复制选中的字符
    await copySelectedBtn.click();
    
    // 检查复制按钮状态
    await expect(copySelectedBtn).toBeDisabled();
    
    // 等待复制完成
    await page.waitForTimeout(1000);
    await expect(copySelectedBtn).not.toBeDisabled();
  });

  test('字符卡片信息显示', async ({ page }) => {
    const firstCard = page.locator('.character-card').first();
    
    // 检查字符预览
    const preview = firstCard.locator('.character-preview');
    await expect(preview).toBeVisible();
    
    // 检查字符名称
    const name = firstCard.locator('h3');
    await expect(name).toBeVisible();
    await expect(name).not.toHaveText('');
    
    // 检查字符描述
    const description = firstCard.locator('p');
    await expect(description).toBeVisible();
    await expect(description).not.toHaveText('');
    
    // 检查分类标签
    const category = firstCard.locator('.bg-apple-gray-100');
    await expect(category).toBeVisible();
    
    // 检查热度星级
    const stars = firstCard.locator('.text-yellow-400');
    await expect(stars).toHaveCount(4); // 第一个字符的热度应该是4星
  });

  test('字符卡片悬停效果', async ({ page }) => {
    const firstCard = page.locator('.character-card').first();
    
    // 检查初始状态
    await expect(firstCard).not.toHaveClass(/hover:shadow-lg/);
    
    // 悬停在卡片上
    await firstCard.hover();
    await expect(firstCard).toHaveClass(/hover:shadow-lg/);
    
    // 移开鼠标
    await page.mouse.move(0, 0);
    await expect(firstCard).not.toHaveClass(/hover:shadow-lg/);
  });

  test('字符搜索清除功能', async ({ page }) => {
    const searchInput = page.locator('#character-search');
    const clearButton = searchInput.locator('button');
    const characterCards = page.locator('.character-card');
    
    // 输入搜索内容
    await searchInput.fill('test');
    await expect(characterCards).toHaveCount(0);
    
    // 点击清除按钮
    await clearButton.click();
    await expect(searchInput).toHaveValue('');
    await expect(characterCards).toHaveCount(12);
  });
});