import SubscriptionsSection from '@/components/membership/SubscriptionsSection';
import { getMembershipPlans } from '@/lib/wp-api';
import type { WPSubscriptionsDetailAttributes } from '@/types/wp-blocks';

export default async function SubscriptionsDetailBlock(attrs: WPSubscriptionsDetailAttributes) {
  const plans = await getMembershipPlans();
  return (
    <SubscriptionsSection
      content={{
        label: attrs.label,
        title: attrs.title,
        description: attrs.description,
      }}
      plans={plans.length > 0 ? plans : undefined}
    />
  );
}

