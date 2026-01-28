'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Film, Key, Database, CreditCard, CheckCircle, Copy, ArrowRight } from 'lucide-react';

export default function SetupPage() {
  const [clerkPublishable, setClerkPublishable] = useState('');
  const [clerkSecret, setClerkSecret] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [copied, setCopied] = useState(false);

  const generateEnvContent = () => {
    return `# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${clerkPublishable || 'your_clerk_publishable_key'}
CLERK_SECRET_KEY=${clerkSecret || 'your_clerk_secret_key'}
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Database
DATABASE_URL="your_database_url"

# Google Gemini API
GOOGLE_GEMINI_API_KEY=${geminiKey || 'your_gemini_api_key'}

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEnvContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Film className="w-8 h-8 text-amber-500" />
            <span className="text-xl font-bold text-white">AI Studio Platform</span>
          </Link>
          <Link href="/demo-dashboard" className="text-gray-400 hover:text-white transition">
            View Demo Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-sm mb-6">
            <Key className="w-4 h-4" />
            <span>配置助手</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            快速配置您的AI Studio
          </h1>
          <p className="text-gray-400 text-lg">
            只需3步，5分钟完成配置
          </p>
        </div>

        {/* Step 1: Clerk */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">
              1
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">配置Clerk认证</h2>
              <p className="text-gray-400 mb-4">
                Clerk提供用户认证服务（Email + Google OAuth）
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Publishable Key
              </label>
              <input
                type="text"
                value={clerkPublishable}
                onChange={(e) => setClerkPublishable(e.target.value)}
                placeholder="pk_test_xxxxxxxxxx"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Secret Key
              </label>
              <input
                type="password"
                value={clerkSecret}
                onChange={(e) => setClerkSecret(e.target.value)}
                placeholder="sk_test_xxxxxxxxxx"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <a
            href="https://dashboard.clerk.com/sign-up"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition"
          >
            前往Clerk获取密钥
            <ArrowRight className="w-4 h-4" />
          </a>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              💡 <strong>提示：</strong> 注册后创建应用，选择 Email + Google 认证方式，即可获取密钥
            </p>
          </div>
        </div>

        {/* Step 2: Gemini */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">
              2
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">配置Google Gemini AI</h2>
              <p className="text-gray-400 mb-4">
                Gemini提供AI脚本分析和图片生成能力
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSyxxxxxxxxxx"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition"
          >
            前往Google获取密钥
            <ArrowRight className="w-4 h-4" />
          </a>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              💡 <strong>提示：</strong> 点击 "Create API Key"，选择或创建Google Cloud项目即可
            </p>
          </div>
        </div>

        {/* Step 3: Update Config */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">
              3
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">更新配置文件</h2>
              <p className="text-gray-400 mb-4">
                将生成的配置复制到 .env.local 文件
              </p>
            </div>
          </div>

          <div className="bg-black/60 rounded-lg p-4 mb-4 relative">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              {generateEnvContent()}
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition flex items-center gap-2 text-sm"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <span className="text-amber-500">1.</span>
              <span>复制上面的配置内容</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <span className="text-amber-500">2.</span>
              <span>打开项目中的 <code className="px-2 py-1 bg-white/10 rounded">.env.local</code> 文件</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <span className="text-amber-500">3.</span>
              <span>粘贴并保存</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-300">
              <span className="text-amber-500">4.</span>
              <span>重启开发服务器：<code className="px-2 py-1 bg-white/10 rounded">npm run dev</code></span>
            </div>
          </div>
        </div>

        {/* Optional: Stripe & Database */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">可选配置（稍后配置）</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-400 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">Stripe支付</h4>
                <p className="text-sm text-gray-400 mb-2">
                  用于订阅付费功能，可以稍后配置
                </p>
                <a href="https://stripe.com" target="_blank" className="text-sm text-amber-500 hover:text-amber-400">
                  访问Stripe →
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
              <Database className="w-6 h-6 text-green-400 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">数据库</h4>
                <p className="text-sm text-gray-400 mb-2">
                  用于存储用户数据和项目，推荐使用Supabase
                </p>
                <a href="https://supabase.com" target="_blank" className="text-sm text-amber-500 hover:text-amber-400">
                  访问Supabase →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-black mb-4">
            配置完成后
          </h3>
          <p className="text-black/80 mb-6">
            重启服务器，即可体验完整的AI Studio功能！
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/demo-dashboard"
              className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition"
            >
              查看演示Dashboard
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white/20 text-black font-semibold rounded-lg hover:bg-white/30 transition"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
