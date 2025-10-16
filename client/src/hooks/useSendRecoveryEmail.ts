import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import sendRecoveryEmailApi from '@/api/sendRecoveryEmailApi';
export const useSendRecoveryPasswordEmail = (callbackFn?: () => void) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: sendRecoveryEmailApi,
    onSuccess: (credentials) => {
      if (callbackFn) {
        callbackFn();
      }
      navigate('/RecoveryEmailValidationPage', { state: credentials });
      window.location.reload(); // makes the login dialog close
      return;
    },
    onError: (error) => {
      navigate('/');
      if (callbackFn) callbackFn();
      throw new Error(error.message);
    },
  });
};
