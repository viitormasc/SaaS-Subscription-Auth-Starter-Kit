import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import sendRecoveryEmailApi from '@/api/sendRecoveryEmailApi';
import resendRecoveryEmailApi from '@/api/resendRecoveyEmailApi';
export const useResendRecoveryEmail = (callbackFn?: () => void) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resendRecoveryEmailApi,
    onSuccess: (credentials) => {
      if (callbackFn) {
        callbackFn();
      }
      navigate('/RecoveryEmailValidationPage', { state: credentials });
      return;
    },
    onError: (error) => {
      navigate('/');
      if (callbackFn) callbackFn();
      throw new Error(error.message);
    },
  });
};
