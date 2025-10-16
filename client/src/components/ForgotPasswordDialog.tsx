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
import { useSendRecoveryPasswordEmail } from '@/hooks/useSendRecoveryEmail';
import { useId, useState, type ChangeEvent } from 'react';
import ReCaptcha from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from './ui/logo';

export default function ForgotPasswordDialog() {
  const id = useId();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [openPassDialog, setOpenDialog] = useState(false);
  const [captcha, setCaptcha] = useState('');

  const { mutate: sendValidationEmail, isPending } =
    useSendRecoveryPasswordEmail(() => setOpenDialog(false));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      toast.error('Please use a valid email');
      return;
    }

    if (!captcha) {
      toast.error('Please complete the captcha');
      return;
    }

    sendValidationEmail({ email, captcha });
  }
  function onCaptchaChange(value: string | null) {
    setCaptcha(value || '');
  }

  return (
    <Dialog open={openPassDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <a className="text-sm underline hover:no-underline">Forgot password?</a>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <Logo />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Recover password
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your e-mail to recover your password
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
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
          </div>
          <ReCaptcha
            sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY}
            onChange={onCaptchaChange}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={!captcha || !email}
          >
            Send recovery e-mail
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
