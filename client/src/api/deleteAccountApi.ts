import axios from '@/services/axios';
import type { ApiResponse, LoginUserData } from '@/types/interfaces';
import { toast } from 'react-toastify';

export default async function deleteAccountApi(captcha: string) {

  if (!captcha) {
    toast.error('Please complete the captcha');
    throw new Error('Please Complete the captcha');
  }
  try {
    const res: ApiResponse = await axios.delete('/api/user/deleteUser', {
      data: { captcha },
    });
    const data = res.data as LoginUserData;

    toast.success(data.message);

    return data.user;
  } catch (err: any) {
    const errors = [err.response.data.errors];
    errors.forEach((error: string) => toast.error(error));
    throw new Error(errors[0]);
  }
}
