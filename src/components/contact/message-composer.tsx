'use client';

import { Mail, Send } from 'lucide-react';
import { useId, useRef, useState, type FormEvent } from 'react';
import { gmailComposeUrl, mailtoUrl, whatsappUrl } from '@/lib/contact';
import { cn } from '@/lib/utils';
import { GmailIcon, WhatsAppIcon } from '../icons/brand-icons';
import { buttonClasses } from '../ui/button';

type Channel = 'whatsapp' | 'gmail' | 'mailto';
type Errors = Partial<Record<'name' | 'message', string>>;

const topics = [
  'General enquiry',
  'Project or collaboration',
  'Role or opportunity',
  'Research',
  'Something else',
];

export function buildMessage(name: string, topic: string, message: string): string {
  return `Hello Adnan,\n\n${message.trim()}\n\n— ${name.trim()}${topic ? `\n(Topic: ${topic})` : ''}`;
}

export function validateComposer(name: string, message: string): Errors {
  const errors: Errors = {};
  if (name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  if (message.trim().length < 10)
    errors.message = 'Please write a message of at least 10 characters.';
  else if (message.length > 2000)
    errors.message = 'Please keep the message under 2,000 characters.';
  return errors;
}

/**
 * Drafts a message and hands it to WhatsApp, Gmail or the visitor's mail app. This site
 * has no server-side mail sending, so the form never claims to have sent anything — it
 * opens the chosen app with the text pre-filled and offers a direct link as a fallback.
 */
export function MessageComposer() {
  const formId = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<{ channel: Channel; url: string } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel = (submitter?.value ?? 'whatsapp') as Channel;
    const name = String(data.get('name') ?? '');
    const topic = String(data.get('topic') ?? '');
    const message = String(data.get('message') ?? '');

    const nextErrors = validateComposer(name, message);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setResult(null);
      requestAnimationFrame(() => {
        summaryRef.current?.focus();
      });
      return;
    }

    const text = buildMessage(name, topic, message);
    const subject = `${topic || 'Hello'} — from ${name.trim()}`;
    const url =
      channel === 'whatsapp'
        ? whatsappUrl(text)
        : channel === 'gmail'
          ? gmailComposeUrl({ subject, body: text })
          : mailtoUrl({ subject, body: text });

    if (channel === 'mailto') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    setResult({ channel, url });
  };

  const channelName = (channel: Channel) =>
    channel === 'whatsapp' ? 'WhatsApp' : channel === 'gmail' ? 'Gmail' : 'your mail app';

  const errorEntries = Object.entries(errors) as [keyof Errors, string][];

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-describedby={`${formId}-note`}
      className="space-y-5"
      data-testid="message-composer"
    >
      <p id={`${formId}-note`} className="text-sm leading-relaxed text-ink-muted">
        This form doesn’t send anything by itself — it opens WhatsApp, Gmail or your mail app with
        your message filled in, and you press send there.
      </p>

      {errorEntries.length ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border border-danger/40 bg-danger-soft p-4 text-sm text-ink focus:outline-none"
        >
          <p className="font-semibold">
            Please fix {errorEntries.length === 1 ? 'this' : 'these'} before continuing:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#${formId}-${field}`}
                  className="underline"
                  onClick={(event) => {
                    event.preventDefault();
                    (field === 'name' ? nameRef : messageRef).current?.focus();
                  }}
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-name`} className="text-sm font-medium text-ink">
            Your name <span className="text-ink-subtle">(required)</span>
          </label>
          <input
            ref={nameRef}
            id={`${formId}-name`}
            name="name"
            autoComplete="name"
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            className={cn(
              'mt-2 h-12 w-full rounded-xl border bg-surface px-4 text-ink outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/30',
              errors.name ? 'border-danger' : 'border-line-control',
            )}
          />
          {errors.name ? (
            <p id={`${formId}-name-error`} className="mt-1.5 text-sm text-danger">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${formId}-topic`} className="text-sm font-medium text-ink">
            Topic
          </label>
          <select
            id={`${formId}-topic`}
            name="topic"
            defaultValue={topics[0]}
            className="mt-2 h-12 w-full rounded-xl border border-line-control bg-surface px-4 text-ink outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            {topics.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className="text-sm font-medium text-ink">
          Message <span className="text-ink-subtle">(required)</span>
        </label>
        <textarea
          ref={messageRef}
          id={`${formId}-message`}
          name="message"
          rows={6}
          required
          maxLength={2000}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          className={cn(
            'mt-2 w-full rounded-xl border bg-surface px-4 py-3 leading-relaxed text-ink outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/30',
            errors.message ? 'border-danger' : 'border-line-control',
          )}
        />
        {errors.message ? (
          <p id={`${formId}-message-error`} className="mt-1.5 text-sm text-danger">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <button
          type="submit"
          name="channel"
          value="whatsapp"
          className={buttonClasses('primary', 'md')}
        >
          <WhatsAppIcon size={16} />
          Send via WhatsApp
        </button>
        <button
          type="submit"
          name="channel"
          value="gmail"
          className={buttonClasses('secondary', 'md')}
        >
          <GmailIcon size={15} />
          Send via Gmail
        </button>
        <button
          type="submit"
          name="channel"
          value="mailto"
          className={buttonClasses('ghost', 'md')}
        >
          <Mail size={16} aria-hidden="true" />
          Open in mail app
        </button>
      </div>

      <div role="status" aria-live="polite" className="min-h-6 text-sm text-ink-muted">
        {result ? (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Send size={14} aria-hidden="true" className="text-accent" />
            Opened {channelName(result.channel)} with your message — press send there to deliver it.
            <a
              href={result.url}
              target={result.channel === 'mailto' ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="link-inline"
            >
              Nothing opened? Use this link
            </a>
          </p>
        ) : null}
      </div>
    </form>
  );
}
