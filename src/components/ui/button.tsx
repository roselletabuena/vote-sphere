import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-extrabold uppercase tracking-wider transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none rounded-none active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white border border-slate-900 shadow-xs hover:bg-slate-800 hover:border-slate-800 hover:-translate-y-[1px] hover:shadow-card dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100 dark:hover:bg-white",
        secondary:
          "bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-[10px] font-bold tracking-wider dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:border-slate-700",
        outline:
          "border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100 hover:border-slate-400 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-900 dark:hover:border-slate-700",
        ghost:
          "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        accent:
          "bg-sky-600 text-white border border-sky-600 shadow-xs hover:bg-sky-700 hover:border-sky-700 hover:-translate-y-[1px] dark:bg-sky-500 dark:text-white dark:hover:bg-sky-400",
        destructive:
          "bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 dark:bg-red-600 dark:hover:bg-red-500",
      },
      size: {
        default: "h-9 px-4 py-2 text-xs",
        sm: "h-7 px-3 text-[10px] tracking-widest",
        lg: "h-11 px-6 text-sm tracking-widest",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
