import type { Project } from '../types';

export const greenfactoryBi: Project = {
  slug: 'greenfactory-bi',
  index: 5,
  title: 'GreenFactory BI',
  subtitle: 'Industrial Sustainability MIS & Business Intelligence Platform',
  tagline:
    'Turning factory energy, water and waste data into decisions. It separates production growth from real efficiency loss.',
  summary:
    'A sustainability MIS and BI platform for garment factories that ties every kWh, m³ and kg to the production that caused it, verifies each figure with a second person and splits monthly change into production and efficiency effects.',
  categories: ['mis-bi', 'full-stack'],
  tags: [
    'Python',
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
  repo: 'https://github.com/Adnan121129/GreenFactory-BI.git',
  hue: 152,
  featured: true,
  illustration: 'greenfactory',
  stats: [
    { value: '16', label: 'KPIs with definitions' },
    { value: '12', label: 'interactive charts' },
    { value: '12', label: 'exportable reports' },
    { value: '25', label: 'SQL reporting views' },
    { value: '7', label: 'roles, enforced on the server' },
    { value: '24', label: 'months of synthetic factory data' },
  ],
  notices: [
    {
      tone: 'data',
      title: 'Synthetic demo dataset',
      text: 'The platform ships with a reproducible synthetic dataset covering 24 months of a fictional factory, with planted data-quality scenarios. It is not a real factory’s data.',
    },
  ],
  sections: [
    {
      id: 'overview',
      title: 'About the project',
      blocks: [
        {
          kind: 'paragraph',
          text: 'GreenFactory BI is a full-stack management information system (MIS) and business-intelligence platform for garment factories. It was designed around the Bangladesh ready-made garment (RMG) industry: Bangladeshi taka (BDT), the July–June fiscal year, and typical factory utilities and waste streams. It can be configured for any factory.',
        },
      ],
    },
    {
      id: 'problem',
      title: 'The problem',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Factories often report environmental data as raw monthly totals. That makes a busy month look bad and a quiet month look good. Gaps in the data silently become zeros, and the savings claimed for improvement projects are rarely measured.',
        },
        {
          kind: 'paragraph',
          text: 'GreenFactory BI fixes this by connecting every kWh, cubic metre (m³) and kg to the production that caused it. Each figure is verified by a second person, and every number can be traced back to its source records.',
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
              title: 'Executive dashboard',
              icon: 'dashboard',
              points: [
                '16 KPIs with definitions and period comparisons, 12 interactive charts, global filters, and drill-down from any month to the records behind it.',
              ],
            },
            {
              title: 'Energy, fuel and solar',
              icon: 'zap',
              points: [
                'Grid, generator and rooftop solar tracking, including meter rollover and replacement handling. Fuel is converted to kWh, and submeters break consumption down by department without double counting.',
              ],
            },
            {
              title: 'Water and wastewater',
              icon: 'droplet',
              points: [
                'Withdrawal by source, with recycled water tracked separately, plus discharge and treatment.',
              ],
            },
            {
              title: 'Waste management',
              icon: 'recycle',
              points: ['Generation by category, recovery vs disposal routes, and recovery rate.'],
            },
            {
              title: 'Production and intensity analysis',
              icon: 'factory',
              points: [
                'Energy and water per 1,000 pieces. Each month’s change in consumption is split into a production effect and an efficiency effect.',
              ],
            },
            {
              title: 'GHG emissions',
              icon: 'cloud',
              points: [
                'Scope 1 and 2 estimates for every record, using versioned emission factors and keeping a record of which factor was applied.',
              ],
            },
            {
              title: 'Utility costs',
              icon: 'coins',
              points: [
                'Bills broken into tariff components, budgets vs actuals, and cost changes split into price effects and consumption effects.',
              ],
            },
            {
              title: 'Improvement initiatives',
              icon: 'lightbulb',
              points: [
                'A lifecycle from proposal to verification. Savings are measured against a production-normalised baseline, with payback calculation.',
              ],
            },
            {
              title: 'Targets and alerts',
              icon: 'target',
              points: [
                'Approved baselines and targets with status tracking. Rule-based alerts are deduplicated and lead to assigned corrective actions.',
              ],
            },
            {
              title: 'Reports and data import',
              icon: 'file',
              points: [
                '12 exportable reports (CSV, Excel, print) and validated CSV/Excel import with row-level error preview. A data-quality matrix shows missing or incomplete months.',
              ],
            },
            {
              title: 'Power BI integration',
              icon: 'database',
              points: [
                'A read-only star schema with DAX measures that reproduce the app’s numbers exactly.',
              ],
            },
            {
              title: 'Light and dark themes',
              icon: 'palette',
              points: ['Accessible design with a table view for every chart.'],
            },
          ],
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
              title: 'Data entry',
              points: [
                'Users record meter readings, production output, fuel, waste and bills through forms or bulk import.',
                'Every record is checked: one calendar month per record, valid meter readings, consistent units, and no duplicates or overlapping periods.',
              ],
            },
            {
              title: 'Verification workflow',
              points: [
                'Records start as Submitted and must be verified by a different user. Verified records are locked.',
                'Corrections create a new version, and the full history is kept in an audit log.',
              ],
            },
            {
              title: 'Analytics engine',
              points: [
                'The backend computes every KPI from verified data using strict rules:',
                'No double counting: submeters, generator output and recycled water are each counted only where they belong.',
                'Matched-month ratios: a month enters an intensity only when both consumption and production data are complete.',
                'Missing data is never zero: incomplete months are excluded and the reason is shown.',
              ],
            },
            {
              title: 'Management layer',
              points: [
                'Baselines, targets, initiatives and alerts all use the same engine. A rise in energy intensity therefore triggers an alert, which links to the exact records and to a corrective action.',
              ],
            },
            {
              title: 'BI layer',
              points: [
                'PostgreSQL views publish a star schema for Power BI through a read-only database role. Power BI reports show the same numbers as the web app.',
              ],
            },
          ],
        },
        {
          kind: 'flow',
          label: 'Verification workflow',
          nodes: ['Submitted', 'Verified by a different user', 'Locked'],
          exits: ['Correction → new version (audited)'],
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
                'Python with Django and Django REST Framework, as 10 modular apps: accounts, master data, operations, finance, emissions, analytics, management, data import/export, reporting and demo data',
                'PostgreSQL database with integrity constraints, including a database-level rule that prevents overlapping meter records',
                'Role-based access control for 7 roles, enforced on the server, with session authentication, CSRF protection and a full audit trail',
                'OpenAPI documentation generated with drf-spectacular',
              ],
            },
            {
              label: 'Frontend',
              items: [
                'React 19 with TypeScript, built with Vite',
                'Tailwind CSS for an accessible, responsive interface with light and dark themes',
                'Recharts for data visualisation, using a colour-blind-safe palette',
                'React Router for navigation and Axios for API communication',
              ],
            },
            {
              label: 'Business intelligence',
              items: [
                '25 SQL reporting views in a star schema, plus DAX measures and Power Query scripts for Power BI',
              ],
            },
            {
              label: 'Deployment and documentation',
              items: [
                'Docker Compose setup with PostgreSQL, gunicorn and nginx',
                'Documentation covering architecture, ERD, data dictionary, KPI dictionary, API, security, testing and a case study',
                'A reproducible synthetic dataset covering 24 months of a fictional factory, with planted data-quality scenarios',
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
            { value: '109', label: 'Backend tests · pytest' },
            { value: '44', label: 'Frontend component tests · Vitest & Testing Library' },
            {
              value: 'E2E',
              label: 'Browser tests · Playwright',
              detail: 'Including a full 10-step workflow (below)',
            },
          ],
        },
        {
          kind: 'flow',
          label: 'The 10-step end-to-end workflow',
          nodes: [
            'Record',
            'Verify',
            'Analyse',
            'Alert',
            'Investigate',
            'Corrective action',
            'Run an initiative',
            'Measure savings',
            'Verify',
            'Report',
          ],
        },
      ],
    },
  ],
  seoDescription:
    'GreenFactory BI: a sustainability MIS and BI platform for Bangladesh RMG factories that normalises energy, water and waste by production, verifies every record and reconciles Power BI with the app. Django, PostgreSQL, React and Power BI.',
  keywords: [
    'sustainability',
    'energy intensity',
    'RMG',
    'garment factory',
    'GHG emissions',
    'Power BI',
    'business intelligence',
    'Django',
  ],
};
