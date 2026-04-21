import TestimonialsSection from '@/components/TestimonialsSection';
import type { WPTestimonialsAttributes } from '@/types/wp-blocks';

export default function TestimonialsBlock(attrs: WPTestimonialsAttributes) {
  return (
    <TestimonialsSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
      }}
    />
  );
}

