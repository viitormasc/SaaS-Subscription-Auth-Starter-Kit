import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import stripe from '../config/stripeConfig';
import Subscription from '../models/SubscriptionModel';
import User from '../models/UserModel';
dotenv.config();

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { priceId, isAnnual } = req.body;
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: userId.toString()
        }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONT_END_URL}/success`,
      cancel_url: `${process.env.FRONT_END_URL}/pricing`,
      metadata: {
        userId: userId.toString()
      },
      subscription_data: {
        metadata: {
          userId: userId.toString()
        }
      }
    });
    res.status(200).json({ sucess: true, message: 'Checkout successfully created', sessionId: session.id, sessionUrl: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ message: 'User not logged in' })
    }
    const userId = user.id;
    const subscription = await Subscription.findOne({ userId })

    if (!subscription) {
      return res.status(200).json({
        success: true,
        message: 'User is not subscribed yet',
        plan: 'free',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      });
    }

    return res.status(200).json({
      success: true,
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
};

export const createPortalSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);

    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONT_END_URL}/editProfilePage`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
};
