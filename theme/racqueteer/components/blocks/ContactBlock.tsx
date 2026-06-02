import ContactSection from '@/components/about/ContactSection';
import type { WPContactAttributes } from '@/types/wp-blocks';

export default function ContactBlock(attrs: WPContactAttributes) {
  return (
    <ContactSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
        emailLabel: 'Email us',
        email: attrs.email,
        phoneLabel: 'Call us',
        phone: attrs.phone,
        ctaText: attrs.ctaText,
        ctaUrl: attrs.ctaUrl,
      }}
    />
  );
}

