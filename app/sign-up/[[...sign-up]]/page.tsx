import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-white/70">注册拟像</p>
          <Link href="/new.html" className="text-xs text-[#e2a84b]">
            返回首页
          </Link>
        </div>

        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          oauthFlow="redirect"
          fallbackRedirectUrl="/new.html?space=creation"
          appearance={{
            elements: {
              rootBox: 'mx-auto w-full',
              card: 'bg-transparent shadow-none border-0 p-0',
              formButtonPrimary: 'bg-white hover:bg-[#f4f6f9] text-black font-semibold',
              socialButtonsBlockButton: 'border-white/20 bg-white/5 hover:bg-white/10 text-white',
              socialButtonsBlockButtonText: 'text-white',
              formFieldInput:
                'bg-black/40 border-white/15 text-white placeholder:text-white/35 focus:border-[#e2a84b]/70',
              formFieldLabel: 'text-white/75',
              headerTitle: 'text-white',
              headerSubtitle: 'text-white/65',
              dividerLine: 'bg-white/15',
              dividerText: 'text-white/55',
              footerActionText: 'text-white/55',
              footerActionLink: 'text-[#e2a84b] hover:text-[#f0bf70]',
            },
          }}
        />
      </div>
    </main>
  );
}
