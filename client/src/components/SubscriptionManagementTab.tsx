import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import plans from '@/subscriptionsPlans/subscriptionsPlans';
import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SubscriptionManagementTab() {
  const [isAnnual, setIsAnnual] = useState(false);
  const {
    subscription,
    isLoading,
    handlePlanSelect,
    handleManageSubscription,
    isCreatingCheckout,
  } = useSubscription();

  // Filter plans based on current subscription
  const getAvailablePlans = () => {
    const currentPlan = subscription?.plan;

    if (!currentPlan || currentPlan === 'free') {
      // Free users see all paid plans
      return plans.filter(plan => plan.name !== 'Free');
    }

    if (currentPlan === 'standard') {
      // Standard users only see Pro (upgrade)
      return plans.filter(plan => plan.name === 'Pro');
    }

    if (currentPlan === 'pro') {
      // Pro users see no upgrade options (they're on the highest plan)
      return [];
    }

    return plans.filter(plan => plan.name !== 'Free');
  };

  const getButtonText = (planName: string) => {
    const currentPlan = subscription?.plan;
    const planKey = planName.toLowerCase() as 'free' | 'standard' | 'pro';

    if (!currentPlan || currentPlan === 'free') {
      return planName === 'Standard' ? 'Upgrade Now' : 'Go Pro';
    }

    if (currentPlan === 'standard' && planKey === 'pro') {
      return 'Upgrade to Pro';
    }

    return 'Select Plan';
  };

  const getButtonVariant = (
    baseVariant: 'default' | 'outline',
  ) => {
    return baseVariant;
  };

  const handleUpgradeClick = (planName: string, isAnnual: boolean) => {

    handlePlanSelect(planName, isAnnual);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const availablePlans = getAvailablePlans();
  const currentPlan = subscription?.plan;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Subscription Management</h2>
        <p className="text-muted-foreground mt-2">
          {!currentPlan || currentPlan === 'free'
            ? 'Upgrade your plan to unlock more features'
            : 'Manage your current subscription and explore upgrade options'
          }
        </p>
      </div>

      {/* Current Plan Status for paid users */}
      {(currentPlan === 'standard' || currentPlan === 'pro') && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Current Plan</h3>
                <p className="text-sm text-muted-foreground">
                  You're currently on the <strong className="text-foreground capitalize">{currentPlan}</strong> plan
                  {subscription?.currentPeriodEnd && (
                    <>
                      {' '}
                      • Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </>
                  )}
                </p>
              </div>
              <Button
                onClick={handleManageSubscription}
                variant="outline"
                className="sm:w-auto w-full"
              >
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Options Section */}
      {availablePlans.length > 0 && (
        <>
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
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
                className={`${isAnnual ? 'translate-x-6' : 'translate-x-1'
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

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availablePlans.map((plan) => {
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
              const annualSavings = plan.annualSavings;
              const buttonText = getButtonText(plan.name);
              const buttonVariant = getButtonVariant(
                plan.buttonVariant,
              );

              return (
                <Card
                  key={plan.name}
                  className={`relative border-2 transition-all duration-300 ${plan.popular
                    ? 'border-primary shadow-lg'
                    : 'border-border'
                    }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CardTitle className="text-xl font-bold text-foreground">
                        {plan.name}
                      </CardTitle>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-foreground">
                        ${price}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        /month
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
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
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
                        <ul className="space-y-1">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-1.5 flex-shrink-0" />
                              <span className="text-xs text-muted-foreground">
                                {limitation}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button
                      variant={buttonVariant}
                      className={`w-full bg-green-400 ${plan.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : ''
                        }`}
                      onClick={() => handleUpgradeClick(plan.name, isAnnual)}
                      disabled={isCreatingCheckout}
                    >
                      {isCreatingCheckout ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        buttonText
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* No upgrade available message for Pro users */}
      {currentPlan === 'pro' && (
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Check className="w-12 h-12 text-green-500" />
              <h3 className="text-xl font-semibold text-foreground">
                You're on our highest plan!
              </h3>
              <p className="text-muted-foreground max-w-md">
                You're already subscribed to the Pro plan with all features included.
                There are no higher plans available at this time.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Free plan info for paid users who might want to see what they have */}
      {(currentPlan === 'standard' || currentPlan === 'pro') && (
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => window.location.href = '/pricing'}
            className="text-muted-foreground"
          >
            View all plan details and comparisons
          </Button>
        </div>
      )}
    </div>
  );
}
