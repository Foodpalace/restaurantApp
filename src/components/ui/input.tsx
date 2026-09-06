import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-sm border border-border bg-elevated px-3 text-sm text-fg placeholder:text-subtle",
        "focus-visible:outline-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
