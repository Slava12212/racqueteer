/**
 * WordPress GraphQL API client — нова версія api.ts
 *
 * Використовується для отримання даних з WordPress через WPGraphQL.
 * lib/api.ts залишається як fallback з hardcoded даними.
 *
 * Підключення: замінити імпорти в page.tsx з "@/lib/api" на "@/lib/wp-api"
 * після того як WordPress буде повністю налаштований.
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

import type {
  Job,
  MembershipPlan,
  Testimonial,
  Location,
  Program,
  PriceCompareFeature,
  WPNavbarOptions,
  WPFooterOptions,
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
    next: { revalidate: 3600 },
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
// PAGE BLOCKS — для BlockRenderer
// ========================================

/**
 * Отримати блоки сторінки за slug (наприклад: '/', '/memberships')
 */
export async function getPageBlocks(slug: string): Promise<WPBlock[]> {
  try {
    const data = await wpGraphQL<{ pageBy: { blocks: WPBlock[] } | null }>(
      GET_PAGE_BY_SLUG,
      { slug }
    );
    return data.pageBy?.blocks ?? [];
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
 * Отримати сторінку за slug з її статусом і блоками.
 * Draft або відсутня → повертає null.
 */
export async function getPageBySlug(slug: string): Promise<WPPageData | null> {
  try {
    const data = await wpGraphQL<{
      pageBy: {
        title: string;
        status: string;
        seo?: { metaDesc?: string };
        blocks: WPBlock[];
      } | null;
    }>(GET_PAGE_BY_SLUG, { slug });

    const page = data.pageBy;
    if (!page) return null;

    return {
      title: page.title,
      status: page.status,
      seoDescription: page.seo?.metaDesc ?? '',
      blocks: page.blocks ?? [],
    };
  } catch (err) {
    console.error(`getPageBySlug("${slug}") failed:`, err);
    return null;
  }
}

/**
 * Отримати всі опубліковані slugs (для generateStaticParams у [slug]/page.tsx).
 * Використовує WP REST API (не GraphQL) — простіше і надійніше.
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
    // Виключити slugи, які вже мають статичні маршрути в Next.js
    const staticSlugs = new Set(['', 'memberships', 'private-events', 'about', 'careers']);
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
      jobs: { nodes: Array<{ databaseId: number; title: string; acf: { description: string; category: string }; date: string }> };
    }>(GET_JOBS);

    return data.jobs.nodes.map((node) => ({
      id: node.databaseId,
      title: node.title,
      description: node.acf.description,
      category: node.acf.category,
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
      memberships: { nodes: Array<{ title: string; acf: Omit<MembershipPlan, 'name'> }> };
    }>(GET_MEMBERSHIP_PLANS);

    return data.memberships.nodes.map((node) => ({
      name: node.title,
      ...node.acf,
    }));
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
      testimonials: { nodes: Array<{ databaseId: number; acf: Omit<Testimonial, 'id'> }> };
    }>(GET_TESTIMONIALS);

    return data.testimonials.nodes.map((node) => ({
      id: node.databaseId,
      ...node.acf,
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
          acf: {
            locationId: string;
            name: string;
            status: 'available' | 'coming_soon';
            address: string[];
            description: string;
            image: { sourceUrl: string };
          };
        }>;
      };
    }>(GET_LOCATIONS);

    return data.locations.nodes.map((node) => ({
      id: node.acf.locationId,
      name: node.acf.name,
      status: node.acf.status,
      address: node.acf.address,
      description: node.acf.description,
      amenities: [], // іконки додаються в компоненті
      image: node.acf.image?.sourceUrl ?? '',
    }));
  } catch (err) {
    console.error('getLocations() failed, falling back to hardcoded data:', err);
    const { getLocations: getFallback } = await import('./api');
    return getFallback();
  }
}

// ========================================
// PROGRAMS
// ========================================

export async function getPrograms(): Promise<Program[]> {
  try {
    const data = await wpGraphQL<{
      programs: { nodes: Array<{ acf: Program }> };
    }>(GET_PROGRAMS);

    return data.programs.nodes.map((node) => node.acf);
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

export async function getSiteOptions(): Promise<{ navbar: WPNavbarOptions | null; footer: WPFooterOptions | null }> {
  try {
    const data = await wpGraphQL<{
      acfOptionsNavbar?: { navbar?: WPNavbarOptions | null } | null;
      acfOptionsFooter?: { footer?: WPFooterOptions | null } | null;
    }>(GET_SITE_OPTIONS);

    return {
      navbar: data?.acfOptionsNavbar?.navbar ?? null,
      footer: data?.acfOptionsFooter?.footer ?? null,
    };
  } catch (err) {
    console.error('getSiteOptions() failed, using hardcoded fallback:', err);
    return { navbar: null, footer: null };
  }
}
