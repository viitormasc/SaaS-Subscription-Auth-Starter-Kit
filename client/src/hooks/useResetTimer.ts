import resetTimerApi from '@/api/resetTimerApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useResetTimer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetTimerApi,
    onSuccess: (timer) => {
      queryClient.setQueryData(['timer', timer.categoryId, timer._id], timer);
      const bc = new BroadcastChannel('timer-channel');
      queryClient.invalidateQueries({ queryKey: ['timer', timer.categoryId] });
      bc.postMessage({ type: 'timerUpdated', categoryId: timer.categoryId });
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
