"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-yellow-400 dark:bg-gray-800 text-black dark:text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">ScreenShot Organizer</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/what">What</Link></li>
            <li><Link href="/why">Why</Link></li>
            <li><Link href="/demo">Demo</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><a href="https://github.com/yourusername/screenshot-organizer" target="_blank" rel="noopener noreferrer">Source Code</a></li>
          </ul>
        </nav>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </div>
    </header>
  );
}