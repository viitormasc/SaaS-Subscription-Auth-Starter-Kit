import { useId } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import ThemeContext from '@/utils/ThemeProvider';
import { useContext } from 'react';
import type { ThemeContextType } from '@/types/interfaces';

export default function ToggleDarkModeButton({
  className,
}: {
  className?: string;
}) {
  const { theme, toggleTheme, checked } = useContext(
    ThemeContext,
  ) as ThemeContextType;
  const id = useId();
  if (!toggleTheme) {
    return;
  }
  const handleMoonClick = () => {
    if (theme !== 'dark') {
      toggleTheme(); // Switch to dark mode
    }
  };

  const handleSunClick = () => {
    if (theme !== 'light') {
      toggleTheme(); // Switch to light mode
    }
  };

  return (
    <div
      className={`group inline-flex items-center gap-2 ${className}`}
      data-state={checked ? 'checked' : 'unchecked'}
    >
      <span
        id={`${id}-off`}
        className="group-data-[state=checked]:text-muted-foreground/70 flex-1 cursor-pointer text-right text-sm font-medium"
        aria-controls={id}
        onClick={handleMoonClick}
      >
        <MoonIcon size={16} aria-hidden="true" />
      </span>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={toggleTheme}
        aria-labelledby={`${id}-off ${id}-on`}
        aria-label="Toggle between dark and light mode"
      />
      <span
        id={`${id}-on`}
        className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
        aria-controls={id}
        onClick={handleSunClick}
      >
        <SunIcon size={16} aria-hidden="true" />
      </span>
    </div>
  );
}
