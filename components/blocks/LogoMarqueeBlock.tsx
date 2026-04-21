import LogoSection from '@/components/private-events/LogoSection';
import type { WPLogoMarqueeAttributes } from '@/types/wp-blocks';

export default function LogoMarqueeBlock(attrs: WPLogoMarqueeAttributes) {
  return (
    <LogoSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: '',
        logos: (attrs.logos ?? []).map((l) => l.sourceUrl),
      }}
    />
  );
}

