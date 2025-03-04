"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ShineBorderProps {
  children: ReactNode;
  className?: string;
}

export function ShineBorder({ children, className }: ShineBorderProps) {
  return (
    <div className={cn("relative group overflow-hidden rounded-2xl", className)}>
      {/* Pulsing Glow Effect */}
      <motion.div
        initial={{ opacity: 0.5, scale: 1 }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-30 blur-xl"
      />
      
      {/* Subtle Border Animation */}
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full rounded-2xl border border-transparent group-hover:border-purple-500 transition-all"
      />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}
