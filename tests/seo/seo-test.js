const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function runSEOTest(url, pageName) {
  console.log(`🔍 开始SEO测试: ${pageName} - ${url}`);
  
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
      metaTags: {},
      headingStructure: [],
      images: [],
      links: [],
      structuredData: {},
      performance: {},
      mobile: {},
      seoScore: 0
    };
    
    // 测试Meta标签
    const metaTests = await testMetaTags(page);
    results.metaTags = metaTests;
    
    // 测试标题结构
    const headingTests = await testHeadingStructure(page);
    results.headingStructure = headingTests;
    
    // 测试图片优化
    const imageTests = await testImageOptimization(page);
    results.images = imageTests;
    
    // 测试链接优化
    const linkTests = await testLinkOptimization(page);
    results.links = linkTests;
    
    // 测试结构化数据
    const structuredDataTests = await testStructuredData(page);
    results.structuredData = structuredDataTests;
    
    // 测试移动友好性
    const mobileTests = await testMobileFriendliness(page);
    results.mobile = mobileTests;
    
    // 计算SEO分数
    results.seoScore = calculateSEOScore(results);
    
    return results;
    
  } catch (error) {
    console.error('SEO测试失败:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function testMetaTags(page) {
  const results = {
    title: {
      present: false,
      length: 0,
      optimal: false,
      content: ''
    },
    description: {
      present: false,
      length: 0,
      optimal: false,
      content: ''
    },
    keywords: {
      present: false,
      count: 0
    },
    openGraph: {
      present: false,
      complete: false,
      tags: {}
    },
    twitter: {
      present: false,
      complete: false,
      tags: {}
    },
    viewport: {
      present: false,
      content: ''
    },
    charset: {
      present: false,
      content: ''
    },
    robots: {
      present: false,
      content: ''
    },
    canonical: {
      present: false,
      content: ''
    },
    hreflang: {
      present: false,
      tags: []
    }
  };
  
  // 测试标题
  const title = await page.$('title');
  if (title) {
    results.title.present = true;
    results.title.content = await title.textContent();
    results.title.length = results.title.content.length;
    results.title.optimal = results.title.length >= 30 && results.title.length <= 60;
  }
  
  // 测试描述
  const description = await page.$('meta[name="description"]');
  if (description) {
    results.description.present = true;
    results.description.content = await description.getAttribute('content');
    results.description.length = results.description.content.length;
    results.description.optimal = results.description.length >= 120 && results.description.length <= 160;
  }
  
  // 测试关键词
  const keywords = await page.$('meta[name="keywords"]');
  if (keywords) {
    results.keywords.present = true;
    const content = await keywords.getAttribute('content');
    results.keywords.count = content ? content.split(',').length : 0;
  }
  
  // 测试Open Graph
  const ogTags = await page.$$('meta[property^="og:"]');
  if (ogTags.length > 0) {
    results.openGraph.present = true;
    
    const requiredOG = ['og:title', 'og:description', 'og:image', 'og:url'];
    const foundOG = [];
    
    for (const tag of ogTags) {
      const property = await tag.getAttribute('property');
      const content = await tag.getAttribute('content');
      results.openGraph.tags[property] = content;
      foundOG.push(property);
    }
    
    results.openGraph.complete = requiredOG.every(tag => foundOG.includes(tag));
  }
  
  // 测试Twitter Cards
  const twitterTags = await page.$$('meta[name^="twitter:"]');
  if (twitterTags.length > 0) {
    results.twitter.present = true;
    
    const requiredTwitter = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
    const foundTwitter = [];
    
    for (const tag of twitterTags) {
      const name = await tag.getAttribute('name');
      const content = await tag.getAttribute('content');
      results.twitter.tags[name] = content;
      foundTwitter.push(name);
    }
    
    results.twitter.complete = requiredTwitter.every(tag => foundTwitter.includes(tag));
  }
  
  // 测试其他Meta标签
  const viewport = await page.$('meta[name="viewport"]');
  if (viewport) {
    results.viewport.present = true;
    results.viewport.content = await viewport.getAttribute('content');
  }
  
  const charset = await page.$('meta[charset]');
  if (charset) {
    results.charset.present = true;
    results.charset.content = await charset.getAttribute('charset');
  }
  
  const robots = await page.$('meta[name="robots"]');
  if (robots) {
    results.robots.present = true;
    results.robots.content = await robots.getAttribute('content');
  }
  
  const canonical = await page.$('link[rel="canonical"]');
  if (canonical) {
    results.canonical.present = true;
    results.canonical.content = await canonical.getAttribute('href');
  }
  
  const hreflangTags = await page.$$('link[rel="alternate"][hreflang]');
  if (hreflangTags.length > 0) {
    results.hreflang.present = true;
    for (const tag of hreflangTags) {
      const hreflang = await tag.getAttribute('hreflang');
      const href = await tag.getAttribute('href');
      results.hreflang.tags.push({ hreflang, href });
    }
  }
  
  return results;
}

async function testHeadingStructure(page) {
  const results = {
    headings: [],
    structure: {
      hasH1: false,
      h1Count: 0,
      properOrder: true,
      skippedLevels: []
    }
  };
  
  const headings = await page.$$(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].join(','));
  
  let lastLevel = 0;
  
  for (const heading of headings) {
    const tagName = await heading.evaluate(el => el.tagName);
    const text = await heading.textContent();
    const level = parseInt(tagName.substring(1));
    
    results.headings.push({
      level: level,
      text: text,
      tagName: tagName
    });
    
    if (level === 1) {
      results.structure.hasH1 = true;
      results.structure.h1Count++;
    }
    
    // 检查标题层级是否正确
    if (lastLevel > 0 && level > lastLevel + 1) {
      results.structure.properOrder = false;
      results.structure.skippedLevels.push({
        from: lastLevel,
        to: level,
        position: results.headings.length
      });
    }
    
    lastLevel = level;
  }
  
  return results;
}

