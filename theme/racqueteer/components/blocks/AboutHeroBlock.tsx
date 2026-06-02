import HeroAbout from '@/components/about/HeroAbout';
import type { WPAboutHeroAttributes } from '@/types/wp-blocks';

export default function AboutHeroBlock(attrs: WPAboutHeroAttributes) {
  return (
    <HeroAbout
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        videoUrl: attrs.videoUrl,
      }}
    />
  );
}

