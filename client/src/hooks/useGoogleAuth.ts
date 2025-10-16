import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import getGoogleAuth from '@/api/getGoogleAuth';
import type { ApiResponse } from '@/types/interfaces';

export const useGoogleAuth = (onSuccessCallback?: () => void) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: getGoogleAuth,
    onSuccess: () => {
      if (onSuccessCallback) onSuccessCallback();
      navigate('/');
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
