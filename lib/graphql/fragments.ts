// GraphQL fragments for reusable field groups

export const HERO_FIELDS = `
  fragment HeroFields on AcfRacqueteerHeroBlock {
    title
    description
    ctaPrimaryText: cta_primary_text
    ctaPrimaryUrl: cta_primary_url
    ctaSecondaryText: cta_secondary_text
    ctaSecondaryUrl: cta_secondary_url
    videoUrl: video_url
  }
`;

export const ABOUT_FIELDS = `
  fragment AboutFields on AcfRacqueteerAboutBlock {
    label
    title
    description
    stat1Number: stat1_number
    stat1Label: stat1_label
    stat2Number: stat2_number
    stat2Label: stat2_label
    leftImage: left_image { sourceUrl }
    rightImage: right_image { sourceUrl }
  }
`;

export const LOCATIONS_FIELDS = `
  fragment LocationsFields on AcfRacqueteerLocationsBlock {
    label
    title
    description
  }
`;

export const PROGRAMS_FIELDS = `
  fragment ProgramsFields on AcfRacqueteerProgramsBlock {
    label
    title
    description
    tabs
  }
`;

export const MEMBERSHIP_CTA_FIELDS = `
  fragment MembershipCtaFields on AcfRacqueteerMembershipCtaBlock {
    label
    title
    description
    ctaText: cta_text
    ctaUrl: cta_url
    bgImage: bg_image { sourceUrl }
  }
`;

export const SUBSCRIPTIONS_FIELDS = `
  fragment SubscriptionsFields on AcfRacqueteerSubscriptionsBlock {
    label
    title
    description
  }
`;

export const TESTIMONIALS_FIELDS = `
  fragment TestimonialsFields on AcfRacqueteerTestimonialsBlock {
    label
    title
    description
  }
`;

export const EVENTS_FIELDS = `
  fragment EventsFields on AcfRacqueteerEventsBlock {
    title
    description
    ctaText: cta_text
    ctaUrl: cta_url
    image { sourceUrl }
  }
`;

export const MEMBERSHIP_HERO_FIELDS = `
  fragment MembershipHeroFields on AcfRacqueteerMembershipHeroBlock {
    label
    title
    description
    priceStarting: price_starting
    priceUnit: price_unit
    ctaText: cta_text
    videoUrl: video_url
  }
`;

export const PRIVATE_EVENTS_HERO_FIELDS = `
  fragment PrivateEventsHeroFields on AcfRacqueteerPrivateEventsHeroBlock {
    label
    title
    description
    ctaText: cta_text
    ctaUrl: cta_url
    videoUrl: video_url
  }
`;

export const GALLERY_FIELDS = `
  fragment GalleryFields on AcfRacqueteerGalleryBlock {
    label
    title
    description
    images { sourceUrl }
  }
`;

export const LOGO_MARQUEE_FIELDS = `
  fragment LogoMarqueeFields on AcfRacqueteerLogoMarqueeBlock {
    label
    title
    logos { sourceUrl altText }
  }
`;

export const ABOUT_HERO_FIELDS = `
  fragment AboutHeroFields on AcfRacqueteerAboutHeroBlock {
    label
    title
    description
    videoUrl: video_url
  }
`;

export const MISSION_FIELDS = `
  fragment MissionFields on AcfRacqueteerMissionBlock {
    label
    title
    description
    image { sourceUrl }
  }
`;

export const CONTACT_FIELDS = `
  fragment ContactFields on AcfRacqueteerContactBlock {
    label
    title
    description
    email
    phone
    ctaText: cta_text
    ctaUrl: cta_url
  }
`;

export const CAREERS_HERO_FIELDS = `
  fragment CareersHeroFields on AcfRacqueteerCareersHeroBlock {
    label
    title
    description
    videoUrl: video_url
  }
`;

export const JOB_LISTINGS_FIELDS = `
  fragment JobListingsFields on AcfRacqueteerJobListingsBlock {
    label
    title
    description
  }
`;

export const CAREER_CONTACT_FIELDS = `
  fragment CareerContactFields on AcfRacqueteerCareerContactBlock {
    label
    title
    description
    ctaText: cta_text
    ctaUrl: cta_url
    image { sourceUrl }
  }
`;

