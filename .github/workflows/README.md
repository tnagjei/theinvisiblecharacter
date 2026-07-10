# .github/workflows
- 用途：存放 GitHub Actions 自动化工作流的配置文件
- 关键入口：.github/workflows/deploy.yml
- 边界/依赖：依赖 package.json 中配置的构建与检查脚本
> 一旦本目录内容变化，请更新本文件

## Files
- deploy.yml：项目验证与检查（不执行部署）的唯一工作流
