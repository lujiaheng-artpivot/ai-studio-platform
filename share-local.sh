#!/bin/bash

# 局域网共享脚本

echo "🌐 启动局域网共享服务器"
echo "========================"
echo ""

cd /Users/lujiaheng/Documents/ai-studio-platform

# 获取本机IP
LOCAL_IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1)

echo "📡 服务器信息:"
echo "   本地访问: http://localhost:3000"
echo "   局域网访问: http://$LOCAL_IP:3000"
echo ""
echo "📱 局域网内的设备可以通过以下地址访问:"
echo "   http://$LOCAL_IP:3000"
echo ""
echo "💡 提示:"
echo "   - 确保设备连接到同一WiFi"
echo "   - 手机扫描二维码访问"
echo ""

# 生成二维码（如果安装了qrencode）
if command -v qrencode &> /dev/null; then
    echo "📱 扫描二维码访问:"
    qrencode -t ANSIUTF8 "http://$LOCAL_IP:3000"
fi

echo ""
echo "🚀 启动服务器..."
echo "   按 Ctrl+C 停止"
echo ""

npm run dev -- -H 0.0.0.0
