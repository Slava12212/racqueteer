/**
 * ISR Revalidation Webhook
 *
 * WordPress (WP Webhooks plugin) викликає цей ендпоінт при збереженні сторінки.
 * Це змушує Next.js оновити кеш для відповідного slug.
 *
 * Налаштування в WP Webhooks:
 *   Trigger: post_updated
 *   URL: https://racqueteer.com/api/revalidate?secret=YOUR_SECRET
 *   Body: { "slug": "/memberships" }
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

// Map slugs → fetch tags that need to be invalidated
const SLUG_TAGS: Record<string, string[]> = {
  '/':              ['locations', 'testimonials', 'programs', 'page-blocks', 'page-blocks--'],
  '/careers':       ['jobs', 'page-blocks', 'page-blocks--careers'],
  '/memberships':   ['membership-plans', 'page-blocks', 'page-blocks--memberships'],
  '/private-events':['page-blocks', 'page-blocks--private-events'],
  '/about':         ['page-blocks', 'page-blocks--about'],
};

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug: string = body.slug || '/';

    // Revalidate the full route cache
    revalidatePath(slug);

    // Also revalidate the fetch-level data cache tags for this slug
    const tags = SLUG_TAGS[slug] ?? ['page-blocks'];
    for (const tag of tags) {
      revalidateTag(tag);
    }

    console.log(`[ISR] Revalidated: ${slug}, tags: ${tags.join(', ')}`);
    return Response.json({ revalidated: true, slug, tags });
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

