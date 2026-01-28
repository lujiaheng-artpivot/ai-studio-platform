'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Film, Zap, TrendingUp, Clock, Award, ArrowLeft, Sparkles } from 'lucide-react';
import { AI_TOOLS } from '@/lib/constants';

export default function DemoDashboardPage() {
  // Mock user data
  const userStats = {
    computeSeconds: 50,
    usedSeconds: 12,
    tier: 'free',
    projectsCount: 3,
    generationsCount: 8,
  };

  const remainingSeconds = userStats.computeSeconds - userStats.usedSeconds;
  const usagePercentage = (userStats.usedSeconds / userStats.computeSeconds) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Film className="w-8 h-8 text-amber-500" />
              <span className="text-xl font-bold text-white">AI Studio Platform</span>
            </Link>
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-semibold">
              DEMO MODE
            </span>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white transition flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Demo Notice */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-3">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-amber-500 text-sm">
            🎭 <strong>演示模式</strong> - 这是Dashboard的预览界面。配置Clerk密钥后可使用完整功能。
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, Creator! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your AI studio today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-xs text-gray-400 uppercase">Compute</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {remainingSeconds}
            </div>
            <div className="text-sm text-gray-400 mb-4">
              seconds remaining
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${100 - usagePercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs text-gray-400 uppercase">Projects</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {userStats.projectsCount}
            </div>
            <div className="text-sm text-gray-400">
              active projects
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-xs text-gray-400 uppercase">Generated</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {userStats.generationsCount}
            </div>
            <div className="text-sm text-gray-400">
              this month
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-gray-400 uppercase">Plan</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1 capitalize">
              {userStats.tier}
            </div>
            <div className="text-sm text-gray-400">
              current tier
            </div>
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-black mb-2">
                Unlock More Creative Power
              </h3>
              <p className="text-black/80 mb-4">
                Upgrade to Standard for 1,000 compute seconds, 4K exports, and commercial license
              </p>
              <Link 
                href="/pricing"
                className="inline-block px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition"
              >
                View Plans
              </Link>
            </div>
            <div className="text-6xl">🚀</div>
          </div>
        </div>

        {/* AI Tools Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(AI_TOOLS).map((tool) => (
              <div
                key={tool.id}
                onClick={() => alert(`🎬 ${tool.name}\n\n${tool.description}\n\n⚡ 计算成本: ${Object.values(tool.computeCost)[0]} 秒\n\n💡 配置Clerk密钥后可使用完整功能`)}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition group cursor-pointer"
              >
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-500 transition">
                  {tool.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {tool.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Zap className="w-4 h-4" />
                  <span>
                    {Object.values(tool.computeCost)[0]} compute seconds
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="space-y-4">
              {[
                { icon: '🎬', title: 'Script Analysis Completed', time: '2 hours ago', desc: 'Analyzed "Midnight Runner" screenplay' },
                { icon: '🖼️', title: 'Scene Generated', time: '5 hours ago', desc: 'Created cinematic concept for Act 2' },
                { icon: '👤', title: 'Character Design', time: '1 day ago', desc: 'Generated visual for protagonist' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <div className="text-3xl">{activity.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{activity.title}</h4>
                    <p className="text-sm text-gray-400 mb-1">{activity.desc}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-blue-500 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                🔑 启用完整功能
              </h3>
              <p className="text-gray-400 mb-4">
                配置Clerk和Gemini API密钥后，您可以：
              </p>
              <ul className="space-y-2 text-sm text-gray-300 mb-4">
                <li>✅ 真实的用户注册和登录</li>
                <li>✅ AI脚本分析和图片生成</li>
                <li>✅ 项目保存和管理</li>
                <li>✅ 计算秒数实时追踪</li>
                <li>✅ Stripe支付集成</li>
              </ul>
              <div className="flex gap-3">
                <a 
                  href="https://clerk.com" 
                  target="_blank"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
                >
                  获取Clerk密钥 →
                </a>
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank"
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition text-sm font-semibold"
                >
                  获取Gemini密钥 →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
