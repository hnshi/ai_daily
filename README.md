# AI日氪 - 全球AI资讯每日精选

> 让每个人都能跟上 AI 的步伐

一个自动化 AI 资讯平台，每日精选全球最新 AI 动态，中文翻译，AI 智能摘要。

## ✨ 特性

- 🌐 **全球资讯聚合** - 同步抓取 TechCrunch、The Verge、MIT、36氪等 50+ 顶级媒体
- 🤖 **AI 智能摘要** - 每条资讯经过 AI 二次处理，提炼核心观点
- 📊 **趋势热度排行** - 实时监测热门 AI 话题
- 🏷️ **精准分类标签** - 大模型、AI工具、融资动态、学术前沿、AI一人项目
- 📬 **每日邮件日报** - 每天早上 8 点准时送达
- 🔔 **重大事件即时提醒** - 不错过任何大事
- 🔄 **全自动化** - Python 爬虫 + GitHub Actions 零人工维护

## 🚀 快速开始

### 本地预览

1. 克隆仓库
```bash
git clone https://github.com/你的用户名/ai-daily.git
cd ai-daily
```

2. 打开 `index.html` 即可预览

### 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 导入你的仓库
3. 点击 Deploy

详细配置请参考 [DATABASE_SETUP.md](DATABASE_SETUP.md)

## 📁 项目结构

```
ai-daily/
├── index.html              # 主页
├── style.css               # 样式文件
├── script.js               # 交互逻辑 + Supabase 集成
├── article.html            # 资讯详情页
├── test-db.html            # 数据库连接测试
├── crawler.py              # 爬虫脚本
├── requirements.txt        # Python 依赖
├── .github/workflows/
│   └── crawler.yml         # GitHub Actions 配置
├── supabase-schema.sql     # 数据库建表 SQL
├── DATABASE_SETUP.md       # 数据库配置文档
├── CRAWLER_README.md       # 爬虫说明文档
├── GITHUB_ACTIONS_GUIDE.md # GitHub Actions 配置指南
└── README.md               # 本文档
```

## 🔧 技术栈

- **前端**：HTML + CSS + JavaScript（无框架）
- **数据库**：Supabase（PostgreSQL）
- **爬虫**：Python + feedparser + BeautifulSoup
- **自动化**：GitHub Actions
- **AI 摘要**：OpenAI GPT-3.5（可选）
- **部署**：Vercel（免费）

## 📊 数据库

### 表结构

#### articles（资讯表）
- `id` - 主键
- `title` - 标题
- `summary` - 摘要
- `category` - 分类
- `source` - 来源
- `url` - 原文链接
- `published_at` - 发布时间

#### subscriptions（订阅表）
- `id` - 主键
- `email` - 邮箱地址

详细结构请参考 [DATABASE_SETUP.md](DATABASE_SETUP.md)

## 🔄 自动化流程

### GitHub Actions

- **运行频率**：每天早上 8 点（北京时间）
- **抓取来源**：TechCrunch、The Verge、MIT Tech Review、36氪、量子位、机器之心
- **处理流程**：抓取 → 去重 → AI 摘要 → 写入数据库

详细配置请参考 [GITHUB_ACTIONS_GUIDE.md](GITHUB_ACTIONS_GUIDE.md)

## 📖 文档

- [DATABASE_SETUP.md](DATABASE_SETUP.md) - 数据库配置指南
- [CRAWLER_README.md](CRAWLER_README.md) - 爬虫使用说明
- [GITHUB_ACTIONS_GUIDE.md](GITHUB_ACTIONS_GUIDE.md) - GitHub Actions 配置指南

## 🎯 分类体系

| 分类 | 标签 | 颜色 |
|------|------|------|
| 大模型 | model | 紫色 |
| AI工具 | tool | 青色 |
| AI一人项目 | solo | 粉色 |
| 融资动态 | funding | 黄色 |
| 学术前沿 | research | 绿色 |

## 💰 成本

| 服务 | 免费额度 | 备注 |
|------|---------|------|
| Vercel | 无限 | 个人项目永久免费 |
| Supabase | 500MB + 50K请求/月 | 完全够用 |
| GitHub Actions | 2000分钟/月 | 公开仓库完全免费 |
| OpenAI API | $0.002/1K tokens | 可选，AI 摘要功能 |

**总计**：完全免费（可选功能除外）

## 🔐 配置清单

### GitHub Secrets

需要在 GitHub 仓库配置以下 Secrets：

- `SUPABASE_URL` - Supabase 项目 URL
- `SUPABASE_KEY` - Supabase service_role key
- `OPENAI_API_KEY` - （可选）OpenAI API key

### Supabase

- 已创建表：articles, subscriptions, users, article_views
- 已配置 RLS 行级安全策略
- 已插入示例数据

## 🚧 待完成

- [ ] 邮件推送功能（Resend API）
- [ ] 用户登录系统
- [ ] 阅读历史记录
- [ ] 评论功能
- [ ] 深度研究报告
- [ ] 移动端 App

## 📝 开发路线图

### Phase 1：基础功能 ✅
- [x] 落地页设计
- [x] 数据库集成
- [x] 资讯展示
- [x] 搜索和筛选
- [x] 订阅功能

### Phase 2：自动化 🚧
- [x] Python 爬虫
- [x] GitHub Actions
- [x] AI 摘要
- [ ] 邮件推送
- [ ] 即时提醒

### Phase 3：高级功能 📋
- [ ] 用户系统
- [ ] 订阅管理
- [ ] 阅读历史
- [ ] 个性化推荐
- [ ] 社群功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📮 联系方式

如有问题或建议，欢迎联系！

---

Made with ❤️ by AI日氪团队
