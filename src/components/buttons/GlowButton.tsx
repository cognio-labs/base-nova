import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlowButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-[0_0_36px_rgba(255,255,255,0.16)] transition hover:scale-[1.02] active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
