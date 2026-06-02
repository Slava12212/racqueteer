// WordPress Block Types for BlockRenderer

export interface WPBlock {
  name: string;
  attributes: Record<string, unknown>;
}

// ========================================
// Block Attributes per block type
// ========================================

export interface WPHeroAttributes {
  title: string;
  description: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText: string;
  ctaSecondaryUrl: string;
  videoUrl: string;
}

export interface WPAboutAttributes {
  label: string;
  title: string;
  description: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  leftImage: string;
  rightImage: string;
}

export interface WPLocationsAttributes {
  label: string;
  title: string;
  description: string;
}

export interface WPAmenitiesAttributes {
  label: string;
  title: string;
}

export interface WPProgramsAttributes {
  label: string;
  title: string;
  description: string;
  tabs: unknown; // JSON string or string[] from WP
}

export interface WPMembershipCtaAttributes {
  label: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  bgImage: string;
}

export interface WPSubscriptionsAttributes {
  label: string;
  title: string;
  description: string;
}

export interface WPTestimonialsAttributes {
  label: string;
  title: string;
  description: string;
}

export interface WPEventsAttributes {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  image: string;
  /** JSON-encoded array of {text: string; icon: string} from what_includes repeater */
  whatIncludes?: unknown;
}

export interface WPMembershipHeroAttributes {
  label: string;
  title: string;
  description: string;
  priceStarting: string;
  priceUnit: string;
  ctaText?: string;
  ctaUrl?: string;
  videoUrl: string;
}

export interface WPSubscriptionsDetailAttributes {
  label: string;
  title: string;
  description: string;
}

export interface WPPriceCompareAttributes {
  label: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface WPPrivateEventsHeroAttributes {
  label: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  videoUrl: string;
  /** JSON-encoded array of {text: string; icon: string} from the what_includes repeater */
  whatIncludes?: unknown;
}

export interface WPGalleryAttributes {
  label: string;
  title: string;
  description: string;
  images: unknown; // JSON string or Array<{sourceUrl:string}|string> from WP
}

export interface WPLogoMarqueeAttributes {
  label: string;
  title: string;
  logos: unknown; // JSON string or Array<{sourceUrl:string}|string> from WP
}

export interface WPAboutHeroAttributes {
  label: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface WPMissionAttributes {
  label: string;
  title: string;
  description: string;
  image: string;
  stat1Number?: string;
  stat1Label?: string;
  stat2Number?: string;
  stat2Label?: string;
  stat3Number?: string;
  stat3Label?: string;
  stat4Number?: string;
  stat4Label?: string;
}

export interface WPContactAttributes {
  label: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  ctaText: string;
  ctaUrl: string;
}

export interface WPCareersHeroAttributes {
  label: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface WPJobListingsAttributes {
  label: string;
  title: string;
  description: string;
}

export interface WPCareerContactAttributes {
  label: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  image: string;
}

