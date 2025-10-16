import { toast } from 'react-toastify';
import axios from '@/services/axios';
import type { LogoutApiResponse } from '@/types/interfaces';

export default async function requestLogoutApi() {
  try {
    const res: any = await axios.get('/api/auth/logout');
    toast.success(res?.message);
    return res;
  } catch (err: any) {
    const errors = [err.response.data.errors];
    errors.forEach((error: string) => toast.error(error));
  }
}
