import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base = "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-clay-100 text-brand-800 hover:bg-clay-200",
  ghost: "border border-brand-300 text-brand-700 hover:bg-brand-50",
};

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}: {
  href?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
