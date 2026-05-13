// All GraphQL queries for WordPress WPGraphQL integration

export const GET_PAGE_BY_SLUG = `
  query GetPage($slug: String!) {
    pageBy(uri: $slug) {
      title
      status
      blocks {
        __typename
        ... on AcfRacqueteerHeroBlock {
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
        ... on AcfRacqueteerAboutBlock {
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
        ... on AcfRacqueteerLocationsBlock {
          racqueteerLocations {
            label
            title
            description
          }
        }
        ... on AcfRacqueteerAmenitiesBlock {
          racqueteerAmenities {
            label
            title
            amenities
          }
        }
        ... on AcfRacqueteerProgramsBlock {
          racqueteerPrograms {
            label
            title
            description
            tabs
          }
        }
        ... on AcfRacqueteerMembershipCtaBlock {
          racqueteerMembershipCta {
            label
            title
            description
            ctaText
            ctaUrl
            bgImage
          }
        }
        ... on AcfRacqueteerSubscriptionsBlock {
          racqueteerSubscriptions {
            label
            title
            description
          }
        }
        ... on AcfRacqueteerTestimonialsBlock {
          racqueteerTestimonials {
            label
            title
            description
          }
        }
        ... on AcfRacqueteerEventsBlock {
          racqueteerEvents {
            title
            description
            ctaText
            ctaUrl
            image
            whatIncludes
          }
        }
        ... on AcfRacqueteerMembershipHeroBlock {
          racqueteerMembershipHero {
            label
            title
            description
            priceStarting
            priceUnit
            videoUrl
          }
        }
        ... on AcfRacqueteerSubscriptionsDetailBlock {
          racqueteerSubscriptionsDetail {
            label
            title
            description
          }
        }
        ... on AcfRacqueteerPriceCompareBlock {
          racqueteerPriceCompare {
            label
            title
            description
          }
        }
        ... on AcfRacqueteerPrivateEventsHeroBlock {
          racqueteerPrivateEventsHero {
            label
            title
            description
            ctaText
            ctaUrl
            videoUrl
            whatIncludes
          }
        }
        ... on AcfRacqueteerGalleryBlock {
          racqueteerGallery {
            label
            title
            description
            images
          }
        }
        ... on AcfRacqueteerLogoMarqueeBlock {
          racqueteerLogoMarquee {
            label
            title
            logos
          }
        }
        ... on AcfRacqueteerAboutHeroBlock {
          racqueteerAboutHero {
            label
            title
            description
            videoUrl
          }
        }
        ... on AcfRacqueteerMissionBlock {
          racqueteerMission {
            label
            title
            description
            image
          }
        }
        ... on AcfRacqueteerContactBlock {
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
        ... on AcfRacqueteerCareersHeroBlock {
          racqueteerCareersHero {
            label
            title
            description
            videoUrl
          }
        }
        ... on AcfRacqueteerJobListingsBlock {
          racqueteerJobListings {
            label
            title
            description
          }
        }
        ... on AcfRacqueteerCareerContactBlock {
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
`;

export const GET_JOBS = `
  query GetJobs {
    jobs(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
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
    memberships(first: 10, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
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
          ctaText
          ctaUrl
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
    amenities(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        databaseId
        title
        amenityFields {
          number
          imageLayout
          images { sourceUrl }
          feature1Icon
          feature1Text
          feature2Icon
          feature2Text
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
        locationStatus
        locationAmenities {
          icon
          label
        }
        locationFields {
          locationId
          name
          address
          description
          image { node { sourceUrl } }
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
// Phase 9 — Book Modal options added to acfOptionsBookModal options page
// WordPress ACF setup required:
//   Options page: "Book Modal" (slug: book-modal, menu slug: acf-options-book-modal)
//   Field group attached to that options page with fields:
//     modal_title (text), modal_subtitle (text),
//     sport1_title (text), sport1_image (image, return: array), sport1_button_text (text), sport1_booking_url (url),
//     sport2_title (text), sport2_image (image, return: array), sport2_button_text (text), sport2_booking_url (url)
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
    acfOptionsBookModal {
      bookModal {
        modalTitle
        modalSubtitle
        sport1Title
        sport1Image { sourceUrl }
        sport1ButtonText
        sport1BookingUrl
        sport2Title
        sport2Image { sourceUrl }
        sport2ButtonText
        sport2BookingUrl
      }
    }
  }
`;
