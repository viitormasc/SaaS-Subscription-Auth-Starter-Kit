import { useMutation, useQueryClient } from '@tanstack/react-query';
import signUpApi from '@/api/signUpApi';
import { useNavigate } from 'react-router-dom';
import type { LoginUserData } from '@/types/interfaces';

export const useSignUp = (onSuccessCallback?: () => void) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUpApi,
    onSuccess: (response) => {
      if (!response) throw new Error('No user response from API')
      const data = response.data as LoginUserData
      const user = data.user
      queryClient.setQueryData(['activeUser'], user);
      if (onSuccessCallback) onSuccessCallback();
      navigate('/');
    },
    onError: (error) => {

      throw new Error(error.message);
    },
  });
};
