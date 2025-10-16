import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import changeLoggedInUserPassApi from '@/api/changeLoggedinUserPass';

export const useChangePasswordLoggedInUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  return useMutation({
    mutationFn: changeLoggedInUserPassApi,
    onSuccess: (data) => {
      if (!data) throw new Error('No user data from API');
      const user = data.user;
      queryClient.setQueryData(['activeUser'], user);
      queryClient.invalidateQueries({ queryKey: ['activeUser'] })
      if (onSuccessCallback) onSuccessCallback()
    },
    onError: (error) => {
      console.log(error.message)
      throw new Error(error.message);
    },
  });
};
