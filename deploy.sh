#!/bin/bash

# AI Studio Platform - Vercel部署脚本

echo "🚀 开始部署AI Studio Platform到Vercel..."
echo ""

# 检查是否安装了git
if ! command -v git &> /dev/null; then
    echo "❌ 未检测到Git，请先安装Git"
    exit 1
fi

# 初始化Git仓库
echo "📦 步骤1: 初始化Git仓库..."
cd /Users/lujiaheng/Documents/ai-studio-platform

if [ ! -d .git ]; then
    git init
    echo "✅ Git仓库初始化完成"
else
    echo "✅ Git仓库已存在"
fi

# 创建.gitignore
echo "📝 步骤2: 创建.gitignore文件..."
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# logs
server.log

# backup
*.backup
EOF

echo "✅ .gitignore创建完成"

# 添加所有文件
echo "📦 步骤3: 添加文件到Git..."
git add .
git commit -m "Initial commit: AI Studio Platform" || echo "✅ 文件已提交"

echo ""
echo "✅ 本地准备完成！"
echo ""
echo "📋 接下来请按照以下步骤操作："
echo ""
echo "1️⃣  创建GitHub仓库"
echo "   访问: https://github.com/new"
echo "   仓库名: ai-studio-platform"
echo "   设置为: Public (公开)"
echo ""
echo "2️⃣  推送代码到GitHub"
echo "   复制GitHub提供的命令，类似："
echo "   git remote add origin https://github.com/你的用户名/ai-studio-platform.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  部署到Vercel"
echo "   访问: https://vercel.com/new"
echo "   导入你的GitHub仓库"
echo "   点击Deploy"
echo ""
echo "🎉 完成后你的网站将在几分钟内上线！"
