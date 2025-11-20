import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  priceId: string;
  status: 'active' | 'canceled';
  plan: 'free' | 'standard' | 'pro';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String },
    priceId: { type: String },
    status: { type: String, enum: ['active', 'canceled'], default: 'active' },
    plan: { type: String, enum: ['free', 'standard', 'pro'], default: 'free' },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    canceledAt: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

subscriptionSchema.index({ userId: 1, createdAt: -1 });
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 })

export default mongoose.model<ISubscription>('Subscription', subscriptionSchema);
