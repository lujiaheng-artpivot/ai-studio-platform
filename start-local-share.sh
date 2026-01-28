#!/bin/bash

echo "🌐 启动局域网共享服务器"
echo "========================"
echo ""

cd /Users/lujiaheng/Documents/ai-studio-platform

# 获取本机IP
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "无法获取IP")

echo "📡 服务器信息:"
echo ""
echo "   本地访问: http://localhost:3000"
echo "   局域网访问: http://$LOCAL_IP:3000"
echo ""
echo "📱 同一WiFi下的设备可以访问:"
echo "   http://$LOCAL_IP:3000"
echo ""
echo "💡 分享给朋友:"
echo "   1. 确保连接同一WiFi"
echo "   2. 在手机/电脑浏览器输入上面的地址"
echo "   3. 即可访问您的网站！"
echo ""
echo "🚀 正在启动服务器..."
echo "   按 Ctrl+C 停止服务器"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 停止之前的服务器
pkill -f "next dev" 2>/dev/null

# 启动服务器（允许外部访问）
npm run dev -- -H 0.0.0.0 -p 3000
