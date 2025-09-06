const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function runSecurityTest(url, pageName) {
  console.log(`🔒 开始安全测试: ${pageName} - ${url}`);
  
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
      securityScore: 0,
      tests: {
        https: {},
        headers: {},
        contentSecurity: {},
        inputValidation: {},
        xssProtection: {},
        informationDisclosure: {},
        externalResources: {}
      }
    };
    
    // HTTPS测试
    const httpsTests = await testHTTPS(page, url);
    results.tests.https = httpsTests;
    
    // 安全头部测试
    const headersTests = await testSecurityHeaders(page);
    results.tests.headers = headersTests;
    
    // 内容安全测试
    const contentTests = await testContentSecurity(page);
    results.tests.contentSecurity = contentTests;
    
    // 输入验证测试
    const inputTests = await testInputValidation(page);
    results.tests.inputValidation = inputTests;
    
    // XSS防护测试
    const xssTests = await testXSSProtection(page);
    results.tests.xssProtection = xssTests;
    
    // 信息泄露测试
    const infoTests = await testInformationDisclosure(page);
    results.tests.informationDisclosure = infoTests;
    
    // 外部资源测试
    const externalTests = await testExternalResources(page);
    results.tests.externalResources = externalTests;
    
    // 计算安全分数
    results.securityScore = calculateSecurityScore(results);
    
    return results;
    
  } catch (error) {
    console.error('安全测试失败:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function testHTTPS(page, url) {
  const results = {
    usesHTTPS: url.startsWith('https://'),
    redirectsToHTTPS: false,
    mixedContent: false,
    hsts: false,
    certificate: {
      valid: false,
      issuer: '',
      expires: ''
    }
  };
  
  // 检查HTTP到HTTPS的重定向
  if (!url.startsWith('https://')) {
    try {
      const response = await page.goto(url.replace('http://', 'https://'));
      if (response && response.status() === 200) {
        results.redirectsToHTTPS = true;
      }
    } catch (error) {
      // HTTPS不可用
    }
  }
  
  // 检查混合内容
  const resources = await page.evaluate(() => {
    const resources = [];
    const images = document.querySelectorAll('img');
    const scripts = document.querySelectorAll('script');
    const links = document.querySelectorAll('link');
    
    [...images, ...scripts, ...links].forEach(resource => {
      const src = resource.src || resource.href;
      if (src && src.startsWith('http://')) {
        resources.push({
          type: resource.tagName,
          src: src
        });
      }
    });
    
    return resources;
  });
  
  results.mixedContent = resources.length > 0;
  results.mixedContentResources = resources;
  
  // 检查HSTS
  try {
    const response = await page.goto(url);
    const headers = response.headers();
    results.hsts = !!headers['strict-transport-security'];
  } catch (error) {
    // 无法检查头部
  }
  
  return results;
}

async function testSecurityHeaders(page) {
  const results = {
    headers: {},
    missingHeaders: [],
    recommendations: []
  };
  
  const importantHeaders = [
    'x-frame-options',
    'x-content-type-options',
    'x-xss-protection',
    'content-security-policy',
    'referrer-policy',
    'permissions-policy'
  ];
  
  try {
    const response = await page.goto(page.url());
    const headers = response.headers();
    
    importantHeaders.forEach(header => {
      if (headers[header]) {
        results.headers[header] = headers[header];
      } else {
        results.missingHeaders.push(header);
      }
    });
    
    // 生成建议
    if (results.missingHeaders.includes('x-frame-options')) {
      results.recommendations.push('建议添加X-Frame-Options头部以防止点击劫持');
    }
    if (results.missingHeaders.includes('x-content-type-options')) {
      results.recommendations.push('建议添加X-Content-Type-Options头部以防止MIME类型嗅探');
    }
    if (results.missingHeaders.includes('content-security-policy')) {
      results.recommendations.push('建议添加Content-Security-Policy头部以增强安全性');
    }
    
  } catch (error) {
    console.error('安全头部测试失败:', error);
  }
  
  return results;
}

async function testContentSecurity(page) {
  const results = {
    hasCSP: false,
    cspHeader: '',
    cspValid: false,
    inlineScriptsAllowed: false,
    evalAllowed: false,
    unsafeInline: false
  };
  
  try {
    const response = await page.goto(page.url());
    const headers = response.headers();
    
    if (headers['content-security-policy']) {
      results.hasCSP = true;
      results.cspHeader = headers['content-security-policy'];
      
      // 分析CSP策略
      const csp = results.cspHeader.toLowerCase();
      results.inlineScriptsAllowed = csp.includes("'unsafe-inline'");
      results.evalAllowed = csp.includes("'unsafe-eval'");
      results.unsafeInline = csp.includes("'unsafe-inline'");
      
      results.cspValid = !results.inlineScriptsAllowed && !results.evalAllowed;
    }
  } catch (error) {
    console.error('CSP测试失败:', error);
  }
  
  return results;
}

async function testInputValidation(page) {
  const results = {
    inputFields: [],
    validationTests: [],
    hasValidation: false,
    issues: []
  };
  
  // 查找所有输入字段
  const inputs = await page.$$('input, textarea, select');
  
  for (const input of inputs) {
    const inputInfo = {
      type: await input.getAttribute('type') || 'text',
      name: await input.getAttribute('name') || '',
      id: await input.getAttribute('id') || '',
      required: await input.getAttribute('required') !== null,
      maxLength: await input.getAttribute('maxlength'),
      pattern: await input.getAttribute('pattern'),
      hasValidation: false
    };
    
    // 检查是否有验证属性
    inputInfo.hasValidation = inputInfo.required || inputInfo.maxLength || inputInfo.pattern;
    
    if (inputInfo.hasValidation) {
      results.hasValidation = true;
    }
    
    results.inputFields.push(inputInfo);
  }
  
  // 测试输入验证
  const testInputs = [
    { value: '<script>alert("XSS")</script>', description: 'XSS脚本' },
    { value: 'javascript:alert("XSS")', description: 'JavaScript协议' },
    { value: '" onclick="alert(\'XSS\')', description: '事件处理器' },
    { value: '<img src="x" onerror="alert(\'XSS\')">', description: '图片XSS' },
    { value: '<svg onload="alert(\'XSS\')">', description: 'SVG XSS' }
  ];
  
  for (const testInput of testInputs) {
    const testResult = {
      input: testInput.value,
      description: testInput.description,
      accepted: false,
      sanitized: false
    };
    
    // 尝试在第一个输入框中输入测试值
    if (inputs.length > 0) {
      const firstInput = inputs[0];
      await firstInput.fill(testInput.value);
      
      // 检查输入是否被接受
      const value = await firstInput.inputValue();
      testResult.accepted = value === testInput.value;
      testResult.sanitized = value !== testInput.value && value.length > 0;
    }
    
    results.validationTests.push(testResult);
  }
  
  // 检查问题
  if (results.inputFields.length > 0 && !results.hasValidation) {
    results.issues.push('输入字段缺少客户端验证');
  }
  
  const acceptedMalicious = results.validationTests.filter(test => test.accepted).length;
  if (acceptedMalicious > 0) {
    results.issues.push(`${acceptedMalicious} 个恶意输入被接受，可能存在XSS漏洞`);
  }
  
  return results;
}

async function testXSSProtection(page) {
  const results = {
    hasXSSFilter: false,
    xssFilterEnabled: false,
    outputEncoding: true,
    domBasedXSS: false,
    reflectedXSS: false,
    storedXSS: false
  };
  
  try {
    const response = await page.goto(page.url());
    const headers = response.headers();
    
    // 检查X-XSS-Protection头部
    if (headers['x-xss-protection']) {
      results.hasXSSFilter = true;
      results.xssFilterEnabled = headers['x-xss-protection'].includes('1');
    }
    
    // 测试反射型XSS
    const xssPayload = '<script>alert("XSS")</script>';
    const testUrl = page.url() + '?test=' + encodeURIComponent(xssPayload);
    
    try {
      await page.goto(testUrl);
      const content = await page.content();
      
      // 检查payload是否被反射
      if (content.includes(xssPayload)) {
        results.reflectedXSS = true;
      }
    } catch (error) {
      // 测试失败，跳过
    }
    
    // 检查输出编码
    const scripts = await page.$$('script');
    for (const script of scripts) {
      const content = await script.textContent();
      if (content.includes('<') || content.includes('>')) {
        results.outputEncoding = false;
        break;
      }
    }
    
  } catch (error) {
    console.error('XSS保护测试失败:', error);
  }
  
  return results;
}

async function testInformationDisclosure(page) {
  const results = {
    serverInfo: {
      disclosed: false,
      server: '',
      version: ''
    },
    frameworkInfo: {
      disclosed: false,
      framework: '',
      version: ''
    },
    comments: [],
    hiddenFiles: [],
    directoryListing: false,
    errorMessages: {
      detailed: false,
      examples: []
    }
  };
  
  // 检查服务器信息
  try {
    const response = await page.goto(page.url());
    const headers = response.headers();
    
    if (headers['server']) {
      results.serverInfo.disclosed = true;
      results.serverInfo.server = headers['server'];
    }
    
    if (headers['x-powered-by']) {
      results.frameworkInfo.disclosed = true;
      results.frameworkInfo.framework = headers['x-powered-by'];
    }
  } catch (error) {
    console.error('信息泄露测试失败:', error);
  }
  
  // 检查HTML注释
  const comments = await page.evaluate(() => {
    const comments = [];
    const iterator = document.createNodeIterator(
      document.body,
      NodeFilter.SHOW_COMMENT
    );
    
    let node;
    while (node = iterator.nextNode()) {
      if (node.textContent.trim()) {
        comments.push(node.textContent.trim());
      }
    }
    
    return comments;
  });
  
  results.comments = comments.filter(comment => 
    comment.length > 10 && !comment.includes('copyright') && !comment.includes('license')
  );
  
  // 检查常见隐藏文件
  const hiddenFiles = [
    '.git', '.env', '.env.local', 'config.php', 'wp-config.php',
    'web.config', '.htaccess', '.htpasswd'
  ];
  
  for (const file of hiddenFiles) {
    try {
      const fileUrl = new URL(file, page.url()).href;
      const response = await page.request.get(fileUrl);
      if (response.status() === 200) {
        results.hiddenFiles.push(file);
      }
    } catch (error) {
      // 文件不存在，这是好的
    }
  }
  
  return results;
}

async function testExternalResources(page) {
  const results = {
    externalScripts: [],
    externalStyles: [],
    externalImages: [],
    cdnResources: [],
    mixedContent: [],
    recommendations: []
  };
  
  // 检查外部脚本
  const scripts = await page.$$('script[src]');
  for (const script of scripts) {
    const src = await script.getAttribute('src');
    if (src && src.startsWith('http')) {
      const isExternal = !src.includes(window.location.hostname);
      const isCDN = src.includes('cdn.') || src.includes('cloudflare.') || src.includes('google.');
      
      if (isExternal) {
        results.externalScripts.push({
          src: src,
          isCDN: isCDN,
          integrity: await script.getAttribute('integrity')
        });
      }
      
      if (isCDN) {
        results.cdnResources.push({
          type: 'script',
          src: src
        });
      }
    }
  }
  
  // 检查外部样式
  const links = await page.$$('link[rel="stylesheet"]');
  for (const link of links) {
    const href = await link.getAttribute('href');
    if (href && href.startsWith('http')) {
      const isExternal = !href.includes(window.location.hostname);
      const isCDN = href.includes('cdn.') || href.includes('cloudflare.');
      
      if (isExternal) {
        results.externalStyles.push({
          href: href,
          isCDN: isCDN
        });
      }
      
      if (isCDN) {
        results.cdnResources.push({
          type: 'stylesheet',
          src: href
        });
      }
    }
  }
  
  // 检查外部图片
  const images = await page.$$('img[src]');
  for (const img of images) {
    const src = await img.getAttribute('src');
    if (src && src.startsWith('http')) {
      const isExternal = !src.includes(window.location.hostname);
      
      if (isExternal) {
        results.externalImages.push({
          src: src
        });
      }
    }
  }
  
  // 生成建议
  const scriptsWithoutIntegrity = results.externalScripts.filter(s => !s.integrity && !s.isCDN);
  if (scriptsWithoutIntegrity.length > 0) {
    results.recommendations.push(`${scriptsWithoutIntegrity.length} 个外部脚本缺少完整性验证`);
  }
  
  if (results.externalScripts.length > 5) {
    results.recommendations.push('外部脚本数量较多，建议考虑减少以提高性能和安全性');
  }
  
  return results;
}

function calculateSecurityScore(results) {
  let score = 0;
  let maxScore = 100;
  
  // HTTPS分数 (20分)
  if (results.tests.https.usesHTTPS) score += 15;
  if (!results.tests.https.mixedContent) score += 5;
  
  // 安全头部分数 (20分)
  const securityHeaders = results.tests.headers;
  const headerPoints = {
    'x-frame-options': 5,
    'x-content-type-options': 5,
    'x-xss-protection': 5,
    'content-security-policy': 5
  };
  
  Object.keys(headerPoints).forEach(header => {
    if (securityHeaders.headers[header]) {
      score += headerPoints[header];
    }
  });
  
  // 内容安全分数 (15分)
  if (results.tests.contentSecurity.hasCSP) score += 10;
  if (results.tests.contentSecurity.cspValid) score += 5;
  
  // 输入验证分数 (15分)
  if (results.tests.inputValidation.hasValidation) score += 10;
  const acceptedMalicious = results.tests.inputValidation.validationTests.filter(test => test.accepted).length;
  if (acceptedMalicious === 0) score += 5;
  
  // XSS防护分数 (15分)
  if (results.tests.xssProtection.hasXSSFilter) score += 5;
  if (!results.tests.xssProtection.reflectedXSS) score += 5;
  if (results.tests.xssProtection.outputEncoding) score += 5;
  
  // 信息泄露分数 (10分)
  if (!results.tests.informationDisclosure.serverInfo.disclosed) score += 5;
  if (results.tests.informationDisclosure.comments.length === 0) score += 5;
  
  // 外部资源分数 (5分)
  const scriptsWithoutIntegrity = results.tests.externalResources.externalScripts.filter(s => !s.integrity && !s.isCDN);
  if (scriptsWithoutIntegrity.length === 0) score += 5;
  
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
      console.log(`\n🔒 测试 ${page.name}...`);
      const report = await runSecurityTest(page.url, page.name);
      results.pages[page.name] = report;
      
      // 打印结果摘要
      console.log(`安全分数: ${report.securityScore}/100`);
      console.log(`HTTPS: ${report.tests.https.usesHTTPS ? '✓' : '✗'}`);
      console.log(`安全头部: ${Object.keys(report.tests.headers.headers).length} 个`);
      console.log(`CSP: ${report.tests.contentSecurity.hasCSP ? '✓' : '✗'}`);
      console.log(`输入验证: ${report.tests.inputValidation.hasValidation ? '✓' : '✗'}`);
      
    } catch (error) {
      console.error(`❌ ${page.name} 测试失败:`, error.message);
      results.pages[page.name] = { error: error.message };
    }
  }
  
  // 保存完整报告
  const reportPath = path.join(__dirname, '../../security-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 完整安全报告已保存到: ${reportPath}`);
  
  // 生成总结
  generateSecuritySummary(results);
  
  return results;
}

