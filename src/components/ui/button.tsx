import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-6 text-sm font-medium transition-all duration-500 apple-ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 before:absolute before:inset-0 before:scale-0 before:rounded-full before:bg-white/20 before:opacity-0 before:transition-all before:duration-500 before:content-[''] hover:before:scale-100 hover:before:opacity-100 [&>*]:relative",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-white shadow-[var(--shadow-soft)] hover:bg-[var(--primary-hover)]",
        ghost: "border border-[var(--border)] bg-transparent text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--surface-secondary)]",
        subtle: "bg-[var(--surface-secondary)] text-[var(--text-primary)] hover:bg-[var(--surface)]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
