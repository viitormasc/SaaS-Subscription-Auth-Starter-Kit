import requestLogoutApi from '@/api/requestLogoutApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestLogoutApi,
    onSuccess: () => {
      queryClient.setQueryData(['activeUser'], null);
      navigate('/landing');
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
