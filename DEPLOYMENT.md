# 🚀 AI Studio Platform - 完整部署指南

## 📋 部署前准备清单

### 1. 账号注册
- [ ] Clerk账号 (认证服务)
- [ ] Stripe账号 (支付服务)
- [ ] Google Cloud账号 (Gemini API)
- [ ] Vercel账号 (部署平台)
- [ ] 数据库服务 (Supabase/Neon/Railway)

---

## 🔧 详细配置步骤

### Step 1: Clerk 认证配置

1. **创建Clerk应用**
   - 访问 https://dashboard.clerk.com
   - 点击 "Create Application"
   - 选择认证方式：Email + Google OAuth

2. **配置OAuth提供商**
   ```
   Settings → Authentication → Social Connections
   - 启用 Google
   - 配置 Google OAuth Client ID 和 Secret
   ```

3. **获取API密钥**
   ```
   API Keys 页面复制：
   - Publishable Key → NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - Secret Key → CLERK_SECRET_KEY
   ```

4. **配置重定向URL**
   ```
   Settings → Paths
   - Sign-in URL: /sign-in
   - Sign-up URL: /sign-up
   - After sign-in: /dashboard
   - After sign-up: /dashboard
   ```

---

### Step 2: Stripe 支付配置

1. **创建产品和价格**
   ```
   Products → Add Product

   产品1: Lite Plan
   - 价格: $10/月
   - 类型: Recurring (monthly)
   - 复制 Price ID → STRIPE_LITE_PRICE_ID

   产品2: Standard Plan
   - 价格: $30/月
   - 类型: Recurring (monthly)
   - 复制 Price ID → STRIPE_STANDARD_PRICE_ID

   产品3: Pro Plan
   - 价格: $100/月
   - 类型: Recurring (monthly)
   - 复制 Price ID → STRIPE_PRO_PRICE_ID
   ```

2. **获取API密钥**
   ```
   Developers → API Keys
   - Publishable key → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - Secret key → STRIPE_SECRET_KEY
   ```

3. **配置Webhook**
   ```
   Developers → Webhooks → Add endpoint
   
   URL: https://your-domain.com/api/webhooks/stripe
   
   监听事件：
   ✓ checkout.session.completed
   ✓ invoice.payment_succeeded
   ✓ customer.subscription.updated
   ✓ customer.subscription.deleted
   
   复制 Signing secret → STRIPE_WEBHOOK_SECRET
   ```

---

### Step 3: Google Gemini API 配置

1. **获取API密钥**
   ```
   访问: https://makersuite.google.com/app/apikey
   点击 "Create API Key"
   复制密钥 → GOOGLE_GEMINI_API_KEY
   ```

2. **启用API**
   ```
   Google Cloud Console → APIs & Services
   启用以下API:
   - Generative Language API
   - Imagen API (用于图片生成)
   ```

3. **配置计费**
   ```
   确保Google Cloud项目已启用计费
   设置使用配额和预算提醒
   ```

---

### Step 4: 数据库配置

#### 选项A: Supabase (推荐)

1. **创建项目**
   ```
   访问: https://supabase.com
   Create New Project
   选择地区: 选择离用户最近的
   ```

2. **获取连接字符串**
   ```
   Settings → Database → Connection String
   复制 URI → DATABASE_URL
   
   格式: postgresql://postgres:[password]@[host]:5432/postgres
   ```

#### 选项B: Neon

1. **创建项目**
   ```
   访问: https://neon.tech
   Create Project
   ```

2. **获取连接字符串**
   ```
   Dashboard → Connection String
   复制 → DATABASE_URL
   ```

---

### Step 5: Vercel 部署

