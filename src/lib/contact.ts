import {
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  WHATSAPP_DIGITS,
  WHATSAPP_GREETING,
} from '@/content/site';

/** wa.me link with digits only; the optional message is URL-encoded. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_DIGITS}`;
  const text = message?.trim();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Gmail web compose window addressed to Adnan, with optional subject/body. */
export function gmailComposeUrl(options: { subject?: string; body?: string } = {}): string {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: EMAIL });
  if (options.subject?.trim()) params.set('su', options.subject.trim());
  if (options.body?.trim()) params.set('body', options.body.trim());
  // URLSearchParams encodes spaces as "+", which Gmail accepts; "@" becomes %40.
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/** Plain mailto: link that opens the visitor's default mail app. */
export function mailtoUrl(options: { subject?: string; body?: string } = {}): string {
  const query: string[] = [];
  if (options.subject?.trim()) query.push(`subject=${encodeURIComponent(options.subject.trim())}`);
  if (options.body?.trim()) query.push(`body=${encodeURIComponent(options.body.trim())}`);
  return `mailto:${EMAIL}${query.length ? `?${query.join('&')}` : ''}`;
}

export type ContactChannel = {
  id: 'whatsapp' | 'email' | 'linkedin' | 'github';
  /** Visible button label required by the brief. */
  label: string;
  href: string;
  /**
   * Read by screen readers straight after the visible label, so the accessible name
   * always begins with the visible text (WCAG 2.5.3 Label in Name).
   */
  srDetail: string;
  detail: string;
  external: boolean;
};

export const contactChannels: ContactChannel[] = [
  {
    id: 'whatsapp',
    label: 'Start a Conversation',
    href: whatsappUrl(WHATSAPP_GREETING),
    srDetail: ' with Muhammad Adnan on WhatsApp',
    detail: 'WhatsApp',
    external: true,
  },
  {
    id: 'email',
    label: 'Contact with Email',
    href: gmailComposeUrl(),
    srDetail: `: write to ${EMAIL} in Gmail`,
    detail: EMAIL,
    external: true,
  },
  {
    id: 'linkedin',
    label: 'Contact with LinkedIn',
    href: LINKEDIN_URL,
    srDetail: ': Muhammad Adnan’s profile',
    detail: 'LinkedIn profile',
    external: true,
  },
  {
    id: 'github',
    label: 'Visit to GitHub',
    href: GITHUB_URL,
    srDetail: ': Adnan121129',
    detail: 'github.com/Adnan121129',
    external: true,
  },
];

/** Convert a supplied `.git` clone URL into the repository's web address. */
export function repoWebUrl(repo: string): string {
  return repo.replace(/\.git$/, '');
}
