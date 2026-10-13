import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-mono text-xs uppercase tracking-widest transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-lime text-canvas font-semibold hover:bg-lime/90 hover:shadow-[0_0_25px_rgba(181,255,67,0.35)] hover:-translate-y-0.5 active:translate-y-0",
        ghost: "text-paper hover:text-lime hover:bg-white/5",
        outline:
          "border border-paper/20 bg-elevated/40 backdrop-blur-sm text-paper hover:border-lime/60 hover:text-lime hover:shadow-[0_0_20px_rgba(181,255,67,0.15)] hover:-translate-y-0.5 active:translate-y-0",
        accent:
          "border border-lime/50 bg-lime/10 text-lime font-semibold hover:bg-lime/20 hover:border-lime hover:shadow-[0_0_25px_rgba(181,255,67,0.22)] hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3.5",
        lg: "h-11 px-7 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>;

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
