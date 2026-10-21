import { ArrowUpRight } from 'lucide-react';
import { CopyButton } from '@/components/contact/copy-button';
import { MessageComposer } from '@/components/contact/message-composer';
import { GitHubIcon, GmailIcon, LinkedInIcon, WhatsAppIcon } from '@/components/icons/brand-icons';
import { buttonClasses } from '@/components/ui/button';
import { JsonLd } from '@/components/ui/json-ld';
import { PageIntro } from '@/components/ui/primitives';
import {
  EMAIL,
  GITHUB_HANDLE,
  GITHUB_URL,
  LINKEDIN_URL,
  WHATSAPP_GREETING,
  WHATSAPP_NUMBER_DISPLAY,
  WHATSAPP_NUMBER_E164,
} from '@/content/site';
import { gmailComposeUrl, mailtoUrl, whatsappUrl } from '@/lib/contact';
import { breadcrumbJsonLd, pageMetadata, personJsonLd } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Contact Muhammad Adnan on WhatsApp (+880 1851 633134), by email (mdadnan899@gmail.com), on LinkedIn or on GitHub (Adnan121129).',
  path: '/contact',
});

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          personJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />
      <PageIntro
        eyebrow="Contact"
        title={
          <>
            Let’s start a <em className="text-accent">conversation</em>.
          </>
        }
      >
        <p>
          Whether it’s about data, BI, a backend system or a research question, the channels below
          go straight to me.
        </p>
      </PageIntro>

      <section aria-label="Contact channels" className="container-page py-12 md:py-16">
        <ul className="grid gap-4 md:grid-cols-2">
          <li className="surface-card flex flex-col p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                <WhatsAppIcon size={20} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink">WhatsApp</h2>
                <p className="font-mono text-sm text-ink-muted">
                  <a href={`tel:${WHATSAPP_NUMBER_E164}`} className="hover:text-ink">
                    {WHATSAPP_NUMBER_DISPLAY}
                  </a>
                </p>
              </div>
            </div>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
              Opens WhatsApp on your phone, or WhatsApp Web on a computer, with a short greeting
              ready to edit.
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
              <a
                href={whatsappUrl(WHATSAPP_GREETING)}
                {...external}
                className={buttonClasses('primary', 'md')}
                data-contact="whatsapp"
              >
                <WhatsAppIcon size={16} />
                Start a Conversation
                <ArrowUpRight size={15} aria-hidden="true" className="opacity-60" />
                <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
              </a>
              <CopyButton
                value={WHATSAPP_NUMBER_E164}
                label="Copy number"
                copiedLabel="Number copied"
              />
            </div>
          </li>

          <li className="surface-card flex flex-col p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                <GmailIcon size={19} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink">Email</h2>
                <p className="font-mono text-sm text-ink-muted">{EMAIL}</p>
              </div>
            </div>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
              Use Gmail in the browser, or open your own mail app instead.
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-6">
              <a
                href={gmailComposeUrl()}
                {...external}
                className={buttonClasses('primary', 'md')}
                data-contact="email"
              >
                <GmailIcon size={15} />
                Contact with Email
                <ArrowUpRight size={15} aria-hidden="true" className="opacity-60" />
                <span className="sr-only"> (opens Gmail in a new tab)</span>
              </a>
              <a
                href={mailtoUrl()}
                className="link-inline text-sm font-medium"
                data-contact="mailto"
              >
                Open in mail app
              </a>
              <CopyButton value={EMAIL} label="Copy address" copiedLabel="Email address copied" />
            </div>
          </li>

          <li className="surface-card flex flex-col p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                <LinkedInIcon size={19} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink">LinkedIn</h2>
                <p className="font-mono text-sm [overflow-wrap:anywhere] text-ink-muted">
                  linkedin.com/in/
                  <wbr />
                  muhammad-adnan-55778b242
                </p>
              </div>
            </div>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
              Professional background, updates and messages.
            </p>
            <div className="mt-auto pt-6">
              <a
                href={LINKEDIN_URL}
                {...external}
                className={buttonClasses('secondary', 'md')}
                data-contact="linkedin"
              >
                <LinkedInIcon size={15} />
                Contact with LinkedIn
                <ArrowUpRight size={15} aria-hidden="true" className="opacity-60" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </li>

          <li className="surface-card flex flex-col p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                <GitHubIcon size={19} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink">GitHub</h2>
                <p className="font-mono text-sm text-ink-muted">github.com/{GITHUB_HANDLE}</p>
              </div>
            </div>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
              Source code for the case studies on this site.
            </p>
            <div className="mt-auto pt-6">
              <a
                href={GITHUB_URL}
                {...external}
                className={buttonClasses('secondary', 'md')}
                data-contact="github"
              >
                <GitHubIcon size={15} />
                Visit to GitHub
                <ArrowUpRight size={15} aria-hidden="true" className="opacity-60" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </li>
        </ul>
      </section>

      <section aria-labelledby="composer-title" className="border-t border-line bg-bg-elevated">
        <div className="container-page grid gap-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Draft a message</p>
            <h2 id="composer-title" className="mt-4 font-serif text-headline text-ink">
              Write it here, send it there.
            </h2>
            <p className="mt-4 text-ink-muted">
              Compose your note, then choose WhatsApp, Gmail or your mail app. Nothing is stored on
              this site.
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="surface-card p-6 sm:p-8">
              <MessageComposer />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
