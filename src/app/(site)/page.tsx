import { Hero } from '@/components/home/hero';
import {
  CapabilitiesSection,
  ContactCta,
  ExperienceSection,
  ResearchSection,
  SelectedProjectsSection,
} from '@/components/home/home-sections';
import { LatestWritingSection } from '@/components/home/latest-writing';
import { JsonLd } from '@/components/ui/json-ld';
import { site } from '@/content/site';
import { pageMetadata, personJsonLd, websiteJsonLd } from '@/lib/seo';

export const metadata = pageMetadata({
  title: site.title,
  description: site.description,
  path: '/',
  type: 'profile',
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
      <Hero />
      <SelectedProjectsSection />
      <ResearchSection />
      <CapabilitiesSection />
      <ExperienceSection />
      <LatestWritingSection />
      <ContactCta />
    </>
  );
}
