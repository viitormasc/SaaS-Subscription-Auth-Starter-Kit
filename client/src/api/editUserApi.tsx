import axios from '@/services/axios';
import type { ApiResponse, LoginUserData } from '@/types/interfaces';
import { toast } from 'react-toastify';

export default async function editUserApi(credentials: {
  firstName: string;
  lastName: string;
  profilePhoto: string;
}) {
  const { firstName, lastName, profilePhoto } = credentials;
  try {
    const res: ApiResponse = await axios.put('/api/user/updateUser', {
      firstName,
      lastName,
      profilePhoto,
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
