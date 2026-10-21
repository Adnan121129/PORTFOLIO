import type { Project } from '../types';

export const muhibbiTeaHouse: Project = {
  slug: 'muhibbi-tea-house',
  index: 6,
  title: 'Muhibbi Tea House',
  subtitle: 'An immersive restaurant website with a real ordering engine behind it',
  tagline: 'A 3D tea house you can actually order from.',
  summary:
    'A full-stack ordering platform for a tea house — an immersive 3D storefront on the front, a real-time counter dashboard on the back.',
  categories: ['full-stack', 'interactive-3d'],
  tags: [
    'React 19',
    'TypeScript',
    'Three.js',
    'React Three Fiber',
    'GSAP',
    'Django 5',
    'Django Channels',
    'PostgreSQL 16',
    'Redis',
    'WebSockets',
  ],
  repo: 'https://github.com/Adnan121129/MUHIBBI-TEA-HOUSE.git',
  hue: 58,
  featured: false,
  illustration: 'muhibbi',
  stats: [
    { value: '11', label: 'drinks rendered as live 3D objects' },
    { value: '0', label: 'downloaded 3D model files' },
    { value: '3', label: 'WebSocket channels' },
    { value: '7', label: 'Django apps split by domain' },
  ],
  sections: [
    {
      id: 'overview',
      title: 'About the project',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Most restaurant websites are a menu photo and a phone number. I wanted to build the opposite: a site where the drink is the interface, and where ordering is a real transaction rather than a contact form.',
        },
        {
          kind: 'paragraph',
          text: 'Muhibbi Tea House is a complete ordering platform for a tea and coffee house. The customer side is a 3D storefront — every drink on the menu is a live, rotating object rendered in the browser, and scrolling the homepage builds a cup one ingredient at a time, in the order it is actually poured at the counter.',
        },
        {
          kind: 'paragraph',
          text: 'Behind that sits the part customers never see: a secure REST API, a validated order pipeline, and a staff dashboard where incoming orders appear on a live board the instant they are placed — no refresh, no polling. Staff move an order from Confirmed to Preparing to Ready, and the customer’s tracking page updates in the same second.',
        },
        {
          kind: 'paragraph',
          text: 'The entire menu is database-driven. Adding a new drink — its price, its customisation options, even its 3D ingredient animation — is done from the admin panel. No frontend code is ever touched.',
        },
      ],
    },
    {
      id: 'features',
      title: 'What you can explore',
      blocks: [
        {
          kind: 'features',
          columns: 2,
          items: [
            {
              title: 'Customer side',
              icon: 'cup',
              points: [
                '3D hero and menu (11 drinks, each a real 3D object with steam, glass and lighting)',
                'Scroll-driven ingredient storytelling',
                'Search and filter by drink or ingredient',
                'Customisation with live price updates',
                'Guest checkout for dine-in, takeaway or delivery',
                'Live order tracking',
                'Fully responsive, with a working fallback when WebGL or motion is unavailable',
              ],
            },
            {
              title: 'Staff/admin side',
              icon: 'store',
              points: [
                'Dashboard with live sales and queue metrics',
                'Kanban order board with one-tap actions',
                'Order detail with full audit history',
                'Menu, category, ingredient and option management',
                'Inventory with logged stock movements',
                'Analytics (revenue, busiest hours, best sellers, order-type split)',
                'Customer history',
                'Shop settings',
              ],
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
          kind: 'paragraph',
          text: 'Six mechanics worth naming:',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'The 3D is generated, not downloaded',
              points: [
                'No model files at all — each glass is built at runtime from a silhouette profile revolved around its axis, so a new drink adds zero asset weight.',
              ],
            },
            {
              title: 'The animation lives in the database',
              points: [
                'Each product has ordered ingredient layers storing colour, share of the glass, pour duration and caption. The recipe, the ingredient list and the 3D animation are the same data.',
              ],
            },
            {
              title: 'The browser is never trusted with money',
              points: [
                'Prices, option charges, discounts, fees and totals are recalculated server-side at checkout from the database. A tampered price is silently ignored.',
              ],
            },
            {
              title: 'Orders follow a strict state machine',
              points: [
                'Pending → Confirmed → Preparing → Ready → Completed, with Cancelled and Rejected as exits.',
                'Every transition is written to an append-only history with timestamp and staff member.',
              ],
            },
            {
              title: 'Real-time runs on WebSockets',
              points: [
                'Three channels — staff board, per-order customer tracking, staff notifications.',
                'Events fan out only after the database transaction commits, and the staff payload differs from the customer payload so internal notes never reach a customer socket.',
              ],
            },
            {
              title: 'It degrades instead of breaking',
              points: [
                'No WebGL, a weak device or a lost GPU context all fall back to a CSS/SVG drink built from the same data.',
                'A global budget caps live canvases so eleven cards can’t exhaust the browser’s WebGL limit.',
              ],
            },
          ],
        },
        {
          kind: 'flow',
          label: 'Order state machine',
          nodes: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'],
          exits: ['Cancelled', 'Rejected'],
        },
        {
          kind: 'chips',
          label: 'WebSocket channels',
          items: ['Staff board', 'Per-order customer tracking', 'Staff notifications'],
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
              label: 'Languages',
              items: ['Python', 'TypeScript', 'SQL', 'HTML', 'CSS'],
            },
            {
              label: 'Frontend',
              items: [
                'React 19 + TypeScript, Vite, Tailwind CSS',
                'Three.js with React Three Fiber and Drei',
                'Framer Motion and GSAP',
                'React Router, React Hook Form + Zod, Axios, Recharts',
              ],
            },
            {
              label: 'Backend',
              items: [
                'Django 5, Django REST Framework',
                'Django Channels with Daphne (ASGI)',
                'SimpleJWT',
                'PostgreSQL 16, Redis as the channel layer',
                'django-filter, CORS headers, Pillow, WhiteNoise',
              ],
            },
            {
              label: 'Architecture',
              items: [
                'Seven Django apps split by domain — accounts, catalog, orders, inventory, analytics, notifications and a shared core',
                'HTTP and WebSocket traffic served by one ASGI process',
                'All pricing and order logic lives in a single service layer, so there is exactly one place where money is calculated',
              ],
            },
          ],
        },
      ],
    },
  ],
  seoDescription:
    'Muhibbi Tea House: a 3D tea-house storefront with a real ordering engine — procedural Three.js drinks driven by database ingredient layers, server-side pricing, a strict order state machine and live WebSocket order boards on Django Channels.',
  keywords: [
    'Three.js',
    'React Three Fiber',
    'ordering platform',
    'WebSockets',
    'Django Channels',
    'restaurant website',
    'state machine',
  ],
};
