#!/bin/bash
# AI日氪 - Git 初始化脚本

echo "======================================"
echo "AI日氪 - Git 仓库初始化"
echo "======================================"

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建 .gitignore
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# 环境变量
.env

# 日志
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# 操作系统
.DS_Store
Thumbs.db

# 临时文件
*.tmp
*.bak
EOF

# 重新添加 .gitignore
git add .gitignore

# 提交
git commit -m "feat: AI日氪项目初始化

- 添加前端页面（HTML/CSS/JS）
- 集成 Supabase 数据库
- 实现自动化爬虫
- 配置 GitHub Actions
- 添加测试工具和文档"

echo ""
echo "======================================"
echo "✅ Git 仓库初始化完成！"
echo "======================================"
echo ""
echo "下一步："
echo "1. 在 GitHub 创建新仓库"
echo "2. 运行以下命令推送代码："
echo ""
echo "   git branch -M main"
echo "   git remote add origin https://github.com/你的用户名/ai-daily.git"
echo "   git push -u origin main"
echo ""
echo "3. 配置 GitHub Secrets（参考 GITHUB_ACTIONS_GUIDE.md）"
echo ""
