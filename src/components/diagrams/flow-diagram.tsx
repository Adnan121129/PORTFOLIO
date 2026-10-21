import { ArrowDown, ArrowRight } from 'lucide-react';
import type { DiagramName } from '@/content/types';
import { cn } from '@/lib/utils';

type DiagramNode = { title: string; detail?: string; edgeLabel?: string; emphasis?: boolean };
type DiagramLane = {
  label?: string;
  nodes: DiagramNode[];
  /** Nodes are alternatives/peers rather than a sequence: no arrows between them. */
  parallel?: boolean;
  /** Label for the hand-off from the previous lane. */
  handoff?: string;
};
type DiagramSpec = { title: string; lanes: DiagramLane[] };

/*
 * Architecture and workflow diagrams are written as data and rendered as ordered lists,
 * so the full content is available to screen readers, search engines and text copying.
 * Descriptions paraphrase only what each project’s source documentation states.
 */
const diagrams: Record<DiagramName, DiagramSpec> = {
  'plantops-data-flow': {
    title: 'PlantOps Intelligence data flow',
    lanes: [
      {
        nodes: [
          {
            title: 'Capture',
            detail: 'Shift reports, work orders, downtime events, stock movements and expenses',
          },
          {
            title: 'Validate & approve',
            detail: 'Business rules, approval workflows and an audit log',
          },
          {
            title: 'Single source of truth',
            detail: 'PostgreSQL with database-level constraints',
            emphasis: true,
          },
          { title: 'KPI dictionary', detail: 'One formula, unit and description per KPI' },
          {
            title: 'Decide',
            detail:
              'Dashboard, 10 alert rules, 14 reports, Power BI star schema (15/15 measures match)',
          },
        ],
      },
    ],
  },
  'infravision-pipeline': {
    title: 'InfraVision AI processing pipeline',
    lanes: [
      {
        label: 'Web request — stays fast',
        nodes: [
          { title: 'Upload', detail: 'Images via the React dashboard' },
          { title: 'Validate', detail: 'File type, size and image validity (Django REST API)' },
          { title: 'Store', detail: 'Original to S3/MinIO; inspection recorded in PostgreSQL' },
          { title: 'Queue', detail: 'Job placed on Celery with Redis', emphasis: true },
        ],
      },
      {
        label: 'Background worker — replaceable AI module',
        handoff: 'A separate worker picks up the job',
        nodes: [
          {
            title: 'Preprocess',
            detail:
              'Noise reduction, colour and lighting correction, contrast and edge enhancement',
          },
          {
            title: 'Detect',
            detail: 'Defect detection (currently a labelled classical-image-processing demo model)',
          },
          { title: 'Score', detail: 'Severity and 0–100 health scoring' },
          {
            title: 'Save & update',
            detail: 'Defects stored; health score, risk level and alerts update',
            emphasis: true,
          },
        ],
      },
      {
        label: 'Live updates',
        handoff: 'Results saved; status pushed to the browser',
        nodes: [
          { title: 'Django Channels', detail: 'Status messages over WebSockets' },
          {
            title: 'Browser',
            detail: 'Live progress and a notification when the inspection finishes',
          },
          {
            title: 'Engineer review',
            detail: 'Confirm or reject each detection before acting',
            emphasis: true,
          },
        ],
      },
    ],
  },
  'linguasi-architecture': {
    title: 'LinguaSI architecture',
    lanes: [
      {
        label: 'Three apps',
        parallel: true,
        nodes: [
          {
            title: 'Next.js website',
            detail:
              'Talks to the API through its own server; sign-in tokens live in httpOnly cookies',
          },
          {
            title: 'React Native app (iOS/Android)',
            detail: 'Calls the API directly; tokens kept in the phone’s secure storage',
          },
        ],
      },
      {
        label: 'One API',
        handoff: 'All requests reach one backend',
        nodes: [
          {
            title: 'FastAPI backend',
            detail: 'Owns all data, business rules and AI calls',
            emphasis: true,
          },
          {
            title: 'SI Core',
            detail: 'Eight specialised agents share one compact learner profile',
          },
          {
            title: 'Data & AI providers',
            detail:
              'PostgreSQL 16 (40 tables); Anthropic Claude, OpenAI, Google Gemini or Mock AI Mode',
          },
        ],
      },
    ],
  },
  'nirapotta-flow': {
    title: 'Nirapotta system flow',
    lanes: [
      {
        nodes: [
          {
            title: 'Movement / Sensor Inputs',
            detail: 'Accelerometer, gyroscope and audio, sampled locally',
          },
          {
            title: 'Flutter App Sensor Pipeline',
            detail: 'Background isolate threads stream motion metrics',
          },
          {
            title: 'On-Device 1D-CNN Model',
            detail: 'Classifies emergency gestures locally',
            emphasis: true,
          },
          {
            title: 'Emergency Trigger',
            detail: 'Confirmation step to minimise false positives',
            edgeLabel: 'Threshold met',
          },
          {
            title: 'Geolocation Dispatch & SOS Alert',
            detail: 'Timestamp, device state and GPS coordinates via SMS and network requests',
          },
        ],
      },
    ],
  },
  'garbage-pipeline': {
    title: 'Garbage detection pipeline',
    lanes: [
      {
        nodes: [
          {
            title: 'Urban scene image',
            detail: 'Benchmark: balanced images from the public TACO dataset',
          },
          {
            title: 'DIP preprocessing',
            detail:
              'Bilateral denoising · CLAHE · Multi-Mode Edge Detection · Morphological Refinement',
          },
          {
            title: 'Feature channels',
            detail: 'HSV colour histograms · LBP texture · Hu moment shape statistics',
          },
          {
            title: 'Fused feature vector',
            detail: 'One compact vector encoding waste accumulation',
            emphasis: true,
          },
          { title: 'SVM classifier', detail: 'Garbage or Clean; CPU-only inference' },
        ],
      },
    ],
  },
};

