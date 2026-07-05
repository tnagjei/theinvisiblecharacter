# .github/workflows
- 用途：存放项目的自动化集成与部署（CI/CD）工作流配置文件。
- 关键入口：[deploy.yml](file:///Users/tangjei/Documents/建站/工具站/theinvisiblecharacter/.github/workflows/deploy.yml), [ci.yml](file:///Users/tangjei/Documents/建站/工具站/theinvisiblecharacter/.github/workflows/ci.yml)
- 边界/依赖：依赖项目的 package.json 脚本（如 check:all, build）和 Cloudflare 凭证。
> 一旦本目录内容变化，请更新本文件

## Files
- [ci.yml](file:///Users/tangjei/Documents/建站/工具站/theinvisiblecharacter/.github/workflows/ci.yml)：提交和 PR 时运行的基础检查工作流
- [deploy.yml](file:///Users/tangjei/Documents/建站/工具站/theinvisiblecharacter/.github/workflows/deploy.yml)：项目部署到 Cloudflare Pages 的主工作流