1. **推送代码到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/ai-studio-platform.git
   git push -u origin main
   ```

2. **导入到Vercel**
   ```
   访问: https://vercel.com
   New Project → Import Git Repository
   选择你的仓库
   ```

3. **配置环境变量**
   ```
   Settings → Environment Variables
   
   添加所有 .env.local 中的变量：
   
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   CLERK_SECRET_KEY=sk_test_xxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   STRIPE_LITE_PRICE_ID=price_xxx
   STRIPE_STANDARD_PRICE_ID=price_xxx
   STRIPE_PRO_PRICE_ID=price_xxx
   
   # Database
   DATABASE_URL=postgresql://xxx
   
   # Google Gemini
   GOOGLE_GEMINI_API_KEY=AIzaSyxxx
   
   # App
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **部署**
   ```
   点击 Deploy
   等待构建完成
   ```

5. **配置自定义域名（可选）**
   ```
   Settings → Domains
   添加你的域名
   配置DNS记录
   ```

---

### Step 6: 数据库初始化

1. **本地连接到生产数据库**
   ```bash
   # 更新 .env.local 中的 DATABASE_URL 为生产数据库
   
   # 生成 Prisma Client
   npx prisma generate
   
   # 推送数据库架构
   npx prisma db push
   
   # 查看数据库
   npx prisma studio
   ```

2. **验证表创建**
   ```
   确认以下表已创建：
   - User
   - Project
   - Generation
   - Subscription
   ```

---

### Step 7: Stripe Webhook 测试

1. **更新Webhook URL**
   ```
   Stripe Dashboard → Webhooks
   编辑endpoint URL为生产域名:
   https://your-domain.vercel.app/api/webhooks/stripe
   ```

2. **测试Webhook**
   ```bash
   # 安装 Stripe CLI
   brew install stripe/stripe-cli/stripe
   
   # 登录
   stripe login
   
   # 转发webhook到本地测试
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   
   # 触发测试事件
   stripe trigger checkout.session.completed
   ```

---

## ✅ 部署后检查清单

### 功能测试
- [ ] 用户注册/登录正常
- [ ] Google OAuth登录正常
- [ ] Dashboard页面加载正常
- [ ] AI工具页面可访问
- [ ] 支付流程完整（测试模式）
- [ ] Webhook接收正常
- [ ] 数据库写入正常

### 性能检查
- [ ] 页面加载速度 < 3秒
- [ ] API响应时间 < 1秒
- [ ] 图片优化完成
- [ ] 启用CDN

### 安全检查
- [ ] HTTPS已启用
- [ ] 环境变量安全存储
- [ ] API路由有认证保护
- [ ] Webhook签名验证正常

---

## 🔄 从测试模式切换到生产模式

### Stripe
1. 在Stripe Dashboard切换到生产模式
2. 重新创建产品和价格（生产环境）
3. 更新环境变量中的Price IDs
4. 重新配置Webhook（生产环境）

### Clerk
1. 在Clerk Dashboard切换到生产实例
2. 更新API密钥
3. 配置生产环境的OAuth应用

---

## 📊 监控和维护

### 设置监控
```
推荐工具:
- Vercel Analytics (内置)
- Sentry (错误追踪)
- LogRocket (用户会话录制)
- Stripe Dashboard (支付监控)
```

### 日常维护
- 每日检查错误日志
- 每周审查用户反馈
- 每月分析使用数据
- 定期更新依赖包

---

## 🆘 常见问题

### Q: Webhook一直失败
```
检查:
1. Webhook URL是否正确
2. Signing secret是否匹配
3. 服务器是否可访问
4. 查看Vercel函数日志
```

### Q: 数据库连接失败
```
检查:
1. DATABASE_URL格式是否正确
2. 数据库服务是否运行
3. IP白名单配置
4. SSL模式设置
```

### Q: AI API调用失败
```
检查:
1. API密钥是否有效
2. 配额是否用完
3. API是否已启用
4. 请求格式是否正确
```

---

## 📞 技术支持

遇到问题？
1. 查看项目README
2. 检查Vercel部署日志
3. 查看Stripe事件日志
4. 提交GitHub Issue

---

**祝部署顺利！🎉**
