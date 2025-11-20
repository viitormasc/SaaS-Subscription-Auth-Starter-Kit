import { LoginUserValidator } from '@/classes/LoginUserValidator';
import axios from '@/services/axios';
import type { ApiResponse, LoginUserData } from '@/types/interfaces';
import { toast } from 'react-toastify';

// TODO : make this type secure
export default async function postAuth(credentials: {
  email: string;
  password: string;
  url: string;
}) {
  const loginValidation = new LoginUserValidator(
    credentials.email.trim(),
    credentials.password,
  );

  const errors = loginValidation.checkValidation();
  if (errors.length) {
    errors.forEach((error: string) => toast.error(error));
    throw new Error('Login failed');
  }

  try {
    const res: ApiResponse = await axios.post(credentials.url as string, {
      email: credentials.email.trim(),
      password: credentials.password,
    });
    const data = res.data as LoginUserData;

    toast.success(data.message);

    return res;
  } catch (err: any) {
    const errors = [err.response.data.errors];

    errors.forEach((error: string) => toast.error(error));
    throw new Error(errors[0]);
  }
}
