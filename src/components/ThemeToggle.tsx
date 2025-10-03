import React from 'react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = React.useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  React.useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="text-xs opacity-60 hover:opacity-100 transition-opacity underline underline-offset-4"
    >
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  );
};

export default ThemeToggle;




