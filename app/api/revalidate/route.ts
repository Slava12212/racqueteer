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

import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const slug: string = body.slug || '/';

    revalidatePath(slug);

    console.log(`[ISR] Revalidated: ${slug}`);
    return Response.json({ revalidated: true, slug });
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

