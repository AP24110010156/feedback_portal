"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export default function AnimatedButton({
  children,
  className,
  variant = "primary",
  ...props
}: AnimatedButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-dark)]";
  
  const variants = {
    primary: "text-white bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/30",
    secondary: "text-violet-100 bg-[#231932] hover:bg-[#2e1f40] border border-violet-500/20",
    danger: "text-white bg-rose-600 hover:bg-rose-700",
    ghost: "text-violet-300 hover:text-white hover:bg-violet-500/10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children as React.ReactNode}</span>
    </motion.button>
  );
}
