import logo from '../../assets/CodeByVitor-withotu-bg.png'
import { useContext } from 'react';
import ThemeContext from '@/utils/ThemeProvider';
import type { ThemeContextType } from '@/types/interfaces';
export interface LogoProps {
  className?: string;
}

export default function LogoNoName({ className }: LogoProps) {
  const { theme } = useContext(ThemeContext) as ThemeContextType;

  return (
    <>
      <img
        src={logo}
        alt="Logo study timer app"
        className={
          theme == 'dark'
            ? `w-25 h-25 mt-5 ${className} rounded-full `
            : `w-25 h-25 ${className}  `
        }
      />
    </>
  );
}
