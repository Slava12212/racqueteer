import type { ReactNode } from "react";

// Job listings (Careers page)
export interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
}

// Membership plans
export type FeatureValue = "check" | "cross" | string;

export interface MembershipPlan {
  name: string;
  description: string;
  price: string;
  buttonVariant: "blue" | "red";
  hasImage?: boolean;
  bgClass: string;
  borderClass: string;
  values: FeatureValue[];
}

export interface PriceCompareFeature {
  name: string;
  values: FeatureValue[];
}

// Amenities
export interface AmenityFeature {
  icon: ReactNode;
  text: string;
}

export interface Amenity {
  id: number;
  title: string;
  number: string;
  imageLayout: "single" | "split";
  images: string[];
  features: [AmenityFeature, AmenityFeature];
}

// Testimonials
export interface Testimonial {
  id: number;
  category: string;
  rating: number;
  maxRating: number;
  quote: string;
  authorName: string;
  authorSubtitle: string;
}

// Locations
export interface LocationAmenity {
  label: string;
  icon?: ReactNode;
  /** Icon name from WordPress (maps to SVG in the component) */
  iconName?: string;
}

export interface Location {
  id: string;
  name: string;
  status: "available" | "coming_soon";
  address: string[];
  description: string;
  amenities: LocationAmenity[];
  image: string;
}

// Programs
export interface Program {
  title: string;
  color: "red" | "blue";
  price: string;
  unit: string;
  description: string;
}

// ========================================
// HOMEPAGE CONTENT INTERFACES
// ========================================

export interface HeroContent {
  title: string;
  description: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText: string;
  ctaSecondaryUrl: string;
  videoUrl: string;
}

export interface AboutContent {
  label: string;
  title: string;
  description: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  leftImageUrl: string;
  rightImageUrl: string;
  mobileImageUrl: string;
}

export interface LocationsContent {
  label: string;
  title: string;
  description: string;
}

export interface ProgramsContent {
  label: string;
  title: string;
  description: string;
  tabs: string[];
}

export interface MembershipContent {
  label: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  backgroundImageUrl: string;
}

export interface HomeSubscriptionsContent {
  label: string;
  title: string;
  description: string;
}

export interface TestimonialsContent {
  label: string;
  title: string;
  description: string;
}

export interface EventsContent {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string;
}

export interface HomepageContent {
  hero: HeroContent;
  about: AboutContent;
  locations: LocationsContent;
  programs: ProgramsContent;
  membership: MembershipContent;
  subscriptions: HomeSubscriptionsContent;
  testimonials: TestimonialsContent;
  events: EventsContent;
}

// ========================================
// MEMBERSHIPS PAGE CONTENT INTERFACES
// ========================================

export interface MembershipHeroContent {
  label: string;
  title: string;
  description: string;
  priceStarting: string;
  priceUnit: string;
  ctaText: string;
  videoUrl: string;
}

export interface SubscriptionsHeaderContent {
  label: string;
  title: string;
  description: string;
}

export interface PriceCompareHeaderContent {
  label: string;
  title: string;
  description: string;
}

export interface MembershipsPageContent {
  hero: MembershipHeroContent;
  subscriptionsHeader: SubscriptionsHeaderContent;
  priceCompareHeader: PriceCompareHeaderContent;
}

// ========================================
// PRIVATE EVENTS PAGE CONTENT INTERFACES
// ========================================

export interface PrivateEventsHeroContent {
  label: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  videoUrl: string;
}

export interface GalleryContent {
  label: string;
  title: string;
  description: string;
  images: string[];
}

export interface LogoContent {
  label: string;
  title: string;
  description: string;
  logos: string[];
}

export interface PrivateEventsPageContent {
  hero: PrivateEventsHeroContent;
  gallery: GalleryContent;
  logos: LogoContent;
}

// ========================================
// ABOUT PAGE CONTENT INTERFACES
// ========================================

export interface AboutHeroContent {
  label: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface MissionContent {
  label: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface ContactContent {
  label: string;
  title: string;
  description: string;
  emailLabel: string;
  email: string;
  phoneLabel: string;
  phone: string;
  ctaText: string;
  ctaUrl: string;
}

export interface AboutPageContent {
  hero: AboutHeroContent;
  mission: MissionContent;
  contact: ContactContent;
}

// ========================================
// CAREERS PAGE CONTENT INTERFACES
// ========================================

export interface CareersHeroContent {
  label: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface JobListingsHeaderContent {
  label: string;
  title: string;
  description: string;
}

export interface CareerContactContent {
  label: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string;
}

export interface CareersPageContent {
  hero: CareersHeroContent;
  jobListingsHeader: JobListingsHeaderContent;
  careerContact: CareerContactContent;
}

// ========================================
// WP OPTIONS PAGE TYPES (Phase 8)
// ========================================

export interface WPNavbarOptions {
  navLogo?: { sourceUrl: string; altText: string } | null;
  navLogoIcon?: { sourceUrl: string; altText: string } | null;
  navLinks?: Array<{ label: string; url: string }> | null;
  navCtaText?: string | null;
  navCtaUrl?: string | null;
}

export interface WPFooterOptions {
  footerLogo?: { sourceUrl: string; altText: string } | null;
  footerEmail?: string | null;
  footerPhone?: string | null;
  footerCtaText?: string | null;
  footerCtaUrl?: string | null;
  footerMenuLinks?: Array<{ label: string; url: string }> | null;
  footerLocations?: Array<{ name: string; address: string }> | null;
  footerCopyright?: string | null;
  footerLegalLinks?: Array<{ label: string; url: string }> | null;
}

export interface WPSiteOptions {
  navbar: WPNavbarOptions | null;
  footer: WPFooterOptions | null;
}

// ========================================
// SHARED COMPONENTS CONTENT INTERFACES
// ========================================

export interface NavLink {
  label: string;
  url: string;
}

export interface NavbarContent {
  logoUrl: string;
  logoAlt: string;
  logoIconUrl: string;
  ctaText: string;
  ctaUrl: string;
  menuLinks: NavLink[];
}

export interface FooterLocation {
  name: string;
  address: string;
}

export interface FooterContent {
  logoUrl: string;
  logoAlt: string;
  contactLabel: string;
  email: string;
  phone: string;
  ctaText: string;
  ctaUrl: string;
  menuLabel: string;
  menuLinks: NavLink[];
  locationsLabel: string;
  locations: FooterLocation[];
  copyrightText: string;
  legalLinks: NavLink[];
}
