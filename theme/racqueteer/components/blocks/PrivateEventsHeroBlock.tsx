import HeroPrivateEvents from '@/components/private-events/HeroPrivateEvents';
import type { WPPrivateEventsHeroAttributes } from '@/types/wp-blocks';

function parseWhatIncludes(raw: unknown): Array<{ text: string; icon: string }> | undefined {
  if (!raw) return undefined;
  let arr: unknown[] = [];
  if (Array.isArray(raw)) {
    arr = raw;
  } else if (typeof raw === 'string') {
    try { const p = JSON.parse(raw); if (Array.isArray(p)) arr = p; } catch { /* ignore */ }
  }
  if (!arr.length) return undefined;
  return arr.map((item) => {
    const obj = item as Record<string, string>;
    return { text: obj?.text ?? '', icon: obj?.icon ?? 'box' };
  });
}

export default function PrivateEventsHeroBlock(attrs: WPPrivateEventsHeroAttributes) {
  return (
    <HeroPrivateEvents
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        ctaText: attrs.ctaText,
        ctaUrl: attrs.ctaUrl,
        videoUrl: attrs.videoUrl,
        whatIncludes: parseWhatIncludes(attrs.whatIncludes),
      }}
    />
  );
}
