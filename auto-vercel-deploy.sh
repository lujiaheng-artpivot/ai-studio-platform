#!/bin/bash

cd /Users/lujiaheng/Documents/ai-studio-platform

echo "🚀 开始自动部署..."
echo ""

# 使用expect自动回答问题
expect << 'EOF'
set timeout 300
spawn npx vercel --prod

expect "Set up and deploy" { send "y\r" }
expect "Which scope" { send "\r" }
expect "Link to existing project" { send "n\r" }
expect "What's your project's name" { send "aistudio\r" }
expect "In which directory" { send "\r" }
expect "Want to modify" { send "n\r" }
expect "Do you want to change" { send "n\r" }
expect "Detected a repository" { send "n\r" }

expect eof
EOF

echo ""
echo "✅ 部署完成！"
