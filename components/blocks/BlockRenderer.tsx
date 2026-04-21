/**
 * BlockRenderer — Server Component
 *
 * Приймає масив блоків з WordPress і рендерить відповідні компоненти.
 * Кожен блок — тонка обгортка над існуючим компонентом без змін в оригіналах.
 */

import React from 'react';
import dynamic from 'next/dynamic';
import type { WPBlock } from '@/types/wp-blocks';

// eslint-disable-next-line
const BLOCK_MAP: Record<string, React.ComponentType<any>> = {
  // Home
  'acf/racqueteer-hero':           dynamic(() => import('./HeroBlock')),
  'acf/racqueteer-about':          dynamic(() => import('./AboutBlock')),
  'acf/racqueteer-locations':      dynamic(() => import('./LocationsBlock')),
  'acf/racqueteer-programs':       dynamic(() => import('./ProgramsBlock')),
  'acf/racqueteer-membership-cta': dynamic(() => import('./MembershipCtaBlock')),
  'acf/racqueteer-subscriptions':  dynamic(() => import('./SubscriptionsBlock')),
  'acf/racqueteer-testimonials':   dynamic(() => import('./TestimonialsBlock')),
  'acf/racqueteer-events':         dynamic(() => import('./EventsBlock')),

  // Memberships page
  'acf/racqueteer-membership-hero':      dynamic(() => import('./MembershipHeroBlock')),
  'acf/racqueteer-subscriptions-detail': dynamic(() => import('./SubscriptionsDetailBlock')),
  'acf/racqueteer-price-compare':        dynamic(() => import('./PriceCompareBlock')),

  // Private Events page
  'acf/racqueteer-private-events-hero': dynamic(() => import('./PrivateEventsHeroBlock')),
  'acf/racqueteer-gallery':             dynamic(() => import('./GalleryBlock')),
  'acf/racqueteer-logo-marquee':        dynamic(() => import('./LogoMarqueeBlock')),

  // About page
  'acf/racqueteer-about-hero': dynamic(() => import('./AboutHeroBlock')),
  'acf/racqueteer-mission':    dynamic(() => import('./MissionBlock')),
  'acf/racqueteer-contact':    dynamic(() => import('./ContactBlock')),

  // Careers page
  'acf/racqueteer-careers-hero':   dynamic(() => import('./CareersHeroBlock')),
  'acf/racqueteer-job-listings':   dynamic(() => import('./JobListingsBlock')),
  'acf/racqueteer-career-contact': dynamic(() => import('./CareerContactBlock')),
};

interface BlockRendererProps {
  blocks: WPBlock[];
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, i) => {
        const Component = BLOCK_MAP[block.name];
        if (!Component) {
          console.warn(`[BlockRenderer] Unknown block: ${block.name}`);
          return null;
        }
        return <Component key={i} {...(block.attributes as Record<string, unknown>)} />;
      })}
    </>
  );
}

