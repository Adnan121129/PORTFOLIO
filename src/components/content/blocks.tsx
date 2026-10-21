import { ArrowRight, Check, CornerDownRight, Info } from 'lucide-react';
import type { Block, Section, Step, TestFigure } from '@/content/types';
import { cn } from '@/lib/utils';
import { FlowDiagram } from '../diagrams/flow-diagram';
import { ChipList, Notice, Reveal } from '../ui/primitives';
import { ContentIcon } from './icon';

/** Splits "intro:" + examples into a lead sentence and a nested list. */
function PointList({ points }: { points: string[] }) {
  const leadIndex = points.findIndex((point) => point.trimEnd().endsWith(':'));
  if (leadIndex === -1) {
    return (
      <div className="space-y-2">
        {points.map((point) => (
          <p key={point}>{point}</p>
        ))}
      </div>
    );
  }
  const before = points.slice(0, leadIndex + 1);
  const after = points.slice(leadIndex + 1);
  return (
    <div className="space-y-2">
      {before.map((point) => (
        <p key={point}>{point}</p>
      ))}
      <ul className="space-y-1.5 pl-1">
        {after.map((point) => (
          <li key={point} className="flex gap-2.5">
            <CornerDownRight
              size={15}
              aria-hidden="true"
              className="mt-1 shrink-0 text-ink-subtle"
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Steps({ items }: { items: Step[] }) {
  return (
    <ol className="relative space-y-0">
      {items.map((step, index) => (
        <li
          key={step.title}
          className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-8 last:pb-0 sm:grid-cols-[3rem_1fr]"
        >
          {index < items.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute top-10 bottom-0 left-[1.25rem] w-px bg-line sm:left-[1.5rem]"
            />
          ) : null}
          <span
            aria-hidden="true"
            className="relative z-10 grid size-10 place-items-center rounded-full border border-line-strong bg-bg font-mono text-[0.8rem] text-ink sm:size-12"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="pt-1.5 sm:pt-2.5">
            <h3 className="text-[1.05rem] font-semibold text-ink">
              <span className="sr-only">Step {index + 1}: </span>
              {step.title}
            </h3>
            <div className="mt-2 text-[0.98rem] leading-relaxed text-ink-muted">
              <PointList points={step.points} />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Flow({
  label,
  nodes,
  exits,
  caption,
}: {
  label: string;
  nodes: string[];
  exits?: string[];
  caption?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-bg-elevated p-4 sm:p-5">
      <p className="eyebrow mb-3">{label}</p>
      <ol aria-label={label} className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {nodes.map((node, index) => (
          <li key={`${node}-${index}`} className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.86rem] text-ink">
              <span className="font-mono text-[0.68rem] text-ink-subtle">{index + 1}</span>
              {node}
            </span>
            {index < nodes.length - 1 ? (
              <ArrowRight size={14} aria-hidden="true" className="text-ink-subtle" />
            ) : null}
          </li>
        ))}
      </ol>
      {exits?.length ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.86rem] text-ink-muted">
          <CornerDownRight size={14} aria-hidden="true" />
          <span className="font-mono text-[0.7rem] tracking-wide uppercase">
            {exits.length > 1 ? 'Exits:' : 'Alternative outcome:'}
          </span>
          <ul className="flex flex-wrap gap-1.5">
            {exits.map((exit) => (
              <li
                key={exit}
                className="rounded-full border border-dashed border-line-strong px-3 py-1"
              >
                {exit}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {caption ? <p className="mt-3 text-sm text-ink-muted">{caption}</p> : null}
    </div>
  );
}

function Tests({ items, note }: { items: TestFigure[]; note?: string }) {
  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={`${item.value}-${item.label}`} className="surface-card flex gap-4 p-4">
            <span className="min-w-[3.5rem] font-serif text-[2.1rem] leading-none text-ink">
              {item.value}
            </span>
            <span>
              <span className="block text-[0.95rem] font-medium text-ink">{item.label}</span>
              {item.detail ? (
                <span className="mt-1 block text-[0.88rem] leading-snug text-ink-muted">
                  {item.detail}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      {note ? (
        <p className="mt-4 flex gap-2.5 text-[0.9rem] leading-relaxed text-ink-muted">
          <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
          <span>{note}</span>
        </p>
      ) : null}
    </div>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'paragraph':
      return (
        <p className="max-w-[70ch] text-[1.05rem] leading-[1.75] text-ink-muted">{block.text}</p>
      );

    case 'list': {
      if (block.style === 'number') {
        return (
          <ol className="max-w-[70ch] space-y-2.5">
            {block.items.map((item, index) => (
              <li key={item} className="flex gap-3 text-[1rem] leading-relaxed text-ink-muted">
                <span className="mt-0.5 font-mono text-[0.78rem] text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="max-w-[70ch] space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[1rem] leading-relaxed text-ink-muted">
              {block.style === 'check' ? (
                <Check size={17} aria-hidden="true" className="mt-1 shrink-0 text-accent" />
              ) : (
                <span
                  aria-hidden="true"
                  className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-ink-subtle"
                />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    case 'questions':
      return (
        <ol className="grid gap-2.5 sm:grid-cols-2">
          {block.items.map((question, index) => (
            <li key={question} className="surface-card flex gap-3 p-4">
              <span
                aria-hidden="true"
                className="font-serif text-2xl leading-none text-accent italic"
              >
                Q{index + 1}
              </span>
              <span className="text-[0.98rem] leading-snug text-ink">{question}</span>
            </li>
          ))}
        </ol>
      );

    case 'features':
      return (
        <ul className={cn('grid gap-3 sm:grid-cols-2', block.columns === 3 && 'lg:grid-cols-3')}>
          {block.items.map((feature) => (
            <Reveal as="li" key={feature.title} className="h-full">
              <div className="surface-card h-full p-5 transition-colors hover:border-line-strong">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                    <ContentIcon name={feature.icon} />
                  </span>
                  <h3 className="text-[1rem] leading-snug font-semibold text-ink">
                    {feature.title}
                  </h3>
                </div>
                <ul className="mt-3.5 space-y-2 text-[0.93rem] leading-relaxed text-ink-muted">
                  {feature.points.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.65em] size-1 shrink-0 rounded-full bg-ink-subtle"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      );

    case 'steps':
      return <Steps items={block.items} />;

    case 'flow':
      return (
        <Flow label={block.label} nodes={block.nodes} exits={block.exits} caption={block.caption} />
      );

    case 'chips':
      return (
        <div>
          <p className="eyebrow mb-3">{block.label}</p>
          <ChipList items={block.items} tone="outline" label={block.label} />
        </div>
      );

    case 'stack':
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {block.groups.map((group) => (
            <section key={group.label} className="surface-card p-5" aria-label={group.label}>
              <h3 className="eyebrow text-ink">{group.label}</h3>
              <ul className="mt-3 space-y-2 text-[0.93rem] leading-relaxed text-ink-muted">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[0.65em] size-1 shrink-0 rounded-full bg-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      );

    case 'stats':
      return (
        <div>
          {block.label ? <p className="eyebrow mb-3">{block.label}</p> : null}
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            {block.items.map((stat) => (
              <li key={`${stat.value}-${stat.label}`} className="bg-surface p-4">
                <span className="block font-serif text-[2rem] leading-none text-ink">
                  {stat.value}
                </span>
                <span className="mt-2 block text-[0.85rem] leading-snug text-ink-muted">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'tests':
      return <Tests items={block.items} note={block.note} />;

    case 'callout':
      return (
        <Notice tone={block.tone} title={block.title}>
          {block.text}
        </Notice>
      );

    case 'definitions':
      return (
        <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line">
          {block.items.map((item) => (
            <div
              key={item.term}
              className="grid gap-1 bg-surface p-4 sm:grid-cols-[minmax(10rem,14rem)_1fr] sm:gap-6"
            >
              <dt className="text-[0.95rem] font-semibold text-ink">{item.term}</dt>
              <dd className="text-[0.95rem] leading-relaxed text-ink-muted">{item.detail}</dd>
            </div>
          ))}
        </dl>
      );

    case 'diagram':
      return <FlowDiagram name={block.diagram} caption={block.caption} />;

    case 'quote':
      return (
        <blockquote className="border-l-2 border-accent pl-5">
          <p className="eyebrow mb-3">{block.label}</p>
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph} className="font-serif text-xl leading-relaxed text-ink">
              {paragraph}
            </p>
          ))}
        </blockquote>
      );

    default: {
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}

/**
 * A titled case-study or research section. `scope` (the page slug) keeps the heading id
 * unique even when Next.js keeps a previously visited page hidden in the document.
 */
export function SectionView({
  section,
  index,
  scope,
}: {
  section: Section;
  index: number;
  scope: string;
}) {
  const titleId = `${scope}-${section.id}-title`;
  return (
    <section id={section.id} aria-labelledby={titleId} className="scroll-mt-28">
      <div className="flex items-baseline gap-4 border-t border-line pt-8">
        <span className="font-mono text-[0.75rem] text-accent">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2
          id={titleId}
          className="font-serif text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.05] tracking-tight text-ink"
        >
          {section.title}
        </h2>
      </div>
      <div className="mt-7 space-y-6">
        {section.blocks.map((block, blockIndex) => (
          <BlockView key={`${section.id}-${blockIndex}`} block={block} />
        ))}
      </div>
    </section>
  );
}
