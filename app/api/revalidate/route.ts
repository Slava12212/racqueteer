/**
 * ISR Revalidation Webhook
 *
 * WordPress sends a POST to this endpoint whenever content is saved.
 * revalidateTag('wp-content') purges the fetch cache for all requests tagged 'wp-content'.
 * revalidatePath() purges the Full Route Cache for specific pages.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

// CPT → page slug mapping: which pages to revalidate for each CPT update
const CPT_SLUG_MAP: Record<string, string[]> = {
  '/careers':        ['/careers'],
  '/':               ['/'],
  '/memberships':    ['/memberships'],
  '/private-events': ['/private-events'],
  '/about':          ['/about'],
};

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug: string = body.slug || '/';

    const slugs = CPT_SLUG_MAP[slug] ?? [slug];
    // Invalidate the shared fetch-cache tag so all WP data is refreshed
    revalidateTag('wp-content');
    for (const s of slugs) {
      revalidatePath(s);
    }

    console.log(`[ISR] Revalidated: ${slugs.join(', ')}`);
    return Response.json({ revalidated: true, slugs });
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
