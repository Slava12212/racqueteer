/**
 * Dynamic page route — Phase 7
 *
 * Будь-яка нова сторінка в WordPress автоматично з'являється на сайті.
 * Переведення у Draft → 404.
 * Статичні маршрути (/memberships, /about тощо) мають пріоритет над [slug].
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPageBySlug, getAllPageSlugs } from "@/lib/wp-api";

// Нові WP сторінки генеруються "на льоту" (ISR), не тільки при білді
export const dynamicParams = true;
export const revalidate = 3600;

// Генерує статичні сторінки при білді для вже існуючих WP сторінок
export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Metadata з WordPress SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};
  return {
    title: `${page.title} — Racqueteer`,
    description: page.seoDescription || undefined,
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  // Draft, трашнуто або не існує → 404
  if (!page || page.status !== "publish") {
    notFound();
  }

  return (
    <div className="overflow-x-hidden">
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}

