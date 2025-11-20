import { NextFunction, Request, Response } from 'express';
import Subscription from '../models/SubscriptionModel';

export async function ensurePro(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
  const user = req.user

  const userSubscription = await Subscription.findOne({ userId: user?._id })
  const plan = userSubscription?.plan
  console.log('plan', plan);
  if (plan?.toLowerCase() !== 'pro') return res.status(403).json({ success: false, message: 'You need to be on pro subscription to use this feature' })
  next()
}


export async function ensureStandard(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
  const user = req.user

  const userSubscription = await Subscription.findOne({ userId: user?._id })
  const plan = userSubscription?.plan
  if (plan?.toLowerCase() !== 'pro' || 'standard') return res.status(403).json({ success: false, message: 'You need to be on pro or standard subscription to use this feature' })
  next()
}
