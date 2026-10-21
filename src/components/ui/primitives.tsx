import { ArrowRight, Info, TriangleAlert, Database } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Small pill used for tags, categories and keywords. */
export function Chip({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'accent' | 'outline';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[0.78rem] leading-none whitespace-nowrap',
        tone === 'neutral' && 'bg-surface-2 text-ink-muted',
        tone === 'accent' && 'bg-accent-soft text-accent',
        tone === 'outline' && 'border border-line text-ink-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ChipList({
  items,
  tone,
  label,
  className,
}: {
  items: string[];
  tone?: 'neutral' | 'accent' | 'outline';
  label?: string;
  className?: string;
}) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label={label}>
      {items.map((item) => (
        <li key={item}>
          <Chip tone={tone}>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}

/**
 * Wrapper revealed on scroll by the head script (fade + rise). It is a separate
 * element so the reveal animation never fights with hover transforms on its children.
 */
export function Reveal<T extends ElementType = 'div'>({
  as,
  children,
  className,
  delay,
  ...rest
}: {
  as?: T;
  children: ReactNode;
  className?: string;
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>) {
  const Component = (as ?? 'div') as ElementType;
  return (
    <Component
      data-reveal=""
      data-reveal-delay={delay ? String(delay) : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  action,
  id,
  as: Heading = 'h2',
  className,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: { href: Route; label: string };
  id?: string;
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-12 md:items-end', className)}>
      <div className="md:col-span-8">
        <p className="eyebrow flex items-center gap-3">
          {index ? <span className="text-accent">{index}</span> : null}
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          <span>{eyebrow}</span>
        </p>
        <Heading id={id} className="mt-5 font-serif text-headline text-ink">
          {title}
        </Heading>
        {description ? (
          <p className="mt-5 max-w-2xl text-lead text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action ? (
        <div className="md:col-span-4 md:justify-self-end">
          <Link
            href={action.href}
            className="group inline-flex items-center gap-2 text-[0.95rem] font-medium text-ink"
          >
            <span className="link-sweep">{action.label}</span>
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

const noticeStyles = {
  info: { icon: Info, ring: 'border-accent/30 bg-accent-soft', iconColor: 'text-accent' },
  caution: { icon: TriangleAlert, ring: 'border-warn/30 bg-warn-soft', iconColor: 'text-warn' },
  data: { icon: Database, ring: 'border-line-strong bg-surface-2', iconColor: 'text-ink-muted' },
} as const;

/** Prominent notice for synthetic data, demo models and scope caveats. */
export function Notice({
  tone,
  title,
  children,
  className,
}: {
  tone: keyof typeof noticeStyles;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const style = noticeStyles[tone];
  const Icon = style.icon;
  return (
    <aside
      className={cn(
        'flex gap-3.5 rounded-xl border px-4 py-3.5 sm:px-5 sm:py-4',
        style.ring,
        className,
      )}
      aria-label={title}
    >
      <Icon
        size={18}
        strokeWidth={1.75}
        aria-hidden="true"
        className={cn('mt-0.5 shrink-0', style.iconColor)}
      />
      <div className="min-w-0">
        <p className="text-[0.95rem] font-semibold text-ink">{title}</p>
        <div className="mt-1 text-[0.93rem] leading-relaxed text-ink-muted">{children}</div>
      </div>
    </aside>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: Route }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-subtle">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="link-sweep hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  className={last ? 'text-ink-muted' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <span aria-hidden="true" className="text-line-strong">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Page header shared by listing pages. */
export function PageIntro({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-70"
      />
      <div className="container-page relative grid gap-10 pt-14 pb-12 md:grid-cols-12 md:pt-20 md:pb-16">
        <div className="md:col-span-8">
          <p className="eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            {eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-display text-ink">{title}</h1>
          {children ? (
            <div className="mt-6 max-w-2xl text-lead text-ink-muted">{children}</div>
          ) : null}
        </div>
        {aside ? <div className="md:col-span-4 md:self-end">{aside}</div> : null}
      </div>
    </header>
  );
}
