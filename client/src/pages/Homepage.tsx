import Spinner from '@/components/Spinner';
import { useActiveUser } from '@/hooks/useActiveUser';

export default function Homepage() {
  const { data: user, isLoading: userLoading } = useActiveUser();

  if (userLoading) {
    return <Spinner open />;
  }


  return (
    <div>
    </div>
  );
}
