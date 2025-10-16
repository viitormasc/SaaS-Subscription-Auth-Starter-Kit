import { Label } from '@/components/ui/label';
import { type ChangeEvent } from 'react';
interface ShowPasswordComponentProps {
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
export const ShowPasswordComponent = ({ isChecked, onCheckedChange }: ShowPasswordComponentProps) => {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onCheckedChange(e.target.checked);
  }

  return (
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

  )
}
