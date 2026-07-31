import LogoSection from '@/components/private-events/LogoSection';
import type { WPLogoMarqueeAttributes } from '@/types/wp-blocks';

/** Parse logos: may be JSON string, array of objects with sourceUrl, or array of strings */
function parseLogos(raw: unknown): string[] {
  let arr: unknown[] = [];
  if (Array.isArray(raw)) {
    arr = raw;
  } else if (typeof raw === 'string') {
    try { const p = JSON.parse(raw); if (Array.isArray(p)) arr = p; } catch { /* ignore */ }
  }
  return arr.map((item) =>
    typeof item === 'string' ? item : (item as Record<string, string>)?.url ?? (item as Record<string, string>)?.sourceUrl ?? ''
  ).filter(Boolean);
}

export default function LogoMarqueeBlock(attrs: WPLogoMarqueeAttributes) {
  return (
    <LogoSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: '',
        logos: parseLogos(attrs.logos),
      }}
    />
  );
}

