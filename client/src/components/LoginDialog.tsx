import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FcGoogle } from 'react-icons/fc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useId, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import { ShowPasswordComponent } from './ShowPasswordComponent';
import Spinner from './Spinner';
import LogoNoName from './ui/LogoNoName';

export default function LoginDialog() {
  const id = useId();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const typePassword = isChecked ? 'text' : 'password';

  const fetchUrl = `/api/auth/login`;

  const { mutate: auth, isPending: authPending } = useAuth(() =>
    setOpenDialog(false),
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    auth({ email: email, password: password, url: fetchUrl });
  }

  const { mutate: googleAuth, isPending: googlePending } = useGoogleAuth(() =>
    setOpenDialog(false),
  );

  if (authPending || googlePending) return <Spinner open />;

  async function handleGoogleLogin(e: React.FormEvent) {
    e.preventDefault();
    googleAuth();
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:border-none shadow-none">
          Log in
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex  shrink-0 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <LogoNoName className="scale-140 my-7" />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your credentials to login to your account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input
                id={`${id}-email`}
                placeholder="exemple@gmail.com"
                type="email"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type={typePassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <ShowPasswordComponent
              isChecked={isChecked}
              onCheckedChange={setIsChecked}
            />
            <ForgotPasswordDialog />
          </div>
          <Button type="button" className="w-full" onClick={handleLogin}>
            Sign in
          </Button>
        </form>

        <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-muted-foreground text-xs">Or</span>
        </div>

        <Button
          variant="outline"
          className="dark:text-white"
          onClick={handleGoogleLogin}
        >
          <FcGoogle />
          Login with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
