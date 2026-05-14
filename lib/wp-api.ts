/**
 * WordPress GraphQL API client — primary data layer (replaces lib/api.ts)
 *
 * Fetches all content from WordPress via WPGraphQL.
 * lib/api.ts remains as the hardcoded fallback when WordPress is unavailable.
 *
 * Integration: imports in page.tsx already point to "@/lib/wp-api".
 * Switch back to "@/lib/api" only if WordPress is temporarily unreachable.
 */

import {
  GET_PAGE_BY_SLUG,
  GET_JOBS,
  GET_MEMBERSHIP_PLANS,
  GET_TESTIMONIALS,
  GET_AMENITIES,
  GET_LOCATIONS,
  GET_PROGRAMS,
  GET_PRICE_COMPARE,
  GET_SITE_OPTIONS,
} from './graphql/queries';

import { unstable_cache } from 'next/cache';

import type {
  Job,
  MembershipPlan,
  Testimonial,
  Location,
  Program,
  PriceCompareFeature,
  WPNavbarOptions,
  WPFooterOptions,
  WPBookModalOptions,
} from '@/types';

import type { WPBlock } from '@/types/wp-blocks';

// ========================================
// GraphQL client
// ========================================

async function wpGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const url = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;
  if (!url) throw new Error('NEXT_PUBLIC_WP_GRAPHQL_URL is not defined');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    // Use ISR revalidation so pages can be statically pre-rendered at build time.
    // On-demand cache purging is handled via revalidatePath() / revalidateTag() in the
    // /api/revalidate route, which calls revalidateTag('wp-content').
    next: { revalidate: 60, tags: ['wp-content'] },
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    console.error('WPGraphQL errors:', json.errors);
    throw new Error(json.errors[0]?.message ?? 'WPGraphQL error');
  }

  return json.data as T;
}

// ========================================
// PAGE BLOCKS — for BlockRenderer
// ========================================

/**
 * Raw block shape returned by WPGraphQL Content Blocks.
 * With the flat schema, ACF fields live directly on the block object
 * (e.g. raw.racqueteerHero.title), not under an attributes wrapper.
 */
interface RawBlock {
  __typename: string;
  // Flat schema (new): ACF field group objects are top-level keys
  [key: string]: unknown;
}

// Standard Block interface fields that are NOT ACF data
const BLOCK_INTERFACE_FIELDS = new Set(['__typename', 'id', 'type', 'tagName', 'innerHtml', 'attributes', 'connections']);

/**
 * Flatten block attributes — new flat schema puts ACF data directly on the block.
 * E.g. { __typename: "AcfRacqueteerHeroBlock", racqueteerHero: { title, ... } }
 * Returns the first field-group object found on the raw block.
 *
 * Falls back to legacy nested structure (raw.attributes.racqueteerHero) for
 * backwards compatibility.
 */
function flattenBlockAttributes(raw: RawBlock): Record<string, unknown> {
  // New flat schema: look for the first non-standard field that is an object
  const acfKey = Object.keys(raw).find(
    (k) => !BLOCK_INTERFACE_FIELDS.has(k) && raw[k] !== null && typeof raw[k] === 'object'
  );
  if (acfKey && raw[acfKey]) {
    return raw[acfKey] as Record<string, unknown>;
  }

  // Legacy nested schema fallback (attributes.racqueteerHero)
  const attrs = raw.attributes as Record<string, unknown> | null | undefined;
  if (attrs && typeof attrs === 'object') {
    const nestedKey = Object.keys(attrs).find(
      (k) => k !== '__typename' && attrs[k] !== null && typeof attrs[k] === 'object'
    );
    if (nestedKey && attrs[nestedKey]) {
      return attrs[nestedKey] as Record<string, unknown>;
    }
    return attrs as Record<string, unknown>;
  }

  return {};
}

/**
 * Convert __typename (e.g. "AcfRacqueteerHeroBlock") to BLOCK_MAP key
 * (e.g. "AcfRacqueteerHeroBlock") — BlockRenderer now uses __typename keys directly.
 */
function rawBlockToWPBlock(raw: RawBlock): WPBlock {
  return {
    name: raw.__typename, // BlockRenderer uses __typename as the key
    attributes: flattenBlockAttributes(raw),
  };
}

