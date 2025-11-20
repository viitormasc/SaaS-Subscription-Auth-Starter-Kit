import SignUpDialog from '@/components/SignUpDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import plans from '@/subscriptionsPlans/subscriptionsPlans';
import { Check } from 'lucide-react';
import { useState } from 'react';

export default function PricingPageForGuest() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background py-22 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">
            Simple, Transparent Pricing, Cancel anytime
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for your learning journey. All plans
            include core tracking features.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span
              className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span
                className={`${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-primary transition-transform`}
              />
            </button>
            <span
              className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Annual{' '}
              <Badge variant="secondary" className="ml-1">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const annualSavings = plan.annualSavings;

            return (
              <Card
                key={plan.name}
                className={`relative border-2 transition-all duration-300 hover:scale-105 ${
                  plan.popular ? 'border-primary shadow-lg' : 'border-border'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {plan.name}
                    </CardTitle>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      ${price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{price === 0 ? 'forever' : 'month'}
                    </span>
                    {isAnnual && price > 0 && (
                      <p className="text-sm text-green-500 mt-1">
                        Save ${annualSavings}/year
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Limitations:
                      </p>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full mt-1.5 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col align-bottom items-center">
                  <SignUpDialog />
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: 'Can I switch plans anytime?',
                answer:
                  'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the end of billing cycle.',
              },
              {
                question: 'Is there a free trial?',
                answer:
                  'The Free plan is always free. Paid plans can be cancelled anytime.',
              },
              {
                question: 'What payment methods do you accept?',
                answer:
                  'We accept all major credit cards, PayPal, and bank transfers for annual plans.',
              },
              {
                question: 'Can I cancel my subscription?',
                answer:
                  'Yes, you can cancel anytime. No hidden fees or long-term contracts.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
