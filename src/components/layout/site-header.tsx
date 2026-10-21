import Link from 'next/link';
import { WhatsAppIcon } from '../icons/brand-icons';
import { ThemeToggle } from '../theme/theme-toggle';
import { whatsappUrl } from '@/lib/contact';
import { WHATSAPP_GREETING } from '@/content/site';
import { MobileMenu } from './mobile-menu';
import { NavLinks } from './nav-links';

export function Monogram({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative grid size-9 place-items-center overflow-hidden rounded-[10px] bg-ink font-serif text-[1.15rem] leading-none text-bg ${className}`}
    >
      <span className="translate-y-[0.5px] italic">MA</span>
      <span className="absolute right-1 bottom-1 size-1 rounded-full bg-accent-bright" />
    </span>
  );
}

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-line/80 bg-bg/80 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70"
      style={{ viewTransitionName: 'site-header' }}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link href="/" className="group flex items-center gap-3 rounded-xl pr-2">
          <Monogram className="transition-transform duration-500 group-hover:-rotate-6" />
          <span className="flex flex-col leading-tight">
            <span className="text-[0.95rem] font-semibold tracking-tight whitespace-nowrap text-ink">
              Muhammad Adnan
            </span>
            <span className="hidden font-mono text-[0.66rem] tracking-[0.12em] text-ink-subtle uppercase xs:block">
              MIS · BI · Full-stack
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={whatsappUrl(WHATSAPP_GREETING)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-bg transition-colors hover:bg-accent-strong lg:inline-flex dark:hover:bg-accent dark:hover:text-on-accent"
            data-magnetic=""
          >
            <WhatsAppIcon size={15} />
            Let’s talk
            <span className="sr-only">on WhatsApp (opens in a new tab)</span>
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
