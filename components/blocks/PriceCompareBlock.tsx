import PriceCompareSection from '@/components/membership/PriceCompareSection';
import { getPriceCompareData } from '@/lib/wp-api';

// PriceCompareSection will use WP data if available, otherwise falls back to hardcoded data
export default async function PriceCompareBlock() {
  const { features, plans } = await getPriceCompareData();
  return (
    <PriceCompareSection
      features={features.length > 0 ? features : undefined}
      plans={plans.length > 0 ? plans : undefined}
    />
  );
}

