#!/bin/bash

# AI Studio Platform - 交互式部署助手

echo "🌐 AI Studio Platform - 部署到公网助手"
echo "=========================================="
echo ""

# 检查Git配置
echo "📋 检查Git配置..."
if ! git config user.name > /dev/null 2>&1; then
    echo "⚙️  配置Git用户信息..."
    read -p "请输入您的名字: " git_name
    read -p "请输入您的邮箱: " git_email
    git config --global user.name "$git_name"
    git config --global user.email "$git_email"
    echo "✅ Git配置完成"
else
    echo "✅ Git已配置"
    echo "   用户: $(git config user.name)"
    echo "   邮箱: $(git config user.email)"
fi

echo ""
echo "📦 当前项目状态:"
cd /Users/lujiaheng/Documents/ai-studio-platform
echo "   路径: $(pwd)"
echo "   分支: $(git branch --show-current)"
echo "   提交: $(git log -1 --oneline 2>/dev/null || echo '无提交记录')"

echo ""
echo "🔗 接下来的步骤:"
echo ""
echo "1️⃣  创建GitHub仓库"
echo "   我已经为您打开了GitHub页面"
echo "   请创建一个名为 'ai-studio-platform' 的公开仓库"
echo ""

read -p "已创建GitHub仓库？(y/n): " created_repo

if [ "$created_repo" = "y" ]; then
    echo ""
    read -p "请输入您的GitHub用户名: " github_username
    
    echo ""
    echo "📤 推送代码到GitHub..."
    
    # 检查是否已有remote
    if git remote get-url origin > /dev/null 2>&1; then
        echo "⚠️  检测到已存在的remote，移除旧的..."
        git remote remove origin
    fi
    
    # 添加新的remote
    git remote add origin "https://github.com/$github_username/ai-studio-platform.git"
    
    echo "🚀 推送代码..."
    git branch -M main
    
    if git push -u origin main; then
        echo ""
        echo "✅ 代码推送成功！"
        echo ""
        echo "🎯 GitHub仓库地址:"
        echo "   https://github.com/$github_username/ai-studio-platform"
        echo ""
        echo "2️⃣  部署到Vercel"
        echo "   访问: https://vercel.com/new"
        echo "   或者我现在为您打开..."
        echo ""
        
        read -p "是否打开Vercel部署页面？(y/n): " open_vercel
        
        if [ "$open_vercel" = "y" ]; then
            open "https://vercel.com/new"
            echo ""
            echo "📋 Vercel部署步骤:"
            echo "   1. 使用GitHub账号登录"
            echo "   2. 导入 'ai-studio-platform' 仓库"
            echo "   3. 点击 'Deploy'"
            echo "   4. 等待2-3分钟"
            echo "   5. 完成！获取您的公网地址"
            echo ""
            echo "🎉 部署完成后，您的网站将可以被全世界访问！"
        fi
    else
        echo ""
        echo "❌ 推送失败"
        echo ""
        echo "💡 可能的原因:"
        echo "   1. GitHub用户名输入错误"
        echo "   2. 仓库未创建或名称不匹配"
        echo "   3. 需要GitHub身份验证"
        echo ""
        echo "🔧 解决方法:"
        echo "   1. 检查GitHub用户名"
        echo "   2. 确认仓库已创建"
        echo "   3. 配置GitHub Personal Access Token"
        echo ""
        echo "📖 详细步骤请查看: DEPLOY_TO_PUBLIC.md"
    fi
else
    echo ""
    echo "📖 请先完成以下步骤:"
    echo ""
    echo "1. 访问: https://github.com/new"
    echo "2. 创建仓库:"
    echo "   - 名称: ai-studio-platform"
    echo "   - 可见性: Public"
    echo "   - 不要勾选 'Initialize with README'"
    echo "3. 点击 'Create repository'"
    echo ""
    echo "完成后重新运行此脚本: bash deploy.sh"
fi

echo ""
echo "📚 更多帮助:"
echo "   - 部署指南: DEPLOY_TO_PUBLIC.md"
echo "   - 项目文档: README.md"
echo "   - 快速开始: QUICKSTART.md"
echo ""
