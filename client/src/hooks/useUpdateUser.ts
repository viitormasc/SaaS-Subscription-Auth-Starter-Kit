import editUserApi from '@/api/editUserApi';
import type { LoginUserData } from '@/types/interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useUpdateUser = (onSuccessCallback?: () => void) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editUserApi,
    onSuccess: (response) => {
      const data = response.data as LoginUserData;
      const user = data.user;
      queryClient.setQueryData(['activeUser'], user);
      queryClient.invalidateQueries({ queryKey: ['activeUser', user] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
