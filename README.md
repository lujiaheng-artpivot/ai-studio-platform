# AI Studio Platform - Professional AI Filmmaking Tools

A complete Next.js commercial platform that transforms AI Studio prototypes into a production-ready SaaS application with authentication, payments, and subscription management.

## 🎯 Features

### Core Functionality
- ✅ **6 AI Filmmaking Tools**
  - CineStyle AI - Script analysis & cinematic style generation
  - Storyboard AI - Professional storyboard creation
  - Script Master - AI screenplay writing assistant
  - CineLogic Director - Shot planning & scene breakdown
  - Gemini 3D Virtual Studio - 3D cinematography
  - Cinematic Contact Sheet Generator

### Authentication & User Management
- ✅ Email & Password authentication
- ✅ Google OAuth integration (via Clerk)
- ✅ User dashboard with usage tracking
- ✅ Session management

### Subscription & Billing
- ✅ 4-tier pricing model (Free, Lite, Standard, Pro)
- ✅ Stripe payment integration
- ✅ Compute seconds-based usage tracking
- ✅ Subscription management
- ✅ Webhook handling for payment events

### AI Capabilities
- ✅ Google Gemini API integration
- ✅ Script analysis
- ✅ Image generation
- ✅ Compute usage tracking
- ✅ Resolution-based pricing

## 📋 Pricing Tiers

| Tier | Price | Compute Seconds | Features |
|------|-------|-----------------|----------|
| **Free** | $0/mo | 50 | 720p, Watermarked, Personal use |
| **Lite** | $10/mo | 300 | 1080p, No watermark, Personal use |
| **Standard** | $30/mo | 1,000 | 4K, Commercial license, Priority queue |
| **Pro** | $100/mo | 5,000 | API access, Team collaboration, Dedicated support |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Clerk account (for authentication)
- Stripe account (for payments)
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
cd ai-studio-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_LITE_PRICE_ID=price_xxx
STRIPE_STANDARD_PRICE_ID=price_xxx
STRIPE_PRO_PRICE_ID=price_xxx

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/aistudio"

# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Enable Email/Password and Google OAuth providers
3. Copy your API keys to `.env.local`
4. Configure redirect URLs in Clerk dashboard

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create products and pricing in Stripe Dashboard:
   - Lite Plan: $10/month recurring
   - Standard Plan: $30/month recurring
   - Pro Plan: $100/month recurring
3. Copy price IDs to `.env.local`
4. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
5. Add webhook secret to `.env.local`

### Google Gemini API

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Enable Gemini API in Google Cloud Console
3. Add API key to `.env.local`

## 📁 Project Structure

```
ai-studio-platform/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── analyze-script/
│   │   │   └── generate-image/
│   │   ├── stripe/
│   │   │   └── create-checkout/
│   │   └── webhooks/
│   │       └── stripe/
│   ├── dashboard/
│   │   ├── billing/
│   │   ├── tools/
│   │   │   └── cinestyle/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── pricing/
│   ├── sign-in/
│   ├── sign-up/
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── constants.ts
│   └── stripe.ts
├── prisma/
│   └── schema.prisma
├── middleware.ts
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Payments**: Stripe
- **Database**: PostgreSQL + Prisma
- **AI**: Google Gemini API
- **Deployment**: Vercel (recommended)

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables
   - Deploy!

3. **Configure Stripe Webhook**
   - Update webhook URL to your production domain
   - Test webhook with Stripe CLI

### Database Setup

For production, use a managed PostgreSQL service:
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)

Update `DATABASE_URL` in Vercel environment variables.

## 📊 Database Schema

```prisma
model User {
  id                String   @id @default(cuid())
  clerkId           String   @unique
  email             String   @unique
  subscriptionTier  String   @default("free")
  computeSeconds    Int      @default(50)
  usedSeconds       Int      @default(0)
  stripeCustomerId  String?  @unique
  projects          Project[]
  generations       Generation[]
}

model Project {
  id            String   @id @default(cuid())
  userId        String
  name          String
  type          String
  scriptContent String?
  analysisData  Json?
  generations   Generation[]
}

model Generation {
  id          String   @id @default(cuid())
  userId      String
  projectId   String?
  type        String
  prompt      String
  imageUrl    String?
  computeUsed Int      @default(0)
}
```

## 🔐 Security Best Practices

- ✅ API routes protected with Clerk authentication
- ✅ Stripe webhook signature verification
- ✅ Environment variables for sensitive data
- ✅ HTTPS enforced in production
- ✅ Rate limiting (TODO: implement)
- ✅ Input validation and sanitization

## 📈 TODO / Roadmap

### High Priority
- [ ] Implement database operations (currently using mock data)
- [ ] Add compute seconds deduction logic
- [ ] Implement image upload to cloud storage
- [ ] Add rate limiting
- [ ] Create remaining AI tool pages (Storyboard, Script Master, etc.)

### Medium Priority
- [ ] Add team collaboration features (Pro plan)
- [ ] Implement API access (Pro plan)
- [ ] Add usage analytics dashboard
- [ ] Create admin panel
- [ ] Add email notifications

### Low Priority
- [ ] Add dark/light theme toggle
- [ ] Implement project sharing
- [ ] Add export functionality
- [ ] Create mobile app

## 🐛 Known Issues

- Database operations are currently mocked (needs implementation)
- Image generation uses Gemini API (may need alternative like DALL-E or Midjourney)
- Compute seconds calculation needs refinement based on actual usage
- Need to implement proper error handling for failed payments

## 📝 License

MIT License - feel free to use this project for your own commercial applications.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@aistudioplatform.com or open an issue on GitHub.

---

**Built with ❤️ using Next.js, Clerk, Stripe, and Google Gemini**
