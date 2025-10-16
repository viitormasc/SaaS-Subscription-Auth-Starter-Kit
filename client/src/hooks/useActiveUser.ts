import getActiveUserAPi from '@/api/getActiveUserApi';
import type { UserDocument } from '@/types/interfaces'; // Assuming UserDocument is the type for the active user
import { useQuery } from '@tanstack/react-query';

export const useActiveUser = () => {
  const { data, isLoading, isError } = useQuery<UserDocument | null, Error>({
    queryKey: ['activeUser'],
    queryFn: getActiveUserAPi,
    // staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    staleTime: Infinity
  });

  return { data, isLoading, isError, isLoggedIn: !!data } as const;
};