async function testImageOptimization(page) {
  const results = {
    images: [],
    summary: {
      total: 0,
      withAlt: 0,
      withoutAlt: 0,
      withLazy: 0,
      optimizedSize: 0
    }
  };
  
  const images = await page.$$('img');
  results.summary.total = images.length;
  
  for (const img of images) {
    const imageData = {
      src: '',
      alt: '',
      hasAlt: false,
      hasLazy: false,
      width: 0,
      height: 0,
      fileSize: 0
    };
    
    imageData.src = await img.getAttribute('src') || '';
    imageData.alt = await img.getAttribute('alt') || '';
    imageData.hasAlt = imageData.alt.length > 0;
    
    if (imageData.hasAlt) {
      results.summary.withAlt++;
    } else {
      results.summary.withoutAlt++;
    }
    
    const loading = await img.getAttribute('loading');
    imageData.hasLazy = loading === 'lazy';
    if (imageData.hasLazy) {
      results.summary.withLazy++;
    }
    
    const width = await img.getAttribute('width');
    const height = await img.getAttribute('height');
    imageData.width = width ? parseInt(width) : 0;
    imageData.height = height ? parseInt(height) : 0;
    
    results.images.push(imageData);
  }
  
  return results;
}

async function testLinkOptimization(page) {
  const results = {
    links: [],
    summary: {
      total: 0,
      internal: 0,
      external: 0,
      noFollow: 0,
      broken: 0
    }
  };
  
  const links = await page.$$('a[href]');
  results.summary.total = links.length;
  
  for (const link of links) {
    const linkData = {
      href: '',
      text: '',
      isInternal: false,
      isExternal: false,
      isNoFollow: false,
      isBroken: false
    };
    
    linkData.href = await link.getAttribute('href') || '';
    linkData.text = await link.textContent();
    
    if (linkData.href.startsWith('http')) {
      if (linkData.href.includes('theinvisiblecharacter.live')) {
        linkData.isInternal = true;
        results.summary.internal++;
      } else {
        linkData.isExternal = true;
        results.summary.external++;
      }
    } else if (linkData.href.startsWith('#') || linkData.href.startsWith('/')) {
      linkData.isInternal = true;
      results.summary.internal++;
    }
    
    const rel = await link.getAttribute('rel');
    linkData.isNoFollow = rel && rel.includes('nofollow');
    if (linkData.isNoFollow) {
      results.summary.noFollow++;
    }
    
    results.links.push(linkData);
  }
  
  return results;
}

