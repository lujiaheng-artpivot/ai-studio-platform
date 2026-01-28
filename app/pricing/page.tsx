'use client';

import { useRouter } from 'next/navigation';
import { Check, X, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-white hover:text-amber-500 transition">
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Flexible Pricing for Every Creator</span>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From hobbyists to professional studios. Scale as you grow with transparent, compute-based pricing.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <div 
              key={key}
              className={`relative p-8 rounded-2xl border transition-all hover:scale-105 ${
                key === 'standard' 
                  ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 shadow-2xl shadow-amber-500/20' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {key === 'standard' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                  RECOMMENDED
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="text-sm text-gray-400 mb-1">Compute Seconds</div>
                <div className="text-2xl font-bold text-amber-500">{plan.computeSeconds.toLocaleString()}/mo</div>
                <div className="text-xs text-gray-500 mt-1">
                  {plan.maxResolution} • {plan.hasWatermark ? 'Watermarked' : 'No Watermark'}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations && plan.limitations.length > 0 && (
                <div className="space-y-2 mb-8 pb-6 border-t border-white/10 pt-6">
                  {plan.limitations.map((limitation, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={() => router.push('/sign-up')}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  key === 'standard'
                    ? 'bg-amber-500 text-black hover:bg-amber-400'
                    : key === 'free'
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {key === 'free' ? 'Start Free' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Detailed Feature Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Feature</th>
                  {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                    <th key={key} className="text-center py-4 px-4">
                      <div className="text-white font-bold">{plan.name}</div>
                      <div className="text-sm text-gray-400">${plan.price}/mo</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 text-gray-300">Compute Seconds</td>
                  {Object.values(SUBSCRIPTION_PLANS).map((plan, idx) => (
                    <td key={idx} className="text-center py-4 px-4 text-white font-semibold">
                      {plan.computeSeconds}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 text-gray-300">Max Resolution</td>
                  {Object.values(SUBSCRIPTION_PLANS).map((plan, idx) => (
                    <td key={idx} className="text-center py-4 px-4 text-white">
                      {plan.maxResolution}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 text-gray-300">Watermark</td>
                  {Object.values(SUBSCRIPTION_PLANS).map((plan, idx) => (
                    <td key={idx} className="text-center py-4 px-4">
                      {plan.hasWatermark ? (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      ) : (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 text-gray-300">Commercial License</td>
                  {Object.values(SUBSCRIPTION_PLANS).map((plan, idx) => (
                    <td key={idx} className="text-center py-4 px-4">
                      {plan.commercialLicense ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 text-gray-300">Priority Queue</td>
                  {Object.values(SUBSCRIPTION_PLANS).map((plan, idx) => (
                    <td key={idx} className="text-center py-4 px-4 text-white">
                      {plan.priority === 'highest' ? '⚡ Highest' : plan.priority === 'high' ? '🔥 High' : 'Standard'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 text-gray-300">Batch Processing</td>
                  {Object.values(SUBSCRIPTION_PLANS).map((plan, idx) => (
                    <td key={idx} className="text-center py-4 px-4 text-white">
                      {'batchProcessing' in plan && plan.batchProcessing ? `${plan.batchProcessing} simultaneous` : '1 at a time'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 text-gray-300">API Access</td>
                  {Object.values(SUBSCRIPTION_PLANS).map((plan, idx) => (
                    <td key={idx} className="text-center py-4 px-4">
                      {'apiAccess' in plan && plan.apiAccess ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Team Seats</td>
                  {Object.values(SUBSCRIPTION_PLANS).map((plan, idx) => (
                    <td key={idx} className="text-center py-4 px-4 text-white">
                      {'teamSeats' in plan && plan.teamSeats ? `${plan.teamSeats} seats` : '1 seat'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'What are compute seconds?',
                a: 'Compute seconds measure the AI processing time used to generate your content. Actual consumption varies based on resolution and scene complexity (typically 2-6x your video duration).'
              },
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes! You can change your plan at any time. Upgrades take effect immediately, while downgrades apply at the next billing cycle.'
              },
              {
                q: 'Do unused compute seconds roll over?',
                a: 'No, compute seconds reset each month. We recommend choosing a plan that matches your typical monthly usage.'
              },
              {
                q: 'What happens if I run out of compute seconds?',
                a: "You can purchase additional compute seconds or upgrade to a higher tier. Your projects remain accessible, but you won't be able to generate new content until you add more compute time."
              },
              {
                q: 'Is there a commercial license on Free and Lite plans?',
                a: 'No. Free and Lite plans are for personal use only. You need a Standard or Pro plan for commercial projects, client work, or monetized content.'
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-black mb-4">
              Still Have Questions?
            </h2>
            <p className="text-black/80 text-lg mb-8">
              Our team is here to help you choose the right plan
            </p>
            <button className="px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
