process.loadEnvFile()
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-09-30.clover'
})

export const PRICE_IDS = {
  standard: {
    monthly: process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID!,
    annual: process.env.STRIPE_STANDARD_ANNUAL_PRICE_ID!,
  },
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
  }
};
// const pro = await stripe.products.create({
//   name: 'Pro'
// })
//
//
// const essential = await stripe.products.create({
//   name: 'Essential'
// })
//
// const EssentialPlan = await stripe.plans.create({
//   currency: 'USD',
//   interval: 'month',
//   nickname: 'essential',
//   amount: 499,
//   usage_type: 'licensed',
//   product: essential.id
// })
//
// const ProPlan = await stripe.plans.create({
//   currency: 'USD',
//   interval: 'month',
//   nickname: 'essential',
//   amount: 699,
//   usage_type: 'licensed',
//   product: pro.id
// })

export default stripe