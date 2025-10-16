import type { TimerApiData } from '@/types/interfaces';
import axios from '@/services/axios';
import { toast } from 'react-toastify';

export default async function getTimer(categoryId: string) {
  try {
    const res = await axios.get(`/api/studyTracker/getTimer/${categoryId}`);
    const data = res.data as TimerApiData;
    const timer = data.timer;
    return timer;
  } catch (err: any) {
    const errors = [err.response.data.errors];
    errors.forEach((error: string) => toast.error(error));
    throw new Error(errors[0]);

  }
}