/**
 * Fetch page blocks by slug (e.g. '/', '/memberships')
 */
export async function getPageBlocks(slug: string): Promise<WPBlock[]> {
  try {
    const data = await wpGraphQL<{ pageBy: { blocks: RawBlock[] } | null }>(
      GET_PAGE_BY_SLUG,
      { slug }
    );
    return (data.pageBy?.blocks ?? []).map(rawBlockToWPBlock);
  } catch (err) {
    console.error(`getPageBlocks("${slug}") failed:`, err);
    return [];
  }
}

// ========================================
// PAGE BY SLUG — for dynamic [slug] route (Phase 7)
// ========================================

export interface WPPageData {
  title: string;
  status: string;
  seoDescription: string;
  blocks: WPBlock[];
}

/**
 * Fetch a page by slug with its status and blocks.
 * Draft or missing → returns null.
 */
export async function getPageBySlug(slug: string): Promise<WPPageData | null> {
  try {
    const data = await wpGraphQL<{
      pageBy: {
        title: string;
        status: string;
        blocks: RawBlock[];
      } | null;
    }>(GET_PAGE_BY_SLUG, { slug });

    const page = data.pageBy;
    if (!page) return null;

    return {
      title: page.title,
      status: page.status,
      seoDescription: '',
      blocks: (page.blocks ?? []).map(rawBlockToWPBlock),
    };
  } catch (err) {
    console.error(`getPageBySlug("${slug}") failed:`, err);
    return null;
  }
}

/**
 * Fetch all published page slugs (for generateStaticParams in [slug]/page.tsx).
 * Uses WP REST API (not GraphQL) — simpler and more reliable for slug enumeration.
 */
export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const url = process.env.NEXT_PUBLIC_WP_REST_URL;
    if (!url) return [];

    const res = await fetch(
      `${url}/wp/v2/pages?status=publish&per_page=100&_fields=slug`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];

    const pages: Array<{ slug: string }> = await res.json();
    // Exclude slugs that already have static routes in Next.js
    const staticSlugs = new Set(['', 'memberships', 'private-events', 'about', 'careers', 'home', 'sample-page']);
    return pages
      .map((p) => p.slug)
      .filter((s) => !staticSlugs.has(s));
  } catch (err) {
    console.error('getAllPageSlugs() failed:', err);
    return [];
  }
}

// ========================================
// JOBS
// ========================================

export async function getJobs(): Promise<Job[]> {
  try {
    const data = await wpGraphQL<{
      jobs: { nodes: Array<{ databaseId: number; title: string; jobFields: { description: string; category: string }; date: string }> };
    }>(GET_JOBS);

    return data.jobs.nodes.map((node) => ({
      id: node.databaseId,
      title: node.title,
      description: node.jobFields?.description ?? '',
      category: node.jobFields?.category ?? '',
      date: new Date(node.date).toLocaleDateString('en-AU', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }));
  } catch (err) {
    console.error('getJobs() failed, falling back to hardcoded data:', err);
    const { getJobs: getFallback } = await import('./api');
    return getFallback();
  }
}

// ========================================
// MEMBERSHIP PLANS
// ========================================

export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  try {
    const data = await wpGraphQL<{
      memberships: {
        nodes: Array<{
          title: string;
          acf: {
            price: string;
            description: string;
            buttonVariant: string | string[];
            bgClass: string;
            borderClass: string;
            hasImage: boolean;
            values: string | string[];
            ctaText?: string | null;
            ctaUrl?: string | null;
          };
        }>;
      };
    }>(GET_MEMBERSHIP_PLANS);

    return data.memberships.nodes.map((node) => {
      const acf = node.acf ?? {};
      // buttonVariant: WP returns ["red"] array — take first element
      const buttonVariant = Array.isArray(acf.buttonVariant)
        ? (acf.buttonVariant[0] as 'blue' | 'red') ?? 'blue'
        : (acf.buttonVariant as 'blue' | 'red') ?? 'blue';
      // values: WP returns "check,check,cross" string — split to array
      const values = Array.isArray(acf.values)
        ? acf.values
        : (acf.values ?? '').split(',').map((v: string) => v.trim());
      return {
        name: node.title,
        price: acf.price ?? '',
        description: acf.description ?? '',
        buttonVariant,
        bgClass: acf.bgClass ?? 'bg-white',
        borderClass: acf.borderClass ?? 'border-[#E5E7EB]',
        hasImage: acf.hasImage ?? false,
        values,
        ctaText: acf.ctaText ?? 'JOIN NOW',
        ctaUrl: acf.ctaUrl ?? '#',
      };
    });
  } catch (err) {
    console.error('getMembershipPlans() failed, falling back to hardcoded data:', err);
    const { getMembershipPlans: getFallback } = await import('./api');
    return getFallback();
  }
}

