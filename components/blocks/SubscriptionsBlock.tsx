import HomeSubscriptionsSection from '@/components/HomeSubscriptionsSection';
import type { WPSubscriptionsAttributes } from '@/types/wp-blocks';

export default function SubscriptionsBlock(attrs: WPSubscriptionsAttributes) {
  return (
    <HomeSubscriptionsSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
      }}
    />
  );
}

