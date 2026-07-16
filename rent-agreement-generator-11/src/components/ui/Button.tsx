import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variant === "primary" &&
            "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
          variant === "secondary" &&
            "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400",
          variant === "outline" &&
            "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2.5 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";