export function FlowDiagram({ name, caption }: { name: DiagramName; caption: string }) {
  const spec = diagrams[name];
  return (
    <figure className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg-elevated">
      <div className="bg-grid relative space-y-6 p-4 sm:p-6">
        {spec.lanes.map((lane, laneIndex) => (
          <div key={laneIndex}>
            {lane.handoff && laneIndex > 0 ? (
              <p className="-mt-2 mb-3 flex items-center gap-2 text-[0.8rem] text-ink-subtle">
                <ArrowDown size={14} aria-hidden="true" />
                {lane.handoff}
              </p>
            ) : null}
            {lane.label ? (
              <p className="eyebrow mb-3 flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                {lane.label}
              </p>
            ) : null}
            <ol
              className={cn(
                lane.parallel
                  ? 'grid gap-2 sm:grid-cols-2'
                  : 'flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0',
              )}
              aria-label={lane.label ?? spec.title}
            >
              {lane.nodes.map((node, index) => (
                <li
                  key={node.title}
                  className={cn(
                    'flex flex-col',
                    !lane.parallel && 'lg:flex-1 lg:flex-row lg:items-center',
                  )}
                >
                  {index > 0 && !lane.parallel ? (
                    <span
                      aria-hidden={node.edgeLabel ? undefined : true}
                      className="flex items-center justify-center gap-1.5 py-1 text-ink-subtle lg:w-9 lg:shrink-0 lg:flex-col lg:py-0"
                    >
                      <ArrowDown size={15} className="lg:hidden" aria-hidden="true" />
                      <ArrowRight size={15} className="hidden lg:block" aria-hidden="true" />
                      {node.edgeLabel ? (
                        <span className="font-mono text-[0.65rem] tracking-wide text-accent uppercase lg:text-center">
                          {node.edgeLabel}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      'h-full flex-1 rounded-xl border px-3.5 py-3',
                      node.emphasis ? 'border-accent/40 bg-accent-soft' : 'border-line bg-surface',
                    )}
                  >
                    <p className="flex items-baseline gap-2 text-[0.92rem] font-semibold text-ink">
                      <span className="font-mono text-[0.68rem] font-normal text-ink-subtle">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {node.title}
                    </p>
                    {node.detail ? (
                      <p className="mt-1 text-[0.84rem] leading-snug text-ink-muted">
                        {node.detail}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <figcaption className="border-t border-line px-4 py-3 text-[0.85rem] leading-relaxed text-ink-muted sm:px-6">
        <span className="font-mono text-[0.7rem] tracking-wide text-ink-subtle uppercase">
          Diagram ·{' '}
        </span>
        {caption}
      </figcaption>
    </figure>
  );
}
