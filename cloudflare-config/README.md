# Cloudflare Pages 部署指南

## 配置文件说明

### 1. _headers 文件
用于设置HTTP响应头，包括：
- 安全头部（CSP、XSS保护等）
- 缓存策略
- 预加载指令
- SEO优化头部

**使用方法：**
1. 将文件放在项目根目录
2. Cloudflare Pages会自动识别并应用
3. 支持通配符匹配

### 2. _redirects 文件
用于设置URL重定向规则：
- 301永久重定向（SEO友好）
- 302临时重定向
- 404错误处理
- 语言重定向

**使用方法：**
```
# 格式：源路径 目标路径 状态码
/old-page /new-page 301
```

### 3. wrangler.toml (可选)
高级配置文件，用于：
- 环境变量设置
- 构建设置
- 函数路由
- 插件配置

## 部署步骤

### 1. 连接GitHub仓库
1. 登录Cloudflare Dashboard
2. 进入Pages栏目
3. 点击"Create a project"
4. 选择GitHub仓库
5. 授权Cloudflare访问

### 2. 配置构建设置
- **Build command**: 留空（静态网站）
- **Build output directory**: `/`
- **Root directory**: `/`（默认）

### 3. 设置环境变量（可选）
在Build settings中添加：
```
NODE_VERSION = 18
```

### 4. 部署配置
将以下文件复制到项目根目录：
- `cloudflare-config/_headers` → `/_headers`
- `cloudflare-config/_redirects` → `/_redirects`

### 5. 自动部署
设置完成后，每次推送到main分支会自动部署。

## 自定义域名配置

### 1. 添加域名
在Pages项目设置中：
1. 进入Custom domains
2. 添加 `theinvisiblecharacter.live`
3. 配置DNS记录（Cloudflare会自动提示）

### 2. DNS配置
```
Type: CNAME
Name: @
Target: your-pages-domain.pages.dev
Proxy: Enabled (orange cloud)
```

## 性能优化设置

### 1. 缓存级别
- **Standard**: 开发环境
- **Aggressive**: 生产环境（推荐）

### 2. 优化功能
- Auto Minify: 开启（CSS, JS, HTML）
- Brotli: 开启
- Early Hints: 开启

### 3. CDN设置
- Argo Smart Routing: 可选（付费）
- Image Optimization: 可选（付费）

## 监控与分析

### 1. Cloudflare Analytics
- 页面访问统计
- 性能指标
- 安全事件

### 2. 集成第三方分析
在`_headers`中添加：
```
/*
  Link: </assets/js/analytics.js>; rel=preload; as=script
```

## 回滚策略

### 1. 自动回滚
如果部署失败，Cloudflare会自动保留上一个版本。

### 2. 手动回滚
1. 进入项目Dashboard
2. 点击Deployments
3. 选择要回滚的版本
4. 点击Rollback

## 故障排除

### 1. 常见问题
- **404错误**: 检查`_redirects`文件
- **样式不加载**: 检查CSP策略
- **重定向循环**: 检查重定向规则

### 2. 调试方法
- 使用浏览器开发者工具检查网络请求
- 查看Cloudflare Pages构建日志
- 检查响应头部是否正确应用

## 最佳实践

1. **测试环境**: 使用预览分支进行测试
2. **生产部署**: 从main分支自动部署
3. **监控**: 设置构建失败通知
4. **备份**: 定期检查历史版本
5. **更新**: 定期更新依赖和配置

## 成本估算

- **Cloudflare Pages**: 完全免费
  - 100次构建/月
  - 无限带宽
  - 全球CDN
  - 自动SSL
- **域名**: .live域名约$20-30/年

这个配置确保了网站的高性能、安全性和SEO友好性。