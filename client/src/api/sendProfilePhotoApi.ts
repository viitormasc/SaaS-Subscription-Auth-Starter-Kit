import { toast } from 'react-toastify';
import axios from '@/services/axios';
import type { ApiResponse, LoginUserData } from '@/types/interfaces';

export default async function sendProfilePhotoApi(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  console.log('formData', formData);

  try {
    const res: ApiResponse = await axios.put(
      '/api/user/updateProfilePhoto',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    const data = res.data as LoginUserData;
    console.log('data', data);
    toast.success(data.message);
    const user = data.user;
    return user?.profilePhoto;
  } catch (err: any) {
    console.log(err);
    const errors = [err.response.data.errors];
    errors.forEach((error: string) => toast.error(error));
    throw new Error(errors[0]);
  }
}
