#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║   🚀 AI Studio Platform - 完全自动化部署           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

cd /Users/lujiaheng/Documents/ai-studio-platform

echo "📋 步骤 1/4: 配置Git凭证"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git config --global credential.helper osxkeychain
echo "✅ Git凭证配置完成"
echo ""

echo "📦 步骤 2/4: 配置远程仓库"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git remote remove origin 2>/dev/null
git remote add origin https://github.com/lujiaheng-artpivot/ai-studio-platform.git
git branch -M main
echo "✅ 远程仓库配置完成"
echo ""

echo "🌐 步骤 3/4: 使用GitHub CLI推送代码"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "正在检查GitHub CLI..."

# 检查是否安装了gh
if ! command -v gh &> /dev/null; then
    echo "📥 GitHub CLI未安装，正在安装..."
    
    # 下载GitHub CLI
    echo "正在下载GitHub CLI..."
    curl -L https://github.com/cli/cli/releases/download/v2.40.1/gh_2.40.1_macOS_amd64.zip -o /tmp/gh.zip
    
    echo "正在解压..."
    unzip -q /tmp/gh.zip -d /tmp/
    
    echo "正在安装..."
    sudo mv /tmp/gh_2.40.1_macOS_amd64/bin/gh /usr/local/bin/
    
    echo "✅ GitHub CLI安装完成"
    rm -rf /tmp/gh.zip /tmp/gh_2.40.1_macOS_amd64
else
    echo "✅ GitHub CLI已安装"
fi

echo ""
echo "🔐 正在登录GitHub..."
echo ""
echo "⚠️  浏览器将自动打开，请完成GitHub登录"
echo ""

# 使用GitHub CLI登录
gh auth login -w

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ GitHub登录成功！"
    echo ""
    
    echo "📤 步骤 4/4: 推送代码到GitHub"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # 创建GitHub仓库
    echo "正在创建GitHub仓库..."
    gh repo create ai-studio-platform --public --source=. --remote=origin --push 2>/dev/null || {
        echo "仓库可能已存在，直接推送..."
        git push -u origin main
    }
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "╔════════════════════════════════════════════════════════╗"
        echo "║              ✅ 代码推送成功！                        ║"
        echo "╚════════════════════════════════════════════════════════╝"
        echo ""
        echo "📍 GitHub仓库地址："
        echo "   https://github.com/lujiaheng-artpivot/ai-studio-platform"
        echo ""
        
        echo "🚀 正在打开Vercel部署页面..."
        sleep 2
        open "https://vercel.com/new"
        
        echo ""
        echo "╔════════════════════════════════════════════════════════╗"
        echo "║           🎯 最后一步：Vercel部署                     ║"
        echo "╚════════════════════════════════════════════════════════╝"
        echo ""
        echo "📋 在Vercel页面中："
        echo ""
        echo "   1. 点击 'Continue with GitHub' 登录"
        echo "   2. 点击 'Import Project'"
        echo "   3. 选择 'ai-studio-platform' 仓库"
        echo "   4. 点击 'Import'"
        echo "   5. 点击 'Deploy'"
        echo "   6. 等待2-3分钟"
        echo ""
        echo "🎉 部署完成后，您将获得公网地址！"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "✨ 恭喜！代码已成功推送到GitHub！"
        echo "   只需在Vercel完成最后的部署即可！"
        echo ""
    else
        echo ""
        echo "❌ 推送失败"
        echo ""
        echo "请尝试手动推送："
        echo "   git push -u origin main"
        echo ""
    fi
else
    echo ""
    echo "❌ GitHub登录失败"
    echo ""
    echo "💡 请使用GitHub Desktop方式："
    echo "   1. 打开GitHub Desktop"
    echo "   2. File → Add Local Repository"
    echo "   3. 选择项目文件夹"
    echo "   4. 点击 Publish repository"
    echo ""
fi
