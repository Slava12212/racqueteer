import AboutSection from '@/components/AboutSection';
import type { WPAboutAttributes } from '@/types/wp-blocks';

export default function AboutBlock(attrs: WPAboutAttributes) {
  return (
    <AboutSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        stat1Number: attrs.stat1Number,
        stat1Label: attrs.stat1Label,
        stat2Number: attrs.stat2Number,
        stat2Label: attrs.stat2Label,
        leftImageUrl: attrs.leftImage,
        rightImageUrl: attrs.rightImage,
        mobileImageUrl: attrs.leftImage, // fallback
      }}
    />
  );
}

