# The Invisible Character - Cloudflare Pages 部署清单

## 部署前检查

### 1. 文件结构确认
- [ ] 根目录包含 `index.html`
- [ ] 根目录包含 `_headers` 文件
- [ ] 根目录包含 `_redirects` 文件
- [ ] `assets/` 目录包含所有静态资源
- [ ] `blog/` 目录包含博客文章（如有）
- [ ] `pages/` 目录包含静态页面
- [ ] `sitemap.xml` 已创建
- [ ] `robots.txt` 已创建
- [ ] `404.html` 错误页面已创建

### 2. SEO优化检查
- [ ] 每个页面都有唯一的 `<title>` (50-60字符)
- [ ] 每个页面都有 `<meta name="description">` (140-160字符)
- [ ] 包含 Open Graph 标签
- [ ] 包含 Twitter Card 标签
- [ ] 每个页面都有 `<link rel="canonical">`
- [ ] 结构化数据已添加
- [ ] 图片都有 `alt` 属性
- [ ] H1标签唯一且包含关键词

### 3. 性能优化检查
- [ ] 图片使用 WebP 格式（可选）
- [ ] JavaScript 异步加载
- [ ] CSS 在 `<head>` 中
- [ ] 使用 CDN 资源
- [ ] 启用 Gzip/Brotli 压缩
- [ ] 设置适当的缓存策略

### 4. 安全检查
- [ ] CSP 策略已配置
- [ ] XSS 保护已启用
- [ ] HTTPS 强制跳转
- [ ] 敏感信息未提交到仓库

## Cloudflare Pages 配置

### 1. 连接 GitHub
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 导航到 Pages
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 选择 GitHub 仓库
6. 授权 Cloudflare

### 2. 构建设置
```
Build command: (留空)
Build output directory: /
Root directory: / (默认)
```

### 3. 环境变量（可选）
```
NODE_VERSION: 18
```

### 4. 部署配置
- Production branch: `main`
- 自动部署: ✅ 启用

## 域名配置

### 1. 自定义域名
1. 在 Pages 项目设置中
2. 进入 "Custom domains"
3. 添加 `theinvisiblecharacter.live`
4. 按照提示配置 DNS

### 2. DNS 记录
```
Type: CNAME
Name: @
Value: pages-dev-alias.pages.dev
Proxy: Enabled (橙色云朵)
TTL: Auto
```

## 部署后验证

### 1. 功能测试
- [ ] 首页正常加载
- [ ] 复制功能正常工作
- [ ] 移动端适配正常
- [ ] 所有页面链接有效
- [ ] 表单提交正常（如有）
- [ ] 多语言切换正常

### 2. SEO 验证
- [ ] 使用 Google Search Console 验证网站
- [ ] 提交 sitemap.xml
- [ ] 检查 robots.txt 是否可访问
- [ ] 验证结构化数据（使用 [Rich Results Test](https://search.google.com/test/rich-results)）

### 3. 性能测试
- [ ] 使用 [PageSpeed Insights](https://pagespeed.web.dev/) 测试
  - 目标：移动端 > 70分
  - 目标：桌面端 > 90分
- [ ] 检查 Core Web Vitals
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

### 4. 安全测试
- [ ] 使用 [Security Headers](https://securityheaders.com/) 检查
- [ ] 验证 CSP 策略
- [ ] 检查 HTTPS 证书

## 监控与维护

### 1. 设置监控
- [ ] Cloudflare Analytics
- [ ] Google Analytics 4（可选）
- [ ] Uptime 监控（可选）

### 2. 定期任务
- [ ] 每周检查 SEO 排名
- [ ] 每月更新内容
- [ ] 季度审查性能指标
- [ ] 及时更新依赖

## 故障排除

### 常见问题

1. **页面不显示**
   - 检查 `_headers` 文件语法
   - 验证文件路径

2. **重定向不工作**
   - 检查 `_redirects` 文件格式
   - 确认路径正确

3. **样式不加载**
   - 检查 CSP 策略
   - 验证 CSS 文件路径

4. **构建失败**
   - 查看 Cloudflare 构建日志
   - 检查文件语法错误

### 联系支持
- Cloudflare Pages 文档: https://developers.cloudflare.com/pages/
- Cloudflare 社区: https://community.cloudflare.com/

## 回滚计划

如果出现问题：
1. 在 Cloudflare Dashboard 中
2. 进入项目 → Deployments
3. 选择之前的版本
4. 点击 "Rollback"

## 备份策略

- GitHub 仓库包含所有源代码
- 定期导出 Cloudflare 配置
- 保存数据库备份（如有）

---

**最后更新**: 2025-01-06
**版本**: 1.0