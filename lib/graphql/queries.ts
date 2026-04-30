// All GraphQL queries for WordPress WPGraphQL integration

export const GET_PAGE_BY_SLUG = `
  query GetPage($slug: String!) {
    pageBy(uri: $slug) {
      title
      status
      seo { metaDesc }
      blocks {
        __typename
        ... on AcfRacqueteerHeroBlock {
          attributes {
            racqueteerHero {
              title
              description
              ctaPrimaryText
              ctaPrimaryUrl
              ctaSecondaryText
              ctaSecondaryUrl
              videoUrl
            }
          }
        }
        ... on AcfRacqueteerAboutBlock {
          attributes {
            racqueteerAbout {
              label
              title
              description
              stat1Number
              stat1Label
              stat2Number
              stat2Label
              leftImage
              rightImage
            }
          }
        }
        ... on AcfRacqueteerLocationsBlock {
          attributes {
            racqueteerLocations {
              label
              title
              description
            }
          }
        }
        ... on AcfRacqueteerProgramsBlock {
          attributes {
            racqueteerPrograms {
              label
              title
              description
              tabs
            }
          }
        }
        ... on AcfRacqueteerMembershipCtaBlock {
          attributes {
            racqueteerMembershipCta {
              label
              title
              description
              ctaText
              ctaUrl
              bgImage
            }
          }
        }
        ... on AcfRacqueteerSubscriptionsBlock {
          attributes {
            racqueteerSubscriptions {
              label
              title
              description
            }
          }
        }
        ... on AcfRacqueteerTestimonialsBlock {
          attributes {
            racqueteerTestimonials {
              label
              title
              description
            }
          }
        }
        ... on AcfRacqueteerEventsBlock {
          attributes {
            racqueteerEvents {
              title
              description
              ctaText
              ctaUrl
              image
            }
          }
        }
        ... on AcfRacqueteerMembershipHeroBlock {
          attributes {
            racqueteerMembershipHero {
              label
              title
              description
              priceStarting
              priceUnit
              ctaText
              videoUrl
            }
          }
        }
        ... on AcfRacqueteerSubscriptionsDetailBlock {
          attributes {
            racqueteerSubscriptionsDetail {
              label
              title
              description
            }
          }
        }
        ... on AcfRacqueteerPriceCompareBlock {
          attributes {
            racqueteerPriceCompare {
              label
              title
              description
            }
          }
        }
        ... on AcfRacqueteerPrivateEventsHeroBlock {
          attributes {
            racqueteerPrivateEventsHero {
              label
              title
              description
              ctaText
              ctaUrl
              videoUrl
            }
          }
        }
        ... on AcfRacqueteerGalleryBlock {
          attributes {
            racqueteerGallery {
              label
              title
              description
              images
            }
          }
        }
        ... on AcfRacqueteerLogoMarqueeBlock {
          attributes {
            racqueteerLogoMarquee {
              label
              title
              logos
            }
          }
        }
        ... on AcfRacqueteerAboutHeroBlock {
          attributes {
            racqueteerAboutHero {
              label
              title
              description
              videoUrl
            }
          }
        }
        ... on AcfRacqueteerMissionBlock {
          attributes {
            racqueteerMission {
              label
              title
              description
              image
            }
          }
        }
        ... on AcfRacqueteerContactBlock {
          attributes {
            racqueteerContact {
              label
              title
              description
              email
              phone
              ctaText
              ctaUrl
            }
          }
        }
        ... on AcfRacqueteerCareersHeroBlock {
          attributes {
            racqueteerCareersHero {
              label
              title
              description
              videoUrl
            }
          }
        }
        ... on AcfRacqueteerJobListingsBlock {
          attributes {
            racqueteerJobListings {
              label
              title
              description
            }
          }
        }
        ... on AcfRacqueteerCareerContactBlock {
          attributes {
            racqueteerCareerContact {
              label
              title
              description
              ctaText
              ctaUrl
              image
            }
          }
        }
      }
    }
  }
`;

export const GET_JOBS = `
  query GetJobs {
    jobs(first: 100) {
      nodes {
        databaseId
        title
        jobFields {
          description
          category
        }
        date
      }
    }
  }
`;

export const GET_MEMBERSHIP_PLANS = `
  query GetMembershipPlans {
    memberships(first: 10) {
      nodes {
        title
        acf {
          price
          description
          buttonVariant
          bgClass
          borderClass
          hasImage
          values
        }
      }
    }
  }
`;

export const GET_TESTIMONIALS = `
  query GetTestimonials {
    testimonials(first: 100) {
      nodes {
        databaseId
        testimonialFields {
          category
          rating
          maxRating
          quote
          authorName
          authorSubtitle
        }
      }
    }
  }
`;

export const GET_AMENITIES = `
  query GetAmenities {
    amenities(first: 100) {
      nodes {
        databaseId
        title
        acf {
          number
          imageLayout
          images { sourceUrl }
          features {
            text
          }
        }
      }
    }
  }
`;

export const GET_LOCATIONS = `
  query GetLocations {
    locations(first: 100) {
      nodes {
        databaseId
        locationFields {
          locationId
          name
          status
          address
          description
          image { sourceUrl }
        }
      }
    }
  }
`;

export const GET_PROGRAMS = `
  query GetPrograms {
    programs(first: 100) {
      nodes {
        programFields {
          title
          color
          price
          unit
          description
        }
      }
    }
  }
`;

export const GET_PRICE_COMPARE = `
  query GetPriceCompare {
    priceCompare(first: 1) {
      nodes {
        acf {
          features {
            name
            values
          }
        }
      }
    }
  }
`;

// Phase 8 — Site Options (Navbar + Footer from ACF Options Pages)
export const GET_SITE_OPTIONS = `
  query GetSiteOptions {
    acfOptionsNavbar {
      navbar {
        navLogo { sourceUrl altText }
        navLogoIcon { sourceUrl altText }
        navLinks { label url }
        navCtaText
        navCtaUrl
      }
    }
    acfOptionsFooter {
      footer {
        footerLogo { sourceUrl altText }
        footerEmail
        footerPhone
        footerCtaText
        footerCtaUrl
        footerMenuLinks { label url }
        footerLocations { name address }
        footerCopyright
        footerLegalLinks { label url }
      }
    }
  }
`;
