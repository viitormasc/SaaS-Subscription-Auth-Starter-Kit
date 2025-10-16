import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { useActiveUser } from '@/hooks/useActiveUser';
import { useDeleteUser } from '@/hooks/userDeleteUser';
import ReCaptcha from 'react-google-recaptcha';

export default function DeleteAccountButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const { data: user, isLoading: userLoading, isError } = useActiveUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser(() =>
    setIsDialogOpen(false),
  );
  function onCaptchaChange(value: string | null) {
    setCaptcha(value || '');
  }

  const handleDeleteAccount = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    const userEmail = user?.email;
    if (email.toLowerCase() !== userEmail) {
      toast.error('Email does not match your account email');
      return;
    }
    handleClick();
  };

  const handleClick = async () => {
    console.log('Deleting account...');
    deleteUser(captcha);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Delete Account Permanently
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers. Everything will
            be permanently lost.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-email" className="text-foreground">
              Enter your email to confirm
            </Label>
            <Input
              id="confirm-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Type your email address to confirm account deletion
            </p>
          </div>
        </div>
        <ReCaptcha
          sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY}
          onChange={onCaptchaChange}
        />

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsDialogOpen(false);
              setEmail('');
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting || !email || !captcha}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
