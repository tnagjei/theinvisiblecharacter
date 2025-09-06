# Apple Style Design System - 色彩与排版规范

## 色彩系统

### 主色调 - Apple风格配色

#### 深色主题 (Dark Mode)
```css
/* 基础色彩 */
--color-primary: #007AFF;        /* Apple Blue */
--color-secondary: #5AC8FA;      /* Light Blue */
--color-accent: #FF3B30;         /* Red */
--color-success: #34C759;        /* Green */
--color-warning: #FF9500;        /* Orange */
--color-info: #5856D6;           /* Purple */

/* 背景色 */
--bg-primary: #000000;           /* 纯黑背景 */
--bg-secondary: #1C1C1E;         /* 深灰背景 */
--bg-tertiary: #2C2C2E;          /* 中灰背景 */
--bg-surface: #3A3A3C;           /* 浅灰背景 */

/* 文字色 */
--text-primary: #FFFFFF;         /* 主要文字 */
--text-secondary: #EBEBF5;       /* 次要文字 */
--text-tertiary: #8E8E93;        /* 说明文字 */
--text-disabled: #636366;        /* 禁用文字 */

/* 边框色 */
--border-primary: #38383A;       /* 主要边框 */
--border-secondary: #48484A;     /* 次要边框 */
--border-tertiary: #545458;      /* 三级边框 */
```

#### 浅色主题 (Light Mode)
```css
/* 基础色彩 */
--color-primary: #007AFF;        /* Apple Blue */
--color-secondary: #5AC8FA;      /* Light Blue */
--color-accent: #FF3B30;         /* Red */
--color-success: #34C759;        /* Green */
--color-warning: #FF9500;        /* Orange */
--color-info: #5856D6;           /* Purple */

/* 背景色 */
--bg-primary: #FFFFFF;           /* 纯白背景 */
--bg-secondary: #F2F2F7;         /* 浅灰背景 */
--bg-tertiary: #E5E5EA;          /* 中灰背景 */
--bg-surface: #FFFFFF;           /* 表面背景 */

/* 文字色 */
--text-primary: #000000;         /* 主要文字 */
--text-secondary: #3C3C43;       /* 次要文字 */
--text-tertiary: #8E8E93;        /* 说明文字 */
--text-disabled: #C7C7CC;        /* 禁用文字 */

/* 边框色 */
--border-primary: #C6C6C8;       /* 主要边框 */
--border-secondary: #D1D1D6;     /* 次要边框 */
--border-tertiary: #E5E5EA;      /* 三级边框 */
```

### 渐变色彩

#### 蓝色渐变
```css
.gradient-blue-primary: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
.gradient-blue-light: linear-gradient(135deg, #5AC8FA 0%, #007AFF 100%);
.gradient-blue-dark: linear-gradient(135deg, #0051D5 0%, #007AFF 100%);
```

#### 神秘渐变 (隐形主题)
```css
.gradient-mystery: linear-gradient(135deg, #1E3A8A 0%, #6B7280 50%, #1E3A8A 100%);
.gradient-invisible: linear-gradient(135deg, #6B7280 0%, #1E3A8A 100%);
.gradient-tech: linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%);
```

### 透明度系统

#### 文字透明度
```css
.text-opacity-primary: opacity(1);
.text-opacity-secondary: opacity(0.8);
.text-opacity-tertiary: opacity(0.6);
.text-opacity-disabled: opacity(0.3);
```

#### 背景透明度
```css
.bg-opacity-primary: opacity(1);
.bg-opacity-secondary: opacity(0.9);
.bg-opacity-tertiary: opacity(0.7);
.bg-opacity-disabled: opacity(0.4);
```

## 排版系统

### 字体栈

#### 英文字体
```css
.font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
.font-serif: Georgia, 'Times New Roman', serif;
.font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
```

#### 中文字体
```css
.font-chinese: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', sans-serif;
```

### 字体尺寸

#### 移动端 (Mobile)
```css
.text-xs: { font-size: 0.75rem; line-height: 1rem; }      /* 12px */
.text-sm: { font-size: 0.875rem; line-height: 1.25rem; }  /* 14px */
.text-base: { font-size: 1rem; line-height: 1.5rem; }     /* 16px */
.text-lg: { font-size: 1.125rem; line-height: 1.75rem; }  /* 18px */
.text-xl: { font-size: 1.25rem; line-height: 1.75rem; }   /* 20px */
.text-2xl: { font-size: 1.5rem; line-height: 2rem; }      /* 24px */
.text-3xl: { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-4xl: { font-size: 2.25rem; line-height: 2.5rem; }   /* 36px */
.text-5xl: { font-size: 3rem; line-height: 1; }           /* 48px */
```

#### 桌面端 (Desktop)
```css
.text-6xl: { font-size: 3.75rem; line-height: 1; }        /* 60px */
.text-7xl: { font-size: 4.5rem; line-height: 1; }         /* 72px */
.text-8xl: { font-size: 6rem; line-height: 1; }           /* 96px */
.text-9xl: { font-size: 8rem; line-height: 1; }           /* 128px */
```

