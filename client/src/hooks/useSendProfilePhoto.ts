import sendProfilePhotoApi from '@/api/sendProfilePhotoApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSendProfilePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendProfilePhotoApi,
    onSuccess: (profilePhotoUrl) => {
      queryClient.setQueryData(['activeUser'], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          profilePhoto: profilePhotoUrl,
        };
      });

      queryClient.invalidateQueries({ queryKey: ['activeUser'] });
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
