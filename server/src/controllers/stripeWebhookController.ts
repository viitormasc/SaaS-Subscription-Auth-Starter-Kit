import { Request, Response } from 'express';
import Stripe from 'stripe';
import stripe, { PRICE_IDS } from '../config/stripeConfig';
import Subscription from '../models/SubscriptionModel';
import User from '../models/UserModel';

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!sig) {
    return res.status(400).send('No stripe-signature header');
  }

  let event;

  try {
    let rawBody: Buffer | string;
    // Use the raw body (req.body is already a buffer due to express.raw())
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      default:
    }

    res.send({ received: true });
  } catch (error) {
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!session.subscription) {
    console.error('No subscription found in checkout session');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const userId = session.metadata!.userId;

  await updateSubscriptionInDB(subscription, userId);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  await updateSubscriptionInDB(subscription, userId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  await Subscription.findOneAndUpdate(
    { userId },
    {
      status: 'canceled',
      stripeSubscriptionId: null,
      plan: 'free',
    },
    { upsert: true },
  );
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // You can add additional logic here for successful payments
}

async function updateSubscriptionInDB(subscription: Stripe.Subscription, userId: string) {
  const priceId = subscription.items.data[0].price.id;
  const plan = getPlanFromPriceId(priceId);
  const periodDates = calculateSubscriptionPeriod(subscription);

  const existingSubscriptions = await Subscription.find({
    userId,
    status: 'active',
    stripeSubscriptionId: { $ne: subscription.id }, // ← Exclude current subscription
  });

  // Cancel OLD subscriptions (not the new one)
  if (existingSubscriptions.length > 0) {
    for (const sub of existingSubscriptions) {
      try {
        await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: sub.stripeSubscriptionId },
          {
            status: 'canceled',
            canceledAt: new Date(),
          },
        );
      } catch (error) {
        console.error('Error canceling old subscription:', error);
      }
    }
  }

  try {
    // Update or create the NEW subscription
    const updatedSubscription = await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id }, // ← Better to use Stripe ID as primary key
      {
        userId,
        stripeSubscriptionId: subscription.id,
        priceId,
        status: subscription.status,
        plan,
        currentPeriodStart: periodDates.currentPeriodStart,
        currentPeriodEnd: periodDates.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      { upsert: true, new: true },
    );

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, {
      userPlan: plan,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
    });
  } catch (error) {
    console.error('Error updating subscription in DB:', error);
  }
}
function getPlanFromPriceId(priceId: string): string {
  const prices = Object.values(PRICE_IDS).flatMap((plan) => Object.values(plan));

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
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 7 * intervalCount);
      break;
    case 'day':
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + intervalCount);
      break;
    default:
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
  }

  return {
    currentPeriodStart,
    currentPeriodEnd,
  };
}
