"use client";

import React from "react";
import { motion, type AnimationProps } from "framer-motion";

import { cn } from "@/lib/utils";

const animationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps;

interface ShinyButtonProps {
  children: React.ReactNode;
  className?: string;
}

const ShinyButton = ({ children, className, ...props }: ShinyButtonProps) => {
  return (
    <motion.button
      {...animationProps}
      {...props}
      className={cn(
        "relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-700 dark:to-purple-900 dark:hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]",
        className,
      )}
    >
      <span
        className="relative block size-full text-sm uppercase tracking-wide text-white dark:text-[rgb(255,255,255,90%)]"
        style={{
          maskImage:
            "linear-gradient(-75deg, rgba(255,255,255,0.8) calc(var(--x) + 20%), transparent calc(var(--x) + 30%), rgba(255,255,255,0.8) calc(var(--x) + 100%))",
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
          maskComposite: "exclude",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,rgba(255,255,255,0.1)_calc(var(--x)+20%),rgba(255,255,255,0.3)_calc(var(--x)+25%),rgba(255,255,255,0.1)_calc(var(--x)+100%))] p-px"
      ></span>
    </motion.button>
  );
};

export default ShinyButton;
