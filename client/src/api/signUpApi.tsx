import { toast } from 'react-toastify';
import { SignUpUserValidator } from '@/classes/SignUpValidator';
import axios from '@/services/axios';
import type { LoginUserData, SignUpCheckErrorsProps } from '@/types/interfaces';
import type { ApiResponse } from '@/types/interfaces';

export default async function signUpApi(credentials: SignUpCheckErrorsProps) {
  const { password, confirmPassword, email, name, captcha } = credentials;
  const signUpvalidator = new SignUpUserValidator(
    email,
    password,
    confirmPassword,
  );
  const errors = signUpvalidator.checkValidation();

  if (errors.length) {
    throw new Error('Signup failed');
  }

  try {
    const res: ApiResponse = await axios.post('/api/auth/signup', {
      email: email.trim(),
      name,
      password,
      confirmPassword,
      captcha,
    });

    const data = res.data as LoginUserData;

    toast.success(data.message);

    return res;
  } catch (err: any) {
    const errors = [err.response.data.errors];
    console.log('error', errors);
    errors.forEach((error: string) => toast.error(error));
  }
}
