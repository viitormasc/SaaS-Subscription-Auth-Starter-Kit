import { useMutation, useQueryClient } from '@tanstack/react-query';
import postAuth from '@/api/auth';
import { useNavigate } from 'react-router-dom';
import type { LoginUserData, UserDocument } from '@/types/interfaces';

export const useAuth = (onSuccessCallback?: () => void) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postAuth,
    onSuccess: (response) => {
      const data= response.data as LoginUserData
      const user = data.user
      queryClient.setQueryData(['activeUser'], user)
      if (onSuccessCallback) onSuccessCallback();
      navigate('/');
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
