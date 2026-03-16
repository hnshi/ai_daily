# AI日氪 - 自动化爬虫配置

## 功能说明
这个爬虫系统会：
1. 自动从多个 AI 资讯源抓取最新内容
2. 使用 AI 模型自动翻译和摘要
3. 定时更新到 Supabase 数据库
4. 通过 GitHub Actions 实现全自动化

## 抓取来源
- TechCrunch (AI栏目)
- The Verge (AI栏目)
- MIT Technology Review
- 36氪 (AI/科技栏目)
- InfoQ (AI/大数据)
- 量子位
- 机器之心
- 新智元

## 使用方法

### 1. 配置环境变量
在 GitHub 仓库的 Settings → Secrets and variables → Actions 中添加：
- `SUPABASE_URL`: 你的 Supabase 项目 URL
- `SUPABASE_KEY`: Supabase 的 service_role key（不是 anon key！）
- `OPENAI_API_KEY`: OpenAI API 密钥（用于 AI 摘要）

### 2. 创建 GitHub Actions workflow
将 `.github/workflows/crawler.yml` 添加到你的仓库

### 3. 手动运行或等待定时任务
- 手动运行：GitHub Actions 页面 → 选择 workflow → 点击 "Run workflow"
- 定时运行：默认每天早上 8 点自动运行（北京时间）

## 脚本说明

### crawler.py
主爬虫脚本，包含：
- RSS/HTML 解析
- 内容提取
- AI 摘要生成
- 数据库写入

### requirements.txt
Python 依赖包列表

## 注意事项

### Supabase Key 权限
⚠️ **重要**：必须使用 service_role key，因为它有写入权限。anon key 只能读取！

如何获取：
1. Supabase 控制台 → Settings → API
2. 复制 `service_role` key（不是 `service_role secret`）
3. 添加到 GitHub Secrets

### OpenAI API
用于自动生成资讯摘要，如果不使用可以注释掉相关代码。

### 定时任务
默认配置为每天早上 8 点（UTC+0），你可以修改 crawler.yml 中的 cron 表达式。

## 故障排查

### 1. 爬虫运行但数据库没有数据
- 检查 Supabase Key 是否是 service_role
- 检查 RLS 策略是否允许写入
- 查看 GitHub Actions 日志

### 2. AI 摘要失败
- 检查 OpenAI API Key 是否正确
- 检查 API 账户余额
- 可以暂时禁用 AI 摘要功能

### 3. 抓取失败
- 检查目标网站是否有反爬机制
- 可能需要添加 User-Agent 或代理
- 查看具体错误日志

## 扩展功能

你可以扩展这个系统：
1. 添加更多资讯源
2. 实现智能去重
3. 添加图片抓取
4. 实现邮件推送
5. 添加人工审核流程
