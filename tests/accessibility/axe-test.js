const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const path = require('path');

async function runAccessibilityTest(url, pageName) {
  console.log(`🔍 开始可访问性测试: ${pageName} - ${url}`);
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    
    // 运行axe测试
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // 分析结果
    const report = {
      pageName: pageName,
      url: url,
      timestamp: new Date().toISOString(),
      summary: {
        violations: results.violations.length,
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        inapplicable: results.inapplicable.length
      },
      violations: results.violations.map(violation => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        tags: violation.tags,
        nodes: violation.nodes.map(node => ({
          html: node.html,
          target: node.target,
          failureSummary: node.failureSummary
        }))
      })),
      passes: results.passes.map(pass => ({
        id: pass.id,
        description: pass.description,
        help: pass.help,
        helpUrl: pass.helpUrl,
        tags: pass.tags
      }))
    };
    
    return report;
  } catch (error) {
    console.error('可访问性测试失败:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function testAllPages() {
  const pages = [
    { url: 'http://localhost:8080/', name: '主页' },
    { url: 'http://localhost:8080/about.html', name: '关于页面' },
    { url: 'http://localhost:8080/help.html', name: '帮助页面' },
    { url: 'http://localhost:8080/tools.html', name: '工具页面' },
    { url: 'http://localhost:8080/blog/', name: '博客主页' },
    { url: 'http://localhost:8080/index-fr.html', name: '法语主页' }
  ];
  
  const results = {
    testDate: new Date().toISOString(),
    pages: {}
  };
  
  for (const page of pages) {
    try {
      console.log(`\n🔍 测试 ${page.name}...`);
      const report = await runAccessibilityTest(page.url, page.name);
      results.pages[page.name] = report;
      
      // 打印结果摘要
      console.log(`违规数量: ${report.summary.violations}`);
      console.log(`通过数量: ${report.summary.passes}`);
      console.log(`不完整数量: ${report.summary.incomplete}`);
      
      if (report.summary.violations > 0) {
        console.log('⚠️ 发现违规:');
        report.violations.forEach(violation => {
          console.log(`  • ${violation.id} (${violation.impact}): ${violation.description}`);
          console.log(`    影响: ${violation.nodes.length} 个元素`);
        });
      }
      
    } catch (error) {
      console.error(`❌ ${page.name} 测试失败:`, error.message);
      results.pages[page.name] = { error: error.message };
    }
  }
  
  // 保存完整报告
  const reportPath = path.join(__dirname, '../../accessibility-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 完整可访问性报告已保存到: ${reportPath}`);
  
  // 生成总结
  generateAccessibilitySummary(results);
  
  return results;
}

function generateAccessibilitySummary(results) {
  const summary = {
    testDate: results.testDate,
    totalPages: Object.keys(results.pages).length,
    passedPages: 0,
    failedPages: 0,
    totalViolations: 0,
    violationsByImpact: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
    },
    commonViolations: {},
    recommendations: []
  };
  
  Object.entries(results.pages).forEach(([pageName, pageData]) => {
    if (pageData.error) {
      summary.failedPages++;
      summary.recommendations.push(`${pageName}: 测试失败 - ${pageData.error}`);
    } else {
      if (pageData.summary.violations === 0) {
        summary.passedPages++;
      } else {
        summary.failedPages++;
        summary.totalViolations += pageData.summary.violations;
        
        // 统计违规影响级别
        pageData.violations.forEach(violation => {
          const impact = violation.impact;
          if (summary.violationsByImpact[impact]) {
            summary.violationsByImpact[impact]++;
          } else {
            summary.violationsByImpact[impact] = 1;
          }
          
          // 统计常见违规
          if (summary.commonViolations[violation.id]) {
            summary.commonViolations[violation.id]++;
          } else {
            summary.commonViolations[violation.id] = 1;
          }
        });
      }
    }
  });
  
  // 生成建议
  if (summary.violationsByImpact.critical > 0) {
    summary.recommendations.push(`发现 ${summary.violationsByImpact.critical} 个严重违规，需要立即修复`);
  }
  
  if (summary.violationsByImpact.serious > 0) {
    summary.recommendations.push(`发现 ${summary.violationsByImpact.serious} 个重要违规，建议尽快修复`);
  }
  
  // 常见违规建议
  const topViolations = Object.entries(summary.commonViolations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  topViolations.forEach(([violationId, count]) => {
    summary.recommendations.push(`${violationId}: 在 ${count} 个页面中发现，建议优先修复`);
  });
  
  // 保存总结报告
  const summaryPath = path.join(__dirname, '../../accessibility-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  // 打印总结
  console.log('\n🔍 可访问性测试总结');
  console.log('='.repeat(50));
  console.log(`测试页面总数: ${summary.totalPages}`);
  console.log(`通过测试: ${summary.passedPages}`);
  console.log(`失败测试: ${summary.failedPages}`);
  console.log(`总违规数: ${summary.totalViolations}`);
  console.log('\n违规影响级别分布:');
  Object.entries(summary.violationsByImpact).forEach(([impact, count]) => {
    console.log(`  ${impact}: ${count}`);
  });
  
  if (topViolations.length > 0) {
    console.log('\n🔍 最常见违规:');
    topViolations.forEach(([violationId, count]) => {
      console.log(`  ${violationId}: ${count} 次出现`);
    });
  }
  
  if (summary.recommendations.length > 0) {
    console.log('\n🔧 修复建议:');
    summary.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }
  
  console.log(`\n📄 总结报告已保存到: ${summaryPath}`);
}

// 键盘导航测试
async function testKeyboardNavigation(url, pageName) {
  console.log(`⌨️ 测试键盘导航: ${pageName}`);
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    
    const results = {
      pageName: pageName,
      url: url,
      timestamp: new Date().toISOString(),
      keyboardNavigation: {
        tabOrder: [],
        focusableElements: 0,
        missingFocusIndicators: [],
        skippedElements: []
      },
      skipLinks: {
        present: false,
        functional: false
      },
      landmarks: {
        present: false,
        complete: false
      }
    };
    
    // 检查跳过链接
    const skipLink = await page.$('a[href^="#main"], a[href="#main-content"]');
    if (skipLink) {
      results.skipLinks.present = true;
      
      // 测试跳过链接功能
      await skipLink.click();
      const mainContent = await page.$('#main, #main-content, main');
      if (mainContent) {
        results.skipLinks.functional = true;
      }
    }
    
    // 检查地标
    const landmarks = await page.$$(['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'].join(','));
    if (landmarks.length > 0) {
      results.landmarks.present = true;
      
      const hasMain = await page.$('main');
      const hasNav = await page.$('nav');
      const hasHeader = await page.$('header');
      const hasFooter = await page.$('footer');
      
      if (hasMain && hasNav && hasHeader && hasFooter) {
        results.landmarks.complete = true;
      }
    }
    
    // 测试Tab键导航
    const focusableElements = await page.$$([
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(','));
    
    results.keyboardNavigation.focusableElements = focusableElements.length;
    
    // 测试Tab键顺序
    let tabCount = 0;
    let currentElement = null;
    let previousElements = new Set();
    
    while (tabCount < 100) { // 防止无限循环
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      const focusedElement = await page.evaluate(() => {
        const activeElement = document.activeElement;
        return activeElement ? {
          tagName: activeElement.tagName,
          id: activeElement.id,
          className: activeElement.className,
          textContent: activeElement.textContent?.substring(0, 50)
        } : null;
      });
      
      if (!focusedElement) break;
      
      const elementKey = `${focusedElement.tagName}-${focusedElement.id || focusedElement.className}`;
      
      // 检查是否重复（循环）
      if (previousElements.has(elementKey)) {
        break;
      }
      
      previousElements.add(elementKey);
      results.keyboardNavigation.tabOrder.push(focusedElement);
      tabCount++;
    }
    
    // 检查焦点指示器
    for (const element of focusableElements) {
      const hasFocusStyle = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || 
               styles.boxShadow !== 'none' || 
               styles.border !== 'none' ||
               el.hasAttribute('tabindex');
      });
      
      if (!hasFocusStyle) {
        const elementInfo = await element.evaluate((el) => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className
        }));
        results.keyboardNavigation.missingFocusIndicators.push(elementInfo);
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('键盘导航测试失败:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testAllPages().catch(console.error);
}

module.exports = { 
  runAccessibilityTest, 
  testAllPages, 
  testKeyboardNavigation 
};