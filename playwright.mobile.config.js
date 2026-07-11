// input: 本机或 GitHub Actions 已安装的 Google Chrome 与静态 HTML 源文件。
// output: 仅运行 SEO 手机冒烟测试，不下载或启动六浏览器矩阵。
// pos: 轻量移动端检查配置（更新规则：检查范围变化时同步 package.json 与工作流 README）。

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  testMatch: 'seo-mobile-smoke.spec.js',
  fullyParallel: false,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:8080',
    browserName: 'chromium',
    channel: 'chrome',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'python3 -m http.server 8080 --bind 127.0.0.1',
    port: 8080,
    reuseExistingServer: !process.env.CI
  }
});
