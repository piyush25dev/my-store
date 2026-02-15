import { cn } from "@/lib/utils";

export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-stone-900 text-stone-50",
    secondary: "bg-stone-100 text-stone-800",
    destructive: "bg-red-100 text-red-700",
    outline: "border border-stone-300 text-stone-700",
    success: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)}>
      {children}
    </span>
  );
}

export function Button({ children, variant = "default", size = "default", className, onClick, disabled }) {
  const variants = {
    default: "bg-stone-900 text-white hover:bg-stone-700 active:scale-95",
    outline: "border border-stone-300 text-stone-800 hover:bg-stone-50 active:scale-95",
    ghost: "text-stone-700 hover:bg-stone-100 active:scale-95",
    destructive: "bg-red-600 text-white hover:bg-red-500 active:scale-95",
  };
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    icon: "h-9 w-9",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 disabled:opacity-50 disabled:pointer-events-none select-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition",
        className
      )}
      {...props}
    />
  );
}

export function Card({ children, className }) {
  return (
    <div className={cn("rounded-xl border border-stone-200 bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}

export function Select({ value, onChange, options, className }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 transition",
        className
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Separator({ className }) {
  return <div className={cn("h-px bg-stone-200 w-full", className)} />;
}