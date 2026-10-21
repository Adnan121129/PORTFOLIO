import Link from 'next/link';
import { PauseOffscreen } from '../motion/pause-offscreen';

/*
 * The hero’s visual signature: the pattern that runs through the MIS/BI and AI projects —
 * capture records once, validate them, model them, and turn them into decisions.
 * Each stage cites projects where the source material documents it.
 */
const stages = [
  {
    key: 'capture',
    title: 'Capture',
    text: 'Shift logs, meter readings, inspection photos and learner essays — recorded once, at the source.',
    seenIn: [
      { label: 'PlantOps', href: '/projects/plantops-intelligence' as const },
      { label: 'InfraVision', href: '/projects/infravision-ai' as const },
    ],
  },
  {
    key: 'validate',
    title: 'Validate',
    text: 'Business rules, second-person verification, approvals and audit trails before a number counts.',
    seenIn: [
      { label: 'GreenFactory', href: '/projects/greenfactory-bi' as const },
      { label: 'OmniManager', href: '/projects/omnimanager' as const },
    ],
  },
  {
    key: 'model',
    title: 'Model',
    text: 'Central KPI dictionaries, star schemas, and computer-vision or ML pipelines with checks around them.',
    seenIn: [
      { label: 'PlantOps', href: '/projects/plantops-intelligence' as const },
      { label: 'LinguaSI', href: '/projects/linguasi' as const },
    ],
  },
  {
    key: 'decide',
    title: 'Decide',
    text: 'Dashboards, alerts, reports and explained recommendations people can act on.',
    seenIn: [
      { label: 'GreenFactory', href: '/projects/greenfactory-bi' as const },
      { label: 'LinguaSI', href: '/projects/linguasi' as const },
    ],
  },
];

export function DecisionPipeline() {
  return (
    <PauseOffscreen className="relative">
      <h2 className="sr-only">How I approach data systems</h2>
      {/* Desktop connector: animated dashes between the four stage markers. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-[1.375rem] right-0 left-0 hidden h-3 w-full lg:block"
        preserveAspectRatio="none"
        viewBox="0 0 1000 12"
      >
        <line
          x1="0"
          y1="6"
          x2="1000"
          y2="6"
          className="stroke-(--line-strong)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="0"
          y1="6"
          x2="1000"
          y2="6"
          className="animate-flow stroke-(--accent)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <ol className="relative grid gap-0 pl-[1.4rem] lg:grid-cols-4 lg:gap-8 lg:pl-0">
        {stages.map((stage, index) => (
          <li
            key={stage.key}
            className="relative grid grid-cols-[1.75rem_1fr] gap-x-4 border-l border-line pb-8 pl-0 last:pb-0 lg:block lg:border-l-0 lg:pb-0"
          >
            <span
              aria-hidden="true"
              className="relative z-10 -ml-[1.4rem] grid size-11 place-items-center rounded-full border border-line-strong bg-bg font-mono text-[0.78rem] text-ink lg:ml-0"
            >
              {String(index + 1).padStart(2, '0')}
              <span
                className="animate-pulse-dot absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-accent-bright"
                style={{ animationDelay: `${index * 0.6}s` }}
              />
            </span>
            <div className="lg:mt-5">
              <h3 className="font-serif text-[1.65rem] leading-none text-ink">{stage.title}</h3>
              <p className="mt-2.5 max-w-[34ch] text-[0.93rem] leading-relaxed text-ink-muted">
                {stage.text}
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.7rem] tracking-wide text-ink-subtle uppercase">
                <span>Seen in</span>
                {stage.seenIn.map((item, i) => (
                  <span key={item.label} className="inline-flex items-center gap-2">
                    <Link
                      href={item.href}
                      className="relative z-10 text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-accent hover:decoration-accent"
                    >
                      {item.label}
                    </Link>
                    {i < stage.seenIn.length - 1 ? <span aria-hidden="true">·</span> : null}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </PauseOffscreen>
  );
}
