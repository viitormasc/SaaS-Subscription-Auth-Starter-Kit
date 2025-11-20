import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
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
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useSendVerificationEmail } from '@/hooks/useSendVerificationEmail';
import { useSignUp } from '@/hooks/useSignUp';
import { FcGoogle } from 'react-icons/fc';
import { useId, useState, type ChangeEvent } from 'react';
import ReCaptcha from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import Logo from './ui/logo';
import SignUpCheckErrors from './ui/SignUpCheckErrors';
import { toast } from 'react-toastify';
import LogoNoName from './ui/LogoNoName';

export default function SignUpDialog({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  const id = useId();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const typePassword = isChecked ? 'text' : 'password';
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setIsChecked(e.target.checked);
  }

  const { mutate: signUp } = useSignUp(() => setOpenDialog(false));

  const { mutate: sendVerificationEmail, isPending } = useSendVerificationEmail(
    () => setOpenDialog(false),
  );
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    sendVerificationEmail({ password, confirmPassword, email, name, captcha });
    if (isPending) return <Spinner open />;
    // signUp({ password, confirmPassword, email, name, captcha });
  }

  const { mutate: googleAuth } = useGoogleAuth(() => setOpenDialog(false));

  async function handleGoogleSignUp(e: React.FormEvent) {
    e.preventDefault();
    googleAuth();
  }

  function onCaptchaChange(value: string | null) {
    setCaptcha(value || '');
  }
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className={`hover:border-none shadow-none ${className}`}>
          {text ? text : 'Get Started'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2 mt-[60px]">
          <div
            className="flex items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <LogoNoName className="scale-140 mb-8" />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Welcome!</DialogTitle>
            <DialogDescription className="sm:text-center">
              Lets start hitting your goals!
            </DialogDescription>
          </DialogHeader>
        </div>
        <Button
          variant="outline"
          className=" dark:text-white"
          onClick={handleGoogleSignUp}
        >
          <FcGoogle /> Sign up with Google
        </Button>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-fullName`}>Full name</Label>
              <Input
                id={`${id}-fullName`}
                placeholder="Jhon smith"
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
                required
              />
            </div>
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
            <div className="*:not-first:mt-2">
              <Label htmlFor={`${id}-confirmPassword`}>Confirm Password</Label>
              <Input
                id={`${id}-confirmPassword`}
                placeholder="Enter your password again"
                type={typePassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setConfirmPassword(e.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="dark: bg-white"
                onChange={handleChange}
                checked={isChecked}
              />
              <Label>Show password</Label>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="dark: bg-white"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPrivacyChecked(e.target.checked)
                }
                checked={privacyChecked}
              />
              <Label>
                {' '}
                I agree with{' '}
                <Link
                  to="/legalPage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer underline text-blue-400"
                >
                  privacy policy
                </Link>
              </Label>
            </div>
          </div>

          <SignUpCheckErrors
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            name={name}
            captcha={captcha}
          />
          <ReCaptcha
            sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY}
            theme="dark"
            onChange={onCaptchaChange}
          />
          <Button
            type="button"
            className="w-full dark:text-white"
            disabled={
              !captcha ||
              !email ||
              !confirmPassword ||
              !password ||
              !name ||
              !privacyChecked
            }
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </form>

        {/* <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1"> */}
        {/*   <span className="text-muted-foreground text-xs">Or</span> */}
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
}
