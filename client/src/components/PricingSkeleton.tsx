import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export default function PricingPageSkeleton() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center space-y-4 mb-12">
          <div className="h-10 bg-muted rounded-lg w-3/4 max-w-2xl mx-auto animate-pulse" />
          <div className="h-6 bg-muted rounded-lg w-2/3 max-w-xl mx-auto animate-pulse" />

          {/* Toggle Switch Skeleton */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
            <div className="h-6 w-11 bg-muted rounded-full animate-pulse" />
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Pricing Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {[1, 2, 3].map((index) => (
            <Card
              key={index}
              className={`relative border-2 ${index === 2 ? 'border-primary' : 'border-border'
                }`}
            >
              {/* Popular Badge Skeleton */}
              {index === 2 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="h-7 w-32 bg-primary/20 rounded-full animate-pulse" />
                </div>
              )}

              <CardHeader className="text-center pb-4">
                {/* Icon and Title */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-4 bg-muted rounded w-3/4 mx-auto animate-pulse" />

                {/* Price Skeleton */}
                <div className="mt-4 space-y-2">
                  <div className="h-12 w-32 bg-muted rounded mx-auto animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded mx-auto animate-pulse" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features Skeleton */}
                <ul className="space-y-3">
                  {[1, 2, 3, 4, 5].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-muted rounded-full flex-shrink-0 mt-0.5 animate-pulse" />
                      <div className="h-4 bg-muted rounded flex-1 animate-pulse" />
                    </li>
                  ))}
                </ul>

                {/* Limitations Skeleton (only for first card) */}
                {index === 1 && (
                  <div className="pt-2">
                    <div className="h-3 w-20 bg-muted rounded mb-2 animate-pulse" />
                    <ul className="space-y-2">
                      {[1, 2, 3].map((limitation) => (
                        <li key={limitation} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-muted rounded-full mt-1.5 flex-shrink-0 animate-pulse" />
                          <div className="h-3 bg-muted rounded flex-1 animate-pulse" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section Skeleton */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="h-8 bg-muted rounded-lg w-64 mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((faq) => (
              <div key={faq} className="bg-muted/50 rounded-lg p-6 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
