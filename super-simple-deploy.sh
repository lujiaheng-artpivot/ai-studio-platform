#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║      🚀 超级简单部署 - Vercel CLI直接部署          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

cd /Users/lujiaheng/Documents/ai-studio-platform

echo "📦 检查Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI已安装 ✅"
else
    echo "Vercel CLI未找到，使用已安装的版本"
fi

echo ""
echo "🚀 开始部署到Vercel..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 接下来会发生什么："
echo ""
echo "   1. 浏览器会自动打开Vercel登录页面"
echo "   2. 使用GitHub或Email登录"
echo "   3. 返回终端，按照提示回答几个问题"
echo "   4. Vercel会自动上传和部署代码"
echo "   5. 2-3分钟后获得公网地址！"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "准备好了吗？按回车开始部署..." 

echo ""
echo "🔐 正在打开Vercel登录..."
echo ""

# 使用Vercel CLI部署
npx vercel --prod

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 部署完成！"
echo ""
echo "您的网站地址显示在上方 ↑"
echo ""
echo "✨ 全世界的人都可以访问您的网站了！"
echo ""
