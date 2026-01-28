# 🚀 快速开始指南

## 5分钟快速启动

### 1. 安装依赖
```bash
cd /Users/lujiaheng/Documents/ai-studio-platform
npm install
```

### 2. 配置环境变量

复制 `.env.local` 文件并填入你的密钥：

```env
# 最小配置（用于本地开发测试）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_key_here
GOOGLE_GEMINI_API_KEY=your_key_here
DATABASE_URL="postgresql://user:password@localhost:5432/aistudio"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 初始化数据库
```bash
npm run db:generate
npm run db:push
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

---

## 📝 获取必需的API密钥

### Clerk (认证) - 5分钟
1. 访问 https://clerk.com → Sign up
2. Create Application → 选择 "Email + Google"
3. 复制 API Keys 到 `.env.local`

### Google Gemini (AI) - 2分钟
1. 访问 https://makersuite.google.com/app/apikey
2. Create API Key
3. 复制到 `.env.local`

### Stripe (支付) - 可选，用于测试支付
1. 访问 https://stripe.com → Sign up
2. Get API Keys (测试模式)
3. 复制到 `.env.local`

---

## 🎯 核心功能测试

### 测试认证
1. 访问 http://localhost:3000
2. 点击 "Sign Up"
3. 注册新账号
4. 登录到Dashboard

### 测试AI工具
1. 进入 Dashboard → AI Tools
2. 点击 "CineStyle AI"
3. 输入剧本文本
4. 点击 "Analyze Script"

### 测试支付（需要Stripe配置）
1. 进入 Dashboard → Billing
2. 点击 "Upgrade Now"
3. 使用测试卡号: 4242 4242 4242 4242

---

## 📂 项目结构

```
ai-studio-platform/
├── app/
│   ├── api/              # API路由
│   ├── dashboard/        # 用户Dashboard
│   ├── pricing/          # 定价页面
│   └── page.tsx          # 首页
├── lib/
│   ├── constants.ts      # 配置常量
│   └── stripe.ts         # Stripe配置
├── prisma/
│   └── schema.prisma     # 数据库模型
└── .env.local            # 环境变量
```

---

## 🛠️ 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 数据库
npm run db:generate      # 生成Prisma Client
npm run db:push          # 推送数据库架构
npm run db:studio        # 打开数据库管理界面

# Stripe
npm run stripe:listen    # 监听Stripe Webhook（需安装Stripe CLI）
```

---

## ✅ 功能清单

### 已完成 ✓
- [x] 用户认证（Email + Google OAuth）
- [x] 用户Dashboard
- [x] 4层订阅定价
- [x] Stripe支付集成
- [x] AI脚本分析（Gemini API）
- [x] AI图片生成
- [x] 计算秒数追踪
- [x] 响应式设计

### 待实现 ⏳
- [ ] 数据库CRUD操作（当前使用mock数据）
- [ ] 计算秒数扣除逻辑
- [ ] 图片云存储上传
- [ ] 其他5个AI工具页面
- [ ] 用户使用历史
- [ ] API访问（Pro计划）
- [ ] 团队协作（Pro计划）

---

## 🎨 自定义配置

### 修改定价
编辑 `lib/constants.ts`:
```typescript
export const SUBSCRIPTION_PLANS = {
  free: {
    price: 0,
    computeSeconds: 50,
    // ...
  },
  // 修改价格和配额
}
```

### 添加新的AI工具
1. 在 `lib/constants.ts` 添加工具定义
2. 创建 `app/dashboard/tools/[tool-name]/page.tsx`
3. 创建对应的API路由

### 修改主题颜色
编辑 `tailwind.config.js` 或直接修改组件中的颜色类名

---

## 🐛 故障排除

### 问题: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### 问题: Prisma错误
```bash
npm run db:generate
npm run db:push
```

### 问题: Clerk认证失败
- 检查 `.env.local` 中的Clerk密钥
- 确认Clerk Dashboard中的重定向URL配置

### 问题: AI API调用失败
- 检查Google Gemini API密钥
- 确认API配额未用完
- 查看浏览器控制台错误信息

---

## 📚 学习资源

- [Next.js文档](https://nextjs.org/docs)
- [Clerk文档](https://clerk.com/docs)
- [Stripe文档](https://stripe.com/docs)
- [Prisma文档](https://www.prisma.io/docs)
- [Google Gemini API](https://ai.google.dev/docs)

---

## 🎉 下一步

1. **完善功能**: 实现数据库操作和计算秒数逻辑
2. **添加工具**: 创建其他5个AI工具页面
3. **测试支付**: 配置Stripe并测试完整支付流程
4. **部署上线**: 按照 DEPLOYMENT.md 部署到Vercel

---

**需要帮助？** 查看 README.md 或 DEPLOYMENT.md 获取详细信息

祝开发顺利！🚀
