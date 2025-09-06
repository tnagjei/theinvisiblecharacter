const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runPerformanceTest(url) {
  console.log(`🚀 开始性能测试: ${url}`);
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-gpu', '--disable-extensions']
  });
  
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port
  };
  
  try {
    const runnerResult = await lighthouse(url, options);
    const report = runnerResult.lhr;
    
    // 生成性能报告
    const performanceReport = {
      url: url,
      timestamp: new Date().toISOString(),
      performance: {
        score: report.categories.performance.score * 100,
        metrics: {}
      },
      accessibility: {
        score: report.categories.accessibility.score * 100
      },
      bestPractices: {
        score: report.categories['best-practices'].score * 100
      },
      seo: {
        score: report.categories.seo.score * 100
      }
    };
    
    // 提取性能指标
    Object.keys(report.audits).forEach(key => {
      const audit = report.audits[key];
      if (audit.scoreDisplayMode === 'numeric') {
        performanceReport.performance.metrics[key] = {
          score: audit.score,
          displayValue: audit.displayValue,
          numericValue: audit.numericValue
        };
      }
    });
    
    return performanceReport;
  } catch (error) {
    console.error('性能测试失败:', error);
    throw error;
  } finally {
    await chrome.kill();
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
      console.log(`\n📊 测试 ${page.name}...`);
      const report = await runPerformanceTest(page.url);
      results.pages[page.name] = report;
      
      // 打印关键指标
      console.log(`性能分数: ${report.performance.score.toFixed(0)}/100`);
      console.log(`可访问性分数: ${report.accessibility.score.toFixed(0)}/100`);
      console.log(`最佳实践分数: ${report.bestPractices.score.toFixed(0)}/100`);
      console.log(`SEO分数: ${report.seo.score.toFixed(0)}/100`);
      
      // 检查关键性能指标
      const metrics = report.performance.metrics;
      if (metrics['first-contentful-paint']) {
        console.log(`首次内容绘制: ${metrics['first-contentful-paint'].displayValue}`);
      }
      if (metrics['largest-contentful-paint']) {
        console.log(`最大内容绘制: ${metrics['largest-contentful-paint'].displayValue}`);
      }
      if (metrics['cumulative-layout-shift']) {
        console.log(`累积布局偏移: ${metrics['cumulative-layout-shift'].displayValue}`);
      }
      if (metrics['first-input-delay']) {
        console.log(`首次输入延迟: ${metrics['first-input-delay'].displayValue}`);
      }
      
    } catch (error) {
      console.error(`❌ ${page.name} 测试失败:`, error.message);
      results.pages[page.name] = { error: error.message };
    }
  }
  
  // 保存完整报告
  const reportPath = path.join(__dirname, '../../performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 完整性能报告已保存到: ${reportPath}`);
  
  // 生成总结
  generateSummary(results);
  
  return results;
}

function generateSummary(results) {
  const summary = {
    testDate: results.testDate,
    totalPages: Object.keys(results.pages).length,
    passedPages: 0,
    failedPages: 0,
    averageScores: {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0
    },
    recommendations: []
  };
  
  let totalPerformance = 0;
  let totalAccessibility = 0;
  let totalBestPractices = 0;
  let totalSeo = 0;
  
  Object.entries(results.pages).forEach(([pageName, pageData]) => {
    if (pageData.error) {
      summary.failedPages++;
      summary.recommendations.push(`${pageName}: 测试失败 - ${pageData.error}`);
    } else {
      summary.passedPages++;
      
      totalPerformance += pageData.performance.score;
      totalAccessibility += pageData.accessibility.score;
      totalBestPractices += pageData.bestPractices.score;
      totalSeo += pageData.seo.score;
      
      // 检查性能分数
      if (pageData.performance.score < 90) {
        summary.recommendations.push(`${pageName}: 性能分数较低 (${pageData.performance.score.toFixed(0)}/100)，建议优化`);
      }
      
      // 检查LCP
      const lcp = pageData.performance.metrics['largest-contentful-paint'];
      if (lcp && lcp.numericValue > 2500) {
        summary.recommendations.push(`${pageName}: 最大内容绘制时间过长 (${lcp.displayValue})，建议优化图片和资源加载`);
      }
      
      // 检查FID
      const fid = pageData.performance.metrics['first-input-delay'];
      if (fid && fid.numericValue > 100) {
        summary.recommendations.push(`${pageName}: 首次输入延迟过长 (${fid.displayValue})，建议优化JavaScript执行`);
      }
      
      // 检查CLS
      const cls = pageData.performance.metrics['cumulative-layout-shift'];
      if (cls && cls.numericValue > 0.1) {
        summary.recommendations.push(`${pageName}: 累积布局偏移过大 (${cls.displayValue})，建议优化图片尺寸和动态内容`);
      }
    }
  });
  
  summary.averageScores.performance = totalPerformance / summary.passedPages;
  summary.averageScores.accessibility = totalAccessibility / summary.passedPages;
  summary.averageScores.bestPractices = totalBestPractices / summary.passedPages;
  summary.averageScores.seo = totalSeo / summary.passedPages;
  
  // 保存总结报告
  const summaryPath = path.join(__dirname, '../../performance-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  // 打印总结
  console.log('\n📊 性能测试总结');
  console.log('='.repeat(50));
  console.log(`测试页面总数: ${summary.totalPages}`);
  console.log(`通过测试: ${summary.passedPages}`);
  console.log(`失败测试: ${summary.failedPages}`);
  console.log('\n平均分数:');
  console.log(`性能: ${summary.averageScores.performance.toFixed(1)}/100`);
  console.log(`可访问性: ${summary.averageScores.accessibility.toFixed(1)}/100`);
  console.log(`最佳实践: ${summary.averageScores.bestPractices.toFixed(1)}/100`);
  console.log(`SEO: ${summary.averageScores.seo.toFixed(1)}/100`);
  
  if (summary.recommendations.length > 0) {
    console.log('\n🔧 优化建议:');
    summary.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }
  
  console.log(`\n📄 总结报告已保存到: ${summaryPath}`);
}

// 如果直接运行此脚本
if (require.main === module) {
  testAllPages().catch(console.error);
}

module.exports = { runPerformanceTest, testAllPages };