import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useActiveUser } from '@/hooks/useActiveUser';
import { usePrefetchPricing } from '@/prefetchHooks/prefetchHooks';
import { useLocation } from 'react-router-dom';
import LoginDialog from './LoginDialog';
import SignUpDialog from './SignUpDialog';
import ToggleDarkModeButton from './ToggleDarkModeButton';
import Logo from './ui/logo';
import UserDropdownMenu from './UserDropdownMenu';
const UserLoggedInNavigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/pricing', label: 'Pricing' },
];

const noUserNavigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Navbar() {
  const { data: user } = useActiveUser();
  const location = useLocation();
  const prefetchPricing = usePrefetchPricing()


  const navigationLinks = user
    ? UserLoggedInNavigationLinks
    : noUserNavigationLinks;

  const isActiveLink = (href: string) => {
    return location.pathname == href;
  };
  return (
    <header className="w-[100%] fixed border-b px-4 md:px-6 shadow-sm z-[1000] bg-white dark:bg-[#0A0A0A] ">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden" >
              <NavigationMenu className="max-w-none *:w-full" >
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2" >
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full" onMouseOver={() => console.log('mouse enter')} >
                      <NavigationMenuLink
                        href={link.href}
                        className="py-1.5"
                        active={true}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a href="/" className="text-primary hover:text-primary/90">
              <Logo />
            </a>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      active={isActiveLink(link.href)}
                      href={link.href}
                      style={{ pointerEvents: 'auto' }}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                      onMouseEnter={() => {
                        if (link.label == 'Pricing' && !isActiveLink(link.href))
                          prefetchPricing()
                      }}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {!user && <ToggleDarkModeButton />}
          {!user && <LoginDialog />}
          {!user ? (
            <SignUpDialog />
          ) : (
            <>
              <UserDropdownMenu />
            </>
          )}
        </div>
      </div>
    </header >
  );
}
