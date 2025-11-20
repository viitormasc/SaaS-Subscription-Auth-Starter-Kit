import { useSubscription } from '@/hooks/useSubscription'; // Adjust the import path as needed
import React from 'react';
import Spinner from './Spinner';

interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  plan: 'standard' | 'pro'
}

const UpgradeDialog: React.FC<UpgradeDialogProps> = ({
  open = true,
  onClose,
  title = "Feature Locked 🔒",
  message = "This feature is not available for you. Upgrade your plan to have access.",
  plan
}) => {
  const {
    subscription,
    isLoading,
    handlePlanSelect,
  } = useSubscription();

  if (!open) return null;

  const handleUpgrade = () => {
    handlePlanSelect(plan || 'pro', false)
  };

  if (isLoading) return <Spinner open />

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🔒</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {subscription?.plan || 'Free Plan'}
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-card-foreground leading-relaxed">
            {message}
          </p>

          {/* Feature List */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-500">✓</span>
              <span className="text-muted-foreground">Access to all AI features</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-500">✓</span>
              <span className="text-muted-foreground">Priority support</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-500">✓</span>
              <span className="text-muted-foreground">Advanced analytics</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 border-t border-border bg-muted/20">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-card-foreground bg-background border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white  bg-primary rounded-lg hover:bg-orange-300 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Upgrade Plan</span>
              </>
            )}
          </button>
        </div>

        {/* Current Plan Info */}
        {subscription && (
          <div className="px-6 pb-4">
            <div className="text-xs text-muted-foreground text-center">
              Current: {subscription.plan} •
              {subscription.status === 'active' ? ' Active' : ' Inactive'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeDialog;
