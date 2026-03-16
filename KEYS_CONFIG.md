# 🔑 密钥配置说明

## 密钥区分

### 1. anon / public key（浏览器端使用）
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrdmVnZ3Jjb2Z0Z3h2eHRrYm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NDI0NTksImV4cCI6MjA4OTIxODQ1OX0.mo8px2ta-qIBIPFG6x2YLV0LNnqJUxLppHhjRidCLKs
```

**用途**：
- ✅ 前端代码（HTML/JS）
- ✅ 浏览器环境
- ✅ 可以公开（因为有 RLS 保护）

**使用场景**：
- 读取数据库数据
- 用户订阅（写入 subscriptions 表，需要 RLS 策略允许）

**位置**：
- `index.html`（已配置）
- `script.js`（已配置）
- `test-db.html`（已配置）

---

### 2. service_role key（服务器端使用）
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrdmVnZ3Jjb2Z0Z3h2eHRrYm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY0MjQ1OSwiZXhwIjoyMDg5MjE4NDU5fQ.xsqN9gY6YlRDVE1MVYFk7mU9uwQyfRjh6rOv7lDxkGQ
```

**用途**：
- ⚠️ 服务器端代码（Python）
- ⚠️ GitHub Actions
- ⚠️ 绝对不能泄露！

**使用场景**：
- 写入 articles 表（爬虫）
- 完全绕过 RLS 限制
- 拥有所有权限

**位置**：
- `crawler.py`（通过环境变量）
- GitHub Secrets（SUPABASE_KEY）

---

## ⚠️ 重要安全提示

### service_role key 必须：
1. ✅ 只在服务器端使用
2. ✅ 通过环境变量或 Secrets 存储
3. ✅ 永远不要提交到 Git 仓库
4. ✅ 如果泄露，立即在 Supabase 控制台重新生成

### anon key 可以：
1. ✅ 在前端代码中使用
2. ✅ 提交到 Git 仓库
3. ✅ 公开访问
4. ✅ 安全（有 RLS 保护）

---

## 📝 配置总结

### 前端（已配置 ✅）
- **文件**：`script.js`, `test-db.html`
- **密钥**：anon key
- **状态**：已更新

### 后端（需要配置 ⚠️）
- **文件**：`crawler.py`
- **密钥**：service_role key
- **存储位置**：GitHub Secrets

### GitHub Secrets 配置

在 GitHub 仓库 → Settings → Secrets and variables → Actions 添加：

| Secret 名称 | 值 |
|------------|------|
| `SUPABASE_URL` | `https://pkveggrcoftgxvxtkbnj.supabase.co` |
| `SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrdmVnZ3Jjb2Z0Z3h2eHRrYm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY0MjQ1OSwiZXhwIjoyMDg5MjE4NDU5fQ.xsqN9gY6YlRDVE1MVYFk7mU9uwQyfRjh6rOv7lDxkGQ` |
| `OPENAI_API_KEY` | （可选）你的 OpenAI key |

---

## 🧪 测试步骤

### 1. 测试前端连接（anon key）
```bash
# 在浏览器中打开 test-db.html
file:///c:/Users/永超/WorkBuddy/Claw/ai-daily/test-db.html
```

应该能看到：
- ✅ 连接成功
- ✅ 显示数据库中的资讯

### 2. 测试爬虫（service role key）
1. 推送代码到 GitHub
2. 配置 GitHub Secrets
3. 运行 GitHub Actions
4. 在 Supabase 控制台查看数据

---

## 🔄 密钥更换

如果需要更换密钥：

### 1. 更换 anon key
1. Supabase 控制台 → Settings → API
2. 复制新的 anon key
3. 更新 `script.js` 和 `test-db.html`
4. 推送代码到 GitHub

### 2. 更换 service_role key
1. Supabase 控制台 → Settings → API
2. 点击 "Generate new JWT secret" 生成新的 service_role key
3. 复制新的 service_role key
4. 更新 GitHub Secrets（SUPABASE_KEY）
5. 删除旧的密钥

---

## 📞 常见问题

### Q：为什么不能用 service_role key 在前端？
A：因为 service_role key 有完全权限，如果泄露，攻击者可以删除整个数据库！

### Q：anon key 安全吗？
A：是的，因为有 RLS（Row Level Security）保护，只能访问你允许的数据。

### Q：如何确认使用了正确的密钥？
A：
- 前端：anon key（role: "anon"）
- 后端：service_role key（role: "service_role"）

查看 JWT payload 可以确认密钥类型。

---

## ✅ 检查清单

- [x] 前端已配置 anon key
- [x] 测试页面已配置 anon key
- [ ] 推送代码到 GitHub
- [ ] 在 GitHub 配置 service_role key（SUPABASE_KEY）
- [ ] 测试 GitHub Actions
- [ ] 确认数据写入成功

---

**安全第一，永远不要泄露 service_role key！** 🔒
