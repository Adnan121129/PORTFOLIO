import { site } from '@/content/site';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = `${site.name} — MIS, Business Intelligence & Full-Stack Engineering`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: site.label,
    title: 'I turn data into decisions—and build the systems behind them.',
    subtitle: site.name,
    showAvatar: true,
  });
}
