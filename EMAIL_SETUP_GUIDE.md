# 📧 邮件推送功能配置指南

## 功能概述

本指南帮助你配置 AI Daily 的每日邮件推送功能，实现每天早上 8 点自动发送最新的 AI 资讯日报到订阅用户的邮箱。

## ✅ 已完成的工作

- ✅ 创建了精美的邮件模板（HTML）
- ✅ 实现了 Vercel Serverless Function 用于发送邮件
- ✅ 集成了 Resend API 和 Supabase 数据库
- ✅ 配置了 Cron Job（每天早上 8 点自动执行）
- ✅ 实现了文章自动获取和邮件生成逻辑

## 🔧 配置步骤

### 第一步：在 Vercel 添加环境变量

登录 [Vercel Dashboard](https://vercel.com/dashboard)，进入你的项目，在 Settings → Environment Variables 中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `RESEND_API_KEY` | `re_Scu4PpCq_MUixRBDrs7oDir8D23LmQ9bT` | 你的 Resend API Key |
| `RESEND_FROM_EMAIL` | `AI Daily <onboarding@resend.dev>` | 发件邮箱（开发阶段可用 Resend 测试域名） |
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL | 数据库地址 |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的 Service Role Key | Supabase 管理员密钥 |
| `WEBSITE_URL` | `https://ai-daily.vercel.app` | 你的网站地址 |
| `CRON_SECRET` | 生成一个随机字符串 | 用于验证 Cron Job 请求 |

**注意：**
- Service Role Key 在 Supabase Dashboard → Settings → API 中获取
- CRON_SECRET 可以生成一个随机的 UUID，例如：`uuidgen` 或使用在线工具生成

### 第二步：验证 Supabase Service Role Key

确保你的 SUPABASE_SERVICE_ROLE_KEY 是 Service Role Key 而不是 Public Key。

在代码中，我们需要查询 `articles` 表，如果没有 Service Role Key，可以临时修改代码直接使用 public key：

```javascript
// 在 api/send-daily-email.js 中修改
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
```

并在环境变量中添加：
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 第三步：配置测试邮箱

在 `api/send-daily-email.js` 中，找到 `getSubscribers()` 函数，修改测试邮箱：

```javascript
async function getSubscribers() {
  // 临时返回测试邮箱
  const testEmails = ['your-email@example.com'];
  return testEmails;
  // ... 后续可以从 Supabase subscribers 表获取
}
```

### 第四步：部署到 Vercel

```bash
# 提交代码
git add .
git commit -m "添加邮件推送功能"
git push

# Vercel 会自动部署
```

### 第五步：测试邮件发送

部署完成后，可以通过以下方式测试：

#### 方式一：手动触发 API

```bash
curl -X POST https://ai-daily.vercel.app/api/send-daily-email \
  -H "Content-Type: application/json" \
  -H "X-Cron-Secret: your-cron-secret-here"
```

#### 方式二：在浏览器访问

直接访问 `https://ai-daily.vercel.app/api/send-daily-email`（如果移除了 POST 限制）

#### 方式三：在 Vercel Dashboard 测试

1. 进入 Vercel Dashboard → 你的项目
2. 点击 Functions → 选择 `/api/send-daily-email`
3. 点击 "Invoke" 按钮

## 📊 Cron Job 时间说明

Vercel Cron 使用 **UTC 时间**，所以需要转换：

| 北京时间 | UTC 时间 | Cron 表达式 |
|---------|---------|-------------|
| 早上 8:00 | 凌晨 0:00 | `0 0 * * *` |
| 早上 9:00 | 凌晨 1:00 | `0 1 * * *` |

当前配置：`0 8 * * *` 表示每天 **UTC 上午 8 点**，即 **北京时间下午 4 点**。

### 修改为北京时间早上 8 点

修改 `vercel.json`：

```json
{
  "crons": [
    {
      "path": "/api/send-daily-email",
      "schedule": "0 0 * * *"  // UTC 0:00 = 北京时间 8:00
    }
  ]
}
```

## 📧 Resend 使用说明

### 开发阶段（免费）

使用 Resend 提供的测试域名 `onboarding@resend.dev`，每天可以发送最多 3000 封邮件，但只能发送到已验证的邮箱（最多 3 个）。

**验证测试邮箱：**
1. 登录 [Resend Dashboard](https://resend.com/dashboard)
2. 进入 Settings → Email API
3. 在 "Allowed Domains" 下添加你的邮箱

### 生产环境

1. 添加自己的域名：Settings → Domains → Add Domain
2. 按照提示配置 DNS 记录
3. 等待验证完成
4. 修改 `RESEND_FROM_EMAIL` 为你的域名邮箱，例如：
   ```
   RESEND_FROM_EMAIL=AI Daily <noreply@yourdomain.com>
   ```

## 🔍 故障排查

### 问题1：邮件发送失败

**检查：**
- Resend API Key 是否正确
- 发件邮箱是否已验证
- 环境变量是否已添加到 Vercel

**查看日志：**
- Vercel Dashboard → Functions → `/api/send-daily-email` → Logs

### 问题2：Cron Job 没有执行

**检查：**
- `vercel.json` 配置是否正确
- 项目是否已重新部署
- 查看部署日志是否有 Cron Job 执行记录

### 问题3：获取不到文章数据

**检查：**
- Supabase URL 和 Key 是否正确
- `articles` 表是否存在且有数据
- 数据库的 RLS（Row Level Security）策略是否允许读取

## 📝 下一步优化

1. **创建订阅管理功能**：
   - 添加订阅表单（在网站首页）
   - 实现退订功能
   - 管理订阅状态

2. **Supabase subscribers 表结构**：

```sql
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);
```

3. **订阅统计**：
   - 总订阅数
   - 活跃订阅数
   - 今日新增订阅

## 📚 相关文件

- `api/send-daily-email.js` - 邮件发送 API
- `templates/email-template.html` - 邮件模板
- `vercel.json` - Vercel 配置（Cron Job）
- `package.json` - 项目依赖
- `.env.example` - 环境变量示例

---

**配置完成后，每天早上 8 点（北京时间），系统会自动发送最新的 AI 资讯日报到所有订阅用户的邮箱！** 🚀
