import { toast } from 'react-toastify';
import { LoginUserValidator } from '@/classes/LoginUserValidator';
import axios from '@/services/axios';
import type { ApiResponse, LoginUserData } from '@/types/interfaces';

export default async function validateSignUpCode(credentials: {
  email: string;
  validationCode: string;
  password: string;
  confirmPassword: string;
  name: string;
  captcha: string;
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

    return credentials;
  } catch (err: any) {
    const errors = [err.response.data.errors];
    errors.forEach((error: string) => toast.error(error));

    throw new Error(errors[0]);
  }
}
