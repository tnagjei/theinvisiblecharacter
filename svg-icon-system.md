# SVG图标系统与品牌视觉元素

## 图标设计原则

### 设计理念
- **简洁性**: 使用最少的线条表达含义
- **一致性**: 统一的线条粗细和圆角
- **识别性**: 清晰的视觉层次
- **可扩展性**: 适应不同尺寸
- **现代感**: 符合Apple设计语言

### 技术规范
- **线条粗细**: 2px (标准), 1.5px (小图标), 3px (大图标)
- **圆角**: 4px (标准圆角)
- **网格**: 24x24 网格系统
- **间距**: 2px 最小间距
- **颜色**: 支持主题色彩切换

## 品牌图标

### 主Logo
```svg
<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景圆 -->
  <circle cx="60" cy="60" r="58" fill="url(#gradient)" stroke="none"/>
  
  <!-- 隐形字符符号 -->
  <text x="60" y="70" font-family="monospace" font-size="48" font-weight="bold" text-anchor="middle" fill="white">
    &nbsp;
  </text>
  
  <!-- 装饰性边框 -->
  <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="5,5"/>
  
  <!-- 渐变定义 -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#007AFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5AC8FA;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>
```

### 简化Logo
```svg
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
  <text x="16" y="20" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle" fill="white">
    &nbsp;
  </text>
  
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#007AFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5AC8FA;stop-opacity:1" />
    </linearGradient>
  </defs>
</svg>
```

### 字符图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="12" y="16" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle" fill="currentColor">
    &nbsp;
  </text>
</svg>
```

## 功能图标

### 复制图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="9" y="9" width="13" height="13" rx="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 设置图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 1v6m0 6v6m-9-9h6m6 0h6m-2.3-6.3l-4.2 4.2m-3.4 3.4l-4.2 4.2m0-9.8l4.2 4.2m3.4 3.4l4.2 4.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 主题切换图标
```svg
<!-- 深色模式图标 -->
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<!-- 浅色模式图标 -->
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 1v6m0 6v6m-9-9h6m6 0h6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 搜索图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="11" cy="11" r="8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="m21 21-4.35-4.35" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 清除图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="m15 9-6 6m0-6 6 6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## 导航图标

### 首页图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="m3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 22V12h6v10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 博客图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 关于图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 16v-4m0-4h.01" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 联系图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="m22 6-10 7L2 6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## 社交媒体图标

### Twitter图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
</svg>
```

### GitHub图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
</svg>
```

### LinkedIn图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
  <circle cx="4" cy="4" r="2"/>
</svg>
```

### Email图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="m22 6-10 7L2 6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## 状态图标

### 成功图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="m22 4-12 12-4-4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 错误图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="m15 9-6 6m0-6 6 6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 警告图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="m10.29 3.86 1.28 2.6c.22.45.82.88 1.32.96l2.36.39c1.9.31 2.34 1.67 1 3.04l-1.83 1.83c-.39.39-.61 1.15-.49 1.69l.53 2.27c.52 2.23-.76 3.1-2.86 1.93l-2.21-1.31c-.5-.29-1.31-.29-1.81 0l-2.21 1.31c-2.08 1.17-3.38.3-2.86-1.93l.53-2.27c.12-.54-.1-1.3-.49-1.69l-1.83-1.83c-1.34-1.37-.92-2.73 1-3.04l2.36-.39c.49-.08 1.09-.51 1.31-.96l1.28-2.6c.82-1.68 2.16-1.68 2.99 0Z" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 信息图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 16v-4m0-4h.01" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## 操作图标

### 加载图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 下拉箭头
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 关闭图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="m18 6-12 12m0-12 12 12" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 菜单图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## 特殊图标

### 隐形字符图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="3" y="3" width="18" height="18" rx="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 12h8m-4-4v8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 2"/>
</svg>
```

### 空格字符图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="4" y="8" width="16" height="8" rx="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 2"/>
  <path d="M8 12h8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 制表符图标
```svg
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M3 12h18m-6-6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 2"/>
</svg>
```

## 图标系统CSS

### 图标基础样式
```css
.tic-icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: middle;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: all 0.2s ease;
}

.tic-icon-sm {
  width: 16px;
  height: 16px;
  stroke-width: 1.5;
}

.tic-icon-lg {
  width: 32px;
  height: 32px;
  stroke-width: 2.5;
}

.tic-icon-xl {
  width: 48px;
  height: 48px;
  stroke-width: 3;
}
```

### 图标按钮样式
```css
.tic-icon-btn {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.tic-icon-btn:hover {
  background-color: rgba(0, 122, 255, 0.1);
}

.tic-icon-btn:active {
  background-color: rgba(0, 122, 255, 0.2);
  transform: scale(0.95);
}

.tic-icon-btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 图标动画
```css
.tic-icon-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tic-icon-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.tic-icon-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}
```

## 图标使用规范

### 命名规范
- **格式**: `tic-icon-{name}`
- **描述性**: 使用有意义的名称
- **一致性**: 保持命名风格一致

### 尺寸规范
- **小**: 16x16px (用于紧凑空间)
- **标准**: 24x24px (默认尺寸)
- **大**: 32x32px (用于重要操作)
- **特大**: 48x48px (用于主要功能)

### 颜色规范
- **主要**: 使用 `currentColor` 继承父元素颜色
- **主题**: 支持深色/浅色主题切换
- **状态**: 根据状态使用不同颜色

### 使用示例
```html
<!-- 基础图标使用 -->
<svg class="tic-icon" viewBox="0 0 24 24">
  <!-- 图标路径 -->
</svg>

<!-- 图标按钮 -->
<button class="tic-icon-btn">
  <svg class="tic-icon" viewBox="0 0 24 24">
    <!-- 图标路径 -->
  </svg>
</button>

<!-- 带动画的图标 -->
<svg class="tic-icon tic-icon-spin" viewBox="0 0 24 24">
  <!-- 图标路径 -->
</svg>
```

---

*此SVG图标系统遵循现代设计原则，确保了 The Invisible Character 的视觉一致性和专业性。*