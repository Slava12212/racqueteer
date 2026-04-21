import MembershipSection from '@/components/MembershipSection';
import type { WPMembershipCtaAttributes } from '@/types/wp-blocks';

export default function MembershipCtaBlock(attrs: WPMembershipCtaAttributes) {
  return (
    <MembershipSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        ctaText: attrs.ctaText,
        ctaUrl: attrs.ctaUrl,
        backgroundImageUrl: attrs.bgImage,
      }}
    />
  );
}

