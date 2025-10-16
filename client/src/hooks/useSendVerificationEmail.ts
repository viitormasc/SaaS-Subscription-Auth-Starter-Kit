import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import sendVerificationEmailApi from '@/api/sendVerificationEmailApi';
export const useSendVerificationEmail = (onSuccessCallback?: () => void) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendVerificationEmailApi,
    onSuccess: (credentials) => {
      if (onSuccessCallback) onSuccessCallback();
      navigate('/EmailValidationPage', { state: credentials });
    },
    onError: (error) => {
      navigate('/')
      throw new Error(error.message);
    },
  });
};
