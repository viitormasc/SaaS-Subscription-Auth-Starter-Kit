import { useMutation, useQueryClient } from '@tanstack/react-query';
import startTimerApi from '@/api/startTimerApi';
import resumeTimerApi from '@/api/resumeTimerApi';

export const useResumeTimer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resumeTimerApi,
    onSuccess: (timer) => {
      queryClient.setQueryData(['timer', timer.categoryId, timer._id], timer);
      const bc = new BroadcastChannel('timer-channel');
      queryClient.invalidateQueries({ queryKey: ['timer', timer.categoryId] });

      bc.postMessage({ type: 'timerUpdated', categoryId: timer.categoryId });
      const categoryBc = new BroadcastChannel('category-channel')
      categoryBc.postMessage({ type: 'categoryUpdated', userId: timer.userId })

    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
