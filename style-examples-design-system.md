# 样式示例与设计系统文档

## 设计系统概览

### 核心原则
- **简洁优雅**: 遵循 Apple 设计语言
- **一致性**: 统一的视觉语言
- **可访问性**: 符合 WCAG 2.1 标准
- **响应式**: 移动优先设计
- **性能**: 轻量级实现

### 技术栈
- **CSS 框架**: Tailwind CSS
- **图标**: SVG 图标系统
- **动画**: CSS 动画和过渡
- **主题**: CSS 变量实现深色/浅色主题

## CSS 变量系统

### 根变量定义
```css
:root {
  /* 颜色变量 */
  --color-primary: #007AFF;
  --color-secondary: #5AC8FA;
  --color-accent: #FF3B30;
  --color-success: #34C759;
  --color-warning: #FF9500;
  --color-info: #5856D6;
  --color-error: #FF3B30;
  
  /* 浅色主题 */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F2F2F7;
  --bg-tertiary: #E5E5EA;
  --bg-surface: #FFFFFF;
  
  --text-primary: #000000;
  --text-secondary: #3C3C43;
  --text-tertiary: #8E8E93;
  --text-disabled: #C7C7CC;
  
  --border-primary: #C6C6C8;
  --border-secondary: #D1D1D6;
  --border-tertiary: #E5E5EA;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* 动画 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}

/* 深色主题 */
.dark {
  --bg-primary: #000000;
  --bg-secondary: #1C1C1E;
  --bg-tertiary: #2C2C2E;
  --bg-surface: #3A3A3C;
  
  --text-primary: #FFFFFF;
  --text-secondary: #EBEBF5;
  --text-tertiary: #8E8E93;
  --text-disabled: #636366;
  
  --border-primary: #38383A;
  --border-secondary: #48484A;
  --border-tertiary: #545458;
}
```

## 实用工具类

### 间距工具
```css
/* 内边距 */
.p-xs { padding: var(--spacing-xs); }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }
.p-2xl { padding: var(--spacing-2xl); }

/* 外边距 */
.m-xs { margin: var(--spacing-xs); }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }
.m-xl { margin: var(--spacing-xl); }
.m-2xl { margin: var(--spacing-2xl); }

/* 方向性间距 */
.mt-sm { margin-top: var(--spacing-sm); }
.mb-sm { margin-bottom: var(--spacing-sm); }
.ml-sm { margin-left: var(--spacing-sm); }
.mr-sm { margin-right: var(--spacing-sm); }

.pt-sm { padding-top: var(--spacing-sm); }
.pb-sm { padding-bottom: var(--spacing-sm); }
.pl-sm { padding-left: var(--spacing-sm); }
.pr-sm { padding-right: var(--spacing-sm); }
```

### 颜色工具
```css
/* 文字颜色 */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }
.text-disabled { color: var(--text-disabled); }

/* 主题颜色 */
.text-blue { color: var(--color-primary); }
.text-green { color: var(--color-success); }
.text-orange { color: var(--color-warning); }
.text-red { color: var(--color-error); }
.text-purple { color: var(--color-info); }

/* 背景颜色 */
.bg-primary { background-color: var(--bg-primary); }
.bg-secondary { background-color: var(--bg-secondary); }
.bg-tertiary { background-color: var(--bg-tertiary); }
.bg-surface { background-color: var(--bg-surface); }
```

### 布局工具
```css
/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.container-sm {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.container-lg {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* 网格 */
.grid {
  display: grid;
  gap: var(--spacing-md);
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Flexbox */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.gap-lg { gap: var(--spacing-lg); }
```

### 动画工具
```css
/* 过渡 */
.transition-fast {
  transition: all var(--transition-fast);
}

.transition-normal {
  transition: all var(--transition-normal);
}

.transition-slow {
  transition: all var(--transition-slow);
}

/* 悬停效果 */
.hover-scale:hover {
  transform: scale(1.05);
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(0, 122, 255, 0.3);
}
```

## 组件样式示例

### 按钮样式
```css
.btn {
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5;
  border: none;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: #0051D5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn-secondary:hover {
  background-color: rgba(0, 122, 255, 0.1);
}

.btn-lg {
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: 1.125rem;
  border-radius: var(--radius-lg);
}

.btn-sm {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.875rem;
  border-radius: var(--radius-sm);
}

.btn-icon {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### 卡片样式
```css
.card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-primary);
  transition: all var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-secondary);
}

