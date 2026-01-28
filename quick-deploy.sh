#!/bin/bash

# 快速部署脚本（无需GitHub）

echo "🚀 快速部署到Vercel（无需GitHub）"
echo "===================================="
echo ""

cd /Users/lujiaheng/Documents/ai-studio-platform

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装Vercel CLI..."
    npm install -g vercel
fi

echo "🔐 登录Vercel..."
echo "   浏览器会自动打开，请完成登录"
echo ""

vercel login

echo ""
echo "🚀 开始部署..."
echo ""

vercel --prod

echo ""
echo "🎉 部署完成！"
echo ""
echo "您的网站地址将显示在上方"
echo "复制地址分享给任何人！"