async function testStructuredData(page) {
  const results = {
    present: false,
    valid: false,
    scripts: [],
    types: []
  };
  
  const scripts = await page.$$('script[type="application/ld+json"]');
  
  if (scripts.length > 0) {
    results.present = true;
    
    for (const script of scripts) {
      try {
        const content = await script.textContent();
        const data = JSON.parse(content);
        results.scripts.push(data);
        
        if (data['@type']) {
          results.types.push(data['@type']);
        }
      } catch (error) {
        console.error('解析结构化数据失败:', error);
      }
    }
    
    results.valid = results.scripts.length > 0;
  }
  
  return results;
}

async function testMobileFriendliness(page) {
  const results = {
    viewportConfigured: false,
    contentSizedToViewport: false,
    touchElements: {
      total: 0,
      properlySized: 0
    },
    fontSizes: {
      readable: true,
      issues: []
    }
  };
  
  // 检查viewport配置
  const viewport = await page.$('meta[name="viewport"]');
  if (viewport) {
    const content = await viewport.getAttribute('content');
    results.viewportConfigured = content && content.includes('width=device-width');
  }
  
  // 测试移动端显示
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForLoadState('networkidle');
  
  // 检查内容是否适配视口
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  results.contentSizedToViewport = bodyWidth <= 375;
  
  // 检查触摸元素
  const touchElements = await page.$$('button, a, input, textarea, select, [onclick]');
  results.touchElements.total = touchElements.length;
  
  for (const element of touchElements) {
    const box = await element.boundingBox();
    if (box && box.width >= 44 && box.height >= 44) {
      results.touchElements.properlySized++;
    }
  }
  
  // 检查字体大小
  const textElements = await page.$$('p, span, div');
  for (const element of textElements) {
    const fontSize = await element.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return parseFloat(styles.fontSize);
    });
    
    if (fontSize < 14) {
      results.fontSizes.issues.push({
        element: 'text element',
        fontSize: fontSize
      });
    }
  }
  
  return results;
}

function calculateSEOScore(results) {
  let score = 0;
  let maxScore = 100;
  
  // Meta标签分数 (30分)
  if (results.metaTags.title.present && results.metaTags.title.optimal) score += 10;
  if (results.metaTags.description.present && results.metaTags.description.optimal) score += 10;
  if (results.metaTags.openGraph.present && results.metaTags.openGraph.complete) score += 5;
  if (results.metaTags.twitter.present && results.metaTags.twitter.complete) score += 5;
  
  // 标题结构分数 (20分)
  if (results.headingStructure.structure.hasH1 && results.headingStructure.structure.h1Count === 1) score += 10;
  if (results.headingStructure.structure.properOrder) score += 10;
  
  // 图片优化分数 (15分)
  const altPercentage = results.images.summary.total > 0 ? 
    (results.images.summary.withAlt / results.images.summary.total) * 100 : 100;
  score += Math.min(10, (altPercentage / 100) * 10);
  if (results.images.summary.withLazy > 0) score += 5;
  
  // 链接优化分数 (10分)
  if (results.links.summary.broken === 0) score += 5;
  if (results.links.summary.noFollow === 0) score += 5;
  
  // 结构化数据分数 (10分)
  if (results.structuredData.present && results.structuredData.valid) score += 10;
  
  // 移动友好性分数 (15分)
  if (results.mobile.viewportConfigured) score += 5;
  if (results.mobile.contentSizedToViewport) score += 5;
  const touchPercentage = results.mobile.touchElements.total > 0 ?
    (results.mobile.touchElements.properlySized / results.mobile.touchElements.total) * 100 : 100;
  score += Math.min(5, (touchPercentage / 100) * 5);
  
  return Math.round(score);
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
      const report = await runSEOTest(page.url, page.name);
      results.pages[page.name] = report;
      
      // 打印结果摘要
      console.log(`SEO分数: ${report.seoScore}/100`);
      console.log(`Meta标签: ${report.metaTags.title.present ? '✓' : '✗'} 标题, ${report.metaTags.description.present ? '✓' : '✗'} 描述`);
      console.log(`标题结构: ${report.headingStructure.structure.hasH1 ? '✓' : '✗'} H1, ${report.headingStructure.structure.properOrder ? '✓' : '✗'} 层级正确`);
      console.log(`图片优化: ${report.images.summary.withAlt}/${report.images.summary.total} 有Alt标签`);
      
    } catch (error) {
      console.error(`❌ ${page.name} 测试失败:`, error.message);
      results.pages[page.name] = { error: error.message };
    }
  }
  
  // 保存完整报告
  const reportPath = path.join(__dirname, '../../seo-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 完整SEO报告已保存到: ${reportPath}`);
  
  // 生成总结
  generateSEOSummary(results);
  
  return results;
}

