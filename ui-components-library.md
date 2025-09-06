# UI组件库设计规范

## 组件设计原则

### 设计理念
- **简洁性**: 遵循 Apple 的设计语言，去除不必要的装饰
- **一致性**: 统一的视觉语言和交互模式
- **可访问性**: 符合 WCAG 2.1 标准
- **响应式**: 适配各种屏幕尺寸
- **性能**: 轻量级实现，快速渲染

### 命名规范
- **BEM 命名**: Block__Element--Modifier
- **语义化**: 使用有意义的类名
- **前缀**: 使用 `tic-` 前缀标识品牌组件

## 按钮组件

### 主要按钮 (Primary Button)
```css
.tic-btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.tic-btn-primary:hover {
  background-color: #0051D5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.tic-btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.2);
}

.tic-btn-primary:disabled {
  background-color: var(--color-disabled);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

### 次要按钮 (Secondary Button)
```css
.tic-btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tic-btn-secondary:hover {
  background-color: rgba(0, 122, 255, 0.1);
  transform: translateY(-1px);
}

.tic-btn-secondary:active {
  transform: translateY(0);
}

.tic-btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 文本按钮 (Text Button)
```css
.tic-btn-text {
  background-color: transparent;
  color: var(--color-primary);
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tic-btn-text:hover {
  background-color: rgba(0, 122, 255, 0.1);
}

.tic-btn-text:active {
  background-color: rgba(0, 122, 255, 0.2);
}
```

### 复制按钮 (Copy Button - 特色组件)
```css
.tic-btn-copy {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1.5;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
}

.tic-btn-copy::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.tic-btn-copy:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
}

.tic-btn-copy:hover::before {
  left: 100%;
}

.tic-btn-copy.copied {
  background: linear-gradient(135deg, var(--color-success) 0%, #30D158 100%);
  animation: copySuccess 0.6s ease;
}

@keyframes copySuccess {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

## 卡片组件

### 基础卡片 (Base Card)
```css
.tic-card {
  background-color: var(--bg-surface);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid var(--border-primary);
}

.tic-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.tic-card__header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-secondary);
}

.tic-card__body {
  margin-bottom: 16px;
}

.tic-card__footer {
  padding-top: 16px;
  border-top: 1px solid var(--border-secondary);
}
```

### 字符展示卡片 (Character Display Card)
```css
.tic-character-card {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-primary);
}

.tic-character-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 122, 255, 0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.tic-character-display {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: 16px;
  letter-spacing: 0.2em;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.tic-character-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
```

### 功能特性卡片 (Feature Card)
```css
.tic-feature-card {
  background-color: var(--bg-surface);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid var(--border-primary);
  height: 100%;
}

.tic-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.tic-feature-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.tic-feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.tic-feature-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
```

## 导航组件

### 导航栏 (Navigation Bar)
```css
.tic-navbar {
  background-color: var(--bg-primary);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.tic-navbar.scrolled {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tic-navbar__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.tic-navbar__brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.25rem;
}

.tic-navbar__logo {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.tic-navbar__nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.tic-navbar__link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;
}

.tic-navbar__link:hover {
  color: var(--text-primary);
}

.tic-navbar__link.active {
  color: var(--color-primary);
}

.tic-navbar__link.active::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: var(--color-primary);
  border-radius: 2px;
}

.tic-navbar__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 移动端导航 */
.tic-navbar__mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 24px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .tic-navbar__mobile-toggle {
    display: block;
  }
  
  .tic-navbar__nav {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background-color: var(--bg-primary);
    border-top: 1px solid var(--border-primary);
    flex-direction: column;
    padding: 16px 0;
    gap: 16px;
  }
  
  .tic-navbar__nav.active {
    display: flex;
  }
}
```

### 页脚 (Footer)
```css
.tic-footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
  padding: 48px 0 32px;
  margin-top: 64px;
}

.tic-footer__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.tic-footer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.tic-footer__section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.tic-footer__links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tic-footer__links li {
  margin-bottom: 8px;
}

.tic-footer__links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.tic-footer__links a:hover {
  color: var(--text-primary);
}

.tic-footer__social {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.tic-footer__social a {
  width: 40px;
  height: 40px;
  background-color: var(--bg-surface);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.tic-footer__social a:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.tic-footer__bottom {
  border-top: 1px solid var(--border-secondary);
  padding-top: 32px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.875rem;
}
```

## 表单组件

### 输入框 (Input)
```css
.tic-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.tic-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.tic-input::placeholder {
  color: var(--text-tertiary);
}

.tic-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tic-input.error {
  border-color: var(--color-error);
}

.tic-input.error:focus {
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
}
```

### 搜索框 (Search Input)
```css
.tic-search {
  position: relative;
}

.tic-search__input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.tic-search__icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
}

.tic-search__clear {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.tic-search__clear:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}
```

## 模态框组件

### 基础模态框 (Modal)
```css
.tic-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.tic-modal.active {
  opacity: 1;
  visibility: visible;
}

.tic-modal__content {
  background-color: var(--bg-surface);
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.tic-modal.active .tic-modal__content {
  transform: scale(1);
}

.tic-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.tic-modal__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tic-modal__close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.tic-modal__close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}

.tic-modal__body {
  margin-bottom: 24px;
}

.tic-modal__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
```

## 通知组件

### Toast 通知
```css
.tic-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: var(--bg-surface);
  border-radius: 8px;
  padding: 16px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  transform: translateX(400px);
  transition: transform 0.3s ease;
  z-index: 3000;
}

.tic-toast.show {
  transform: translateX(0);
}

.tic-toast__icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tic-toast__icon.success {
  background-color: var(--color-success);
  color: white;
}

.tic-toast__icon.error {
  background-color: var(--color-error);
  color: white;
}

.tic-toast__icon.info {
  background-color: var(--color-info);
  color: white;
}

.tic-toast__content {
  flex: 1;
}

.tic-toast__title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.tic-toast__message {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.tic-toast__close {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.tic-toast__close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}
```

## 加载组件

### 加载器 (Loader)
```css
.tic-loader {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-primary);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.tic-loader__container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.tic-loader__text {
  margin-left: 12px;
  color: var(--text-secondary);
}
```

## 布局组件

### 容器 (Container)
```css
.tic-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.tic-container-sm {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.tic-container-lg {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### 网格系统 (Grid)
```css
.tic-grid {
  display: grid;
  gap: 24px;
}

.tic-grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.tic-grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.tic-grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 768px) {
  .tic-grid-2,
  .tic-grid-3,
  .tic-grid-4 {
    grid-template-columns: 1fr;
  }
}
```

---

*此UI组件库设计遵循 Apple 的设计语言，确保了现代、简洁、专业的视觉效果。所有组件都支持深色/浅色主题切换。*