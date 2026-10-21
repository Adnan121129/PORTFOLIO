/**
 * Identity, copy and contact destinations.
 *
 * The about-me paragraph and every contact destination are copied exactly from the
 * supplied brief. Change them here and every page, metadata block and test picks
 * them up.
 */

export const WHATSAPP_NUMBER_DISPLAY = '+880 1851 633134';
export const WHATSAPP_NUMBER_E164 = '+8801851633134';
/** Digits only, as required by wa.me links. */
export const WHATSAPP_DIGITS = '8801851633134';
export const EMAIL = 'mdadnan899@gmail.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/muhammad-adnan-55778b242/';
export const GITHUB_URL = 'https://github.com/Adnan121129';
export const GITHUB_HANDLE = 'Adnan121129';

export const WHATSAPP_GREETING =
  'Hello Adnan, I visited your portfolio and would like to start a conversation.';

export const site = {
  name: 'Muhammad Adnan',
  firstName: 'Muhammad',
  lastName: 'Adnan',
  /** Used for <title> on the home page and as the default social title. */
  title: 'Muhammad Adnan — MIS, Business Intelligence & Full-Stack Engineering',
  description:
    'Portfolio of Muhammad Adnan, a data-driven CSE graduate focused on Management Information Systems (MIS), Business Intelligence (BI), data analysis, applied AI/ML and backend-focused full-stack development.',
  label: 'CSE · MIS & Business Intelligence · Full-Stack Engineering',
  headline: 'I turn data into decisions—and build the systems behind them.',
  intro:
    'I work where management information systems, business intelligence and software engineering meet: capturing operational records once, validating them, modelling them into consistent KPIs, and building the backends, dashboards and applied AI/ML tools that help people decide what happens next.',
  /** Exact about-me copy from the brief. */
  about:
    'Data-driven CSE graduate focused on Management Information Systems (MIS) and Business Intelligence (BI), backed by backend-focused full-stack development skills. I turn data into actionable insights and build systems that support better business decisions. Experienced in collaborative software, SI/ML, and project management work, and equally comfortable with administrative and operational tasks.',
  locale: 'en_US',
} as const;

export type NavItem = {
  href: '/projects' | '/research' | '/writing' | '/about' | '/contact';
  label: string;
};

export const mainNav: NavItem[] = [
  { href: '/projects', label: 'Projects' },
  { href: '/research', label: 'Research' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
