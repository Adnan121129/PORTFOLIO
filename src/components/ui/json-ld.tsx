import { serializeJsonLd, type JsonLdObject } from '@/lib/seo';

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      // Safe: values are serialised with "<" escaped (see serializeJsonLd).
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
