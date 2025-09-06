# 响应式设计原型与交互规范

## 响应式设计策略

### 设计理念
- **移动优先**: 从小屏幕开始设计，逐步增强
- **渐进增强**: 确保基础功能在所有设备上可用
- **性能优化**: 针对不同设备优化加载速度
- **用户体验**: 保持一致的用户体验

### 断点系统

#### 标准断点
```css
/* 移动端 */
@media (max-width: 639px) {
  /* 小型手机 */
}

/* 移动端 - 中型 */
@media (min-width: 640px) {
  /* 中型手机 */
}

/* 平板端 */
@media (min-width: 768px) {
  /* 平板设备 */
}

/* 桌面端 */
@media (min-width: 1024px) {
  /* 小型桌面 */
}

/* 大型桌面 */
@media (min-width: 1280px) {
  /* 标准桌面 */
}

/* 超大型桌面 */
@media (min-width: 1536px) {
  /* 大型桌面 */
}
```

#### 容器宽度
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
    padding: 0 24px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

## 页面布局响应式设计

### 主页面布局

#### 移动端 (< 768px)
```css
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-layout__header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.main-layout__main {
  flex: 1;
  padding: 24px 0;
}

.main-layout__footer {
  margin-top: auto;
}
```

#### 桌面端 (≥ 768px)
```css
@media (min-width: 768px) {
  .main-layout {
    /* 保持相同结构，但调整间距 */
  }
  
  .main-layout__main {
    padding: 48px 0;
  }
}
```

### 网格系统

#### 响应式网格
```css
.grid {
  display: grid;
  gap: 16px;
}

.grid-1 {
  grid-template-columns: 1fr;
}

.grid-2 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

.grid-3 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

.grid-4 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### 弹性布局

#### Flexbox 响应式
```css
.flex {
  display: flex;
  gap: 16px;
}

.flex-col {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

@media (min-width: 768px) {
  .flex-md-row {
    flex-direction: row;
  }
}
```

## 组件响应式设计

### 导航栏响应式

#### 移动端导航
```css
.navbar {
  padding: 12px 16px;
}

.navbar__brand {
  font-size: 1.125rem;
}

.navbar__nav {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--bg-primary);
  border-top: 1px solid var(--border-primary);
  padding: 16px;
  flex-direction: column;
  gap: 8px;
}

.navbar__nav.active {
  display: flex;
}

.navbar__mobile-toggle {
  display: block;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 24px;
  cursor: pointer;
}

@media (min-width: 768px) {
  .navbar {
    padding: 16px 24px;
  }
  
  .navbar__nav {
    display: flex;
    position: static;
    background-color: transparent;
    border-top: none;
    padding: 0;
    flex-direction: row;
    gap: 32px;
  }
  
  .navbar__mobile-toggle {
    display: none;
  }
}
```

### 按钮响应式

#### 按钮尺寸
```css
.btn {
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.875rem;
  border-radius: 6px;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 1.125rem;
  border-radius: 12px;
}

@media (max-width: 639px) {
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .btn-group {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn-group .btn {
    width: 100%;
  }
}
```

### 卡片响应式

#### 卡片布局
```css
.card {
  padding: 20px;
  border-radius: 12px;
}

@media (min-width: 768px) {
  .card {
    padding: 24px;
  }
}

.card-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 交互设计规范

### 动画原则

#### 动画时长
```css
/* 快速交互 */
.animation-fast {
  transition: all 0.15s ease;
}

/* 标准动画 */
.animation-normal {
  transition: all 0.3s ease;
}

/* 慢速动画 */
.animation-slow {
  transition: all 0.5s ease;
}
```

#### 缓动函数
```css
/* 标准缓动 */
.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 缓出 */
.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

/* 缓入 */
.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}
```

### 交互状态

#### 按钮状态
```css
.btn {
  /* 默认状态 */
  opacity: 1;
  transform: translateY(0);
}

.btn:hover {
  /* 悬停状态 */
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn:active {
  /* 按下状态 */
  opacity: 0.8;
  transform: translateY(0);
}

.btn:focus {
  /* 焦点状态 */
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:disabled {
  /* 禁用状态 */
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### 微交互

#### 复制按钮反馈
```css
.copy-btn {
  position: relative;
  overflow: hidden;
}

.copy-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.copy-btn:hover::before {
  left: 100%;
}

.copy-btn.copied {
  background-color: var(--color-success);
  animation: copy-pulse 0.6s ease;
}

@keyframes copy-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

#### 加载状态
```css
.loading {
  position: relative;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### 触摸优化

#### 触摸目标
```css
/* 确保触摸目标至少 44x44px */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 移动端优化 */
@media (hover: none) {
  .btn {
    /* 增加触摸区域 */
    min-height: 44px;
  }
  
  .nav-link {
    padding: 12px 16px;
  }
}
```

### 滚动行为

#### 平滑滚动
```css
html {
  scroll-behavior: smooth;
}

/* 禁用平滑滚动（如果用户偏好减少动画） */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

#### 滚动阴影
```css
.scroll-shadow {
  position: relative;
}

.scroll-shadow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scroll-shadow.scrolled::after {
  opacity: 1;
}
```

## 可访问性交互

#### 键盘导航
```css
/* 焦点样式 */
:focus {
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
  padding: 8px;
  text-decoration: none;
  border-radius: 0 0 4px 0;
}

.skip-link:focus {
  top: 0;
}
```

#### 屏幕阅读器优化
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
```

## 性能优化

#### 动画性能
```css
/* 使用 transform 和 opacity 进行动画 */
.animate-performance {
  will-change: transform, opacity;
  transform: translateZ(0);
}

/* 避免动画性能问题 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 图片优化
```css
/* 响应式图片 */
.responsive-img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* 懒加载占位符 */
.lazy-img {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## 测试与验证

#### 响应式测试清单
- [ ] 所有断点下的布局测试
- [ ] 触摸交互测试
- [ ] 键盘导航测试
- [ ] 屏幕阅读器测试
- [ ] 性能测试
- [ ] 跨浏览器兼容性测试

#### 交互测试用例
1. 按钮点击反馈
2. 表单输入验证
3. 模态框开关
4. 下拉菜单交互
5. 移动端手势支持
6. 复制功能反馈
7. 主题切换动画

---

*此响应式设计原型与交互规范确保了 The Invisible Character 在所有设备上都能提供一致、流畅的用户体验。*