import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { useChangePasswordLoggedInUser } from '@/hooks/useChangePasswordLoggedInUser';
import Spinner from './Spinner';
import { ShowPasswordComponent } from './ShowPasswordComponent';
import { ChangePasswordErrorsCheck } from './ChangePasswordErrorsCheck';

export const ChangePasswordUserTab = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChecked, setIsChecked] = useState(false);
  const typePassword = isChecked ? 'text' : 'password';

  const { mutate: changeUserPassword, isPending } =
    useChangePasswordLoggedInUser(() =>
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }),
    );

  function handlePasswordChange(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    changeUserPassword({
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
      currentPassword: passwordData.currentPassword,
    });
  }
  if (isPending) return <Spinner open />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Change Password
        </h2>
        <p className="text-muted-foreground">
          Update your password to keep your account secure
        </p>
      </div>

      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-foreground">
            Current Password
          </Label>
          <Input
            id="currentPassword"
            type={typePassword}
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            placeholder="Enter current password"
            className="border-border text-foreground bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-foreground">
            New Password
          </Label>
          <Input
            id="newPassword"
            type={typePassword}
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            placeholder="Enter new password"
            className="border-border text-foreground bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-foreground">
            Confirm New Password
          </Label>
          <Input
            id="confirmPassword"
            value={passwordData.confirmPassword}
            type={typePassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            placeholder="Confirm new password"
            className="border-border text-foreground bg-background"
          />
        </div>
        <ChangePasswordErrorsCheck
          password={passwordData.newPassword}
          confirmPassword={passwordData.confirmPassword}
        />
        <ShowPasswordComponent
          isChecked={isChecked}
          onCheckedChange={setIsChecked}
        />
        <Button
          onClick={handlePasswordChange}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Lock className="w-4 h-4 mr-2" />
          Update Password
        </Button>
      </div>
    </div>
  );
};
