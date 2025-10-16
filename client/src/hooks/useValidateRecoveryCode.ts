import validateSignUpCode from '@/api/validateSignUpCode';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from './useSignUp';
import validateRecoveryEmail from '@/api/validateRecoveyEmail';

export const useValidateRecoveryCode = (onSuccessCallback?: () => void) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: signUp } = useSignUp();

  return useMutation({
    mutationFn: validateRecoveryEmail,
    onSuccess: (userId) => {
      navigate(`/ChangeRecoverPasswordPage/${userId}`);
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