// ========================================
// TESTIMONIALS
// ========================================

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await wpGraphQL<{
      testimonials: { nodes: Array<{
        databaseId: number;
        testimonialFields: {
          category: string;
          rating: number;
          maxRating: number;
          quote: string;
          authorName: string;
          authorSubtitle: string;
        };
      }> };
    }>(GET_TESTIMONIALS);

    return data.testimonials.nodes.map((node) => ({
      id: node.databaseId,
      category:       node.testimonialFields?.category       ?? '',
      rating:         node.testimonialFields?.rating         ?? 0,
      maxRating:      node.testimonialFields?.maxRating      ?? 5,
      quote:          node.testimonialFields?.quote          ?? '',
      authorName:     node.testimonialFields?.authorName     ?? '',
      authorSubtitle: node.testimonialFields?.authorSubtitle ?? '',
    }));
  } catch (err) {
    console.error('getTestimonials() failed, falling back to hardcoded data:', err);
    const { getTestimonials: getFallback } = await import('./api');
    return getFallback();
  }
}

// ========================================
// LOCATIONS
// ========================================

export async function getLocations(): Promise<Location[]> {
  try {
    const data = await wpGraphQL<{
      locations: {
        nodes: Array<{
          databaseId: number;
          locationStatus?: string | null;
          locationAmenities?: Array<{ icon?: string; label?: string }> | null;
          locationFields: {
            locationId: string;
            name: string;
            address: string;
            description: string;
            image: { node: { sourceUrl: string } };
          };
        }>;
      };
    }>(GET_LOCATIONS);

    return data.locations.nodes.map((node) => {
      const lf = node.locationFields ?? {};

      // locationStatus comes from Location.locationStatus (manual resolver, v24).
      // Resolver already normalises to lowercase 'available' | 'coming_soon'.
      const rawSt = node.locationStatus ?? '';
      const status: 'available' | 'coming_soon' =
        rawSt === 'coming_soon' ? 'coming_soon' : 'available';

      // Map amenities from WP repeater rows to LocationAmenity objects.
      // The icon SVG is resolved by the component via LOCATION_ICON_MAP.
      const amenities = Array.isArray(node.locationAmenities)
        ? node.locationAmenities
            .filter((a) => a && a.label)
            .map((a) => ({
              label: a.label ?? '',
              iconName: Array.isArray(a.icon) ? (a.icon[0] ?? '') : (a.icon ?? ''),
            }))
        : [];

      return {
        id:          lf.locationId ?? String(node.databaseId),
        name:        lf.name        ?? '',
        status,
        address:     (lf.address ?? '').split('\n').filter(Boolean),
        description: lf.description ?? '',
        amenities,   // icons are resolved in LocationsSection via LOCATION_ICON_MAP
        image:       lf.image?.node?.sourceUrl ?? '',
      };
    });
  } catch (err) {
    console.error('getLocations() failed, falling back to hardcoded data:', err);
    const { getLocations: getFallback } = await import('./api');
    return getFallback();
  }
}

// ========================================
// AMENITIES (standalone CPT)
// ========================================

export interface WPCptAmenity {
  id: number;
  title: string;
  number: string;
  imageLayout: 'single' | 'split';
  images: string[]; // always [] from query; resolved via fallback in AmenitiesBlock
  feature1Icon: string;
  feature1Text: string;
  feature2Icon: string;
  feature2Text: string;
}

