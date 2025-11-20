import { ChevronDownIcon, LogOutIcon, UserPenIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useActiveUser } from '@/hooks/useActiveUser';
import { useLogout } from '@/hooks/useLogout';
import ToggleDarkModeBUtton from './ToggleDarkModeButton';

export default function UserDropdownMenu() {
  const { mutate: logout, isPending } = useLogout();
  const { data: user, isLoading, isError } = useActiveUser();
  if (!user) return <h1>ERROR </h1>;
  function handleLogout() {
    logout();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={async () => {
            if (!('Notification' in window)) {
              console.log('This browser does not support notifications.');
              return;
            }
            await Notification.requestPermission();
          }}
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent"
        >
          <Avatar>
            <AvatarImage
              src={user.profilePhoto}
              alt="Profile image"
              className="aspect-sq uare h-full w-full object-co ve r "
            />
            <AvatarFallback className="bg- border-2 dark:bg-zinc-400  dark:text-black dark:border-zinc-400 border-black ">
              {user?.name?.slice(0, 2).toUpperCase() ?? 'VM'}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 z-20000">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user?.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
            <Link to="/editProfilePage">Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <ToggleDarkModeBUtton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