function generateSEOSummary(results) {
  const summary = {
    testDate: results.testDate,
    totalPages: Object.keys(results.pages).length,
    passedPages: 0,
    failedPages: 0,
    averageSEOScore: 0,
    scoreDistribution: {
      excellent: 0, // 90+
      good: 0, // 70-89
      fair: 0, // 50-69
      poor: 0 // <50
    },
    commonIssues: [],
    recommendations: []
  };
  
  let totalScore = 0;
  let validPages = 0;
  
  Object.entries(results.pages).forEach(([pageName, pageData]) => {
    if (pageData.error) {
      summary.failedPages++;
      summary.recommendations.push(`${pageName}: 测试失败 - ${pageData.error}`);
    } else {
      validPages++;
      totalScore += pageData.seoScore;
      
      // 分类分数
      if (pageData.seoScore >= 90) {
        summary.scoreDistribution.excellent++;
        summary.passedPages++;
      } else if (pageData.seoScore >= 70) {
        summary.scoreDistribution.good++;
        summary.passedPages++;
      } else if (pageData.seoScore >= 50) {
        summary.scoreDistribution.fair++;
      } else {
        summary.scoreDistribution.poor++;
      }
      
      // 检查常见问题
      if (!pageData.metaTags.title.present) {
        summary.commonIssues.push('缺少标题标签');
      }
      if (!pageData.metaTags.description.present) {
        summary.commonIssues.push('缺少描述标签');
      }
      if (!pageData.headingStructure.structure.hasH1) {
        summary.commonIssues.push('缺少H1标题');
      }
      if (pageData.images.summary.withoutAlt > 0) {
        summary.commonIssues.push('图片缺少Alt标签');
      }
    }
  });
  
  summary.averageSEOScore = validPages > 0 ? totalScore / validPages : 0;
  
  // 生成建议
  if (summary.averageSEOScore < 70) {
    summary.recommendations.push('整体SEO分数较低，建议优先优化Meta标签和标题结构');
  }
  
  if (summary.scoreDistribution.poor > 0) {
    summary.recommendations.push(`${summary.scoreDistribution.poor} 个页面需要大幅SEO优化`);
  }
  
  if (summary.commonIssues.length > 0) {
    const uniqueIssues = [...new Set(summary.commonIssues)];
    uniqueIssues.forEach(issue => {
      summary.recommendations.push(`建议修复: ${issue}`);
    });
  }
  
  // 保存总结报告
  const summaryPath = path.join(__dirname, '../../seo-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  // 打印总结
  console.log('\n🔍 SEO测试总结');
  console.log('='.repeat(50));
  console.log(`测试页面总数: ${summary.totalPages}`);
  console.log(`通过测试: ${summary.passedPages}`);
  console.log(`失败测试: ${summary.failedPages}`);
  console.log(`平均SEO分数: ${summary.averageSEOScore.toFixed(1)}/100`);
  console.log('\n分数分布:');
  console.log(`  优秀 (90+): ${summary.scoreDistribution.excellent}`);
  console.log(`  良好 (70-89): ${summary.scoreDistribution.good}`);
  console.log(`  一般 (50-69): ${summary.scoreDistribution.fair}`);
  console.log(`  较差 (<50): ${summary.scoreDistribution.poor}`);
  
  if (summary.commonIssues.length > 0) {
    console.log('\n🔍 常见问题:');
    summary.commonIssues.forEach(issue => console.log(`  • ${issue}`));
  }
  
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

module.exports = { runSEOTest, testAllPages };