export async function getAmenities(): Promise<WPCptAmenity[]> {
  try {
    const data = await wpGraphQL<{
      amenities: {
        nodes: Array<{
          databaseId: number;
          title: string;
          amenityFields: {
            number: string | null;
            imageLayout: string | null;
            images: Array<{ sourceUrl: string }> | null;
            feature1Icon: string | null;
            feature1Text: string | null;
            feature2Icon: string | null;
            feature2Text: string | null;
          } | null;
        }>;
      };
    }>(GET_AMENITIES);

    return data.amenities.nodes.map((node, index) => {
      const af = node.amenityFields;
      const wpImages = (af?.images ?? [])
        .map(img => img?.sourceUrl)
        .filter((url): url is string => !!url);
      return {
        id:           node.databaseId,
        title:        node.title,
        number:       af?.number ?? String(index + 1).padStart(2, '0'),
        imageLayout:  (af?.imageLayout === 'split' ? 'split' : 'single') as 'single' | 'split',
        images:       wpImages, // real WP gallery images (empty array when not uploaded)
        feature1Icon: af?.feature1Icon ?? '',
        feature1Text: af?.feature1Text ?? '',
        feature2Icon: af?.feature2Icon ?? '',
        feature2Text: af?.feature2Text ?? '',
      };
    });
  } catch (err) {
    console.error('getAmenities() failed:', err);
    return [];
  }
}

// ========================================
// PROGRAMS
// ========================================

export async function getPrograms(): Promise<Program[]> {
  try {
    const data = await wpGraphQL<{
      programs: { nodes: Array<{ color?: unknown; programFields: Record<string, unknown> }> };
    }>(GET_PROGRAMS);

    return data.programs.nodes
      .map((node) => {
        const f = node.programFields;
        if (!f) return null;
        // `color` is queried at the Program node level (not inside programFields)
        // because the ProgramFields ACF wrapper doesn't pass databaseId to the resolver.
        // The Program-level resolver correctly receives the post object.
        const rawColor = Array.isArray(node.color) ? node.color[0] : node.color;
        const color: 'red' | 'blue' = rawColor === 'red' ? 'red' : 'blue';
        return {
          title:       (f.title       as string) ?? '',
          color,
          price:       (f.price       as string) ?? '',
          unit:        (f.unit        as string) ?? '',
          description: (f.description as string) ?? '',
        } as Program;
      })
      .filter(Boolean) as Program[];
  } catch (err) {
    console.error('getPrograms() failed, falling back to hardcoded data:', err);
    const { getPrograms: getFallback } = await import('./api');
    return getFallback();
  }
}

// ========================================
// PRICE COMPARE
// ========================================

export async function getPriceCompareData(): Promise<{
  features: PriceCompareFeature[];
  plans: MembershipPlan[];
}> {
  try {
    const [featuresData, plans] = await Promise.all([
      wpGraphQL<{
        priceCompare: { nodes: Array<{ acf: { features: PriceCompareFeature[] } }> };
      }>(GET_PRICE_COMPARE),
      getMembershipPlans(),
    ]);

    const features = featuresData.priceCompare.nodes[0]?.acf.features ?? [];
    return { features, plans };
  } catch (err) {
    console.error('getPriceCompareData() failed, falling back to hardcoded data:', err);
    const { getPriceCompareData: getFallback } = await import('./api');
    return getFallback();
  }
}

// ========================================
// SITE OPTIONS — Navbar + Footer (Phase 8)
// ========================================

const _fetchSiteOptions = async () => {
  try {
    const data = await wpGraphQL<{
      acfOptionsNavbar?: { navbar?: WPNavbarOptions | null } | null;
      acfOptionsFooter?: { footer?: WPFooterOptions | null } | null;
      acfOptionsBookModal?: { bookModal?: WPBookModalOptions | null } | null;
    }>(GET_SITE_OPTIONS);

    return {
      navbar:    data?.acfOptionsNavbar?.navbar       ?? null,
      footer:    data?.acfOptionsFooter?.footer       ?? null,
      bookModal: data?.acfOptionsBookModal?.bookModal ?? null,
    };
  } catch (err) {
    console.error('getSiteOptions() failed, using hardcoded fallback:', err);
    return { navbar: null, footer: null, bookModal: null };
  }
};

export const getSiteOptions = unstable_cache(
  _fetchSiteOptions,
  ['site-options'],
  { revalidate: 3600, tags: ['wp-content'] }
);
