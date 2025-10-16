import { toast } from 'react-toastify';
import axios from '@/services/axios';
import type { ApiResponse, LoginUserData } from '@/types/interfaces';

export default async function validateRecoveryEmail(credentials: {
  email: string;
  validationCode: string;
  userId?: string;
}) {
  try {
    const res: ApiResponse = await axios.put(
      '/api/auth/checkValidationCodeEmail',
      {
        email: credentials.email.trim().toLowerCase(),
        validationCode: credentials.validationCode,
      },
    );
    const data = res.data as LoginUserData;

    toast.success(data.message);
    const { userId } = data;
    return userId;
  } catch (err: any) {
    const errors = [err.response.data.errors];
    errors.forEach((error: string) => toast.error(error));

    throw new Error(errors[0]);
  }
}
