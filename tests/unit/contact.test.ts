import { describe, expect, it } from 'vitest';
import {
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  WHATSAPP_DIGITS,
  WHATSAPP_GREETING,
  site,
} from '@/content/site';
import {
  contactChannels,
  gmailComposeUrl,
  mailtoUrl,
  repoWebUrl,
  whatsappUrl,
} from '@/lib/contact';

describe('contact destinations (exact values from the brief)', () => {
  it('uses the supplied identity values', () => {
    expect(WHATSAPP_DIGITS).toBe('8801851633134');
    expect(EMAIL).toBe('mdadnan899@gmail.com');
    expect(LINKEDIN_URL).toBe('https://www.linkedin.com/in/muhammad-adnan-55778b242/');
    expect(GITHUB_URL).toBe('https://github.com/Adnan121129');
  });

  it('builds the WhatsApp link with digits only and an optional URL-encoded message', () => {
    expect(whatsappUrl()).toBe('https://wa.me/8801851633134');
    expect(whatsappUrl('   ')).toBe('https://wa.me/8801851633134');
    expect(whatsappUrl('Hi & hello?')).toBe('https://wa.me/8801851633134?text=Hi%20%26%20hello%3F');
    expect(whatsappUrl(WHATSAPP_GREETING)).toBe(
      'https://wa.me/8801851633134?text=Hello%20Adnan%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20start%20a%20conversation.',
    );
  });

  it('builds the exact Gmail compose URL', () => {
    expect(gmailComposeUrl()).toBe(
      'https://mail.google.com/mail/?view=cm&fs=1&to=mdadnan899%40gmail.com',
    );
    const withMessage = new URL(gmailComposeUrl({ subject: 'Hello', body: 'Line 1\nLine 2' }));
    expect(withMessage.origin + withMessage.pathname).toBe('https://mail.google.com/mail/');
    expect(withMessage.searchParams.get('to')).toBe(EMAIL);
    expect(withMessage.searchParams.get('su')).toBe('Hello');
    expect(withMessage.searchParams.get('body')).toBe('Line 1\nLine 2');
  });

  it('builds a mailto fallback', () => {
    expect(mailtoUrl()).toBe('mailto:mdadnan899@gmail.com');
    expect(mailtoUrl({ subject: 'A & B' })).toBe('mailto:mdadnan899@gmail.com?subject=A%20%26%20B');
  });

  it('exposes the four hero actions with their required labels', () => {
    expect(contactChannels.map((channel) => channel.label)).toEqual([
      'Start a Conversation',
      'Contact with Email',
      'Contact with LinkedIn',
      'Visit to GitHub',
    ]);
    const hrefs = Object.fromEntries(contactChannels.map((channel) => [channel.id, channel.href]));
    expect(hrefs.whatsapp.startsWith('https://wa.me/8801851633134')).toBe(true);
    expect(hrefs.email).toBe(
      'https://mail.google.com/mail/?view=cm&fs=1&to=mdadnan899%40gmail.com',
    );
    expect(hrefs.linkedin).toBe(LINKEDIN_URL);
    expect(hrefs.github).toBe(GITHUB_URL);
    for (const channel of contactChannels) expect(channel.href).not.toMatch(/^#|^$/);
  });

  it('turns clone URLs into browsable repository URLs', () => {
    expect(repoWebUrl('https://github.com/Adnan121129/LinguaSI.git')).toBe(
      'https://github.com/Adnan121129/LinguaSI',
    );
  });
});

describe('identity copy', () => {
  it('keeps the about-me paragraph exactly as supplied', () => {
    expect(site.about).toBe(
      'Data-driven CSE graduate focused on Management Information Systems (MIS) and Business Intelligence (BI), backed by backend-focused full-stack development skills. I turn data into actionable insights and build systems that support better business decisions. Experienced in collaborative software, SI/ML, and project management work, and equally comfortable with administrative and operational tasks.',
    );
  });
});
