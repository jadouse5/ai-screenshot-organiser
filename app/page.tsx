import Link from 'next/link';
import Ripple from '@/components/ui/ripple';
import ShinyButton from '@/components/ui/shiny-button';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-200 dark:bg-gradient-to-b dark:from-black dark:to-gray-900">
      <div className="z-10 text-center">
        <h1 className="mb-4 text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 dark:text-white">
          Screenshot Organizer
        </h1>
        <p className="mb-8 text-xl text-pink-500 dark:text-pink-200">
          Organize and analyze your screenshots with ease
        </p>
        <ShinyButton>
          <Link href="/dashboard">Get Started</Link>
        </ShinyButton>
      </div>
      <Ripple className="opacity-75" />
    </div>
  );
}