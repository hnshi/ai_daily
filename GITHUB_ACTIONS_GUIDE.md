# GitHub Actions 配置指南

## 快速开始

### 步骤 1：获取 Supabase Service Role Key

⚠️ **重要**：必须使用 `service_role` key，它有写入权限！

1. 打开 Supabase 控制台：https://supabase.com/dashboard/project/pkveggrcoftgxvxtkbnj/settings/api
2. 在 "Project API keys" 部分，找到 `service_role` key
3. 点击复制（注意：这是 `service_role`，不是 `service_role secret`）
4. 保存这个 key，它将用于写入数据库

### 步骤 2：配置 GitHub Secrets

1. 如果还没有 GitHub 仓库，先创建一个：
   - 访问 https://github.com/new
   - 仓库名称：`ai-daily`（或你喜欢的名字）
   - 设置为 Public 或 Private 都可以
   - 创建仓库

2. 将代码推送到 GitHub：
   ```bash
   cd c:\Users\永超\WorkBuddy\Claw\ai-daily
   git init
   git add .
   git commit -m "Initial commit: AI Daily with crawler"
   git branch -M main
   git remote add origin https://github.com/你的用户名/ai-daily.git
   git push -u origin main
   ```

3. 在 GitHub 仓库中配置 Secrets：
   - 进入你的仓库
   - 点击 Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - 添加以下 secrets：

   | Secret 名称 | 值 |
   |------------|------|
   | `SUPABASE_URL` | `https://pkveggrcoftgxvxtkbnj.supabase.co` |
   | `SUPABASE_KEY` | 你复制的 service_role key |
   | `OPENAI_API_KEY` | （可选）你的 OpenAI API key |

### 步骤 3：手动运行测试

1. 在仓库中，点击 Actions 标签
2. 选择 "AI 资讯自动抓取" workflow
3. 点击 "Run workflow" → "Run workflow"
4. 等待几分钟，查看运行结果

### 步骤 4：查看结果

1. 打开 Supabase 控制台
2. 进入 Table Editor → articles 表
3. 你应该能看到新抓取的资讯

## 定时任务

默认配置：
- **运行时间**：每天 UTC 0 点（北京时间早上 8 点）
- **可修改**：编辑 `.github/workflows/crawler.yml` 中的 cron 表达式

### 修改定时时间

```yaml
schedule:
  # cron 格式：分 时 日 月 周
  # UTC 时间，需要换算成北京时间（UTC+8）
  - cron: '0 0 * * *'  # 每天 0 点（北京时间 8 点）

  # 其他示例：
  - cron: '0 */6 * * *'  # 每 6 小时一次
  - cron: '0 12 * * *'  # 每天 12 点（北京时间 20 点）
  - cron: '0 6,12,18 * * *'  # 每天 6, 12, 18 点（北京时间 14, 20, 凌晨 2 点）
```

## 本地运行

如果你想本地测试爬虫：

### 1. 安装 Python
下载并安装 Python 3.10+：https://www.python.org/downloads/

### 2. 安装依赖
```bash
cd c:\Users\永超\WorkBuddy\Claw\ai-daily
pip install -r requirements.txt
```

### 3. 配置环境变量
复制 `.env.example` 为 `.env`：
```bash
copy .env.example .env
```

编辑 `.env` 文件，填入你的配置：
```
SUPABASE_URL=https://pkveggrcoftgxvxtkbnj.supabase.co
SUPABASE_KEY=your-service-role-key-here
OPENAI_API_KEY=your-openai-api-key-here
```

### 4. 运行爬虫
```bash
python crawler.py
```

## 故障排查

### 问题 1：GitHub Actions 运行失败

**可能原因**：
- Secrets 配置错误
- Supabase Key 权限不足

**解决方法**：
1. 检查 GitHub Secrets 是否正确配置
2. 确认使用的是 `service_role` key（不是 `anon` key）
3. 查看 Actions 日志中的错误信息

### 问题 2：抓取到的数据很少

**可能原因**：
- 网站有反爬机制
- RSS feed 结构变化

**解决方法**：
1. 查看日志中的具体错误
2. 可以手动测试 RSS feed 是否可访问
3. 考虑添加更多资讯源

### 问题 3：数据库没有新数据

**可能原因**：
- 文章已存在（去重机制）
- 发布时间太旧（超过 72 小时）

**解决方法**：
1. 检查 Supabase 中是否已有相同 URL 的文章
2. 修改 `filter_recent_articles` 的时间范围
3. 查看日志了解跳过的文章数量

## 扩展功能

### 添加新的资讯源

编辑 `crawler.py` 中的 `NEWS_SOURCES`：

```python
NEWS_SOURCES = [
    # 现有源...

    {
        'name': '新资讯源',
        'url': 'https://example.com/feed.xml',
        'type': 'rss',  # 或 'html'
        'category': 'model',  # model/tool/solo/funding/research
        'source': '来源名称'
    }
]
```

### 禁用 AI 摘要

如果不使用 OpenAI API：
1. 不配置 `OPENAI_API_KEY` secret
2. 爬虫会自动跳过 AI 摘要功能

### 添加更多分类

修改 `CATEGORY_MAP`：

```python
CATEGORY_MAP = {
    'model': '大模型',
    'tool': 'AI工具',
    'solo': 'AI一人项目',
    'funding': '融资动态',
    'research': '学术前沿',
    'news': '新闻动态',  # 新增分类
    'product': '产品发布'  # 新增分类
}
```

## 成本估算

### GitHub Actions（免费）
- 公开仓库：完全免费
- 私有仓库：每月 2000 分钟免费额度

### OpenAI API（可选）
- GPT-3.5-turbo：$0.002/1K tokens
- 每篇摘要约 100-200 tokens
- 100 篇文章/天 ≈ $0.04/天 ≈ $1.2/月

### Supabase（免费）
- 500MB 数据库存储
- 50,000 次请求/月
- 完全满足需求

## 下一步

1. ✅ 配置 GitHub Secrets
2. ✅ 推送代码到 GitHub
3. ✅ 手动运行测试
4. ✅ 确认数据写入成功
5. ✅ 等待定时任务自动运行
6. 📧 添加邮件推送功能
7. 🚀 部署前端到 Vercel
