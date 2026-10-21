import type { Project } from '../types';

export const omnimanager: Project = {
  slug: 'omnimanager',
  index: 4,
  title: 'OmniManager',
  subtitle: 'Multi-tenant SaaS platform for agencies, consultants and service businesses',
  tagline: 'An all-in-one workspace for agencies: projects, time, billing and a client portal.',
  summary:
    'One connected system for agencies: a client’s project, the hours logged against it, the invoice built from those hours and the client’s online payment are all linked — with isolated workspaces, a branded client portal and a Revenue Leak Radar.',
  categories: ['full-stack'],
  tags: [
    'React 19',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Radix UI',
    'TanStack Query',
    'Django',
    'Django REST Framework',
    'PostgreSQL',
    'Stripe',
    'WeasyPrint',
    'Playwright',
  ],
  // No repository link was supplied for this project.
  repo: undefined,
  hue: 262,
  featured: false,
  illustration: 'omnimanager',
  stats: [
    { value: '~150', label: 'REST API endpoints' },
    { value: '5', label: 'roles inside each workspace' },
    { value: '75 · 90 · 100%', label: 'automatic budget alert thresholds' },
    { value: '5', label: 'end-to-end user journeys tested' },
  ],
  sections: [
    {
      id: 'overview',
      title: 'About the project',
      blocks: [
        {
          kind: 'paragraph',
          text: 'OmniManager is a multi-tenant SaaS platform for agencies, consultants and service businesses. It replaces the usual pile of separate tools (project boards, time trackers, spreadsheets, invoicing apps, e-signature services, client email threads) with one connected system. A client’s project, the hours logged against it, the invoice built from those hours and the client’s online payment are all linked.',
        },
        {
          kind: 'paragraph',
          text: 'Each company gets its own isolated workspace with role-based access for owners, admins, project managers, team members and clients. Clients log in to a branded portal where they approve work, sign contracts and pay invoices.',
        },
        {
          kind: 'flow',
          label: 'The core loop',
          nodes: ['Task', 'Time', 'Invoice', 'Online payment'],
        },
      ],
    },
    {
      id: 'features',
      title: 'What you can explore',
      blocks: [
        {
          kind: 'features',
          items: [
            {
              title: 'Projects & tasks',
              icon: 'kanban',
              points: [
                'Time-and-materials, fixed-price and monthly retainer projects',
                'Tasks and subtasks with priorities, labels, estimates, due dates and blocking dependencies',
                'List view and drag-and-drop Kanban board',
                'Milestones, deliverables and a project calendar',
                'Global search (⌘K) across projects, tasks, clients and invoices',
              ],
            },
            {
              title: 'CRM & clients',
              icon: 'contact',
              points: [
                'Lead pipeline with stages, deal values and follow-up reminders',
                'Interaction log (calls, meetings, emails, notes)',
                'Duplicate detection and one-click lead-to-client conversion',
                'Client profiles with projects, documents, balances and a full timeline',
              ],
            },
            {
              title: 'Time tracking & approvals',
              icon: 'timer',
              points: [
                'One global timer per user (start, pause, resume, switch, stop) that stays accurate across tabs and devices',
                'Manual entries in natural formats such as 1:30, 1.5h or 90m',
                'Day, week and month views plus a weekly timesheet grid',
                'Approval flow: draft → submitted → approved/rejected, with required rejection reasons and no self-approval',
              ],
            },
            {
              title: 'Budgets, expenses & project health',
              icon: 'gauge',
              points: [
                'Fee and hour budgets, with automatic alerts at 75%, 90% and 100%',
                'Expenses that track internal cost separately from the amount charged to the client, with receipts',
                'An explainable health score: every risk signal is listed with its reason',
                'Estimated profitability and margin per project',
              ],
            },
            {
              title: 'Invoicing & payments',
              icon: 'receipt',
              points: [
                'Invoices generated from approved time, approved expenses and completed milestones',
                'Each piece of work can only ever be billed once',
                'Manual invoices, discounts, tax, PDF export and email delivery',
                'Partial payments, refunds/reversals, credit notes and overdue tracking',
                'Recurring invoices (weekly to yearly)',
                'Online card payments with secure, server-verified checkout',
              ],
            },
            {
              title: 'Contracts & e-signatures',
              icon: 'signature',
              points: [
                'Proposal and contract templates with smart placeholders and pricing tables',
                'Clients sign in the portal with a drawn or typed signature and explicit consent',
                'A tamper-evident audit trail: any change to the signing history is detected',
                'Signed PDF certificates',
              ],
            },
            {
              title: 'Client portal',
              icon: 'door',
              points: [
                'Branded with the agency’s logo and colour',
                'One approvals inbox for deliverables, scope changes, signatures and payments',
                'Project progress, milestones, shared files and conversations',
                'Invoices with online payment and full payment history',
              ],
            },
            {
              title: 'Reports & Revenue Leak Radar',
              icon: 'radar',
              points: [
                'Profitability by project and client, team utilization, time trends and receivables aging, with CSV exports',
                'Revenue Leak Radar automatically flags money slipping through the cracks: approved work that was never invoiced, time stuck in approval, budget overruns and overdue invoices',
                'Each alert shows the exact records behind it and a one-click fix',
              ],
            },
            {
              title: 'Interface',
              icon: 'monitor',
              points: [
                'Clean, professional design in light and dark themes',
                'Fully responsive down to phone screens',
                'Keyboard-accessible components',
              ],
            },
          ],
        },
        {
          kind: 'flow',
          label: 'Timesheet approval',
          nodes: ['Draft', 'Submitted', 'Approved'],
          exits: ['Rejected (reason required)'],
        },
      ],
    },
    {
      id: 'how-it-works',
      title: 'How the system works',
      blocks: [
        {
          kind: 'steps',
          items: [
            {
              title: 'Workspaces & roles',
              points: [
                'A company signs up and gets a private workspace. Every record belongs to one workspace, and the server enforces isolation on every request: data from another company is simply invisible.',
                'Inside a workspace, five roles control access. Financial data (rates, budgets, margins, invoices) is visible only to those authorized to see it.',
              ],
            },
            {
              title: 'From task to time',
              points: [
                'Managers create projects and assign tasks. Team members track time with the live timer or log it manually, then submit their week for approval.',
                'The project manager approves or rejects each entry with a reason.',
              ],
            },
            {
              title: 'From time to invoice',
              points: [
                'Approved, billable time and expenses (plus completed milestones) become invoice lines in a few clicks.',
                'Every billed record is permanently linked to its invoice line, which makes double billing impossible.',
                'Sending an invoice locks it, emails the PDF and publishes it to the client portal.',
              ],
            },
            {
              title: 'From invoice to payment',
              points: [
                'The client opens the invoice in the portal and pays online through a hosted checkout.',
                'The payment provider sends a signed notification back to the server. The server verifies the signature, records the payment exactly once even if the notification arrives twice, and updates the balance.',
              ],
            },
            {
              title: 'Contracts',
              points: [
                'A manager drafts a contract from a template and sends it. That version is frozen and fingerprinted.',
                'The client reviews and signs in the portal. Every event (sent, viewed, signed) is chained to the previous one, so the history can be verified at any time.',
              ],
            },
            {
              title: 'Monitoring',
              points: [
                'Budgets, project health and the Revenue Leak Radar are calculated live from the real records. Managers see risks as they appear rather than at month’s end.',
              ],
            },
            {
              title: 'Background jobs',
              points: [
                'A scheduled job generates recurring invoices, sends reminders and expires unsigned documents.',
              ],
            },
          ],
        },
        {
          kind: 'chips',
          label: 'Roles inside a workspace',
          items: ['Owner', 'Admin', 'Project manager', 'Team member', 'Client'],
        },
      ],
    },
    {
      id: 'stack',
      title: 'How I built it',
      blocks: [
        {
          kind: 'stack',
          groups: [
            {
              label: 'Frontend',
              items: [
                'React 19 with TypeScript, built with Vite',
                'Tailwind CSS with a custom design system (accessible components built on Radix UI)',
                'TanStack Query for data fetching and caching',
                'React Router for routing',
                'React Hook Form + Zod for form validation',
                'Recharts for charts and dashboards',
              ],
            },
            {
              label: 'Backend',
              items: [
                'Python with Django and Django REST Framework: a REST API with roughly 150 endpoints',
                'PostgreSQL database, using constraints, transactions and row-level locking to protect data integrity',
                'Session authentication with CSRF protection and rate limiting',
                'WeasyPrint for PDF invoices and contracts',
                'Stripe integration plus a built-in payment sandbox for local testing',
                'Secure file uploads, file validation and an email notification system',
              ],
            },
            {
              label: 'Engineering practices',
              items: [
                'Multi-tenant architecture with server-side, role-based permissions',
                'Exact decimal arithmetic for all money, with no mixing of currencies',
                'Duplicate-safe operations for payments, invoices and timers',
                'Configuration through environment variables, with no secrets in code',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'testing',
      title: 'Testing & quality',
      blocks: [
        {
          kind: 'tests',
          items: [
            {
              value: '136',
              label: 'Backend tests · pytest',
              detail: 'Covering business rules, permissions, data isolation and payment security',
            },
            {
              value: '54',
              label: 'Frontend tests · Vitest + Testing Library',
            },
            {
              value: '5',
              label: 'End-to-end journeys · Playwright',
              detail: 'Real user journeys run in a browser (listed below)',
            },
          ],
        },
        {
          kind: 'list',
          style: 'bullet',
          items: [
            'task → time → invoice → online payment',
            'contract → client signature → verified audit trail',
            'budget → overrun alert → invoice from the Revenue Leak Radar',
            'workspace isolation',
            'client data isolation',
          ],
        },
      ],
    },
  ],
  seoDescription:
    'OmniManager: a multi-tenant SaaS for agencies linking projects, time tracking, invoicing, e-signatures and online payments, with a branded client portal and a Revenue Leak Radar. Django REST API (~150 endpoints), React 19 and PostgreSQL.',
  keywords: [
    'multi-tenant SaaS',
    'time tracking',
    'invoicing',
    'client portal',
    'e-signatures',
    'Stripe',
    'Django',
    'React',
  ],
};
