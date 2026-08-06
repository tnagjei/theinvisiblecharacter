// input: scripts/site-files.js 所定义的所有公开 HTML 页面。
// output: 阻止任何公开页面遗漏精密索引共享样式的回归测试。
// pos: UI 重构的静态契约（更新规则：共享样式合并为 site.min.css 后，契约随之更新）。

const fs = require('fs');
const path = require('path');
const { root, sourceHtmlFiles } = require('../scripts/site-files');

const publicHtmlFiles = () => [
  ...sourceHtmlFiles(),
  path.join(root, '404.html')
];

describe('精密索引全站样式契约', () => {
  test('每个公开 HTML 页面都加载合并后的 site.min.css（或旧版 precision-index.css）', () => {
    const missing = publicHtmlFiles()
      .filter((file) => {
        const html = fs.readFileSync(file, 'utf8');
        return !html.includes('assets/css/site.min.css') && !html.includes('assets/css/precision-index.css');
      })
      .map((file) => path.relative(root, file));

    expect(missing).toEqual([]);
  });

  test('公开页面不加载会注入固定底部导航的旧手机脚本', () => {
    const legacyScriptPages = publicHtmlFiles()
      .filter((file) => fs.readFileSync(file, 'utf8').includes('mobile-optimization.js'))
      .map((file) => path.relative(root, file));

    expect(legacyScriptPages).toEqual([]);
  });

  test('主题脚本可以作为普通 script 标签执行', () => {
    const themeScript = fs.readFileSync(path.join(root, 'assets/js/theme.js'), 'utf8');

    expect(themeScript).not.toMatch(/^\s*export\s+/m);
  });

  test('历史页面引用的 favicon.svg 存在', () => {
    expect(fs.existsSync(path.join(root, 'assets/icons/favicon.svg'))).toBe(true);
  });
});
