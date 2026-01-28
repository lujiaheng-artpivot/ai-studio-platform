import Stripe from 'stripe';

// 使环境变量可选，避免构建时报错
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover' as any,
  typescript: true,
});
