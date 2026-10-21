# Muhammad Adnan — portfolio

Personal site of Muhammad Adnan: MIS and business intelligence, data analysis, applied AI/ML
and backend-focused full-stack engineering. It has eight project case studies, five research
pages, a journal with a real publishing workflow, and contact actions for WhatsApp, Gmail,
LinkedIn and GitHub.

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4
and libSQL/SQLite. Content for projects, research and the profile comes from the supplied
brief (`Portfolio_Prompt.txt`) and lives in typed modules under `src/content`.

## Quick start

Requires Node.js 20.9 or newer.

```sh
npm install
cp .env.example .env.local      # adjust if needed; defaults work locally
npm run setup                   # create data/portfolio.db and add the three SAMPLE articles
npm run admin:create            # create your admin account (prompts for email and password)
npm run dev                     # http://localhost:3000 — admin at /admin
```

`npm run setup` is optional: without it the database is created on first use and the journal
starts empty.

## Scripts

| Command                                                       | What it does                                                                                        |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `npm run dev`                                                 | Development server                                                                                  |
| `npm run build` / `npm start`                                 | Production build (runs database migrations first) / serve it                                        |
| `npm run lint` · `npm run typecheck` · `npm run format:check` | ESLint · TypeScript · Prettier                                                                      |
| `npm test`                                                    | Unit and component tests (Vitest)                                                                   |
| `npm run test:e2e`                                            | End-to-end tests (Playwright) against a production build — see [Testing](#testing)                  |
| `npm run check`                                               | Lint, type-check and unit tests together                                                            |
| `npm run admin:create`                                        | Create the admin account, or reset its password (signs out existing sessions)                       |
| `npm run db:migrate`                                          | Apply database migrations                                                                           |
| `npm run db:seed`                                             | Insert the flagged sample articles (skips any that exist)                                           |
| `npm run db:remove-samples`                                   | Delete the sample articles that are still flagged as samples                                        |
| `node scripts/screenshots.mjs <dir> [url] [routes…]`          | Full-page screenshots of routes in light and dark themes at several widths (needs a running server) |

## Where things live

```
src/content/          Identity, contact destinations, profile, 8 projects, 5 research items,
                      journal categories, sample articles (all plain TypeScript data)
src/app/(site)/       Public pages: /, /about, /projects, /projects/[slug], /research,
                      /research/[slug], /writing, /writing/[slug], /writing/feed.xml, /contact
src/app/admin/        Protected admin: sign-in, articles, editor, preview, media library,
                      server actions and the image-upload route
src/lib/              Database client and migrations, posts repository, markdown pipeline,
                      authentication, media processing, SEO helpers
src/components/       UI, layout, case-study blocks, diagrams and illustrations
tests/unit · tests/e2e  Vitest and Playwright suites
docs/IMPLEMENTATION.md  Requirements checklist and how each one was verified
```

### Editing the portfolio content

Projects (`src/content/projects/*.ts`), research (`src/content/research/*.ts`), the profile
(`src/content/profile.ts`) and identity/contact details (`src/content/site.ts`) are typed data;
pages, metadata, the sitemap and tests all read from them. A few things are deliberate:

- The about-me paragraph is copied exactly from the brief, including “SI/ML”. If that was meant
  to read “AI/ML”, change `site.about` in `src/content/site.ts` (and the unit test that guards it).
- Research abstracts are quoted as supplied; statuses say what each item is (prototype,
  simulation study, proposed framework…) and never claim publication or peer review.
- Synthetic datasets and demo models are labelled on PlantOps Intelligence, GreenFactory BI and
  InfraVision AI. Test counts are shown as supplied, with the breakdown explained.
- OmniManager has no repository link because none was supplied. No live-demo links exist anywhere.
- Project illustrations are drawn diagrams, captioned as illustrations — not product screenshots.

## Writing and the admin

Sign in at `/admin` with the account from `npm run admin:create`.

- **Write** in Markdown with a formatting toolbar: headings, lists, links, tables, code blocks
  with syntax highlighting, `> [!NOTE]` callouts and images from the media library.
- **Preview** inside the editor, or open the full-page preview of the saved version.
- **Save draft** stores the article in the database. Drafts never appear on public pages, in
  the sitemap, the RSS feed or search, and their URLs return 404.
- **Publish** checks that the excerpt, body length and cover alt text are complete, then makes
  the article live. **Unpublish** turns it back into a draft. **Delete** asks for confirmation.
- Changing a published article’s URL slug keeps the old URL working with a permanent redirect.
- **Images**: JPEG, PNG, WebP, GIF or AVIF up to 4 MB. Each upload is decoded and checked,
  resized to at most 2000 px wide, converted to WebP and stripped of metadata such as GPS
  location. Images are stored in the database and served from `/media/<id>`.
- SEO title and description fields are optional and fall back to the title and excerpt.
- Leaving the editor with unsaved changes asks for confirmation; Ctrl/⌘ + S saves.

Every save is a server action that re-checks the session, validates the input and only reports
success once the database write has finished. Public pages are cached and refreshed through a
cache tag on every change.

### Sample articles

Three sample articles (`src/content/sample-posts.ts`) are clearly marked as samples in the
source and in the admin list. Before launch, remove them with **Remove sample posts** in the
admin (refreshes the live site immediately) or `npm run db:remove-samples` (then restart the
server or make any change in the admin). Editing a sample removes its sample flag, so your own
rewrites are never deleted by these commands.

## Data and persistence

Articles, media, admin accounts, sessions and login attempts are stored with libSQL:

- **Default:** a SQLite file at `data/portfolio.db` (WAL mode). Suitable for local development
  and for self-hosting on a machine with a persistent disk.
- **Serverless hosting:** set `DATABASE_URL` to a hosted libSQL database such as
  [Turso](https://turso.tech) (`libsql://…`) and `DATABASE_AUTH_TOKEN` to its token. Serverless
  file systems are not persistent, so a file database would lose data there.

Migrations (`src/lib/db/migrations.ts`) run automatically on first access and before every
build. Back up a file database with `sqlite3 data/portfolio.db ".backup backup.db"`; Turso has
its own backups.

## Security

- Passwords are hashed with scrypt. Sessions are random 256-bit tokens in an httpOnly,
  SameSite=Lax cookie (`Secure` and `__Host-` prefixed in production); only a SHA-256 hash of
  the token is stored. Sign-in is rate-limited per account and per IP address.
- Every admin page, server action and the upload route checks the session on the server.
  Server actions and uploads reject cross-site requests. Admin pages are `noindex` (meta tag and
  `X-Robots-Tag`) and disallowed in `robots.txt`.
- Article Markdown is rendered on the server with raw HTML disabled and sanitised with
  `rehype-sanitize`; unsafe URLs such as `javascript:` are removed.
- No credentials or API keys exist in client code or in the repository. The site loads no
  third-party scripts, fonts or analytics, and sends a strict Content Security Policy plus
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` and HSTS.

## Testing

```sh
npm run check          # ESLint + TypeScript + Vitest (69 unit/component tests)
npm run test:e2e       # Playwright (desktop and mobile Chromium)
```

`npm run test:e2e` builds the site into `.next-e2e` and serves it on port 3100 with a
throwaway database (`data/e2e.db`) that is recreated on every run with the sample articles and
a test-only admin account (defined in `tests/e2e/support.ts`; it exists only in that throwaway
database). It never touches `data/portfolio.db`. Install the browser once with
`npx playwright install chromium` if it is not already available.

The end-to-end suite covers the exact contact destinations, keyboard access, project and
research pages, filtering and empty states, the journal and RSS feed, the complete admin
workflow (create → preview → draft → publish → edit → unpublish → delete, uploads, sign-out,
protected endpoints), theme persistence without a flash, reduced motion, the mobile menu,
404s, metadata/sitemap/robots/security headers, axe WCAG 2.2 A/AA scans in both themes,
horizontal overflow at 320–1440 px, a full internal-link crawl, and pages with images blocked.
Every test also fails on any console error or uncaught exception.

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the public origin in every environment — canonical URLs, the
sitemap, RSS and social previews depend on it.

### Self-hosted Node.js (simplest)

```sh
npm ci
npm run build
npm start              # or run behind a process manager; serve over HTTPS via a reverse proxy
```

Keep `data/` on persistent storage and run a single instance (the page cache lives on that
server). Create the admin with `npm run admin:create` on the server.

### Vercel + Turso

1. Create a Turso database and token (`turso db create`, `turso db tokens create`).
2. In the Vercel project, set `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL` and `DATABASE_AUTH_TOKEN`
   for both build and runtime. The build runs migrations and pre-renders published articles,
   so it needs database access.
3. Deploy. Then create the admin from your machine with the same variables:
   `DATABASE_URL=… DATABASE_AUTH_TOKEN=… npm run admin:create`.

Uploads are limited to 4 MB to stay within serverless request-size limits.

## Licences

Code: all rights reserved by Muhammad Adnan unless he chooses otherwise. Fonts: Geist and
Geist Mono (subsets, SIL OFL 1.1) and Instrument Serif (SIL OFL 1.1) — see `src/fonts/`.
