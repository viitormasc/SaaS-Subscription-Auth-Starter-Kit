import { Button } from './ui/button';
import { toast } from 'react-toastify';
import { useLogout } from '@/hooks/useLogout';
import Spinner from './Spinner';

export default function LogoutButton() {
  const { mutate: logout, isError, isPending } = useLogout();

  if (isPending) return <Spinner open />;

  async function handleClick() {
    logout();
  }

  return (
    <>
      <Button variant="outline" onClick={handleClick}>
        Logout
      </Button>
    </>
  );
}
