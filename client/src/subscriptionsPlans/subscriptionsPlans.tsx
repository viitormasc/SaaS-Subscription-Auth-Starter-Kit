export type PlansType = {
  name: string
  description: string
  monthlyPrice: number
  annualPrice: number
  popular: boolean
  features: string[],
  limitations: string[],
  buttonVariant: 'outline' | 'default'
  annualSavings?: number,

}

const plans: PlansType[] = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    annualPrice: 0,
    popular: false,
    features: [
      'Unlimited track time for up to 2 activities',
      'Access dashboard data',
      'Track 1 activity at a time',
      'Notifications to help hit goals',
      'Basic progress tracking',
    ],
    limitations: [
      'Cannot download dashboard data',
      'Cannot track more than 1 activity simultaneously',
      'No help from AI',
    ],
    buttonVariant: 'outline' as const,
  },
  {
    name: 'Standard',
    description: 'The most popular choice for serious learners',
    monthlyPrice: 4.99,
    annualPrice: 3.99,
    annualSavings: 12,
    popular: true,
    features: [
      'Everything in Free, plus:',
      'Track unlimited time for unlimited activities',
      'Access AND download dashboard data',
      'Track multiple activities simultaneously',
      'Advanced analytics and insights',
      'Priority support',
    ],
    limitations: [],
    buttonVariant: 'default' as const,
  },
  {
    name: 'Pro',
    description: 'Maximum productivity with AI power',
    monthlyPrice: 7.99,
    annualPrice: 4.99,
    annualSavings: 36,
    popular: false,
    features: [
      'Everything in Standard, plus:',
      'AI insights on your study patterns',
      'AI suggestions for improving results',
      'Personalized study recommendations',
      'Early access to new features',
      '24/7 premium support',
    ],
    limitations: [],
    buttonVariant: 'outline' as const,
  },
];

export default plans
