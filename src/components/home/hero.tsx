import Image from 'next/image';
import portrait from '@/assets/muhammad-adnan.jpg';
import { site } from '@/content/site';
import { ContactActions } from '../contact/contact-actions';
import { DecisionPipeline } from './decision-pipeline';

function CornerTicks() {
  const tick = 'absolute size-3 border-ink-subtle/60';
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -inset-2.5">
      <span className={`${tick} top-0 left-0 border-t border-l`} />
      <span className={`${tick} top-0 right-0 border-t border-r`} />
      <span className={`${tick} bottom-0 left-0 border-b border-l`} />
      <span className={`${tick} right-0 bottom-0 border-r border-b`} />
    </span>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="bg-grid mask-fade pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] size-[38rem] rounded-full bg-accent-soft blur-3xl"
      />

      <div className="container-page relative">
        <div className="grid gap-12 pt-10 pb-14 md:grid-cols-12 md:gap-10 md:pt-14 lg:pt-14 lg:pb-16">
          <div className="md:col-span-7 lg:col-span-8">
            <p className="flex items-center gap-3">
              <Image
                src="/images/muhammad-adnan-avatar.jpg"
                alt=""
                width={40}
                height={40}
                sizes="40px"
                className="size-10 rounded-full border border-line object-cover md:hidden"
              />
              <span className="eyebrow flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="hidden h-px w-8 bg-line-strong md:inline-block"
                />
                {site.label}
              </span>
            </p>

            <h1 id="hero-title" className="mt-6 font-serif text-hero text-ink">
              <span className="block">{site.firstName}</span>
              <span className="block pl-[0.06em] italic">
                {site.lastName}
                <span className="text-accent not-italic">.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-[24ch] text-[clamp(1.5rem,2.7vw,2.2rem)] leading-[1.15] font-medium tracking-tight text-ink">
              I turn data into{' '}
              <em className="font-serif text-[1.12em] font-normal text-accent">decisions</em>—and
              build the systems behind them.
            </p>

            <p className="mt-5 max-w-[62ch] text-lead text-ink-muted">{site.intro}</p>

            <ContactActions className="mt-8" layout="grid" />
          </div>

          <div className="hidden md:col-span-5 md:block lg:col-span-4">
            <figure className="relative md:mt-20 lg:mt-12">
              <div className="relative">
                <CornerTicks />
                <div className="overflow-hidden rounded-2xl border border-line bg-surface-2">
                  <Image
                    src={portrait}
                    alt="Portrait of Muhammad Adnan wearing glasses and a brown pinstripe blazer over a white shirt"
                    preload
                    placeholder="blur"
                    quality={85}
                    sizes="(min-width: 1240px) 380px, (min-width: 1024px) 30vw, (min-width: 768px) 38vw, 1px"
                    className="aspect-[4/5] h-auto w-full object-cover object-[50%_22%]"
                  />
                </div>
              </div>
              <figcaption className="mt-5 flex items-start justify-between gap-4 font-mono text-[0.7rem] tracking-[0.12em] text-ink-subtle uppercase">
                <span>Fig. 01 — {site.name}</span>
                <span className="text-right">BSc CSE · UIU</span>
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="border-t border-line py-10 lg:py-12">
          <DecisionPipeline />
        </div>
      </div>
    </section>
  );
}
