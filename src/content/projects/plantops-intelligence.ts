import type { Project } from '../types';

export const plantopsIntelligence: Project = {
  slug: 'plantops-intelligence',
  index: 1,
  title: 'PlantOps Intelligence',
  subtitle: 'Power Plant Management Information System & Business Intelligence Platform',
  tagline:
    'Turning scattered plant logbooks and spreadsheets into reliable, real-time management insight.',
  summary:
    'An end-to-end MIS and BI platform that brings a power station’s shift logs, maintenance, inventory and costs into one validated database — then turns them into KPIs, alerts, reports and a Power BI-ready star schema.',
  categories: ['mis-bi', 'full-stack'],
  tags: [
    'Python',
    'Django',
    'Django REST Framework',
    'PostgreSQL',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Recharts',
    'Power BI',
    'Docker',
    'Playwright',
  ],
  repo: 'https://github.com/Adnan121129/PlantOps-Intelligence.git',
  hue: 72,
  featured: true,
  illustration: 'plantops',
  stats: [
    { value: '9', label: 'integrated business modules' },
    { value: '6', label: 'user roles, enforced on the server' },
    { value: '10', label: 'automated alert rules' },
    { value: '14', label: 'exportable management reports' },
    { value: '15/15', label: 'DAX measures reconciled with the app' },
    { value: '120', label: 'days of synthetic plant history' },
  ],
  notices: [
    {
      tone: 'data',
      title: 'Synthetic demo dataset',
      text: 'The project runs on a realistic synthetic dataset of a fictional combined-cycle power station, with 120 days of operations, maintenance, inventory and cost history. It is not live plant data.',
    },
  ],
  sections: [
    {
      id: 'problem',
      title: 'The problem',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Power plants produce huge amounts of operational data, but it is usually spread across paper shift logbooks, Excel sheets, separate maintenance tools and store stock cards. Managers can’t confidently answer simple questions like:',
        },
        {
          kind: 'questions',
          items: [
            'How efficiently is the plant running this month?',
            'Which equipment causes the most downtime, and why?',
            'Which preventive maintenance tasks are overdue?',
            'Which critical spare parts are about to run out?',
            'Are we spending within budget?',
          ],
        },
      ],
    },
    {
      id: 'solution',
      title: 'The solution',
      blocks: [
        {
          kind: 'paragraph',
          text: 'PlantOps Intelligence solves this by bringing every plant activity into one validated database. Each record is captured once, checked against business rules, approved by the right person, and then turned into KPIs, trends, alerts and reports. It also provides a Power BI-ready data model for deeper analysis.',
        },
        {
          kind: 'diagram',
          diagram: 'plantops-data-flow',
          caption:
            'Simplified data flow, drawn from the documented architecture: records are captured once, validated and approved, stored in a single source of truth, and served to the dashboard, alerts, reports and Power BI through one KPI dictionary.',
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
              title: 'Executive Dashboard',
              icon: 'dashboard',
              points: [
                'Live KPI cards: generation, availability, capacity factor, heat rate, downtime, maintenance cost and budget usage',
                'Trend charts, top downtime causes and open alerts at a glance',
                'Filter by period and unit, then click a chart to drill into the underlying records',
                'Every chart can switch to a table view for accessibility',
              ],
            },
            {
              title: 'Daily Operations & Shift Reporting',
              icon: 'clipboard',
              points: [
                'Shift reports with generation, fuel use, running hours and incidents',
                'Approval workflow: Draft → Submitted → Approved / Returned for correction',
                'Automatic detection of missing shift reports',
              ],
            },
            {
              title: 'Equipment Register',
              icon: 'cog',
              points: [
                'Full asset hierarchy (plant → unit → system → equipment) with criticality ratings',
                'Each asset’s history of work orders, downtime and costs',
              ],
            },
            {
              title: 'Maintenance Management',
              icon: 'wrench',
              points: [
                'Work order lifecycle: Reported → Assigned → In Progress → Completed → Closed',
                'Preventive maintenance schedules with an auto-generated PM calendar',
                'Downtime tracking with MTTR (mean time to repair) and MTBF (mean time between failures) analytics',
              ],
            },
            {
              title: 'Inventory & Procurement',
              icon: 'package',
              points: [
                'Stock ledger with weighted-average costing that never lets stock go negative',
                'Reorder-level warnings for critical spares',
                'Purchase requests → purchase orders → goods receipt',
              ],
            },
            {
              title: 'Workforce & Shifts',
              icon: 'users',
              points: ['Shift roster, attendance and overtime approval'],
            },
            {
              title: 'Costs & Budgets',
              icon: 'wallet',
              points: [
                'Operational expenses by category, unit and department',
                'Budget vs. actual tracking and variance analysis',
              ],
            },
            {
              title: 'Smart Alerts',
              icon: 'bell',
              points: [
                'A rule engine with 10 business rules, such as overdue PM, low critical stock, budget overrun, repeated failures, missing reports and unusual expenses',
                'Duplicate alerts are suppressed automatically, and alerts close themselves once the problem is fixed',
              ],
            },
            {
              title: 'Report Center',
              icon: 'file',
              points: ['14 management reports exportable to Excel and CSV'],
            },
            {
              title: 'Insights',
              icon: 'lightbulb',
              points: ['Rule-based insights that highlight trends and anomalies in plain language'],
            },
            {
              title: 'User Experience',
              icon: 'palette',
              points: [
                'Light and dark themes',
                'Colour-blind-safe chart palette',
                'Responsive layout',
              ],
            },
          ],
        },
        {
          kind: 'flow',
          label: 'Shift report approval',
          nodes: ['Draft', 'Submitted', 'Approved'],
          exits: ['Returned for correction'],
        },
        {
          kind: 'flow',
          label: 'Work order lifecycle',
          nodes: ['Reported', 'Assigned', 'In Progress', 'Completed', 'Closed'],
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
              title: 'Role-based access',
              points: [
                'There are six user roles, each seeing and doing only what their job requires.',
                'Permissions are enforced on the server, not just hidden in the UI.',
              ],
            },
            {
              title: 'Data capture with validation',
              points: [
                'Users record shift reports, work orders, downtime events, stock movements and expenses. Every entry is validated against business rules, for example:',
                'Downtime can’t overlap for the same equipment.',
                'Stock can’t be issued beyond what’s available.',
                'Timestamps must follow a logical order.',
              ],
            },
            {
              title: 'Approval workflows',
              points: [
                'Shift reports and overtime go through review and approval.',
                'Every action is recorded in an audit log showing who did what, and when.',
              ],
            },
            {
              title: 'Single source of truth',
              points: [
                'Downtime figures come only from recorded downtime events.',
                'Costs come from one expense ledger, and spare parts are costed automatically when issued.',
                'This means every number on every screen agrees with every other.',
              ],
            },
            {
              title: 'KPI engine',
              points: [
                'All KPIs are defined once in a central KPI dictionary, with a formula, unit and description for each.',
                'The dashboard, the reports and the BI layer all use the same definitions.',
              ],
            },
            {
              title: 'Automatic monitoring',
              points: [
                'The alert engine regularly checks the data against its rules and raises, updates or resolves alerts without manual effort.',
              ],
            },
            {
              title: 'Business intelligence layer',
              points: [
                'SQL views arrange the data into a star schema: fact tables for generation, downtime, maintenance, inventory and costs, and dimension tables for date, asset, unit and department.',
                'Power BI connects to these views through a read-only database user.',
                'A reconciliation check proves that the DAX measures produce exactly the same figures as the application: 15 of 15 measures match.',
              ],
            },
          ],
        },
        {
          kind: 'chips',
          label: 'The six user roles',
          items: [
            'Admin',
            'Operations Officer',
            'Maintenance Engineer',
            'Store/Procurement Officer',
            'Shift Supervisor',
            'Management',
          ],
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
              label: 'Backend',
              items: [
                'Python with Django and Django REST Framework, used to build a secure REST API',
                'A service layer for business logic, with database transactions and row locking so concurrent users can’t corrupt data, such as two people issuing the same stock at once',
                'Session authentication with CSRF protection, plus token authentication for BI access',
                'Login rate-limiting, audit logging and settings loaded from environment variables, so no credentials are stored in the code',
              ],
            },
            {
              label: 'Database',
              items: [
                'PostgreSQL with a fully normalized schema',
                'Database-level constraints, including unique keys, check constraints and an exclusion constraint that prevents overlapping downtime',
                'A dedicated bi schema of SQL views for reporting',
              ],
            },
            {
              label: 'Frontend',
              items: [
                'React with TypeScript, built with Vite',
                'Tailwind CSS for styling, with design tokens for the light and dark themes',
                'Recharts for interactive data visualization',
                'React Router for navigation, with filters stored in the URL so views can be shared and drilled into',
                'Axios for API communication',
              ],
            },
            {
              label: 'Business Intelligence',
              items: [
                'Power BI data model: a star schema, DAX measures, and setup and refresh documentation',
                'SQL views designed as fact and dimension tables',
              ],
            },
            {
              label: 'DevOps & Tooling',
              items: [
                'Docker and Docker Compose setup (PostgreSQL, Gunicorn API server, Nginx web server)',
                'Git and GitHub for version control',
                'A reproducible demo-data generator that builds 120 days of realistic plant history',
              ],
            },
            {
              label: 'Documentation',
              items: [
                'Architecture overview',
                'Entity-relationship diagram (ERD)',
                'API reference',
                'Data quality rules',
                'Security guide',
                'KPI dictionary and permission matrix',
                'Power BI connection guide',
                'Case study',
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
              value: '76',
              label: 'Backend tests · Pytest',
              detail: 'Covering business rules, permissions, workflows and concurrency',
            },
            {
              value: '20',
              label: 'Frontend tests · Vitest & React Testing Library',
            },
            {
              value: 'E2E',
              label: 'Browser tests · Playwright',
              detail:
                'End-to-end tests of real user workflows, such as a full maintenance work-order cycle and role-based approvals',
            },
            {
              value: 'Lint',
              label: 'Static checks',
              detail: 'Ruff for Python linting and the TypeScript compiler for type checking',
            },
          ],
          note: 'The project’s key highlights cite 100 automated tests across backend, frontend and end-to-end. The itemised breakdown lists 76 backend and 20 frontend tests; the Playwright end-to-end tests are not counted individually in the source.',
        },
      ],
    },
    {
      id: 'highlights',
      title: 'Key highlights',
      blocks: [
        {
          kind: 'list',
          style: 'check',
          items: [
            '9 integrated business modules in one platform',
            '6 user roles with permissions enforced on the server',
            '10 automated alert rules and 14 exportable reports',
            'A Power BI star schema whose measures match the app’s figures exactly',
            '100 automated tests across backend, frontend and end-to-end',
            'Secure by design: audit trails, validation and no stored credentials',
          ],
        },
      ],
    },
  ],
  seoDescription:
    'PlantOps Intelligence: a power plant MIS and BI platform with shift reporting, maintenance, inventory, budgets, 10 alert rules, 14 reports and a Power BI star schema reconciled 15/15 with the app. Built with Django, PostgreSQL and React.',
  keywords: [
    'management information system',
    'business intelligence',
    'power plant',
    'Power BI',
    'DAX',
    'Django',
    'PostgreSQL',
    'KPI dictionary',
  ],
};
