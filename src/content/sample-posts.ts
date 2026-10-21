/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SAMPLE / EDITORIAL DEMO CONTENT
 * ─────────────────────────────────────────────────────────────────────────────
 * These starter articles exist so the Writing section can be designed and tested.
 * They are explainers drawn only from the design decisions documented for Adnan’s
 * own projects (PlantOps Intelligence, GreenFactory BI, InfraVision AI, LinguaSI).
 * Code snippets and numbers inside them are explicitly labelled as illustrative.
 *
 * They are inserted with is_sample = 1 by `npm run db:seed`, show a “Sample” badge in
 * the admin dashboard, and lose that badge once edited and saved. Remove them all with
 * `npm run db:remove-samples` or the “Remove sample posts” button in /admin.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { PostInput } from '@/lib/writing/types';

export const samplePosts: PostInput[] = [
  {
    title: 'Missing data is not zero: honest monthly KPIs for factory sustainability',
    slug: 'missing-data-is-not-zero',
    excerpt:
      'Raw monthly totals make a busy month look bad and a quiet month look good. Three rules from GreenFactory BI — normalise by production, use matched months only, and never turn a gap into a zero — make sustainability KPIs worth trusting.',
    category: 'data-bi',
    tags: ['KPIs', 'Data quality', 'Sustainability', 'GreenFactory BI'],
    seoTitle: 'Missing data is not zero: honest monthly sustainability KPIs',
    seoDescription:
      'Why raw monthly totals mislead, and three rules — production normalisation, matched months and explicit gaps — for trustworthy factory energy and water KPIs.',
    coverImageId: null,
    coverAlt: '',
    featured: true,
    body: `Factories often report environmental data as raw monthly totals. That habit quietly breaks the numbers: a busy month looks bad, a quiet month looks good, gaps in the data silently become zeros, and the savings claimed for improvement projects are rarely measured.

Those are exactly the problems I designed **GreenFactory BI** around. This note explains the three rules that do most of the work.

## Rule 1: Normalise by production

Energy and water only mean something next to the output that consumed them. GreenFactory BI reports **energy and water per 1,000 pieces**, so a month that produced more garments is not penalised for using more electricity to do it.

## Rule 2: Use matched months only

A ratio needs both halves. A month enters an intensity figure **only when both consumption and production data are complete**. If either side is partial, the month is left out of the ratio rather than producing a misleading number.

## Rule 3: Missing is never zero

When a month is incomplete it is excluded — and the reason is shown. A zero would claim that the factory used no energy; an exclusion with a reason tells the truth: *we don’t know yet*.

> [!NOTE]
> Excluding a month is not the same as hiding it. A data-quality matrix shows which months are missing or incomplete, so the gap stays visible instead of silently becoming a zero.

## A worked example

The numbers below are **illustrative**, not data from a real factory.

| Month | Electricity (kWh) | Production (pieces) | kWh per 1,000 pieces |
| --- | ---: | ---: | ---: |
| A | 120,000 | 400,000 | 300 |
| B | 150,000 | 600,000 | 250 |
| C | 135,000 | *incomplete* | *excluded — production data missing* |

Looking only at totals, month B used 25% more electricity than month A and looks worse. Normalised by production, month B was actually **more efficient**: 250 kWh per 1,000 pieces instead of 300. Month C is not reported as zero, and it is not silently averaged in.

## Splitting a change into production and efficiency effects

GreenFactory BI splits each month’s change in consumption into a **production effect** and an **efficiency effect**. One common way to express that split, using intensity *I* (consumption per unit) and production *P*:

- Production effect = (P₂ − P₁) × I₁
- Efficiency effect = (I₂ − I₁) × P₂

The two effects always add up to the total change. With the illustrative months above (production in thousands of pieces):

- Production effect = (600 − 400) × 300 = **+60,000 kWh**
- Efficiency effect = (250 − 300) × 600 = **−30,000 kWh**
- Total change = 150,000 − 120,000 = **+30,000 kWh**

So the extra 30,000 kWh is the net of growing output (+60,000) and genuinely better efficiency (−30,000). That is the sentence a manager needs — and raw totals can never produce it.

## In SQL: a matched-month intensity

An illustrative sketch of the idea — only complete months on both sides reach the ratio:

\`\`\`sql
-- Illustrative sketch: only months where both sides are complete enter the ratio
SELECT c.month,
       c.kwh,
       p.pieces,
       ROUND(c.kwh / (p.pieces / 1000.0), 1) AS kwh_per_1000_pcs
FROM monthly_consumption AS c
JOIN monthly_production  AS p ON p.month = c.month
WHERE c.is_complete = 1
  AND p.is_complete = 1;
\`\`\`

## Verification makes the rules stick

Rules only help if the inputs are trustworthy. In GreenFactory BI, records start as *Submitted* and must be **verified by a different user**. Verified records are locked; corrections create a new version, and the full history is kept in an audit log. Every number on a dashboard can be traced back to its source records.

If you want the full architecture — the analytics engine, the Power BI star schema and the 10-step end-to-end test — read the [GreenFactory BI case study](/projects/greenfactory-bi).
`,
  },
  {
    title: 'Proving the BI layer agrees with the app: reconciling DAX measures',
    slug: 'reconciling-dax-measures-with-the-app',
    excerpt:
      'A Power BI report and an application dashboard built on the same data should never disagree. In PlantOps Intelligence, one KPI dictionary, a star schema of SQL views and a reconciliation check keep them aligned — 15 of 15 measures match.',
    category: 'data-bi',
    tags: ['Power BI', 'DAX', 'Star schema', 'PlantOps Intelligence'],
    seoTitle: 'Reconciling Power BI DAX measures with the application',
    seoDescription:
      'How a central KPI dictionary, a star schema of SQL views, a read-only BI user and a reconciliation check keep Power BI figures identical to the app.',
    coverImageId: null,
    coverAlt: '',
    featured: false,
    body: `There is a quiet failure mode in many business-intelligence projects: the application shows one availability figure, the Power BI report shows another, and nobody can say which is right. Each layer defined the KPI on its own, and the definitions drifted.

In **PlantOps Intelligence** I treated agreement between the app and the BI layer as something to *prove*, not hope for.

## One definition per KPI

All KPIs are defined once in a **central KPI dictionary**, with a formula, unit and description for each. The dashboard, the reports and the BI layer all use the same definitions — so there is only one place where “availability” or “downtime” can be defined.

## One source of truth underneath

Definitions only agree if the data underneath agrees too:

- Downtime figures come **only** from recorded downtime events.
- Costs come from **one** expense ledger, and spare parts are costed automatically when issued.

That means every number on every screen agrees with every other — and gives the BI layer one set of facts to read.

## A star schema built from SQL views

The reporting layer is a dedicated schema of SQL views arranged as a star schema: **fact tables** for generation, downtime, maintenance, inventory and costs, and **dimension tables** for date, asset, unit and department. Power BI connects to these views through a **read-only database user**, so a report can never change operational data.

An illustrative sketch of what one fact view can look like (PostgreSQL; not the project’s exact SQL):

\`\`\`sql
-- Illustrative sketch of a fact view in a dedicated BI schema
CREATE VIEW bi.fact_downtime AS
SELECT d.id                                   AS downtime_id,
       d.equipment_id                         AS asset_key,
       CAST(d.started_at AS date)             AS date_key,
       EXTRACT(EPOCH FROM (d.ended_at - d.started_at)) / 3600.0 AS duration_hours
FROM operations_downtime AS d
WHERE d.ended_at IS NOT NULL;
\`\`\`

And the matching measure on the Power BI side, again as an illustration:

\`\`\`dax
-- Illustrative sketch, not the project's exact definition
Downtime Hours =
SUM ( FactDowntime[DurationHours] )
\`\`\`

## Reconciliation as a test

The final step is a **reconciliation check**: compute each measure in the application and in DAX for the same period and filters, then compare. In PlantOps Intelligence the check reports **15 of 15 measures match**.

The shape of such a check is simple — the discipline is in running it:

\`\`\`python
# Illustrative: compare each KPI from the app with the same KPI from the BI layer
def reconcile(app: dict[str, float], bi: dict[str, float], tolerance: float = 0.0):
    mismatches = {
        name: (value, bi.get(name))
        for name, value in app.items()
        if bi.get(name) is None or abs(value - bi[name]) > tolerance
    }
    return len(app) - len(mismatches), mismatches
\`\`\`

> [!TIP]
> Treat a reconciliation mismatch like a failing test. It almost always means a definition drifted somewhere — and it is far cheaper to find that before a manager does.

## What this buys you

- Managers can move between the app and Power BI without second-guessing either.
- New measures inherit a clear definition from the KPI dictionary.
- The BI layer stays read-only, documented and reproducible.

The full system — six roles, ten alert rules, fourteen reports and the testing approach — is in the [PlantOps Intelligence case study](/projects/plantops-intelligence).
`,
  },
  {
    title: 'AI as decision support: checks around the model, not blind trust',
    slug: 'ai-as-decision-support',
    excerpt:
      'In InfraVision AI and LinguaSI the same principle shows up in two very different domains: the model proposes, the system verifies, and a person decides. Here is what that looks like in practice.',
    category: 'ai-ml',
    tags: ['AI', 'Human-in-the-loop', 'Validation', 'InfraVision AI', 'LinguaSI'],
    seoTitle: 'AI as decision support: checks around the model',
    seoDescription:
      'Design patterns from InfraVision AI and LinguaSI: labelled model status, human confirmation, schema-validated AI output, quote checks and clamped scores.',
    coverImageId: null,
    coverAlt: '',
    featured: false,
    body: `Two of my projects use AI in completely different domains — structural inspection photos in **InfraVision AI**, and English essays and speaking practice in **LinguaSI**. The common thread is a design principle rather than a model: *the AI proposes, the system verifies, and a person decides.*

## InfraVision AI: engineers confirm or reject every finding

InfraVision AI turns inspection photos into candidate defects — cracks, spalling, corrosion and rust — with a severity rating and a 0–100 health score per asset. But the AI acts as **decision support**: engineers can confirm or reject each detection before acting on it.

A few architectural choices support that stance:

- **The model is a separate, replaceable module.** A new or improved model can be plugged in without changing the rest of the application.
- **Heavy work runs in the background.** The web request only validates and stores the image; a Celery worker does the processing and reports progress over WebSockets.
- **The model’s status is stated plainly.** The platform currently runs a demo detection model based on classical image processing, clearly labelled in the app. The next steps are explicit: train the ResNet-50 model on a real crack dataset (SDNET2018), then measure and report its accuracy.

> [!IMPORTANT]
> A clearly labelled demo model is more useful than an impressive-looking unlabelled one. People can only weigh a result if they know where it came from.

## LinguaSI: the AI is checked, not trusted blindly

LinguaSI uses AI to evaluate and explain learners’ writing and speaking. The platform’s own code still measures, validates and decides:

- AI output must match a **typed schema** (15 AI tasks), with one repair attempt.
- A mistake the AI quotes must **actually exist in the learner’s text**, or it is discarded.
- Bands are **clamped** to valid values, and they are labelled *AI Estimated* practice indicators — never official IELTS scores.
- Pronunciation is marked **“not assessed”** when the audio evidence isn’t there, instead of guessing.

Here is an illustrative sketch of the “checked, not trusted” idea in Python — not the project’s actual code:

\`\`\`python
# Illustrative sketch — not LinguaSI's actual implementation
from pydantic import BaseModel, ValidationError

class Finding(BaseModel):
    quote: str
    correction: str
    explanation: str

class EssayEvaluation(BaseModel):
    band: float
    findings: list[Finding]

def accept(raw_json: str, essay: str) -> EssayEvaluation | None:
    try:
        result = EssayEvaluation.model_validate_json(raw_json)
    except ValidationError:
        return None  # the caller may make one repair attempt
    result.band = round(min(9.0, max(0.0, result.band)) * 2) / 2  # clamp to valid half-bands
    result.findings = [f for f in result.findings if f.quote in essay]  # quotes must exist
    return result
\`\`\`

## A short checklist

1. Say what the model is — trained, demo or rule-based — wherever its output appears.
2. Keep a person in the loop for decisions with consequences.
3. Validate structured output against a schema; repair once, then fail safely.
4. Cross-check the model’s claims against the input it was given.
5. Prefer “not assessed” over a confident guess.
6. Keep the AI behind an interface so it can be replaced.

Read the [InfraVision AI](/projects/infravision-ai) and [LinguaSI](/projects/linguasi) case studies for the complete architectures.
`,
  },
];
