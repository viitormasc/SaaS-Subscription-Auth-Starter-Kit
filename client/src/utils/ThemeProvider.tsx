import type { ChildrenProps, ThemeContextType } from '@/types/interfaces';
import { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  checked: false
});

export default ThemeContext;

export const ThemeProvider = ({ children }: ChildrenProps) => {
  const savedTheme = localStorage.getItem('theme') ?? 'dark';
  const [theme, setTheme] = useState(savedTheme); // Initial theme
  const [checked, setChecked] = useState(false);
  // Optional: Load theme from localStorage on mount
  useEffect(() => {
    if (savedTheme) {
      setTheme(savedTheme);
      const isChecked = savedTheme == 'light' ? true : false;
      setChecked(isChecked);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme ?? 'dark');
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    setChecked((prev) => !prev);
  };

  return (
    <ThemeContext value={{ theme, toggleTheme, checked, setChecked }}>
      {children}
    </ThemeContext>
  );
};
