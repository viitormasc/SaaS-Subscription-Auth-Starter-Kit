import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-09-30.clover',
});

const appearance = {
  theme: 'night',
  variables: {
    colorPrimary: 'rgb(255,105,0 )',
    colorBackground: 'rgb(10,10,10)',
    colorDanger: 'rgb(231, 0, 11)',

  }
}

export const PRICE_IDS = {
  standard: {
    monthly: process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID!,
    annual: process.env.STRIPE_STANDARD_ANNUAL_PRICE_ID!,
  },
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
  },
};

// const checkout = stripe.elements({ process.env.STRIPE_SECRET_KEY, appearance })

export default stripe;
