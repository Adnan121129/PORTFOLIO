import { ArrowUpRight } from 'lucide-react';
import { EMAIL } from '@/content/site';
import { contactChannels, mailtoUrl } from '@/lib/contact';
import { cn } from '@/lib/utils';
import { GitHubIcon, GmailIcon, LinkedInIcon, WhatsAppIcon } from '../icons/brand-icons';
import { buttonClasses } from '../ui/button';
import { CopyButton } from './copy-button';

const icons = {
  whatsapp: WhatsAppIcon,
  email: GmailIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
} as const;

/**
 * The four required contact actions: Start a Conversation (WhatsApp), Contact with Email
 * (Gmail compose, with a mailto: fallback below), Contact with LinkedIn and Visit to GitHub.
 */
export function ContactActions({
  className,
  showEmailFallback = true,
  size = 'lg',
  layout = 'row',
}: {
  className?: string;
  showEmailFallback?: boolean;
  size?: 'md' | 'lg';
  /** "grid" keeps the four actions in a tidy 2×2 block (used in the hero). */
  layout?: 'row' | 'grid';
}) {
  return (
    <div className={className}>
      <ul
        className={cn(
          'grid grid-cols-1 gap-2.5 xs:grid-cols-2',
          layout === 'grid' ? 'max-w-xl' : 'sm:flex sm:flex-wrap',
        )}
        data-testid="contact-actions"
      >
        {contactChannels.map((channel, index) => {
          const Icon = icons[channel.id];
          return (
            <li key={channel.id}>
              <a
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                data-contact={channel.id}
                data-magnetic={index === 0 ? '' : undefined}
                className={buttonClasses(
                  index === 0 ? 'primary' : 'secondary',
                  size,
                  layout === 'grid'
                    ? 'w-full justify-between'
                    : 'w-full justify-between sm:w-auto sm:justify-center',
                )}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Icon size={16} />
                  {channel.label}
                  <span className="sr-only">{channel.srDetail} (opens in a new tab)</span>
                </span>
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="opacity-60 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                />
              </a>
            </li>
          );
        })}
      </ul>
      {showEmailFallback ? (
        <p
          className={cn('mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted')}
        >
          <span>Prefer your own mail app?</span>
          <a href={mailtoUrl()} className="link-inline font-medium" data-contact="mailto">
            {EMAIL}
          </a>
          <CopyButton value={EMAIL} label="Copy address" copiedLabel="Email address copied" />
        </p>
      ) : null}
    </div>
  );
}
