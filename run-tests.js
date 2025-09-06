#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 TheInvisibleCharacter.live 全面测试');

const results = {
  startTime: new Date().toISOString(),
  tests: {},
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    duration: 0
  }
};

async function runTest(testName, command, description) {
  console.log(`\n📋 ${description}`);
  console.log('='.repeat(50));
  
  try {
    console.log(`⏳ 执行命令: ${command}`);
    const startTime = Date.now();
    
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    
    const duration = Date.now() - startTime;
    results.tests[testName] = {
      status: 'passed',
      duration: duration,
      description: description
    };
    
    results.summary.passed++;
    console.log(`✅ ${description} - 通过 (${duration}ms)`);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    results.tests[testName] = {
      status: 'failed',
      duration: duration,
      error: error.message,
      description: description
    };
    
    results.summary.failed++;
    console.log(`❌ ${description} - 失败 (${duration}ms)`);
    console.log(`错误: ${error.message}`);
  }
  
  results.summary.total++;
}

async function runAllTests() {
  console.log('🎯 TheInvisibleCharacter.live 自动化测试套件');
  console.log('='.repeat(60));
  
  // 1. 安装依赖
  await runTest(
    'install-dependencies',
    'npm install',
    '安装测试依赖'
  );
  
  // 2. E2E测试
  await runTest(
    'e2e-tests',
    'npm run test:e2e',
    '端到端功能测试'
  );
  
  // 3. 性能测试
  await runTest(
    'performance-tests',
    'npm run test:perf',
    '性能测试'
  );
  
  // 4. 可访问性测试
  await runTest(
    'accessibility-tests',
    'npm run test:a11y',
    '可访问性测试'
  );
  
  // 5. SEO测试
  await runTest(
    'seo-tests',
    'npm run test:seo',
    'SEO测试'
  );
  
  // 6. 安全测试
  await runTest(
    'security-tests',
    'npm run test:security',
    '安全测试'
  );
  
  // 生成最终报告
  results.endTime = new Date().toISOString();
  results.summary.duration = new Date(results.endTime) - new Date(results.startTime);
  
  generateFinalReport(results);
  
  console.log('\n🎊 测试完成！');
  console.log(`总计: ${results.summary.total} 个测试`);
  console.log(`通过: ${results.summary.passed} 个`);
  console.log(`失败: ${results.summary.failed} 个`);
  console.log(`耗时: ${results.summary.duration}ms`);
  
  if (results.summary.failed > 0) {
    console.log('\n⚠️  有测试失败，请查看详细报告');
    process.exit(1);
  } else {
    console.log('\n✅ 所有测试通过！');
    process.exit(0);
  }
}

function generateFinalReport(results) {
  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  console.log(`\n📄 完整测试报告已保存到: ${reportPath}`);
  
  // 生成HTML报告
  generateHTMLReport(results);
}

function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TheInvisibleCharacter.live 测试报告</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #e9ecef;
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #495057;
        }
        .summary-card .number {
            font-size: 2em;
            font-weight: bold;
            color: #007bff;
        }
        .test-results {
            margin-top: 30px;
        }
        .test-item {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            margin-bottom: 15px;
            overflow: hidden;
        }
        .test-header {
            padding: 15px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .test-header.passed {
            background: #d4edda;
            border-color: #c3e6cb;
        }
        .test-header.failed {
            background: #f8d7da;
            border-color: #f5c6cb;
        }
        .test-title {
            font-weight: bold;
            margin: 0;
        }
        .test-status {
            padding: 4px 12px;
            border-radius: 4px;
            color: white;
            font-size: 0.9em;
        }
        .test-status.passed {
            background: #28a745;
        }
        .test-status.failed {
            background: #dc3545;
        }
        .test-details {
            padding: 15px 20px;
        }
        .test-duration {
            color: #6c757d;
            font-size: 0.9em;
        }
        .test-error {
            color: #dc3545;
            background: #f8d7da;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
        }
        .report-info {
            text-align: center;
            color: #6c757d;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 TheInvisibleCharacter.live 测试报告</h1>
        
        <div class="summary">
            <div class="summary-card">
                <h3>总测试数</h3>
                <div class="number">${results.summary.total}</div>
            </div>
            <div class="summary-card">
                <h3>通过测试</h3>
                <div class="number" style="color: #28a745;">${results.summary.passed}</div>
            </div>
            <div class="summary-card">
                <h3>失败测试</h3>
                <div class="number" style="color: #dc3545;">${results.summary.failed}</div>
            </div>
            <div class="summary-card">
                <h3>总耗时</h3>
                <div class="number">${Math.round(results.summary.duration / 1000)}s</div>
            </div>
        </div>
        
        <div class="test-results">
            <h2>测试详情</h2>
            ${Object.entries(results.tests).map(([testName, testResult]) => `
                <div class="test-item">
                    <div class="test-header ${testResult.status}">
                        <h3 class="test-title">${testResult.description}</h3>
                        <span class="test-status ${testResult.status}">
                            ${testResult.status === 'passed' ? '✅ 通过' : '❌ 失败'}
                        </span>
                    </div>
                    <div class="test-details">
                        <div class="test-duration">
                            ⏱️ 耗时: ${testResult.duration}ms
                        </div>
                        ${testResult.error ? `
                            <div class="test-error">
                                <strong>错误信息:</strong><br>
                                ${testResult.error}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="report-info">
            <p>报告生成时间: ${new Date(results.endTime).toLocaleString()}</p>
            <p>测试开始时间: ${new Date(results.startTime).toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
  `;
  
  const htmlPath = path.join(__dirname, 'test-report.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`📄 HTML测试报告已保存到: ${htmlPath}`);
}

// 如果直接运行此脚本
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };