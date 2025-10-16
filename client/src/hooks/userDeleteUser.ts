import deleteAccountApi from '@/api/deleteAccountApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useDeleteUser = (onSuccessCallback?: () => void) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccountApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeUser'] });
      if (onSuccessCallback) onSuccessCallback();
      navigate('/');
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
