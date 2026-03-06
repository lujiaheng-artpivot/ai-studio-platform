import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { zhCN } from '@clerk/localizations';
import { Toaster } from 'react-hot-toast';
import { getPublicAppUrl } from '@/lib/config';
import "./globals.css";

const publicAppUrl = getPublicAppUrl();
const DEFAULT_AUTH_REDIRECT = '/new.html?space=creation';

const authRedirects = {
  signInForce: DEFAULT_AUTH_REDIRECT,
  signUpForce: DEFAULT_AUTH_REDIRECT,
  signInFallback: DEFAULT_AUTH_REDIRECT,
  signUpFallback: DEFAULT_AUTH_REDIRECT,
  afterSignIn: DEFAULT_AUTH_REDIRECT,
  afterSignUp: DEFAULT_AUTH_REDIRECT,
};
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'lubiao',
      url: publicAppUrl,
      logo: `${publicAppUrl}/favicon.ico`,
      sameAs: [publicAppUrl],
    },
    {
      '@type': 'WebSite',
      name: 'lubiao',
      url: publicAppUrl,
      inLanguage: ['zh-CN'],
      potentialAction: {
        '@type': 'SearchAction',
        target: `${publicAppUrl}/new.html?query={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'lubiao',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '10',
        priceCurrency: 'USD',
      },
      description: '面向影视团队的 AI 视频生产工作台，覆盖剧本生成、Seedance 2.0 分镜脚本与电影风格剧照生成。',
      url: publicAppUrl,
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(publicAppUrl),
  title: {
    default: "lubiao - AI 影视工业化生产平台",
    template: "%s | lubiao",
  },
  description: "lubiao 将 AI 能力封装成三阶段创作流程：剧本生成、Seedance 2.0 分镜脚本、美术风格剧照生成。",
  keywords: [
    "AI影视制作",
    "剧本生成",
    "Seedance 2.0",
    "分镜脚本",
    "电影风格剧照",
    "Google AI Studio",
    "lubiao",
  ],
  authors: [{ name: "lubiao" }],
  creator: "lubiao",
  publisher: "lubiao",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: "lubiao - AI 影视工业化生产平台",
    description: "从剧本生成到 Seedance 分镜与电影风格剧照的 AI 生产链路",
    type: "website",
    url: publicAppUrl,
    siteName: 'lubiao',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "lubiao - AI 影视工业化生产平台",
    description: "从剧本生成到 Seedance 分镜与电影风格剧照的 AI 生产链路",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={zhCN}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl={authRedirects.signInForce}
      signUpForceRedirectUrl={authRedirects.signUpForce}
      signInFallbackRedirectUrl={authRedirects.signInFallback}
      signUpFallbackRedirectUrl={authRedirects.signUpFallback}
      afterSignInUrl={authRedirects.afterSignIn}
      afterSignUpUrl={authRedirects.afterSignUp}
    >
      <html lang="zh-CN">
        <body>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          {children}
          <Toaster position="bottom-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
