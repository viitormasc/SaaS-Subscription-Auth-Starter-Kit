import type { CreateCheckoutSessionParams } from '@/types/interfaces';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getPriceId,
  subscriptionService,
} from '../services/subscriptionService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
// Query keys
export const subscriptionKeys = {
  all: ['subscription'] as const,
  status: () => [...subscriptionKeys.all, 'status'] as const,
};

// Hook for getting subscription status
export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: subscriptionKeys.status(),
    queryFn: subscriptionService.getSubscriptionStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook for creating checkout session
export const useCreateCheckoutSession = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (params: CreateCheckoutSessionParams) => {
      return await subscriptionService.createCheckoutSession(params);
    },
    onSuccess: async (data) => {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      window.location.href = data.sessionUrl;
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to create checkout session';
      toast.error(errorMessage);
    },
  });
};

// Hook for creating portal session
export const useCreatePortalSession = () => {
  return useMutation({
    mutationFn: subscriptionService.createPortalSession,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to create portal session';
      toast.error(errorMessage);
    },
  });
};

// Hook for canceling subscription
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionService.cancelSubscription,
    onSuccess: () => {
      // Invalidate and refetch subscription status
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.status() });
      toast.success('Subscription cancelled successfully');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to cancel subscription';
      toast.error(errorMessage);
    },
  });
};

// Composite hook for subscription management
export const useSubscription = () => {
  const statusQuery = useSubscriptionStatus();
  const checkoutMutation = useCreateCheckoutSession();
  const portalMutation = useCreatePortalSession();
  const cancelMutation = useCancelSubscription();

  const handlePlanSelect = async (planName: string, isAnnual: boolean) => {
    if (planName === 'Free') {
      toast.info('You are already on the Free plan');
      return;
    }

    try {
      const priceId = getPriceId(planName, isAnnual);
      await checkoutMutation.mutateAsync({ priceId, isAnnual });
    } catch (error) {
      // Error is already handled in the mutation
      console.error('Plan selection failed:', error);
    }
  };

  const handleManageSubscription = () => {
    portalMutation.mutate();
  };

  const handleCancelSubscription = () => {
    if (
      window.confirm(
        'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
      )
    ) {
      cancelMutation.mutate();
    }
  };

  return {
    // Data
    subscription: statusQuery.data,

    // Status
    isLoading: statusQuery.isLoading,
    isError: statusQuery.isError,
    error: statusQuery.error,

    // Actions
    handlePlanSelect,
    handleManageSubscription,
    handleCancelSubscription,

    // Mutation states
    isCreatingCheckout: checkoutMutation.isPending,
    isCreatingPortal: portalMutation.isPending,
    isCanceling: cancelMutation.isPending,

    // Refetch function
    refetchStatus: statusQuery.refetch,
  };
};

// export const usePriceCalculation = () => {
//   const getPrice = (planName: string, isAnnual: boolean): number => {
//     const prices = {
//       Free: { monthly: 0, annual: 0 },
//       Standard: { monthly: 4.99, annual: 3.99 },
//       Pro: { monthly: 7.99, annual: 4.99 },
//     };
//
//     const planKey = planName as keyof typeof prices;
//     const billingKey = isAnnual ? 'annual' : 'monthly';
//
//     return prices[planKey]?.[billingKey] ?? 0;
//   };
//
//   const getAnnualSavings = (planName: string): number => {
//     if (planName === 'Free') return 0;
//
//     const monthlyPrice = getPrice(planName, false);
//     const annualPrice = getPrice(planName, true);
//
//     return Number((monthlyPrice * 12 - annualPrice * 12).toFixed(2));
//   };
//
//   return {
//     getPrice,
//     getAnnualSavings,
//   };
// };
