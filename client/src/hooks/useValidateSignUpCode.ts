import validateSignUpCode from '@/api/validateSignUpCode';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from './useSignUp';

export const useValidateSignUpCode = () => {
  const navigate = useNavigate();

  const { mutate: signUp } = useSignUp();

  return useMutation({
    mutationFn: validateSignUpCode,
    onSuccess: (credentials) => {
      console.log('sucess validating email');
      const { password, confirmPassword, email, name, captcha } = credentials;
      signUp({ password, confirmPassword, email, name, captcha });
      // if (onSuccessCallback) onSuccessCallback();
      // navigate('/');
    },
    onError: (error) => {
      console.log(error);
      throw new Error(error.message);
    },
  });
};
