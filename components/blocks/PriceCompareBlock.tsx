import PriceCompareSection from '@/components/membership/PriceCompareSection';

// PriceCompareSection has no props — data is fetched internally
// When WordPress integration is complete, refactor to accept content props
export default function PriceCompareBlock() {
  return <PriceCompareSection />;
}

