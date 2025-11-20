import { subscriptionKeys } from "@/hooks/useSubscription"
import { subscriptionService } from "@/services/subscriptionService"
import { useQueryClient } from "@tanstack/react-query"

export const usePrefetchPricing = () => {
  const queryClient = useQueryClient()

  const prefetchPricing = async () => {
    await queryClient.prefetchQuery({
      queryKey: subscriptionKeys.status(),
      queryFn: subscriptionService.getSubscriptionStatus,
      staleTime: 5 * 60 * 1000,
    })
  }

  return prefetchPricing
}
