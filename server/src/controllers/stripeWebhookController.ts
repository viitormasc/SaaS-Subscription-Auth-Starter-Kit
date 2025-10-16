import { Request, Response } from 'express';
import Stripe from 'stripe';
import stripe, { PRICE_IDS } from '../config/stripeConfig';
import Subscription from '../models/SubscriptionModel';

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!sig) {
    console.error('No stripe-signature header found');
    return res.status(400).send('No stripe-signature header');
  }

  let event;

  try {
    let rawBody: Buffer | string;
    // Use the raw body (req.body is already a buffer due to express.raw())
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Webhook verified successfully. Event type:', event.type);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Processing checkout.session.completed');
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        console.log('Processing customer.subscription.updated');
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        console.log('Processing customer.subscription.deleted');
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        console.log('Processing invoice.payment_succeeded');
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    console.log('Webhook processed successfully');
    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed for user:', session.metadata?.userId);

  if (!session.subscription) {
    console.error('No subscription found in checkout session');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const userId = session.metadata!.userId;

  await updateSubscriptionInDB(subscription, userId);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  const userId = subscription.metadata.userId;
  await updateSubscriptionInDB(subscription, userId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  const userId = subscription.metadata.userId;

  await Subscription.findOneAndUpdate(
    { userId },
    {
      status: 'canceled',
      stripeSubscriptionId: null,
      plan: 'free'
    },
    { upsert: true }
  );

  console.log('Subscription marked as canceled for user:', userId);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  // You can add additional logic here for successful payments
}

async function updateSubscriptionInDB(subscription: Stripe.Subscription, userId: string) {
  console.log('Updating subscription in DB for user:', userId);

  const priceId = subscription.items.data[0].price.id;
  const plan = getPlanFromPriceId(priceId);

  const periodDates = calculateSubscriptionPeriod(subscription);

  const updatedSubscription = await Subscription.findOneAndUpdate(
    { userId },
    {
      stripeSubscriptionId: subscription.id,
      priceId,
      status: subscription.status,
      plan,
      currentPeriodStart: periodDates.currentPeriodStart,
      currentPeriodEnd: periodDates.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    },
    { upsert: true, new: true }
  );

  console.log('Subscription updated in DB:', updatedSubscription);
}

function getPlanFromPriceId(priceId: string): string {
  const prices = Object.values(PRICE_IDS).flatMap(plan => Object.values(plan));

  if (prices.includes(priceId)) {
    if (Object.values(PRICE_IDS.standard).includes(priceId)) return 'standard';
    if (Object.values(PRICE_IDS.pro).includes(priceId)) return 'pro';
  }

  return 'free';
}

function calculateSubscriptionPeriod(subscription: Stripe.Subscription): {
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
} {
  const now = new Date();

  // Use billing_cycle_anchor as period start
  const billingCycleAnchor = new Date(subscription.billing_cycle_anchor * 1000);

  // Calculate period end based on interval
  const subscriptionItem = subscription.items.data[0];
  const interval = subscriptionItem.price.recurring?.interval || 'month';
  const intervalCount = subscriptionItem.price.recurring?.interval_count || 1;

  let currentPeriodStart = billingCycleAnchor;
  let currentPeriodEnd = new Date(billingCycleAnchor);

  switch (interval) {
    case 'month':
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + intervalCount);
      break;
    case 'year':
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + intervalCount);
      break;
    case 'week':
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + (7 * intervalCount));
      break;
    case 'day':
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + intervalCount);
      break;
    default:
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
  }

  return {
    currentPeriodStart,
    currentPeriodEnd
  };
}