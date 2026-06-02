import HeroMembership from '@/components/membership/HeroMembership';
import type { WPMembershipHeroAttributes } from '@/types/wp-blocks';

export default function MembershipHeroBlock(attrs: WPMembershipHeroAttributes) {
  return (
    <HeroMembership
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        priceStarting: attrs.priceStarting,
        priceUnit: attrs.priceUnit,
        ctaText: attrs.ctaText ?? 'View plans',
        ctaUrl: attrs.ctaUrl ?? '#memberships-plans',
        videoUrl: attrs.videoUrl,
      }}
    />
  );
}

