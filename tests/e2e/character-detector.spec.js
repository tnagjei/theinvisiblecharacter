const { test, expect } = require('@playwright/test');

test.describe('字符检测器测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#detector-tool');
  });

  test('检测器界面加载', async ({ page }) => {
    await expect(page.locator('#detector-tool')).toBeVisible();
    await expect(page.locator('#detector-input')).toBeVisible();
    await expect(page.locator('#detect-button')).toBeVisible();
    await expect(page.locator('#clear-detector')).toBeVisible();
    await expect(page.locator('#real-time-detection')).toBeVisible();
  });

  test('基本检测功能', async ({ page }) => {
    const detectorInput = page.locator('#detector-input');
    const detectButton = page.locator('#detect-button');
    
    // 输入包含隐形字符的文本
    await detectorInput.fill('Hello​World'); // 包含零宽空格
    await detectButton.click();
    
    // 等待检测结果
    await page.waitForSelector('#detection-results', { state: 'visible' });
    
    // 检查检测结果
    const results = page.locator('#detection-results');
    await expect(results).toBeVisible();
    await expect(results.locator('text=检测结果')).toBeVisible();
    await expect(results.locator('text=1 个隐形字符')).toBeVisible();
  });

  test('实时检测功能', async ({ page }) => {
    const detectorInput = page.locator('#detector-input');
    const realTimeCheckbox = page.locator('#real-time-detection');
    
    // 启用实时检测
    await realTimeCheckbox.check();
    await expect(realTimeCheckbox).toBeChecked();
    
    // 输入文本
    await detectorInput.fill('Test​Text'); // 包含零宽空格
    
    // 等待实时检测结果
    await page.waitForTimeout(1000);
    
    // 检查实时检测是否生效
    const results = page.locator('#detection-results');
    await expect(results).toBeVisible();
    
    // 禁用实时检测
    await realTimeCheckbox.uncheck();
    await expect(realTimeCheckbox).not.toBeChecked();
  });

  test('多字符检测', async ({ page }) => {
    const detectorInput = page.locator('#detector-input');
    const detectButton = page.locator('#detect-button');
    
    // 输入包含多个隐形字符的文本
    await detectorInput.fill('Hello​‌‍World'); // 包含零宽空格、零宽非连接符、零宽连接符
    await detectButton.click();
    
    // 等待检测结果
    await page.waitForSelector('#detection-results', { state: 'visible' });
    
    // 检查检测结果
    const results = page.locator('#detection-results');
    await expect(results).toBeVisible();
    await expect(results.locator('text=3 个隐形字符')).toBeVisible();
    
    // 检查每个检测到的字符
    const detectedChars = results.locator('.flex.items-center.justify-between');
    await expect(detectedChars).toHaveCount(3);
  });

  test('无隐形字符检测', async ({ page }) => {
    const detectorInput = page.locator('#detector-input');
    const detectButton = page.locator('#detect-button');
    
    // 输入正常文本
    await detectorInput.fill('Hello World');
    await detectButton.click();
    
    // 等待检测结果
    await page.waitForSelector('#detection-results', { state: 'visible' });
    
    // 检查检测结果
    const results = page.locator('#detection-results');
    await expect(results).toBeVisible();
    await expect(results.locator('text=文本中未检测到隐形字符')).toBeVisible();
    await expect(results.locator('text-green-600')).toBeVisible();
  });

  test('清除功能', async ({ page }) => {
    const detectorInput = page.locator('#detector-input');
    const clearButton = page.locator('#clear-detector');
    const detectButton = page.locator('#detect-button');
    
    // 输入文本并检测
    await detectorInput.fill('Hello​World');
    await detectButton.click();
    await page.waitForSelector('#detection-results', { state: 'visible' });
    
    // 清除内容
    await clearButton.click();
    
    // 检查清除结果
    await expect(detectorInput).toHaveValue('');
    await expect(page.locator('#detection-results')).toBeHidden();
  });

  test('字符清理功能', async ({ page }) => {
    const detectorInput = page.locator('#detector-input');
    const detectButton = page.locator('#detect-button');
    
    // 输入包含隐形字符的文本
    await detectorInput.fill('Hello​‌‍World');
    await detectButton.click();
    await page.waitForSelector('#detection-results', { state: 'visible' });
    
    // 点击清理按钮
    const cleanButton = page.locator('button:has-text("清理隐形字符")');
    await cleanButton.click();
    
    // 等待清理完成
    await page.waitForTimeout(1000);
    
    // 检查清理结果
    await expect(detectorInput).toHaveValue('HelloWorld');
  });

  test('检测结果导出功能', async ({ page }) => {
    const detectorInput = page.locator('#detector-input');
    const detectButton = page.locator('#detect-button');
    
    // 输入包含隐形字符的文本
    await detectorInput.fill('Hello​World');
    await detectButton.click();
    await page.waitForSelector('#detection-results', { state: 'visible' });
    
    // 设置下载监听
    const downloadPromise = page.waitForEvent('download');
    
    // 点击导出按钮
    const exportButton = page.locator('button:has-text("导出结果")');
    await exportButton.click();
    
    // 等待下载完成
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/detection-results/);
  });

  test('检测结果显示', async ({ page }) => {
    const detectorInput = page.locator('#detector-input');
    const detectButton = page.locator('#detect-button');
    
    // 输入包含隐形字符的文本
    await detectorInput.fill('Hello​World');
    await detectButton.click();
    await page.waitForSelector('#detection-results', { state: 'visible' });
    
    // 检查结果显示格式
    const results = page.locator('#detection-results');
    await expect(results.locator('h3')).toHaveText('检测结果');
    await expect(results.locator('.text-red-600')).toBeVisible();
    await expect(results.locator('.bg-red-100')).toBeVisible();
    
    // 检查字符详情
    const charDetails = results.locator('.flex.items-center.justify-between');
    await expect(charDetails).toBeVisible();
    await expect(charDetails.locator('.font-medium')).toBeVisible();
    await expect(charDetails.locator('.text-sm')).toBeVisible();
  });

  test('输入框字符限制', async ({ page }) => {
    const detectorInput = page.locator('#detector-input');
    
    // 输入长文本
    const longText = 'A'.repeat(10000) + '​'; // 10000个字符加一个隐形字符
    await detectorInput.fill(longText);
    
    // 检查输入是否被接受
    const value = await detectorInput.inputValue();
    expect(value).toBe(longText);
  });

  test('检测结果持久化', async ({ page }) => {
    const detectorInput = page.locator('#detector-input');
    const detectButton = page.locator('#detect-button');
    
    // 输入文本并检测
    await detectorInput.fill('Hello​World');
    await detectButton.click();
    await page.waitForSelector('#detection-results', { state: 'visible' });
    
    // 刷新页面
    await page.reload();
    await page.waitForSelector('#detector-tool');
    
    // 检查检测结果是否消失（应该消失）
    await expect(page.locator('#detection-results')).toBeHidden();
    await expect(detectorInput).toHaveValue('');
  });

  test('检测按钮状态', async ({ page }) => {
    const detectorInput = page.locator('#detector-input');
    const detectButton = page.locator('#detect-button');
    
    // 检查初始状态
    await expect(detectButton).toBeEnabled();
    
    // 输入文本后检查按钮状态
    await detectorInput.fill('Hello');
    await expect(detectButton).toBeEnabled();
    
    // 清空文本后检查按钮状态
    await detectorInput.clear();
    await expect(detectButton).toBeEnabled(); // 按钮应该始终可用
  });
});