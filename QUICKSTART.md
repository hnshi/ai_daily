# 🚀 AI日氪 - 快速启动指南

## 📋 5 分钟快速开始

### 步骤 1：获取 Supabase Service Role Key（必须）

⚠️ **重要**：需要复制的是 **service_role key**（不是 anon key！）

1. 打开：https://supabase.com/dashboard/project/pkveggrcoftgxvxtkbnj/settings/api
2. 在 "Project API keys" 部分，找到 `service_role` key
3. 点击复制（注意：Supabase 会提示"This key has the ability to bypass Row Level Security"，这就是我们要的）

**service_role key 示例**：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrdmVnZ3Jjb2Z0Z3h2eHRrYm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY0MjQ1OSwiZXhwIjoyMDg5MjE4NDU5fQ.xsqN9gY6YlRDVE1MVYFk7mU9uwQyfRjh6rOv7lDxkGQ
```

查看详细说明请阅读 [KEYS_CONFIG.md](KEYS_CONFIG.md)

### 步骤 2：创建 GitHub 仓库

1. 访问：https://github.com/new
2. 仓库名：`ai-daily`（或你喜欢的名字）
3. Public 或 Private 都可以
4. 点击 "Create repository"

### 步骤 3：推送代码到 GitHub

在 PowerShell 中运行：

```powershell
cd c:\Users\永超\WorkBuddy\Claw\ai-daily
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/ai-daily.git
git push -u origin main
```

### 步骤 4：配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击：Settings → Secrets and variables → Actions
3. 点击 "New repository secret"，添加以下 3 个：

| Secret 名称 | 值 |
|------------|------|
| `SUPABASE_URL` | `https://pkveggrcoftgxvxtkbnj.supabase.co` |
| `SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrdmVnZ3Jjb2Z0Z3h2eHRrYm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY0MjQ1OSwiZXhwIjoyMDg5MjE4NDU5fQ.xsqN9gY6YlRDVE1MVYFk7mU9uwQyfRjh6rOv7lDxkGQ` |
| `OPENAI_API_KEY` | （可选）你的 OpenAI key |

### 步骤 5：测试爬虫

1. 在仓库中点击 "Actions" 标签
2. 选择 "AI 资讯自动抓取" workflow
3. 点击 "Run workflow" → 绿色的 "Run workflow" 按钮
4. 等待 2-3 分钟

### 步骤 6：查看结果

1. 打开 Supabase 控制台：https://supabase.com/dashboard/project/pkveggrcoftgxvxtkbnj/editor
2. 点击 `articles` 表
3. 你应该能看到新抓取的资讯！🎉

## ✅ 完成！

现在你的网站已经可以自动抓取资讯了！

- **自动运行**：每天早上 8 点（北京时间）自动抓取
- **手动运行**：随时在 GitHub Actions 页面手动触发
- **查看数据**：在 Supabase 控制台查看所有资讯

## 🌐 部署网站（可选）

如果你想部署网站让别人访问：

1. 访问：https://vercel.com/new
2. 导入你的 GitHub 仓库
3. 点击 "Deploy"
4. 几秒钟后，你就有一个在线网站了！

## 📖 详细文档

- [DATABASE_SETUP.md](DATABASE_SETUP.md) - 数据库配置详情
- [CRAWLER_README.md](CRAWLER_README.md) - 爬虫功能说明
- [GITHUB_ACTIONS_GUIDE.md](GITHUB_ACTIONS_GUIDE.md) - GitHub Actions 详细配置

## ❓ 常见问题

### Q1：找不到 service_role key？
A: 在 Supabase 控制台 → Settings → API → Project API keys 部分

### Q2：GitHub Actions 运行失败？
A: 检查 Secrets 是否正确配置，查看 Actions 日志中的错误信息

### Q3：没有抓取到数据？
A: 可能是 RSS feed 暂时不可用，等一段时间后重试

### Q4：不想配置 OpenAI API？
A: 没问题！不配置也可以运行，只是不会自动生成 AI 摘要

## 🎯 下一步

- ✅ 自动抓取资讯
- 📧 添加邮件推送（参考文档）
- 🚀 部署到 Vercel
- 💰 配置订阅收费

祝你使用愉快！🎉
