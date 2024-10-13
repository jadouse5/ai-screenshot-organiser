import Link from 'next/link';
import Ripple from '@/components/ui/ripple';
import ShinyButton from '@/components/ui/shiny-button';
import { cn } from "@/lib/utils";
import DotPattern from "@/components/ui/dot-pattern";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-200 dark:bg-gradient-to-b dark:from-black dark:to-gray-900">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-50">
        <Image
          src="/logo.png"
          alt="ScreenShot Organizer Logo"
          width={1000}
          height={1000}
          className="object-contain"
        />
      </div>
      <div className="z-10 text-center">
        <h1 className="mb-4 text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 dark:text-white">
          Pinata Shot
        </h1>
        <p className="mb-8 text-xl text-pink-500 dark:text-pink-200">
          Organize and analyze your screenshots with ease
        </p>
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          )}
        />
        <Link href="/demo">
          <ShinyButton>
            Get Started
          </ShinyButton>
        </Link>
        <Ripple className="opacity-75" />
      </div>
    </div>
  );
}