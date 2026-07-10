// tests/e2e/blank-text-generator.spec.js
// input: browser interactions on blank-text-generator page
// output: assertion results for generator and analyzer behaviors
// pos: test spec run by playwright test; update when adding new features or changing UI selectors

const { test, expect } = require('@playwright/test');

test.describe('Blank Text Generator E2E Tests', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    await page.goto('/blank-text-generator.html');
  });

  test('Page metadata is correct', async ({ page }) => {
    // 1. Title verification
    await expect(page).toHaveTitle('Blank Text Generator (Copy & Paste Empty Text)');

    // 2. Canonical verification
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://theinvisiblecharacter.live/blank-text-generator');

    // 3. Hero layout rendering
    await expect(page.locator('h1')).toHaveText('Blank Text Generator: Copy & Paste Empty Text');
  });

  test('Normal generation works for different character types and counts', async ({ page }) => {
    // Test default character (U+2800) with count = 1
    await page.fill('#btg-count', '1');
    await page.click('#btg-generate');

    const result1 = await page.inputValue('#btg-result');
    expect(result1).toBe('\u2800');
    await expect(page.locator('#btg-status')).toContainText('Generated 1 character using Braille Pattern Blank (U+2800).');

    // Test U+200B with count = 10
    await page.check('#btg-char-u200B');
    await page.fill('#btg-count', '10');
    await page.click('#btg-generate');

    const result2 = await page.inputValue('#btg-result');
    expect(result2).toBe('\u200B'.repeat(10));
    await expect(page.locator('#btg-status')).toContainText('Generated 10 characters using Zero Width Space (U+200B).');

    // Test U+3164 with count = 50
    await page.check('#btg-char-u3164');
    await page.fill('#btg-count', '50');
    await page.click('#btg-generate');

    const result3 = await page.inputValue('#btg-result');
    expect(result3).toBe('\u3164'.repeat(50));
    await expect(page.locator('#btg-status')).toContainText('Generated 50 characters using Hangul Filler (U+3164).');
  });

  test('Input validation blocks invalid counts and displays errors', async ({ page }) => {
    const errorMsg = page.locator('#btg-count-error');

    // 1. Empty input
    await page.fill('#btg-count', '');
    await page.click('#btg-generate');
    await expect(errorMsg).toHaveText('Please enter a number of characters.');
    await expect(page.locator('#btg-count')).toHaveClass(/btg-input-error/);

    // 2. Alphabetic input
    await page.locator('#btg-count').focus();
    await page.keyboard.type('abc');
    await page.click('#btg-generate');
    await expect(errorMsg).toHaveText('Please enter a number of characters.');

    // 3. Decimal input
    await page.fill('#btg-count', '5.5');
    await page.click('#btg-generate');
    await expect(errorMsg).toHaveText('Enter a whole number between 1 and 1000.');

    // 4. Negative input
    await page.fill('#btg-count', '-5');
    await page.click('#btg-generate');
    await expect(errorMsg).toHaveText('Minimum is 1 character.');

    // 5. Zero input
    await page.fill('#btg-count', '0');
    await page.click('#btg-generate');
    await expect(errorMsg).toHaveText('Minimum is 1 character.');

    // 6. Above limit (> 1000)
    await page.fill('#btg-count', '1001');
    await page.click('#btg-generate');
    await expect(errorMsg).toHaveText('Maximum is 1000 characters.');
  });

  test('Quick count buttons update input and generate instantly', async ({ page }) => {
    // Click quick count 10
    await page.click('.btg-quick-btn[data-count="10"]');
    await expect(page.locator('#btg-count')).toHaveValue('10');
    const result10 = await page.inputValue('#btg-result');
    expect(result10).toBe('\u2800'.repeat(10));

    // Click quick count 50
    await page.click('.btg-quick-btn[data-count="50"]');
    await expect(page.locator('#btg-count')).toHaveValue('50');
    const result50 = await page.inputValue('#btg-result');
    expect(result50).toBe('\u2800'.repeat(50));
  });

  test('Copy result functionality works with UI feedback', async ({ page }) => {
    // Generate text first
    await page.fill('#btg-count', '3');
    await page.click('#btg-generate');

    const copyBtn = page.locator('#btg-copy-result');
    await expect(copyBtn).toBeEnabled();

    // Trigger copy click and verify button state feedback
    await copyBtn.click();
    await expect(copyBtn).toContainText('Copied');
    await expect(copyBtn).toHaveClass(/copy-success/);

    // After 2 seconds it should revert
    await page.waitForTimeout(2200);
    await expect(copyBtn).toContainText('Copy Blank Text');
    await expect(copyBtn).not.toHaveClass(/copy-success/);
  });

  test('Analyzer module correctly detects and counts characters', async ({ page }) => {
    // Paste mixed characters: 2 * U+2800, 3 * U+200B, 1 * U+3164, 4 * spaces, 2 * newlines, 1 * regular char 'A'
    const mixedText = '\u2800\u2800\u200B\u200B\u200B\u3164    \n\nA';
    await page.fill('#btg-analyze-input', mixedText);
    await page.click('#btg-analyze-btn');

    // Verify results container is shown
    await expect(page.locator('#btg-analyze-results')).toBeVisible();
    await expect(page.locator('#btg-analyze-summary')).toContainText('13 characters detected.');

    // Verify count details
    const getRowVal = async (label) => {
      const row = page.locator(`.btg-analyze-row:has-text("${label}")`);
      return (await row.locator('.btg-analyze-val').textContent()).trim();
    };

    expect(await getRowVal('Braille Blank (U+2800)')).toBe('2');
    expect(await getRowVal('Zero Width Space (U+200B)')).toBe('3');
    expect(await getRowVal('Hangul Filler (U+3164)')).toBe('1');
    expect(await getRowVal('Ordinary spaces (U+0020)')).toBe('4');
    expect(await getRowVal('Newlines (U+000A)')).toBe('2');
    expect(await getRowVal('Other characters')).toBe('1'); // 'A'

    // Verify unique tags (6 total: U+2800, U+200B, U+3164, U+0020, U+000A, U+0041)
    const tags = page.locator('#btg-char-tags .btg-char-tag');
    await expect(tags).toHaveCount(6);
    const tagTexts = await tags.allTextContents();
    expect(tagTexts).toContain('U+2800 ×2');
    expect(tagTexts).toContain('U+200B ×3');
    expect(tagTexts).toContain('U+3164 ×1');
    expect(tagTexts).toContain('U+0020 ×4');
    expect(tagTexts).toContain('U+000A ×2');
    expect(tagTexts).toContain('U+0041 ×1');

    // Test clear
    await page.click('#btg-analyze-clear');
    await expect(page.locator('#btg-analyze-input')).toHaveValue('');
    await expect(page.locator('#btg-analyze-results')).toBeHidden();
  });

  test('Responsive view checks', async ({ page }) => {
    const viewports = [375, 430];
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      // Ensure controls and result panel are visible
      await expect(page.locator('#btg-char-fieldset')).toBeVisible();
      await expect(page.locator('#btg-count')).toBeVisible();
      await expect(page.locator('#btg-generate')).toBeVisible();
      await expect(page.locator('#btg-result-panel')).toBeVisible();
      await expect(page.locator('#btg-result')).toBeVisible();
      await expect(page.locator('#btg-copy-result')).toBeVisible();
    }
  });

  test('Static preset noscript tags exist in HTML source for No-JS fallback', async ({ page }) => {
    // Evaluate if noscript contains the static preset fields
    const noscriptContent = await page.locator('noscript').innerHTML();
    expect(noscriptContent).toContain('preset-2800-1');
    expect(noscriptContent).toContain('preset-2800-3');
    expect(noscriptContent).toContain('preset-2800-10');
    expect(noscriptContent).toContain('preset-200b-1');
    expect(noscriptContent).toContain('preset-3164-1');
  });
});
