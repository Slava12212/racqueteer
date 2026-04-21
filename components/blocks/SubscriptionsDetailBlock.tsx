import SubscriptionsSection from '@/components/membership/SubscriptionsSection';
import type { WPSubscriptionsDetailAttributes } from '@/types/wp-blocks';

export default function SubscriptionsDetailBlock(attrs: WPSubscriptionsDetailAttributes) {
  return (
    <SubscriptionsSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
      }}
    />
  );
}

