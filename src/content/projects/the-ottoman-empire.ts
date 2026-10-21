import type { Project } from '../types';

export const theOttomanEmpire: Project = {
  slug: 'the-ottoman-empire',
  index: 7,
  title: 'The Ottoman Empire · 1299–1922',
  subtitle: 'An interactive digital history website',
  tagline: 'Rise. Expansion. Glory. Transformation. Decline. Legacy.',
  summary:
    'A cinematic, interactive 3D web experience covering six centuries of Ottoman history, built on cited sources.',
  categories: ['interactive-3d'],
  tags: ['Next.js', 'React', 'TypeScript', 'Three.js', 'Tailwind CSS', 'GSAP', 'D3', 'WebGL'],
  repo: 'https://github.com/Adnan121129/The-Ottoman-Empire.git',
  hue: 18,
  featured: false,
  illustration: 'ottoman',
  stats: [
    { value: '36', label: 'sultans' },
    { value: '40', label: 'key figures' },
    { value: '41', label: 'battles' },
    { value: '124', label: 'dated events' },
    { value: '60', label: 'places' },
    { value: '156', label: 'sources' },
  ],
  sections: [
    {
      id: 'overview',
      title: 'About',
      blocks: [
        {
          kind: 'paragraph',
          text: 'The Ottoman Empire 1299–1922 is an interactive digital history website. It follows the empire from Osman I’s small frontier principality to the abolition of the Sultanate on 1 November 1922. The end of the Caliphate in 1924 is a separate, final chapter. The aim is to feel like a documentary while staying as accurate as a reference work.',
        },
        { kind: 'paragraph', text: 'The site handles history carefully:' },
        {
          kind: 'list',
          style: 'check',
          items: [
            'Every section lists its sources: 156 books, primary sources and documents in total.',
            'Each statement is labelled as a confirmed fact, tradition or legend, interpretation or scholarly debate.',
            'No quotes or dates are invented.',
            'The empire is shown as neither purely heroic nor purely villainous.',
            'Reconstructions such as portraits, 3D scenes and battle diagrams are clearly marked as artistic or schematic.',
          ],
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
              title: '3D hero',
              icon: 'globe',
              points: [
                'A real-time skyline of Constantinople at dusk, with animated water, clouds and boats and cursor parallax.',
              ],
            },
            {
              title: 'Timeline',
              icon: 'clock',
              points: [
                'Six centuries grouped by era, horizontal on desktop and vertical on mobile, with a detail panel for each milestone.',
              ],
            },
            {
              title: 'Interactive map',
              icon: 'map',
              points: [
                '13 snapshot years from 1300 to 1922.',
                'Shows direct rule, vassals, contested areas and successor states.',
                'Supports zoom and pan, and can play through time.',
                'Has layers for cities, battles, rivers and trade routes.',
              ],
            },
            {
              title: 'Ottoman Time Machine',
              icon: 'search',
              points: [
                'Pick any year and see who ruled, the capital, the borders, the wars, and the key people and buildings of that moment.',
              ],
            },
            {
              title: 'The Fall of Constantinople, 1453',
              icon: 'landmark',
              points: ['A six-stage reconstruction of the siege, from preparation to capture.'],
            },
            {
              title: 'Battles explorer',
              icon: 'swords',
              points: [
                '41 battles, each with a campaign map, movement arrows, commanders and outcome.',
              ],
            },
            {
              title: 'Architecture',
              icon: 'building',
              points: [
                '19 landmarks, plus Mimar Sinan’s three great mosques in 3D with an exploded view and floor plans.',
              ],
            },
            {
              title: '3D Istanbul',
              icon: 'globe',
              points: [
                'The city in four periods (1453, 1560, 1620, 1870), with camera fly-to between landmarks.',
              ],
            },
            {
              title: 'Army and navy',
              icon: 'shield',
              points: [
                'A 3D armoury (sabre, yatağan, shield, cannon) and a 3D war galley with clickable hotspots.',
              ],
            },
            {
              title: 'People',
              icon: 'users',
              points: [
                'All 36 sultans and 40 key figures, including statesmen, admirals, scholars and powerful women.',
              ],
            },
            {
              title: 'House of Osman',
              icon: 'crown',
              points: ['A zoomable family tree across 21 generations.'],
            },
            {
              title: 'Compare the Sultans',
              icon: 'chart',
              points: [
                'Side-by-side data on reigns, battles and reforms, deliberately with no “best” score.',
              ],
            },
            {
              title: 'The Final Years, 1908–1922',
              icon: 'book',
              points: ['A darker closing chapter that ends with “The Sultanate is abolished”.'],
            },
            {
              title: 'Also included',
              icon: 'sparkles',
              points: [
                'Culture and society',
                'A 57-term glossary',
                'Fuzzy site search',
                'Generative ambient sound',
                'Easter eggs',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'numbers',
      title: 'In numbers',
      blocks: [
        {
          kind: 'stats',
          label: 'Content',
          items: [
            { value: '36', label: 'sultans' },
            { value: '40', label: 'figures' },
            { value: '41', label: 'battles' },
            { value: '124', label: 'dated events' },
            { value: '60', label: 'places' },
            { value: '156', label: 'sources' },
          ],
        },
        {
          kind: 'stats',
          label: 'Code',
          items: [
            { value: '5', label: '3D scenes' },
            { value: '94', label: 'static pages' },
            { value: '55', label: 'components' },
            { value: '18,000+', label: 'lines of code' },
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
              title: 'Static architecture',
              points: [
                'The whole site is pre-rendered at build time into HTML, CSS and JavaScript. There is no server or database, so it can be hosted on any CDN and loads fast.',
              ],
            },
            {
              title: 'Content as typed data',
              points: [
                'All historical content lives in TypeScript data files with strict types.',
                'Records link to each other by ID. For example, a battle links to its ruler, place and sources.',
                'A validation script checks every link before each build.',
              ],
            },
            {
              title: 'Page generation',
              points: [
                'Next.js generates a page for every sultan and figure. The sitemap and SEO metadata come from the same data.',
              ],
            },
            {
              title: 'Maps',
              points: [
                'A Node.js script projects Natural Earth coastline data with D3-geo into SVG at build time.',
                'Hand-drawn territory polygons for each year are clipped to the land.',
                'Cities, battles and routes are placed at runtime using the same projection.',
              ],
            },
            {
              title: '3D',
              points: [
                'Three.js runs through React Three Fiber.',
                'Procedural models: every model is generated in code, so there are no model files. Custom GLSL shaders draw the sky, clouds and water.',
                'Lazy loading: viewers load only when they scroll near the screen and pause when they leave it.',
                'Quality tiers: rendering quality adapts to the device.',
                'Fallback video: low-power phones and browsers without WebGL get a pre-rendered video loop of the hero scene.',
              ],
            },
            {
              title: 'Animation',
              points: [
                'GSAP ScrollTrigger drives the pinned horizontal timeline.',
                'Motion handles reveals and transitions.',
                'All animation turns off for users who prefer reduced motion.',
              ],
            },
            {
              title: 'Certainty system',
              points: [
                'Reusable components attach fact or legend labels, plus a “Sources & references” panel, to each section.',
              ],
            },
            {
              title: 'Search and sound',
              points: [
                'Fuse.js provides fuzzy search across all content.',
                'The Web Audio API synthesizes ambient sound live, so no music files are used.',
              ],
            },
            {
              title: 'Accessibility',
              points: [
                'Keyboard navigation throughout.',
                'ARIA labels.',
                'Table and list alternatives for the visual tools.',
                'Colour-blind-safe charts.',
                'Responsive from phones to wide desktops.',
              ],
            },
          ],
        },
        {
          kind: 'chips',
          label: 'Statement labels (certainty system)',
          items: ['Confirmed fact', 'Tradition or legend', 'Interpretation', 'Scholarly debate'],
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
              items: [
                'TypeScript and TSX for application code, components and content data',
                'CSS through Tailwind CSS v4',
                'GLSL for the WebGL shaders',
                'JavaScript (Node.js) for build scripts',
              ],
            },
            {
              label: 'Frontend',
              items: [
                'Framework: Next.js 16 (App Router, static export) with React 19',
                'Styling: Tailwind CSS v4 with a custom Ottoman-inspired design system (burgundy, gold, ivory, emerald, geometric patterns)',
                '3D: Three.js, React Three Fiber and drei',
                'Animation: GSAP and Motion',
                'Maps: D3-geo, TopoJSON and Natural Earth data',
                'Search: Fuse.js',
                'Icons: Lucide',
                'Audio: Web Audio API',
                'Fonts: Cormorant Garamond, Manrope and Amiri',
              ],
            },
            {
              label: 'Backend',
              items: [
                'None, by design. The site uses static site generation: all content is compiled into pages at build time. It needs no server, database or API, which keeps it fast, secure and free to host.',
              ],
            },
            {
              label: 'Tooling and deployment',
              items: [
                'Build scripts (Node.js): map projection, data validation, and hero video rendering with Playwright and FFmpeg',
                'Quality checks: strict TypeScript, plus automated headless-browser screenshot tests on desktop and mobile',
                'Version control: Git and GitHub',
                'Deployment: one build command produces a static folder for Vercel, Netlify or Cloudflare Pages',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'process',
      title: 'Development process',
      blocks: [
        {
          kind: 'list',
          style: 'number',
          items: [
            'Research and design of the data model.',
            'Design system.',
            'Map engine.',
            'Storytelling sections.',
            'Procedural 3D scenes.',
            'Accessibility, performance and SEO pass.',
          ],
        },
      ],
    },
  ],
  seoDescription:
    'The Ottoman Empire 1299–1922: a cited, interactive 3D digital history site — 13-snapshot territory map, 41 battles, 36 sultans, a 1453 siege reconstruction and procedural Three.js scenes — statically generated with Next.js.',
  keywords: [
    'digital history',
    'Ottoman Empire',
    'Three.js',
    'D3-geo',
    'interactive map',
    'Next.js static export',
    'GSAP',
  ],
};
