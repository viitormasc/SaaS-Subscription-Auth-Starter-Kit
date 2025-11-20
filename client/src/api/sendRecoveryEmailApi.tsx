import axios from '@/services/axios';
import type { ApiResponse, EmailSentData, SendRecoveryEmailProps } from '@/types/interfaces';
import { toast } from 'react-toastify';

export default async function sendRecoveryEmailApi(
  credentials: SendRecoveryEmailProps,
) {
  const { email, captcha } = credentials;
  try {
    const res: ApiResponse = await axios.post(
      '/api/auth/sendForgotPasswordEmail',
      {
        email: email.trim().toLowerCase(),
        captcha,
      },
    );

    const data = res.data as EmailSentData;
    toast.success(data.message);
    const id = data.emailSentID;
    credentials.id = id;
    return credentials;
  } catch (err: any) {
    const errors = err.response.data.errors;
    console.log(errors);
    errors.forEach((error: string) => toast.error(error));
    throw new Error(errors[0]);
  }
}
