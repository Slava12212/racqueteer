// All GraphQL queries for WordPress WPGraphQL integration

export const GET_PAGE_BY_SLUG = `
  query GetPage($slug: String!) {
    pageBy(uri: $slug) {
      title
      blocks {
        name
        ... on AcfRacqueteerHeroBlock {
          attributes {
            title
            description
            ctaPrimaryText: cta_primary_text
            ctaPrimaryUrl: cta_primary_url
            ctaSecondaryText: cta_secondary_text
            ctaSecondaryUrl: cta_secondary_url
            videoUrl: video_url
          }
        }
        ... on AcfRacqueteerAboutBlock {
          attributes {
            label
            title
            description
            stat1Number: stat1_number
            stat1Label: stat1_label
            stat2Number: stat2_number
            stat2Label: stat2_label
            leftImage: left_image
            rightImage: right_image
          }
        }
        ... on AcfRacqueteerLocationsBlock {
          attributes {
            label
            title
            description
          }
        }
        ... on AcfRacqueteerProgramsBlock {
          attributes {
            label
            title
            description
            tabs
          }
        }
        ... on AcfRacqueteerMembershipCtaBlock {
          attributes {
            label
            title
            description
            ctaText: cta_text
            ctaUrl: cta_url
            bgImage: bg_image
          }
        }
        ... on AcfRacqueteerSubscriptionsBlock {
          attributes {
            label
            title
            description
          }
        }
        ... on AcfRacqueteerTestimonialsBlock {
          attributes {
            label
            title
            description
          }
        }
        ... on AcfRacqueteerEventsBlock {
          attributes {
            title
            description
            ctaText: cta_text
            ctaUrl: cta_url
            image
          }
        }
        ... on AcfRacqueteerMembershipHeroBlock {
          attributes {
            label
            title
            description
            priceStarting: price_starting
            priceUnit: price_unit
            ctaText: cta_text
            videoUrl: video_url
          }
        }
        ... on AcfRacqueteerPrivateEventsHeroBlock {
          attributes {
            label
            title
            description
            ctaText: cta_text
            ctaUrl: cta_url
            videoUrl: video_url
          }
        }
        ... on AcfRacqueteerGalleryBlock {
          attributes {
            label
            title
            description
            images
          }
        }
        ... on AcfRacqueteerLogoMarqueeBlock {
          attributes {
            label
            title
            logos
          }
        }
        ... on AcfRacqueteerAboutHeroBlock {
          attributes {
            label
            title
            description
            videoUrl: video_url
          }
        }
        ... on AcfRacqueteerMissionBlock {
          attributes {
            label
            title
            description
            image
          }
        }
        ... on AcfRacqueteerContactBlock {
          attributes {
            label
            title
            description
            email
            phone
            ctaText: cta_text
            ctaUrl: cta_url
          }
        }
        ... on AcfRacqueteerCareersHeroBlock {
          attributes {
            label
            title
            description
            videoUrl: video_url
          }
        }
        ... on AcfRacqueteerJobListingsBlock {
          attributes {
            label
            title
            description
          }
        }
        ... on AcfRacqueteerCareerContactBlock {
          attributes {
            label
            title
            description
            ctaText: cta_text
            ctaUrl: cta_url
            image
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
        acf {
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
          buttonVariant: button_variant
          bgClass: bg_class
          borderClass: border_class
          hasImage: has_image
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
        acf {
          category
          rating
          maxRating: max_rating
          quote
          authorName: author_name
          authorSubtitle: author_subtitle
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
          imageLayout: image_layout
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
        acf {
          locationId: location_id
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
        acf {
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

