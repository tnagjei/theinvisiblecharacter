const fs = require('fs');
const path = require('path');

class StaticAnalyzer {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      pages: {},
      summary: {
        totalPages: 0,
        totalIssues: 0,
        issuesByType: {}
      }
    };
  }

  async analyzeProject() {
    console.log('🔍 开始静态代码分析...');
    
    // 获取所有HTML文件
    const htmlFiles = this.getHtmlFiles();
    this.results.summary.totalPages = htmlFiles.length;
    
    for (const file of htmlFiles) {
      console.log(`\n📄 分析 ${file}...`);
      await this.analyzeHtmlFile(file);
    }
    
    // 生成报告
    this.generateReport();
    
    return this.results;
  }

  getHtmlFiles() {
    const files = [];
    const scanDir = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.')) {
          scanDir(fullPath);
        } else if (item.endsWith('.html')) {
          files.push(fullPath);
        }
      }
    };
    
    scanDir('.');
    return files;
  }

  async analyzeHtmlFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative('.', filePath);
      
      const analysis = {
        filePath: relativePath,
        issues: [],
        metaTags: {},
        structure: {},
        links: [],
        scripts: [],
        styles: [],
        accessibility: {},
        seo: {}
      };
      
      // 分析Meta标签
      this.analyzeMetaTags(content, analysis);
      
      // 分析页面结构
      this.analyzeStructure(content, analysis);
      
      // 分析链接
      this.analyzeLinks(content, analysis);
      
      // 分析脚本和样式
      this.analyzeResources(content, analysis);
      
      // 分析可访问性
      this.analyzeAccessibility(content, analysis);
      
      // 分析SEO
      this.analyzeSEO(content, analysis);
      
      // 检查常见问题
      this.checkCommonIssues(content, analysis);
      
      this.results.pages[relativePath] = analysis;
      this.results.summary.totalIssues += analysis.issues.length;
      
      // 统计问题类型
      analysis.issues.forEach(issue => {
        if (!this.results.summary.issuesByType[issue.type]) {
          this.results.summary.issuesByType[issue.type] = 0;
        }
        this.results.summary.issuesByType[issue.type]++;
      });
      
      console.log(`  发现 ${analysis.issues.length} 个问题`);
      
    } catch (error) {
      console.error(`分析文件 ${filePath} 失败:`, error.message);
      this.results.pages[filePath] = { error: error.message };
    }
  }

  analyzeMetaTags(content, analysis) {
    // 提取title
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      analysis.metaTags.title = titleMatch[1];
      if (titleMatch[1].length < 10) {
        analysis.issues.push({
          type: 'SEO',
          severity: 'warning',
          message: '标题过短，建议至少10个字符'
        });
      }
      if (titleMatch[1].length > 60) {
        analysis.issues.push({
          type: 'SEO',
          severity: 'warning',
          message: '标题过长，建议不超过60个字符'
        });
      }
    } else {
      analysis.issues.push({
        type: 'SEO',
        severity: 'error',
        message: '缺少页面标题'
      });
    }
    
    // 提取meta description
    const descMatch = content.match(/<meta name="description" content="(.*?)"/i);
    if (descMatch) {
      analysis.metaTags.description = descMatch[1];
      if (descMatch[1].length < 120) {
        analysis.issues.push({
          type: 'SEO',
          severity: 'warning',
          message: '描述过短，建议至少120个字符'
        });
      }
      if (descMatch[1].length > 160) {
        analysis.issues.push({
          type: 'SEO',
          severity: 'warning',
          message: '描述过长，建议不超过160个字符'
        });
      }
    } else {
      analysis.issues.push({
        type: 'SEO',
        severity: 'error',
        message: '缺少meta description'
      });
    }
    
    // 检查viewport
    const viewportMatch = content.match(/<meta name="viewport" content="(.*?)"/i);
    if (!viewportMatch) {
      analysis.issues.push({
        type: 'Mobile',
        severity: 'error',
        message: '缺少viewport meta标签'
      });
    }
    
    // 检查charset
    const charsetMatch = content.match(/<meta charset="(.*?)"/i);
    if (!charsetMatch || charsetMatch[1].toLowerCase() !== 'utf-8') {
      analysis.issues.push({
        type: 'Encoding',
        severity: 'error',
        message: '缺少或错误的charset标签'
      });
    }
    
    // 检查Open Graph标签
    const ogTags = content.match(/<meta property="og:(.*?)" content="(.*?)"/gi);
    if (!ogTags || ogTags.length < 3) {
      analysis.issues.push({
        type: 'SEO',
        severity: 'warning',
        message: 'Open Graph标签不完整'
      });
    }
  }

  analyzeStructure(content, analysis) {
    // 检查H1标签
    const h1Tags = content.match(/<h1[^>]*>.*?<\/h1>/gi);
    if (!h1Tags) {
      analysis.issues.push({
        type: 'SEO',
        severity: 'warning',
        message: '缺少H1标签'
      });
    } else if (h1Tags.length > 1) {
      analysis.issues.push({
        type: 'SEO',
        severity: 'warning',
        message: '页面包含多个H1标签'
      });
    }
    
    // 检查标题层级
    const headingPattern = /<h([1-6])[^>]*>.*?<\/h[1-6]>/gi;
    const headings = [];
    let match;
    
    while ((match = headingPattern.exec(content)) !== null) {
      headings.push(parseInt(match[1]));
    }
    
    // 检查标题层级是否正确
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] > headings[i - 1] + 1) {
        analysis.issues.push({
          type: 'SEO',
          severity: 'warning',
          message: `标题层级跳跃：从H${headings[i - 1]}到H${headings[i]}`
        });
      }
    }
    
    // 检查语义化标签
    const semanticTags = ['header', 'nav', 'main', 'footer', 'article', 'section', 'aside'];
    const foundSemanticTags = [];
    
    semanticTags.forEach(tag => {
      if (content.includes(`<${tag}`)) {
        foundSemanticTags.push(tag);
      }
    });
    
    if (!foundSemanticTags.includes('main')) {
      analysis.issues.push({
        type: 'Accessibility',
        severity: 'warning',
        message: '建议使用main标签标识主要内容'
      });
    }
    
    if (!foundSemanticTags.includes('nav')) {
      analysis.issues.push({
        type: 'Accessibility',
        severity: 'warning',
        message: '建议使用nav标签标识导航区域'
      });
    }
    
    analysis.structure.semanticTags = foundSemanticTags;
  }

  analyzeLinks(content, analysis) {
    // 检查链接
    const linkPattern = /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;
    let match;
    
    while ((match = linkPattern.exec(content)) !== null) {
      const href = match[1];
      const text = match[2];
      
      analysis.links.push({
        href: href,
        text: text.trim()
      });
      
      // 检查空链接
      if (!text.trim()) {
        analysis.issues.push({
          type: 'Accessibility',
          severity: 'warning',
          message: `发现空链接文本: ${href}`
        });
      }
      
      // 检查无效链接
      if (href === '#' || href === 'javascript:void(0)') {
        analysis.issues.push({
          type: 'Quality',
          severity: 'warning',
          message: '发现占位符链接'
        });
      }
      
      // 检查外部链接
      if (href.startsWith('http') && !href.includes('theinvisiblecharacter.live')) {
        analysis.issues.push({
          type: 'SEO',
          severity: 'info',
          message: `外部链接: ${href}`
        });
      }
    }
  }

  analyzeResources(content, analysis) {
    // 检查脚本
    const scriptPattern = /<script[^>]*src=["']([^"']*)["'][^>]*>/gi;
    let match;
    
    while ((match = scriptPattern.exec(content)) !== null) {
      const src = match[1];
      analysis.scripts.push(src);
      
      // 检查外部脚本
      if (src.startsWith('http')) {
        const integrityMatch = content.match(new RegExp(`integrity="([^"]*)"`));
        if (!integrityMatch) {
          analysis.issues.push({
            type: 'Security',
            severity: 'warning',
            message: `外部脚本缺少完整性验证: ${src}`
          });
        }
      }
    }
    
    // 检查样式
    const stylePattern = /<link[^>]*href=["']([^"']*\.css)["'][^>]*>/gi;
    while ((match = stylePattern.exec(content)) !== null) {
      const href = match[1];
      analysis.styles.push(href);
    }
    
    // 检查内联样式
    const inlineStyles = content.match(/style="[^"]*"/gi);
    if (inlineStyles && inlineStyles.length > 5) {
      analysis.issues.push({
        type: 'Performance',
        severity: 'warning',
        message: `发现 ${inlineStyles.length} 个内联样式，建议使用CSS类`
      });
    }
    
    // 检查内联脚本
    const inlineScripts = content.match(/<script[^>]*>(.*?)<\/script>/gi);
    if (inlineScripts && inlineScripts.length > 3) {
      analysis.issues.push({
        type: 'Performance',
        severity: 'warning',
        message: `发现 ${inlineScripts.length} 个内联脚本，建议外部化`
      });
    }
  }

  analyzeAccessibility(content, analysis) {
    // 检查alt属性
    const imgPattern = /<img[^>]*>/gi;
    let match;
    
    while ((match = imgPattern.exec(content)) !== null) {
      const imgTag = match[0];
      if (!imgTag.includes('alt=')) {
        analysis.issues.push({
          type: 'Accessibility',
          severity: 'error',
          message: '图片缺少alt属性'
        });
      } else if (imgTag.includes('alt=""')) {
        analysis.issues.push({
          type: 'Accessibility',
          severity: 'warning',
          message: '图片alt属性为空'
        });
      }
    }
    
    // 检查表单标签
    const inputPattern = /<input[^>]*>/gi;
    while ((match = inputPattern.exec(content)) !== null) {
      const inputTag = match[0];
      if (!inputTag.includes('id=') || !content.includes(`for="${inputTag.match(/id="([^"]*)"/)?.[1]}"`)) {
        analysis.issues.push({
          type: 'Accessibility',
          severity: 'warning',
          message: '表单输入框缺少对应的label标签'
        });
      }
    }
    
    // 检查语言属性
    if (!content.match(/<html[^>]*lang=/)) {
      analysis.issues.push({
        type: 'Accessibility',
        severity: 'warning',
        message: 'HTML标签缺少lang属性'
      });
    }
    
    // 检查ARIA标签
    const ariaLabels = content.match(/aria-label="[^"]*"/gi);
    const ariaDescribedby = content.match(/aria-describedby="[^"]*"/gi);
    
    if (!ariaLabels && !ariaDescribedby) {
      analysis.issues.push({
        type: 'Accessibility',
        severity: 'info',
        message: '考虑添加ARIA标签提升可访问性'
      });
    }
  }

  analyzeSEO(content, analysis) {
    // 检查canonical URL
    if (!content.includes('rel="canonical"')) {
      analysis.issues.push({
        type: 'SEO',
        severity: 'warning',
        message: '缺少canonical URL'
      });
    }
    
    // 检查hreflang标签
    if (!content.includes('hreflang=')) {
      analysis.issues.push({
        type: 'SEO',
        severity: 'info',
        message: '多语言网站建议添加hreflang标签'
      });
    }
    
    // 检查结构化数据
    if (!content.includes('application/ld+json')) {
      analysis.issues.push({
        type: 'SEO',
        severity: 'info',
        message: '考虑添加结构化数据'
      });
    }
    
    // 检查关键词密度
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textContent.split(' ');
    
    if (words.length < 100) {
      analysis.issues.push({
        type: 'SEO',
        severity: 'warning',
        message: '页面内容较少，建议增加内容'
      });
    }
  }

  checkCommonIssues(content, analysis) {
    // 检查注释中的敏感信息
    const comments = content.match(/<!--(.*?)-->/gis);
    if (comments) {
      comments.forEach(comment => {
        const commentText = comment.replace(/<!--|-->/g, '').trim();
        if (commentText.includes('TODO') || commentText.includes('FIXME')) {
          analysis.issues.push({
            type: 'Quality',
            severity: 'info',
            message: `发现TODO/FIXME注释: ${commentText.substring(0, 50)}...`
          });
        }
      });
    }
    
    // 检查硬编码URL
    const hardcodedUrls = content.match(/https:\/\/[^"'\s]*\.html/g);
    if (hardcodedUrls) {
      analysis.issues.push({
        type: 'Maintainability',
        severity: 'warning',
        message: `发现 ${hardcodedUrls.length} 个硬编码URL`
      });
    }
    
    // 检查重复内容
    const lines = content.split('\n');
    const lineCounts = {};
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 10) {
        lineCounts[trimmedLine] = (lineCounts[trimmedLine] || 0) + 1;
      }
    });
    
    Object.entries(lineCounts).forEach(([line, count]) => {
      if (count > 3) {
        analysis.issues.push({
          type: 'Quality',
          severity: 'info',
          message: `发现重复代码行 (出现${count}次): ${line.substring(0, 50)}...`
        });
      }
    });
  }

  generateReport() {
    const reportPath = path.join('.', 'static-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    console.log('\n📊 静态分析总结');
    console.log('='.repeat(50));
    console.log(`分析页面数: ${this.results.summary.totalPages}`);
    console.log(`发现问题数: ${this.results.summary.totalIssues}`);
    
    if (this.results.summary.totalIssues > 0) {
      console.log('\n🔍 问题类型分布:');
      Object.entries(this.results.summary.issuesByType).forEach(([type, count]) => {
        console.log(`  ${type}: ${count} 个问题`);
      });
      
      console.log('\n📄 详细报告已保存到: static-analysis-report.json');
    } else {
      console.log('\n✅ 未发现明显问题');
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const analyzer = new StaticAnalyzer();
  analyzer.analyzeProject().catch(console.error);
}

module.exports = StaticAnalyzer;