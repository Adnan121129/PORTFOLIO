# Implementation checklist

How each requirement of the build brief was implemented and verified. “E2E” refers to the
Playwright suite in `tests/e2e`, “unit” to the Vitest suite in `tests/unit`. Results are from
the last full run (see the end of this document).

## Acceptance criteria (brief §12)

| #   | Criterion                                                                                     | Implementation                                                                                                           | Verified by                                                                                                                                                                                                                                                                                |
| --- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | WhatsApp opens `wa.me/8801851633134`                                                          | `src/lib/contact.ts` — digits only, optional URL-encoded greeting                                                        | unit `contact.test.ts`; E2E `contact.spec.ts` (exact `href`, keyboard Enter opens it in a new tab, composer opens it with the drafted text)                                                                                                                                                |
| 2   | Gmail compose and `mailto:` use `mdadnan899@gmail.com`                                        | `gmailComposeUrl()` / `mailtoUrl()`                                                                                      | unit (exact URLs); E2E (hero, contact page, fallback link)                                                                                                                                                                                                                                 |
| 3   | LinkedIn opens the supplied URL                                                               | `LINKEDIN_URL` in `src/content/site.ts`                                                                                  | unit; E2E                                                                                                                                                                                                                                                                                  |
| 4   | GitHub opens `https://github.com/Adnan121129`                                                 | `GITHUB_URL`                                                                                                             | unit; E2E                                                                                                                                                                                                                                                                                  |
| 5   | Project cards open the right case study; back works                                           | Stretched “Read Case Study” link on every card; previous/next and “Back to Projects” on each case study                  | E2E `projects.spec.ts` (card → case study → back → forward → next)                                                                                                                                                                                                                         |
| 6   | 8 projects and 5 research topics with supplied details, no invented links                     | `src/content/projects`, `src/content/research`                                                                           | unit `content.test.ts` (slugs, titles, exact repository URLs, OmniManager has none, the only URLs are the supplied repositories, test figures, synthetic/demo labels, research never “published”/“peer-reviewed”); E2E (all 13 pages return 200, repository links)                         |
| 7   | Search/filter really filter; empty states                                                     | Projects: client filter synced to `?q=`/`?category=`; Writing: server-side SQLite FTS5 search + categories + pagination  | unit `components.test.tsx` (filter logic and UI); E2E (category, search, URL sync, shared links, empty states, clear)                                                                                                                                                                      |
| 8   | Theme toggles, persists, follows the OS first, no flash                                       | Inline `<head>` script sets `data-theme` before paint; toggle stores the choice; `aria-pressed`                          | unit (toggle); E2E `theme.spec.ts` (OS dark with framework JS blocked, stored choice wins, persists across reload)                                                                                                                                                                         |
| 9   | Mobile/keyboard navigation, focus, dialogs, share/copy link, reduced motion                   | Native `<dialog>` menu and confirmations, skip link, visible focus, copy-link with fallback, reduced-motion handling     | E2E `navigation.spec.ts`, `writing.spec.ts` (clipboard), `theme.spec.ts` (no reveals or cursor ring with reduced motion; ring never on touch)                                                                                                                                              |
| 10  | Writing created, edited, previewed, drafted, published, unpublished, persisted; drafts hidden | Admin editor + server actions + libSQL; cache tag refresh                                                                | E2E `admin.spec.ts` full workflow incl. 404 for drafts, absence from sitemap/RSS/listing, reload persistence, fresh “New article”, delete; unit `posts.test.ts` (drafts excluded from every public query, redirects, cascade). Manually: publish/unpublish/delete survive a server restart |
| 11  | Forms validate, explain, never pretend to submit                                              | Contact composer opens WhatsApp/Gmail/mail app and says so (no fake “sent”); admin forms show field errors and a summary | unit (composer, schema); E2E (composer validation, publish refused until complete, wrong password)                                                                                                                                                                                         |
| 12  | Link semantics; no broken links, console errors, hydration errors, key a11y failures          | `target="_blank"` links use `rel="noopener noreferrer"` and announce “opens in a new tab”                                | E2E: every test fails on console errors/uncaught exceptions; full internal-link crawl; new-tab link audit; axe WCAG 2.2 A/AA in both themes on 11 pages + 404                                                                                                                              |
| 13  | Build, lint, type-check, tests pass; mobile/tablet/desktop checks                             | —                                                                                                                        | `npm run build`, `npm run check`, `npm run test:e2e` (desktop 1440 px and Pixel 7 projects); overflow test at 320/375/768/1024/1440 px; screenshots reviewed at 375 and 1440 px in both themes                                                                                             |
| 14  | Metadata, sitemap, robots, canonical URLs, social previews, titles                            | `src/lib/seo.ts`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` per section, JSON-LD                                  | unit `seo.test.ts`; E2E `seo.spec.ts` (unique titles, descriptions, canonicals, `og:image` that loads, JSON-LD types, sitemap contents, security headers)                                                                                                                                  |
| 15  | Usable without motion, without WebGL, when images fail                                        | No WebGL is used; motion is optional; images have text alternatives                                                      | E2E reduced-motion tests; `resilience.spec.ts` blocks all images and checks headings, contact actions and navigation                                                                                                                                                                       |

## Content rules (brief §13)

- [x] Projects, research, skills and experience/activities are separate sections and pages.
- [x] Every project card has **Read Case Study**; every research card has **Read Research**.
- [x] Case studies follow summary → context → solution → features → workflow/architecture →
      stack → testing → highlights → status/next steps → links, where the source supplies them.
- [x] Diagrams have a text alternative or a readable step list next to them.
- [x] Test figures are kept with their context; headline totals are explained, never invented
      (PlantOps: the headline “100 automated tests” is shown with the itemised 76 backend and
      20 frontend tests and a note that the source does not count the E2E tests individually;
      LinguaSI: 223 = 159 API + 64 web/mobile unit tests, with the Playwright journey listed
      separately).
- [x] No invented employment, clients, metrics, papers, awards, grades or deployments.
- [x] Synthetic/demo datasets and the demo detection model are labelled.

## Delivery items (brief §14)

- [x] Responsive site, all routes and interaction states (`/`, `/about`, `/projects`,
      `/projects/[slug]`, `/research`, `/research/[slug]`, `/writing`, `/writing/[slug]`,
      `/writing/feed.xml`, `/contact`, `/admin` and sub-pages, branded 404 and error pages).
- [x] Full content for 8 projects and 5 research topics from `Portfolio_Prompt.txt`.
- [x] Publishing workflow with documented persistence (README → “Data and persistence”).
- [x] Light and dark themes.
- [x] Tested contact actions.
- [x] README and `.env.example` (no secrets).
- [x] Tests and the commands to run them.

## Last verification run

| Check                                        | Result                                                              |
| -------------------------------------------- | ------------------------------------------------------------------- |
| `npm run check` (ESLint, TypeScript, Vitest) | 0 lint problems, 0 type errors, 69 tests in 9 files passed          |
| `npm run format:check`                       | all files formatted                                                 |
| `npm run build`                              | succeeds (57 static pages); also verified with an empty database    |
| `npm run test:e2e`                           | 120 passed, 9 skipped by design (desktop-only or mobile-only cases) |

Lighthouse 13.5 on the production build served locally, two runs per page. Mobile uses
Lighthouse’s default emulation (simulated slow 4G and a 4× slower CPU):

| Page                  | Performance | Accessibility | Best practices | SEO | LCP (simulated) | TBT        | CLS |
| --------------------- | ----------- | ------------- | -------------- | --- | --------------- | ---------- | --- |
| Home                  | 92          | 100           | 100            | 100 | 2.6–3.2 s       | 100–230 ms | 0   |
| About                 | 96–97       | 100           | 100            | 100 | 2.5 s           | 100–150 ms | 0   |
| Projects              | 94–96       | 100           | 100            | 100 | 2.4–3.0 s       | 100–160 ms | 0   |
| Case study (PlantOps) | 94–97       | 100           | 100            | 100 | 2.4–3.0 s       | 70–90 ms   | 0   |
| Research (Nirapotta)  | 94–97       | 100           | 100            | 100 | 2.4–3.0 s       | 80–90 ms   | 0   |
| Writing               | 94–95       | 100           | 100            | 100 | 3.0 s           | 40–80 ms   | 0   |
| Article               | 93–96       | 100           | 100            | 100 | 2.7–3.1 s       | 50–100 ms  | 0   |
| Contact               | 95–98       | 100           | 100            | 100 | 2.4–3.0 s       | 60–80 ms   | 0   |

Desktop preset (home and a case study): Performance 100, LCP 0.6 s, TBT 0 ms, CLS 0.

These are lab measurements on one machine, not field Core Web Vitals. On mobile the simulated
LCP sits around the 2.5 s “good” threshold and above it on some runs; unthrottled, LCP happens at
first paint (~0.1–0.2 s). What the simulation mostly charges for is the framework JavaScript
and web fonts loaded before first paint; fonts were already cut from ~184 KB to ~70 KB
preloaded (Latin subsets, Geist Mono not preloaded).
