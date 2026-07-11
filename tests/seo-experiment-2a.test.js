// input: SEO 实验 2A 允许修改的七个 HTML 页面。
// output: 验证任务型链接、证据状态、真实查询 FAQ 与禁止承诺的静态合同。
// pos: SEO 实验 2A 回归测试（更新规则：实验角色或允许页面变化时同步本测试与 tests/README.md）。

const fs = require('fs');
const path = require('path');
const { root } = require('../scripts/site-files');

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const between = (html, start, end) => html.split(start)[1]?.split(end)[0] || '';
const unsupportedPromises = [
  'most reliable',
  'maximum reliability',
  'works perfectly',
  'fully supports',
  'guaranteed works',
  'ensure compatibility and safety'
];

describe('SEO 实验 2A 页面角色合同', () => {
  test('首页提供自然的 TikTok 专项任务链接', () => {
    expect(read('index.html')).toContain('<a href="/tiktok-invisible-username-generator">Copy an invisible character for a TikTok username</a>');
  });

  test('Blank Text 保留工具优先并覆盖真实任务表达', () => {
    const html = read('blank-text-generator.html');
    expect(html).toContain('Whether you searched for blank text, empty text, a blank character, or an empty character');
    expect(html).toContain('copy blank text');
    expect(html).not.toContain('the most reliable for WhatsApp');
    expect(html).not.toContain('often harder to strip than U+200B');
  });

  test('TikTok 页面区分字段与证据状态并使用真实查询 FAQ', () => {
    const html = read('tiktok-invisible-username-generator.html');
    for (const label of ['Verified on this page:', 'Reported:', 'Disputed:', 'Unknown:']) {
      expect(html).toContain(label);
    }
    expect(html).toContain('How do I get a blank name on TikTok?');
    expect(html).toContain('Can I use an invisible nickname on TikTok?');
    expect(html).toContain('Three characters to test');
    expect(html).toContain('Invisible characters you can test on TikTok');
    expect(html).not.toContain('Best first tries');
    expect(html).not.toContain('Best as a fallback');
    for (const phrase of unsupportedPromises) expect(html.toLowerCase()).not.toContain(phrase);
  });

  test('WhatsApp 工具和指南建立自然双向链接', () => {
    expect(read('whatsapp-blank-message-generator.html')).toContain('href="/blog/whatsapp-invisible-messages"');
    const guide = read('blog/whatsapp-invisible-messages.html');
    expect(guide).toContain('href="/whatsapp-blank-message-generator"');
    expect(between(guide, 'Method 1:', 'Method 2:')).toContain('href="/whatsapp-blank-message-generator"');
    expect(guide).not.toContain('Join thousands of users who trust');
    for (const phrase of unsupportedPromises) expect(guide.toLowerCase()).not.toContain(phrase);
  });

  test('Fortnite 工具和指南建立自然双向链接', () => {
    expect(read('fortnite-invisible-name-generator.html')).toContain('href="/blog/fortnite-invisible-name"');
    const guide = read('blog/fortnite-invisible-name.html');
    expect(guide).toContain('href="/fortnite-invisible-name-generator"');
    expect(between(guide, 'Get Your Invisible Characters', 'Prepare to Change Your Name')).toContain('href="/fortnite-invisible-name-generator"');
    for (const phrase of unsupportedPromises) expect(guide.toLowerCase()).not.toContain(phrase);
  });

  test('GitHub Actions 在现有站点检查后运行 Jest', () => {
    const workflow = read('.github/workflows/deploy.yml');
    expect(workflow).toContain('npm run check:headers');
    expect(workflow).toContain('npm test -- --runInBand');
    expect(workflow.indexOf('npm test -- --runInBand')).toBeGreaterThan(workflow.indexOf('npm run check:headers'));
    expect(workflow).not.toContain('continue-on-error');
  });
});
