import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerkUserId;
        const tier = session.metadata?.tier;

        if (!clerkUserId || !tier) {
          throw new Error('Missing metadata in checkout session');
        }

        // TODO: Update user in database
        // - Set subscription tier
        // - Set Stripe customer ID
        // - Set Stripe subscription ID
        // - Add compute seconds based on tier
        // - Set subscription period end date

        console.log('Subscription created:', {
          clerkUserId,
          tier,
          customerId: session.customer,
          subscriptionId: session.subscription,
        });

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any; // Use any to bypass Stripe type issues
        const subscriptionId = typeof invoice.subscription === 'string' 
          ? invoice.subscription 
          : invoice.subscription?.id;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const clerkUserId = subscription.metadata?.clerkUserId;
          const tier = subscription.metadata?.tier;

          // TODO: Renew user's compute seconds for the new billing period
          console.log('Payment succeeded, renewing compute seconds:', {
            clerkUserId,
            tier,
          });
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata?.clerkUserId;

        // TODO: Update user's subscription status in database
        console.log('Subscription updated:', {
          clerkUserId,
          status: subscription.status,
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata?.clerkUserId;

        // TODO: Downgrade user to free tier
        console.log('Subscription canceled:', {
          clerkUserId,
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
