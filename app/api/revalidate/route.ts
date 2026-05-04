/**
 * ISR Revalidation Webhook
 *
 * WordPress надсилає POST на цей endpoint при збереженні контенту.
 * revalidatePath() скидає Full Route Cache для сторінки.
 * Оскільки fetch у wp-api.ts використовує cache: 'no-store',
 * наступний рендер завжди отримує свіжі дані з WordPress.
 */

import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

// Для CPT — маппінг на сторінки, які треба оновити
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
    for (const s of slugs) {
      revalidatePath(s);
    }

    console.log(`[ISR] Revalidated: ${slugs.join(', ')}`);
    return Response.json({ revalidated: true, slugs });
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