.card-body {
  margin-bottom: var(--spacing-md);
}

.card-footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-secondary);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.card-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}
```

### 输入框样式
```css
.input {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-size: 1rem;
  line-height: 1.5;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  transition: all var(--transition-normal);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input.error {
  border-color: var(--color-error);
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
}
```

### 导航样式
```css
.nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  position: relative;
}

.nav-link:hover {
  color: var(--text-primary);
  background-color: rgba(0, 122, 255, 0.1);
}

.nav-link.active {
  color: var(--color-primary);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background-color: var(--color-primary);
  border-radius: 2px;
}
```

## 页面布局示例

### 主页面布局
```css
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.main {
  flex: 1;
  padding: var(--spacing-2xl) 0;
}

.footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
  padding: var(--spacing-2xl) 0;
  margin-top: auto;
}
```

### 英雄区域
```css
.hero {
  text-align: center;
  padding: var(--spacing-3xl) 0;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-2xl);
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 300px;
  }
}
```

### 功能展示区域
```css
.features {
  padding: var(--spacing-2xl) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  background-color: var(--bg-surface);
  border: 1px solid var(--border-primary);
  transition: all var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
}
```

## 响应式设计

### 移动端优化
```css
@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-md);
  }
  
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
  
  .hero {
    padding: var(--spacing-xl) 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .nav {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .nav-link {
    width: 100%;
    text-align: center;
  }
}
```

### 平板端优化
```css
@media (min-width: 769px) and (max-width: 1024px) {
  .container {
    padding: 0 var(--spacing-lg);
  }
  
  .grid-3,
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
}
```

### 桌面端优化
```css
@media (min-width: 1025px) {
  .hero-title {
    font-size: 3.5rem;
  }
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 主题切换实现

### 主题切换按钮
```css
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  transition: all var(--transition-normal);
}

.theme-toggle:hover {
  background-color: rgba(0, 122, 255, 0.1);
}

.theme-toggle svg {
  width: 20px;
  height: 20px;
}
```

### 主题切换JavaScript
```javascript
// 主题切换功能
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// 检查本地存储中的主题设置
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  html.classList.toggle('dark', savedTheme === 'dark');
} else {
  // 如果没有保存的主题，使用系统偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  html.classList.toggle('dark', prefersDark);
}

// 主题切换事件
themeToggle.addEventListener('click', () => {
  const isDark = html.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // 更新图标
  const icon = themeToggle.querySelector('svg');
  if (isDark) {
    icon.innerHTML = '<circle cx="12" cy="12" r="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 1v6m0 6v6m-9-9h6m6 0h6" stroke-linecap="round" stroke-linejoin="round"/>';
  } else {
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke-linecap="round" stroke-linejoin="round"/>';
  }
});

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    html.classList.toggle('dark', e.matches);
  }
});
```

## 性能优化

### CSS优化
```css
/* 使用 will-change 优化动画性能 */
.animate-performance {
  will-change: transform, opacity;
  transform: translateZ(0);
}

/* 减少重绘和重排 */
.hardware-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* 优化滚动性能 */
.smooth-scroll {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  .smooth-scroll {
    scroll-behavior: auto;
  }
}
```

### 图片优化
```css
/* 懒加载图片 */
.lazy-image {
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.lazy-image.loaded {
  opacity: 1;
}

/* 图片占位符 */
.image-placeholder {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## 可访问性优化

### 焦点样式
```css
/* 改进的焦点样式 */
:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 跳过导航链接 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-sm);
  text-decoration: none;
  border-radius: 0 0 var(--radius-sm) 0;
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}
```

### 屏幕阅读器支持
```css
/* 隐藏视觉元素但保持屏幕阅读器可访问 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 改善高对比度模式 */
@media (prefers-contrast: high) {
  :root {
    --color-primary: #0066CC;
    --color-secondary: #0099FF;
  }
}
```

---

*此样式示例与设计系统文档为 The Invisible Character 项目提供了完整的实现指导，确保了设计的一致性和代码的可维护性。*