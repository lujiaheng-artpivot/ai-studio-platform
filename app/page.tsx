'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Film, Sparkles, Zap, Users, Check } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-8 h-8 text-amber-500" />
            <span className="text-xl font-bold text-white">AI Studio Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-gray-300 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/demo-dashboard" className="text-gray-300 hover:text-white transition">
              Demo
            </Link>
            <Link href="/setup" className="text-gray-300 hover:text-white transition">
              Setup
            </Link>
            <Link 
              href="/setup"
              className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Demo Notice */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-3">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-amber-500 text-sm">
            🔑 <strong>演示模式</strong> - 需要配置Clerk API密钥以启用完整功能。
            <a href="https://clerk.com" target="_blank" className="underline ml-2">立即获取密钥 →</a>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Professional AI Filmmaking Tools</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Transform Your Creative
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
            Vision Into Reality
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
          From script analysis to cinematic generation. Professional AI-powered tools for filmmakers, creators, and storytellers.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={() => alert('请先配置Clerk API密钥\n\n1. 访问 https://clerk.com\n2. 注册并创建应用\n3. 复制API密钥到 .env.local')}
            className="px-8 py-4 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition transform hover:scale-105 flex items-center gap-2"
          >
            Start Creating Free
            <Zap className="w-5 h-5" />
          </button>
          <button 
            onClick={() => router.push('/pricing')}
            className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition border border-white/10"
          >
            View Pricing
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">5,000+</div>
            <div className="text-gray-400">Projects Created</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">6</div>
            <div className="text-gray-400">AI Tools</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Complete AI Filmmaking Suite
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🎬',
              title: 'CineStyle AI',
              description: 'Analyze scripts and generate cinematic style concepts with AI-powered visual prompts.'
            },
            {
              icon: '📋',
              title: 'Storyboard AI',
              description: 'Create professional storyboards from your scripts automatically.'
            },
            {
              icon: '✍️',
              title: 'Script Master',
              description: 'AI-powered screenplay writing assistant for compelling narratives.'
            },
            {
              icon: '🎥',
              title: 'CineLogic Director',
              description: 'Professional director tools and intelligent shot planning.'
            },
            {
              icon: '🎭',
              title: '3D Virtual Studio',
              description: 'Create 3D virtual cinematography and set designs.'
            },
            {
              icon: '📸',
              title: 'Contact Sheet Generator',
              description: 'Generate cinematic sample sheets for client presentations.'
            },
          ].map((feature, idx) => (
            <div 
              key={idx}
              className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition group"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-500 transition">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-white text-center mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-400 text-center mb-16">
          Choose the plan that fits your creative needs
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <div 
              key={key}
              className={`p-8 rounded-2xl border ${
                key === 'standard' 
                  ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 scale-105' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {key === 'standard' && (
                <div className="inline-block px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full mb-4">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400">/month</span>
              </div>
              
              <div className="space-y-3 mb-8">
                {plan.features.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => alert('请先配置Clerk API密钥以启用注册功能')}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  key === 'standard'
                    ? 'bg-amber-500 text-black hover:bg-amber-400'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/pricing" className="text-amber-500 hover:text-amber-400 font-semibold">
            View detailed pricing comparison →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">
            Ready to Start Creating?
          </h2>
          <p className="text-black/80 text-lg mb-8">
            Join thousands of creators using AI to bring their stories to life
          </p>
          <button 
            onClick={() => alert('配置步骤：\n\n1. 访问 https://clerk.com 注册\n2. 创建应用并获取API密钥\n3. 更新 .env.local 文件\n4. 重启服务器')}
            className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition transform hover:scale-105"
          >
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-6 h-6 text-amber-500" />
              <span className="font-bold text-white">AI Studio Platform</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2026 AI Studio Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
