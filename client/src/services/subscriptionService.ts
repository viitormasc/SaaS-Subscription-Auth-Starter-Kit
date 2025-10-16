import type { CheckoutSessionResponse, CreateCheckoutSessionParams, PortalSessionResponse, SubscriptionStatus } from "@/types/interfaces";
import axios from "./axios";


export const subscriptionService = {
  // Create a new checkout session
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResponse> {
    const response = await axios.post<CheckoutSessionResponse>(
      '/subscriptions/create-checkout-session',
      params
    );
    return response.data;
  },

  // Get current subscription status
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const response = await axios.get<SubscriptionStatus>('/subscriptions/status');
    return response.data;
  },

  // Create customer portal session
  async createPortalSession(): Promise<PortalSessionResponse> {
    const response = await axios.post<PortalSessionResponse>('/subscriptions/create-portal-session');
    return response.data;
  },

  // Optional: Cancel subscription
  async cancelSubscription(): Promise<void> {
    await axios.post('/subscriptions/cancel');
  },
};

// Price IDs configuration - move these to environment variables in production
export const PRICE_IDS = {
  standard: {
    monthly: import.meta.env.VITE_STRIPE_STANDARD_MONTHLY_PRICE_ID,
    annual: import.meta.env.VITE_STRIPE_STANDARD_ANNUAL_PRICE_ID,
  },
  pro: {
    monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID,
    annual: import.meta.env.VITE_STRIPE_PRO_ANNUAL_PRICE_ID,
  },
} as const;

// Helper function to get price ID based on plan and billing cycle
export const getPriceId = (planName: string, isAnnual: boolean): string => {
  const planKey = planName.toLowerCase() as keyof typeof PRICE_IDS;
  const billingKey = isAnnual ? 'annual' : 'monthly';

  const priceId = PRICE_IDS[planKey]?.[billingKey];

  if (!priceId) {
    throw new Error(`Price ID not found for plan: ${planName}, billing: ${billingKey}`);
  }

  return priceId;
};
