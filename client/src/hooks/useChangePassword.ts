import { useMutation, useQueryClient } from '@tanstack/react-query';
import signUpApi from '@/api/signUpApi';
import { useNavigate } from 'react-router-dom';
import changePasswordApi from '@/api/changePasswordApi';
import type { LoginUserData } from '@/types/interfaces';

export const useChangePassword = (onSuccessCallback?: () => void) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePasswordApi,
    onSuccess: (data) => {
      if (!data) throw new Error('No user data from API');
      const user = data.user;
      queryClient.setQueryData(['activeUser'], user);
      if (onSuccessCallback) onSuccessCallback();
      navigate('/');
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
