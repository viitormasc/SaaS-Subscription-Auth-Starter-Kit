import { ChangePasswordValidator } from '@/classes/ChangePasswordValidator';
import axios from '@/services/axios';
import type { ApiResponse, ChangeUserLoggedInPassProps, LoginUserData } from '@/types/interfaces';
import { toast } from 'react-toastify';

export default async function changeLoggedInUserPassApi(
  credentials: ChangeUserLoggedInPassProps,
) {
  const { newPassword, confirmPassword, currentPassword } = credentials;
  const passwordValidator = new ChangePasswordValidator(
    newPassword,
    confirmPassword,
  );
  const errors = passwordValidator.checkValidation();

  if (errors.length) {
    errors.forEach((error: string) => toast.error(error));
    throw new Error('Signup failed');
  }

  try {
    const res: ApiResponse = await axios.put('/api/auth/changeUserLoggedInPassword', {
      newPassword,
      confirmPassword,
      currentPassword,
    });

    const data = res.data as LoginUserData;

    toast.success(data.message);

    return data;
  } catch (err: any) {
    const errors = [err.response.data.errors];
    console.log('error', errors);
    errors.forEach((error: string) => toast.error(error));
  }
}
