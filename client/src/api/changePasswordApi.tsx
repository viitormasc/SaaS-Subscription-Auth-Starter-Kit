import { toast } from 'react-toastify';
import axios from '@/services/axios';
import type { ChangePasswordApiProps, LoginUserData } from '@/types/interfaces';
import type { ApiResponse } from '@/types/interfaces';
import { ChangePasswordValidator } from '@/classes/ChangePasswordValidator';

export default async function changePasswordApi(
  credentials: ChangePasswordApiProps,
) {
  const { newPassword, confirmPassword, userId } = credentials;
  console.log('credentials', credentials);
  const passwordValidator = new ChangePasswordValidator(
    newPassword,
    confirmPassword,
  );
  const errors = passwordValidator.checkValidation();
  console.log('errors', errors);

  if (errors.length) {
    errors.forEach((error: string) => toast.error(error));
    throw new Error('Signup failed');
  }

  try {
    const res: ApiResponse = await axios.put('/api/auth/changePassword', {
      newPassword,
      confirmPassword,
      userId,
    });

    const data = res.data as LoginUserData;
    console.log('data', data);

    toast.success(data.message);

    return data;
  } catch (err: any) {
    const errors = [err.response.data.errors];
    console.log('error', errors);
    errors.forEach((error: string) => toast.error(error));
  }
}
