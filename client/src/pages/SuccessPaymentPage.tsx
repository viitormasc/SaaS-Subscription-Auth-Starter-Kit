import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import { formatDateToText } from '@/utils/time';
import { CheckCircle, Clock } from 'lucide-react';

export default function SuccessPaymentPage() {
  const { subscription, handleManageSubscription, isLoading } = useSubscription();
  if (isLoading) return <Spinner open />
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle className="w-20 h-20 text-green-500" />
              <div className="absolute inset-0 animate-ping opacity-20">
                <CheckCircle className="w-20 h-20 text-green-500" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground">
            Payment Successful!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome to {subscription?.plan} plan! Your account has been upgraded and you now have access to all premium features.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground"> Status </p>
                  <p className="font-medium">{subscription?.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Plan</p>
                  <p className="font-medium">{subscription?.plan}</p>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Next billing date:</strong> {formatDateToText(subscription?.currentPeriodEnd!)}
                </p>
              </div>
              <div className='flex items-center justify-center h-12'>
                <Button
                  onClick={handleManageSubscription}
                  className="sm:w-auto w-full bg-green-500"
                >
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
