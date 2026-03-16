# 🚀 AI日氪 - Vercel 部署指南

## 📋 部署前准备

### 1. 准备必要文件

你需要以下文件才能部署到 Vercel：

- ✅ `complete.html` - 完整版网站（单文件，包含所有样式和脚本）
- ✅ `README.md` - 项目说明（可选）

### 2. 账号准备

- GitHub 账号
- Vercel 账号（可以用 GitHub 账号登录）

---

## 🎯 方法一：通过 Vercel 官网部署（推荐，5分钟）

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`ai-daily`
3. 设置为 Public（公开）
4. 不要初始化 README、.gitignore
5. 点击"Create repository"

### 步骤 2：上传代码到 GitHub

在你的电脑上打开 PowerShell 或 CMD：

```powershell
# 进入项目目录
cd c:\Users\永超\WorkBuddy\Claw\ai-daily

# 初始化 Git
git init

# 添加必要的文件
git add complete.html README.md

# 提交代码
git commit -m "feat: AI日氪网站初始版本"

# 重命名分支为 main
git branch -M main

# 添加远程仓库（替换为你的 GitHub 用户名）
git remote add origin https://github.com/你的用户名/ai-daily.git

# 推送代码
git push -u origin main
```

### 步骤 3：在 Vercel 部署

1. 访问 https://vercel.com
2. 点击"Sign Up"或"Login"，用 GitHub 账号登录
3. 登录后，点击 "Add New..." → "Project"
4. 选择刚才创建的 `ai-daily` 仓库
5. 点击"Import"

### 步骤 4：配置部署设置

Vercel 会自动检测配置，但需要手动调整：

1. **Framework Preset**：选择 "Other"
2. **Root Directory**：留空（默认 `./`）
3. **Build and Output Settings**：
   - 由于是静态 HTML，不需要构建命令
   - 直接点击 "Deploy"

### 步骤 5：等待部署

- 部署通常需要 30-60 秒
- 完成后会看到 "✅ Deployed!" 提示
- 点击生成的链接访问你的网站

### 步骤 6：配置自定义域名（可选）

1. 在 Vercel 项目页面，点击 "Settings" → "Domains"
2. 输入你的域名（例如：`ai-daily.yourdomain.com`）
3. 按照提示配置 DNS 记录

---

## 🎯 方法二：通过 Vercel CLI 部署（适合开发者）

### 步骤 1：安装 Vercel CLI

```powershell
# 使用 npm 安装（需要先安装 Node.js）
npm install -g vercel
```

### 步骤 2：登录 Vercel

```powershell
cd c:\Users\永超\WorkBuddy\Claw\ai-daily
vercel login
```

### 步骤 3：部署

```powershell
vercel --prod
```

按照提示操作，Vercel 会自动部署你的网站。

---

## ⚙️ 重要配置

### 配置 Supabase 密钥（前端）

由于前端使用的是 anon key（公开密钥），不需要在 Vercel 中配置环境变量。

anon key 已经在 `complete.html` 中硬编码了，可以直接使用。

### 如果使用服务端功能

如果你后续添加了服务端功能（比如 Python 后端），需要在 Vercel 中配置环境变量：

1. Vercel 项目页面 → "Settings" → "Environment Variables"
2. 添加以下变量：
   - `SUPABASE_URL` = `https://pkveggrcoftgxvxtkbnj.supabase.co`
   - `SUPABASE_KEY` = 你的 service_role key
   - `OPENAI_API_KEY` = 你的 OpenAI key（可选）

---

## 📊 部署后的网站

### 访问地址

Vercel 会自动生成一个 HTTPS 地址，格式为：
```
https://ai-daily-你的用户名.vercel.app
```

例如：
```
https://ai-daily-john.vercel.app
```

### 测试功能

部署后，请测试以下功能：

1. ✅ 页面是否正常显示
2. ✅ 数据库连接是否正常（按 F12 查看 Console）
3. ✅ 搜索功能（Ctrl+K）是否工作
4. ✅ 分类筛选是否工作
5. ✅ 订阅功能是否工作

---

## 🔄 自动部署

### 配置自动部署

Vercel 默认配置了自动部署：

1. 当你推送代码到 GitHub main 分支时
2. Vercel 会自动检测到更改
3. 自动重新部署网站

### 推送新代码

```powershell
# 修改文件后
git add .
git commit -m "更新内容"
git push
```

Vercel 会自动部署！

---

## 🛠️ 常见问题

### 1. 部署后页面空白

**原因**：浏览器缓存问题

**解决**：
- 按 `Ctrl + Shift + R` 强制刷新
- 或者清除浏览器缓存

### 2. 数据库连接失败

**原因**：CORS 策略或密钥问题

**解决**：
- 确认 Supabase anon key 正确
- 检查 Supabase 项目设置中的 CORS 配置

### 3. 搜索功能不工作

**原因**：浏览器快捷键冲突

**解决**：
- 点击搜索按钮使用
- 或者在代码中禁用默认的 Ctrl+K 行为

### 4. 订阅功能不工作

**原因**：数据库权限问题

**解决**：
- 在 Supabase 中检查 RLS（Row Level Security）策略
- 确保 anon 用户可以插入数据到 subscriptions 表

---

## 📝 示例：完整的 Git 推送流程

```powershell
# 1. 进入项目目录
cd c:\Users\永超\WorkBuddy\Claw\ai-daily

# 2. 创建 vercel.json 配置文件（可选）
# 这一步可以跳过，Vercel 会自动配置

# 3. 初始化 Git（如果还没有）
git init

# 4. 添加文件
git add complete.html README.md

# 5. 提交
git commit -m "feat: 初始部署"

# 6. 连接远程仓库
git remote add origin https://github.com/你的用户名/ai-daily.git

# 7. 推送
git branch -M main
git push -u origin main

# 8. 去部署
# 访问 https://vercel.com → Import 项目 → Deploy
```

---

## 🎉 部署成功后

### 接下来可以做什么

1. **添加 Google Analytics**：追踪网站访问数据
2. **配置自定义域名**：使用自己的域名
3. **优化 SEO**：添加 meta 标签、sitemap
4. **添加更多功能**：评论、用户系统、付费订阅
5. **设置自动化**：配置 GitHub Actions 自动抓取资讯

### 分享你的网站

部署成功后，你可以：
- 把 Vercel 生成的链接分享给朋友
- 在社交媒体上发布
- 添加到浏览器收藏夹

---

## 📚 相关文档

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel 部署静态网站](https://vercel.com/docs/concepts/deployments/overview)
- [Supabase 前端集成](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## 💡 提示

- Vercel 免费版限制：每月 100GB 带宽，足够个人使用
- 部署速度通常在 30-60 秒
- 支持自动 HTTPS，无需额外配置
- 全球 CDN 加速，访问速度快

---

**祝你部署顺利！** 🚀

如果遇到问题，请检查：
1. GitHub 仓库是否正确配置
2. Vercel 是否成功连接到 GitHub
3. 代码文件是否正确推送
4. Vercel 部署日志是否有错误信息
