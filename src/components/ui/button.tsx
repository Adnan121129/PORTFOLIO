import type { Route } from 'next';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group/button relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 select-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-bg hover:bg-accent-strong dark:hover:bg-accent dark:hover:text-on-accent shadow-[0_1px_0_rgb(255_255_255/0.08)_inset]',
  accent: 'bg-accent text-on-accent hover:bg-accent-strong dark:hover:bg-accent-strong',
  secondary:
    'border border-line-strong bg-surface/80 text-ink hover:border-ink/40 hover:bg-surface',
  ghost: 'text-ink-muted hover:text-ink hover:bg-surface-2',
  danger: 'bg-danger text-white hover:opacity-90 dark:text-black',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-12 px-6 text-base',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  magnetic?: boolean;
};

export function ButtonLink<T extends string>({
  href,
  variant,
  size,
  className,
  children,
  magnetic,
  ...rest
}: CommonProps & { href: Route<T> } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    'href' | 'className'
  >) {
  return (
    <Link
      href={href}
      className={buttonClasses(variant, size, className)}
      data-magnetic={magnetic ? '' : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** External link styled as a button; always opens in a new tab with safe rel attributes. */
export function ExternalButton({
  href,
  variant,
  size,
  className,
  children,
  magnetic,
  newTab = true,
  ...rest
}: CommonProps & { href: string; newTab?: boolean } & Omit<
    ComponentPropsWithoutRef<'a'>,
    'href' | 'className' | 'target' | 'rel'
  >) {
  return (
    <a
      href={href}
      className={buttonClasses(variant, size, className)}
      data-magnetic={magnetic ? '' : undefined}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
      {newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & Omit<ComponentPropsWithoutRef<'button'>, 'className'>) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
