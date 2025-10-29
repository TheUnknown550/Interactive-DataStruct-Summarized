import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ? stored === 'dark' : prefersDark;
    setDark(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement.classList;
    dark ? root.add('dark') : root.remove('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      className="ml-2 rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle theme"
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}