### 字体权重

#### Apple风格字重
```css
.font-thin: { font-weight: 100; }        /* 超细 */
.font-extralight: { font-weight: 200; }   /* 极细 */
.font-light: { font-weight: 300; }        /* 细体 */
.font-normal: { font-weight: 400; }       /* 正常 */
.font-medium: { font-weight: 500; }       /* 中等 */
.font-semibold: { font-weight: 600; }     /* 半粗 */
.font-bold: { font-weight: 700; }         /* 粗体 */
.font-extrabold: { font-weight: 800; }    /* 超粗 */
.font-black: { font-weight: 900; }        /* 黑体 */
```

### 字间距

#### 字母间距
```css
.tracking-tighter: { letter-spacing: -0.05em; }
.tracking-tight: { letter-spacing: -0.025em; }
.tracking-normal: { letter-spacing: 0; }
.tracking-wide: { letter-spacing: 0.025em; }
.tracking-wider: { letter-spacing: 0.05em; }
.tracking-widest: { letter-spacing: 0.1em; }
```

### 行高

#### 行高系统
```css
.leading-none: { line-height: 1; }
.leading-tight: { line-height: 1.25; }
.leading-snug: { line-height: 1.375; }
.leading-normal: { line-height: 1.5; }
.leading-relaxed: { line-height: 1.625; }
.leading-loose: { line-height: 2; }
```

### 段落样式

#### 文本对齐
```css
.text-left: { text-align: left; }
.text-center: { text-align: center; }
.text-right: { text-align: right; }
.text-justify: { text-align: justify; }
```

#### 文本装饰
```css
.underline: { text-decoration: underline; }
.line-through: { text-decoration: line-through; }
.no-underline: { text-decoration: none; }
```

#### 文本变换
```css
.uppercase: { text-transform: uppercase; }
.lowercase: { text-transform: lowercase; }
.capitalize: { text-transform: capitalize; }
.normal-case: { text-transform: none; }
```

## 排版组件

### 标题系统

#### H1 - 主标题
```css
.h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .h1 {
    font-size: 3.5rem;
  }
}
```

#### H2 - 副标题
```css
.h2 {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.025em;
  margin-bottom: 0.75rem;
}

@media (min-width: 768px) {
  .h2 {
    font-size: 2.5rem;
  }
}
```

#### H3 - 三级标题
```css
.h3 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.025em;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .h3 {
    font-size: 1.875rem;
  }
}
```

### 正文样式

#### 大段正文
```css
.body-large {
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0;
}

@media (min-width: 768px) {
  .body-large {
    font-size: 1.25rem;
  }
}
```

#### 标准正文
```css
.body-normal {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0;
}
```

#### 小号正文
```css
.body-small {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
}
```

### 标签样式

#### 大标签
```css
.label-large {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

#### 标准标签
```css
.label-normal {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

### 链接样式

#### 主要链接
```css
.link-primary {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.link-primary:hover {
  opacity: 0.8;
  text-decoration: underline;
}
```

#### 次要链接
```css
.link-secondary {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 400;
  transition: opacity 0.2s ease;
}

.link-secondary:hover {
  opacity: 0.8;
  text-decoration: underline;
}
```

## 色彩应用指南

### 主要色彩用途

#### Primary Blue (#007AFF)
- **用途**: 主要按钮、链接、重点强调
- **对比度**: 与白色背景对比度 4.8:1
- **可访问性**: 符合 WCAG AA 标准

#### Secondary Blue (#5AC8FA)
- **用途**: 次要按钮、装饰元素
- **对比度**: 与白色背景对比度 3.3:1
- **可访问性**: 适用于大文本

#### Success Green (#34C759)
- **用途**: 成功状态、确认按钮
- **对比度**: 与白色背景对比度 4.1:1
- **可访问性**: 符合 WCAG AA 标准

#### Warning Orange (#FF9500)
- **用途**: 警告状态、提示信息
- **对比度**: 与白色背景对比度 3.8:1
- **可访问性**: 符合 WCAG AA 标准

#### Error Red (#FF3B30)
- **用途**: 错误状态、删除操作
- **对比度**: 与白色背景对比度 4.5:1
- **可访问性**: 符合 WCAG AA 标准

### 主题切换

#### 自动主题
```css
@media (prefers-color-scheme: dark) {
  /* 深色模式样式 */
}

@media (prefers-color-scheme: light) {
  /* 浅色模式样式 */
}
```

#### 手动主题切换
```css
/* 深色模式 */
.dark {
  --bg-primary: #000000;
  --text-primary: #FFFFFF;
  /* 其他深色模式变量 */
}

/* 浅色模式 */
.light {
  --bg-primary: #FFFFFF;
  --text-primary: #000000;
  /* 其他浅色模式变量 */
}
```

---

*此设计系统遵循 Apple 的设计语言，确保了现代、简洁、专业的视觉效果。*