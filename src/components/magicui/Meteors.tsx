"use client";

import {Meteors} from 'magic-ui';
import { cn } from "@/lib/utils";

interface MeteorsProps {
  className?: string;
}

export function Meteors({ className }: MeteorsProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <MagicUIMeteors
        number={15} // Increase meteor count
        className="absolute inset-0"
        meteorClassName="bg-blue-400 opacity-80 w-[2px] h-16 blur-sm"
      />
    </div>
  );
}
