import TestimonialsSection from '@/components/TestimonialsSection';
import { getTestimonials } from '@/lib/wp-api';
import type { WPTestimonialsAttributes } from '@/types/wp-blocks';

export default async function TestimonialsBlock(attrs: WPTestimonialsAttributes) {
  const testimonials = await getTestimonials();
  return (
    <TestimonialsSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
      }}
      testimonials={testimonials.length > 0 ? testimonials : undefined}
    />
  );
}

