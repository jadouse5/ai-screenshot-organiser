"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-800 dark:to-black text-white p-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="ScreenShot Organizer Logo" width={50} height={50} className="mr-2" />
          <span className="text-xl font-bold">Pinata Shot</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/demo">Demo</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><a href="https://github.com/yourusername/screenshot-organizer" target="_blank" rel="noopener noreferrer">Source Code</a></li>
          </ul>
        </nav>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          {theme === 'dark' ? (
            <Sun className="h-[1.2rem] w-[1.2rem] text-pink-300" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] text-purple-300" />
          )}
        </Button>
      </div>
    </header>
  );
}