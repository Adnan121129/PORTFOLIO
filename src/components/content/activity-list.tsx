import { activities, activityGroupLabels } from '@/content/profile';
import { cn } from '@/lib/utils';
import { Reveal } from '../ui/primitives';

/**
 * Experience & activities, shared by the home page and the About page.
 * On small screens the organisation drops onto its own line instead of wrapping mid-name.
 */
export function ActivityList({ className }: { className?: string }) {
  return (
    <ol className={cn('border-t border-line', className)}>
      {activities.map((activity) => (
        <Reveal
          as="li"
          key={activity.id}
          className="grid gap-3 border-b border-line py-7 md:grid-cols-12 md:gap-6"
        >
          <p className="eyebrow md:col-span-3 md:pt-1.5">{activityGroupLabels[activity.group]}</p>
          <div className="md:col-span-9">
            <h3 className="text-[1.15rem] font-semibold text-ink">
              {activity.role}
              <span className="sr-only">, </span>
              <span aria-hidden="true" className="hidden font-normal text-ink-subtle sm:inline">
                {' · '}
              </span>
              <span className="mt-0.5 block font-normal text-ink-muted sm:mt-0 sm:inline">
                {activity.organisation}
                {activity.period ? (
                  <span className="ml-2 font-mono text-[0.78rem] tracking-wide whitespace-nowrap text-ink-subtle">
                    {activity.period}
                  </span>
                ) : null}
              </span>
            </h3>
            <ul className="mt-2 space-y-1.5">
              {activity.points.map((point) => (
                <li
                  key={point}
                  className="max-w-[75ch] text-[0.97rem] leading-relaxed text-ink-muted"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
