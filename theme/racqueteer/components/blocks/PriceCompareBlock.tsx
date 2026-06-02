import PriceCompareSection from '@/components/membership/PriceCompareSection';
import { getPriceCompareData } from '@/lib/wp-api';
import type { WPPriceCompareAttributes } from '@/types/wp-blocks';

export default async function PriceCompareBlock(attrs: WPPriceCompareAttributes) {
  const { features, plans } = await getPriceCompareData();
  return (
    <PriceCompareSection
      features={features.length > 0 ? features : undefined}
      plans={plans.length > 0 ? plans : undefined}
      ctaText={attrs.ctaText || undefined}
      ctaUrl={attrs.ctaUrl || undefined}
    />
  );
}

