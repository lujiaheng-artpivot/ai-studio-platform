#!/bin/bash

# 🚀 一键部署到Vercel

echo "╔════════════════════════════════════════════════════════╗"
echo "║     AI Studio Platform - 一键部署到公网               ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

cd /Users/lujiaheng/Documents/ai-studio-platform

echo "📋 部署步骤："
echo ""
echo "1️⃣  Vercel登录"
echo "2️⃣  项目配置"
echo "3️⃣  开始部署"
echo "4️⃣  获取公网地址"
echo ""

read -p "按回车键开始部署..." 

echo ""
echo "🔐 步骤1: 登录Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "浏览器将自动打开，请选择登录方式："
echo "  • GitHub (推荐)"
echo "  • GitLab"
echo "  • Bitbucket"
echo "  • Email"
echo ""
echo "登录后返回终端继续..."
echo ""

# 执行登录
vercel login

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 登录成功！"
    echo ""
    
    echo "🚀 步骤2: 开始部署"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Vercel会询问几个问题，建议回答："
    echo ""
    echo "  Set up and deploy? → Yes"
    echo "  Which scope? → 选择你的账号"
    echo "  Link to existing project? → No"
    echo "  What's your project's name? → ai-studio-platform"
    echo "  In which directory is your code? → ./"
    echo "  Override settings? → No"
    echo ""
    
    read -p "准备好了吗？按回车开始部署..." 
    
    echo ""
    echo "⏳ 正在部署..."
    echo ""
    
    # 执行部署
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "╔════════════════════════════════════════════════════════╗"
        echo "║              🎉 部署成功！                             ║"
        echo "╚════════════════════════════════════════════════════════╝"
        echo ""
        echo "📱 您的网站已上线！"
        echo ""
        echo "🌐 公网地址显示在上方 (https://xxx.vercel.app)"
        echo ""
        echo "✨ 可访问的页面："
        echo "   • 首页: /"
        echo "   • 定价: /pricing"
        echo "   • 演示Dashboard: /demo-dashboard"
        echo "   • 配置助手: /setup"
        echo ""
        echo "📤 分享给任何人："
        echo "   复制上方的网址，全世界都可以访问！"
        echo ""
        echo "🔧 管理您的项目："
        echo "   访问: https://vercel.com/dashboard"
        echo ""
        echo "📝 更新网站："
        echo "   修改代码后运行: vercel --prod"
        echo ""
    else
        echo ""
        echo "❌ 部署失败"
        echo ""
        echo "💡 可能的原因："
        echo "   1. 网络连接问题"
        echo "   2. 项目配置错误"
        echo "   3. Vercel服务异常"
        echo ""
        echo "🔧 解决方法："
        echo "   1. 检查网络连接"
        echo "   2. 重新运行此脚本"
        echo "   3. 查看错误信息"
        echo ""
    fi
else
    echo ""
    echo "❌ 登录失败"
    echo ""
    echo "💡 请检查："
    echo "   1. 网络连接是否正常"
    echo "   2. 浏览器是否已打开"
    echo "   3. 是否完成了登录流程"
    echo ""
    echo "🔄 重新运行: bash one-click-deploy.sh"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 更多帮助："
echo "   • 部署指南: DEPLOY_TO_PUBLIC.md"
echo "   • Vercel文档: https://vercel.com/docs"
echo ""