function generateSecuritySummary(results) {
  const summary = {
    testDate: results.testDate,
    totalPages: Object.keys(results.pages).length,
    passedPages: 0,
    failedPages: 0,
    averageSecurityScore: 0,
    scoreDistribution: {
      excellent: 0, // 90+
      good: 0, // 70-89
      fair: 0, // 50-69
      poor: 0 // <50
    },
    commonIssues: [],
    criticalIssues: [],
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
      totalScore += pageData.securityScore;
      
      // 分类分数
      if (pageData.securityScore >= 90) {
        summary.scoreDistribution.excellent++;
        summary.passedPages++;
      } else if (pageData.securityScore >= 70) {
        summary.scoreDistribution.good++;
        summary.passedPages++;
      } else if (pageData.securityScore >= 50) {
        summary.scoreDistribution.fair++;
      } else {
        summary.scoreDistribution.poor++;
      }
      
      // 检查关键问题
      if (!pageData.tests.https.usesHTTPS) {
        summary.criticalIssues.push(`${pageName}: 未使用HTTPS`);
      }
      if (pageData.tests.xssProtection.reflectedXSS) {
        summary.criticalIssues.push(`${pageName}: 存在反射型XSS漏洞`);
      }
      if (pageData.tests.inputValidation.validationTests.filter(test => test.accepted).length > 0) {
        summary.criticalIssues.push(`${pageName}: 输入验证不足`);
      }
      
      // 检查常见问题
      if (!pageData.tests.contentSecurity.hasCSP) {
        summary.commonIssues.push('缺少内容安全策略');
      }
      if (Object.keys(pageData.tests.headers.headers).length < 3) {
        summary.commonIssues.push('安全头部不完整');
      }
    }
  });
  
  summary.averageSecurityScore = validPages > 0 ? totalScore / validPages : 0;
  
  // 生成建议
  if (summary.averageSecurityScore < 70) {
    summary.recommendations.push('整体安全分数较低，建议优先修复关键安全问题');
  }
  
  if (summary.criticalIssues.length > 0) {
    summary.recommendations.push(`发现 ${summary.criticalIssues.length} 个关键安全问题，需要立即修复`);
  }
  
  if (summary.commonIssues.length > 0) {
    const uniqueIssues = [...new Set(summary.commonIssues)];
    uniqueIssues.forEach(issue => {
      summary.recommendations.push(`建议修复: ${issue}`);
    });
  }
  
  // 保存总结报告
  const summaryPath = path.join(__dirname, '../../security-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  // 打印总结
  console.log('\n🔒 安全测试总结');
  console.log('='.repeat(50));
  console.log(`测试页面总数: ${summary.totalPages}`);
  console.log(`通过测试: ${summary.passedPages}`);
  console.log(`失败测试: ${summary.failedPages}`);
  console.log(`平均安全分数: ${summary.averageSecurityScore.toFixed(1)}/100`);
  console.log('\n分数分布:');
  console.log(`  优秀 (90+): ${summary.scoreDistribution.excellent}`);
  console.log(`  良好 (70-89): ${summary.scoreDistribution.good}`);
  console.log(`  一般 (50-69): ${summary.scoreDistribution.fair}`);
  console.log(`  较差 (<50): ${summary.scoreDistribution.poor}`);
  
  if (summary.criticalIssues.length > 0) {
    console.log('\n🚨 关键安全问题:');
    summary.criticalIssues.forEach(issue => console.log(`  • ${issue}`));
  }
  
  if (summary.commonIssues.length > 0) {
    console.log('\n🔍 常见问题:');
    summary.commonIssues.forEach(issue => console.log(`  • ${issue}`));
  }
  
  if (summary.recommendations.length > 0) {
    console.log('\n🔧 安全建议:');
    summary.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }
  
  console.log(`\n📄 总结报告已保存到: ${summaryPath}`);
}

// 如果直接运行此脚本
if (require.main === module) {
  testAllPages().catch(console.error);
}

module.exports = { runSecurityTest, testAllPages };