import { toast } from 'react-toastify';
import axios from '@/services/axios';
import type { EmailSentData, SendRecoveryEmailProps } from '@/types/interfaces';
import type { ApiResponse } from '@/types/interfaces';

export default async function resendRecoveryEmailApi(
  credentials: SendRecoveryEmailProps,
) {
  const { email, captcha, id } = credentials;
  try {
    const res: ApiResponse = await axios.post(
      `/api/auth/resendForgotPasswordEmail/${id}`,
      {
        email: email.trim().toLowerCase(),
        captcha,
      },
    );

    const data = res.data as EmailSentData;
    toast.success(data.message);
    const newId = data.emailSentID;
    credentials.id = newId;
    return credentials;
  } catch (err: any) {
    const errors = err.response.data.errors;
    console.log(errors);
    errors.forEach((error: string) => toast.error(error));
    throw new Error(errors[0]);
  }
}
