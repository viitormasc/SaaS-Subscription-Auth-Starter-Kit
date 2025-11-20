import axios from '@/services/axios';
import type {
  ApiResponse,
  LoginUserData,
  UserDocument,
} from '@/types/interfaces'; // Import UserDocument
// import { LoginUserData } from '@/types/interfaces';
// Removed useQueryClient as it cannot be used in a queryFn

export default async function getActiveUserAPi(): Promise<UserDocument | null> {
  try {
    const response: ApiResponse = await axios.get('/api/auth/me');
    const data = response.data as LoginUserData;
    const activeUser = data.user || null;
    return activeUser;
  } catch (error) {
    console.error('Error fetching active user:', error);
    return null; // Return null on error
  }
}
