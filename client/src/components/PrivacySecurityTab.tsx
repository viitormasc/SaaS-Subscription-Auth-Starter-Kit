import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import DeleteAccountButton from './DeleteAccountAlertComponent';

export default function PrivacySecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Privacy & Security
        </h2>
        <p className="text-muted-foreground">
          Manage your privacy and security settings
        </p>
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
        <div className="space-y-0.5">
          <Label className="text-foreground font-medium">
            Account Deletion
          </Label>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all data
          </p>
        </div>
        <DeleteAccountButton />
        {/*   <Button variant="destructive" size="sm"> */}
        {/*     Delete Account */}
        {/*   </Button> */}
      </div>
    </div>
  );
}

