import CareerContactSection from '@/components/careers/CareerContactSection';
import type { WPCareerContactAttributes } from '@/types/wp-blocks';

export default function CareerContactBlock(attrs: WPCareerContactAttributes) {
  return (
    <CareerContactSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        email: attrs.email,
        emailIcon: attrs.emailIcon,
        phone: attrs.phone,
        phoneIcon: attrs.phoneIcon,
        ctaText: attrs.ctaText,
        ctaUrl: attrs.ctaUrl,
        imageUrl: attrs.image,
      }}
    />
  );
}

