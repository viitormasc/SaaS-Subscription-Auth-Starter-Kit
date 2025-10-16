import Spinner from '@/components/Spinner';
import { useActiveUser } from '@/hooks/useActiveUser';

export default function Homepage() {
  const { data: user, isLoading: userLoading, isError } = useActiveUser();


  if (userLoading) {
    return <Spinner open />;
  }

  if (isError) {
    return <div>Error loading user data.</div>;
  }

  return (
    <div className="flex flex-row flex-wrap flex-1 gap-4 justify-baseline">
    </div>
  );
}

