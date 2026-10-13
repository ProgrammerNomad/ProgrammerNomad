import { cn } from "@/lib/utils";

export const fieldControlClass =
  "mt-2 w-full rounded-lg border border-paper/15 bg-elevated/60 backdrop-blur-md px-4 py-3 text-paper transition-all duration-300 placeholder:text-paper/40 focus:border-lime/60 focus:bg-elevated/80 focus:shadow-[0_0_20px_rgba(181,255,67,0.18)] focus:outline-none";

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono text-xs uppercase tracking-widest text-paper/60"
    >
      {children}
    </label>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldControlClass, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldControlClass, className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldControlClass, className)} {...props}>
      {children}
    </select>
  );
}
