/**
 * Data Abstraction Layer for Racqueteer
 * 
 * All data fetching functions for the Racqueteer site.
 * Currently returns hardcoded data, but designed for easy WordPress REST API integration.
 * 
 * Future WordPress Integration:
 * - Replace hardcoded data with fetch() calls to WP REST API
 * - Each function should fetch from: GET /wp-json/wp/v2/{endpoint}
 * - Add error handling, loading states, and caching as needed
 */

import type {
  Job,
  MembershipPlan,
  FeatureValue,
  PriceCompareFeature,
  Amenity,
  Testimonial,
  Location,
  Program,
  HomepageContent,
  MembershipsPageContent,
  PrivateEventsPageContent,
  AboutPageContent,
  CareersPageContent,
  NavbarContent,
  FooterContent,
} from "@/types";

// ========================================
// JOBS DATA (Careers Page)
// ========================================

/**
 * Get all job listings
 * TODO: Replace with WP REST API fetch — GET /wp-json/wp/v2/jobs
 */
export async function getJobs(): Promise<Job[]> {
  return [
    {
      id: 1,
      title: "Club Manager",
      description: "Lead daily operations, manage staff scheduling, oversee member relations, and ensure an exceptional experience across all club facilities.",
      category: "Manager",
      date: "Apr 1, 2026",
    },
    {
      id: 2,
      title: "Assistant Manager",
      description: "Support the Club Manager in daily operations, coordinate events, handle member inquiries, and step in as acting manager when needed.",
      category: "Manager",
      date: "Apr 1, 2026",
    },
    {
      id: 3,
      title: "Head Pickleball Coach",
      description: "Design and lead pickleball training programs for all skill levels. Conduct private lessons, group clinics, and competitive development sessions.",
      category: "Trainer",
      date: "Mar 28, 2026",
    },
    {
      id: 4,
      title: "Padel Trainer",
      description: "Deliver high-energy padel coaching sessions, develop player technique, and help grow the padel community at the club through engaging programs.",
      category: "Trainer",
      date: "Mar 25, 2026",
    },
    {
      id: 5,
      title: "Youth Program Coach",
      description: "Run junior development programs, create age-appropriate training plans, and build a fun and encouraging environment for young players.",
      category: "Trainer",
      date: "Mar 20, 2026",
    },
    {
      id: 6,
      title: "Lead Barista",
      description: "Manage the club café, craft specialty coffee and drinks, maintain quality standards, and train new barista team members.",
      category: "Barista",
      date: "Apr 3, 2026",
    },
    {
      id: 7,
      title: "Barista",
      description: "Prepare and serve premium beverages, maintain a clean and welcoming café space, and provide excellent customer service to members and guests.",
      category: "Barista",
      date: "Apr 3, 2026",
    },
    {
      id: 8,
      title: "Front Desk Associate",
      description: "Welcome members and guests, handle court bookings, answer questions, and ensure smooth check-in and check-out experiences daily.",
      category: "Manager",
      date: "Mar 15, 2026",
    },
  ];
}

/**
 * Get unique job categories
 * TODO: Replace with WP REST API fetch — GET /wp-json/wp/v2/job-categories
 */
export async function getJobCategories(): Promise<string[]> {
  return ["All", "Manager", "Trainer", "Barista"];
}

// ========================================
// MEMBERSHIP PLANS DATA
// ========================================

/**
 * Get membership plan features list
 * TODO: Replace with WP REST API fetch — GET /wp-json/wp/v2/membership-features
 */
export async function getMembershipFeatures(): Promise<string[]> {
  return [
    "UNLIMITED FREE BOOKINGS",
    "BOOKING WINDOW",
    "ANNUAL GUEST PASSES",
    "ACCESS TO GYM & WELLNESS CENTER",
    "AVAILABILITY",
    "PRIORITY BOOKING",
    "PREMIUM CONCIERGE",
    "ANNUAL GUEST PASSES",
    "ACCESS TO GYM & WELLNESS CENTER",
  ];
}

/**
 * Get all membership plans
 * TODO: Replace with WP REST API fetch — GET /wp-json/wp/v2/membership-plans
 */
export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  return [
    {
      name: "STARTER",
      description: "Perfect for getting started",
      price: "$89",
      buttonVariant: "blue",
      bgClass: "bg-[#F4F6F9]",
      borderClass: "border-[#E5E7EB]",
      values: ["check", "check", "check", "cross", "cross", "cross", "cross", "0", "2 days"],
    },
    {
      name: "LIGHT",
      description: "Great choice to begin your journey",
      price: "$135",
      buttonVariant: "blue",
      bgClass: "bg-white",
      borderClass: "border-[#E5E7EB]",
      values: ["check", "check", "check", "check", "check", "cross", "cross", "4", "4 days"],
    },
    {
      name: "PRO",
      description: "Ideal for launching your experience",
      price: "$189",
      buttonVariant: "red",
      hasImage: true,
      bgClass: "bg-white",
      borderClass: "border-[#E5E7EB]",
      values: ["check", "check", "check", "check", "check", "check", "cross", "10", "7 days"],
    },
    {
      name: "PRO+",
      description: "Best suited for your first steps",
      price: "$397",
      buttonVariant: "red",
      bgClass: "bg-white",
      borderClass: "border-[#E5E7EB]",
      values: ["check", "check", "check", "check", "check", "check", "check", "12", "14 days"],
    },
  ];
}

/**
 * Get price comparison table data
 * TODO: Replace with WP REST API fetch — GET /wp-json/wp/v2/price-compare
 */
export async function getPriceCompareData(): Promise<{
  features: PriceCompareFeature[];
  plans: MembershipPlan[];
}> {
  const features: PriceCompareFeature[] = [
    {
      name: "UNLIMITED BOOKINGS",
      values: ["check", "check", "check", "check"],
    },
    {
      name: "BOOKING WINDOW",
      values: ["2 days", "4 days", "7 days", "14 days"],
    },
    {
      name: "GUEST PASSES / YEAR",
      values: ["0", "4", "10", "12"],
    },
    {
      name: "GYM & WELLNESS ACCESS",
      values: ["cross", "check", "check", "check"],
    },
    {
      name: "PRIORITY BOOKING",
      values: ["cross", "cross", "check", "check"],
    },
    {
      name: "PREMIUM CONCIERGE",
      values: ["cross", "cross", "cross", "check"],
    },
  ];

  const plans = await getMembershipPlans();

  return { features, plans };
}

// ========================================
// AMENITIES DATA
// ========================================

/**
 * Get all amenities
 * NOTE: Icons are React components — these will need to be imported in the component
 * TODO: Replace with WP REST API fetch — GET /wp-json/wp/v2/amenities
 * Icon data should come as SVG strings or icon identifiers that map to components
 */
export async function getAmenities(): Promise<Amenity[]> {
  // Icons will be imported in the component that uses this data
  // For now, returning data structure without icon components
  return [
    {
      id: 1,
      title: "State-of-the-Art Courts",
      number: "01",
      imageLayout: "split",
      images: [
        "https://api.builder.io/api/v1/image/assets/TEMP/990ef1551fbb5f0b888274af1c845d648fe5fb94?width=712",
        "https://api.builder.io/api/v1/image/assets/TEMP/702da1f17f07301d52908f1d5474582d68de8bbb?width=440",
      ],
      features: [
        {
          icon: null, // Will be populated in component: <CourtsIcon />
          text: "11 pickleball and 6 premium panoramic padel courts for top-level play",
        },
        {
          icon: null, // Will be populated in component: <JumpRopeIcon />
          text: "Tournament-quality surfaces, lighting, and spacious layouts",
        },
      ],
    },
    {
      id: 2,
      title: "Premium Locker Rooms",
      number: "02",
      imageLayout: "single",
      images: [
        "https://api.builder.io/api/v1/image/assets/TEMP/d8de9b0fdcd157a095ecfe9d6bcb38d05a4539a4?width=1160",
      ],
      features: [
        {
          icon: null, // <LockerIcon />
          text: "Spacious changing rooms with lockers, private showers, and saunas",
        },
        {
          icon: null, // <SaunaIcon />
          text: "Elevated finishes with hotel-style toiletries",
        },
      ],
    },
    {
      id: 3,
      title: "Members Lounge",
      number: "03",
      imageLayout: "split",
      images: [
        "https://api.builder.io/api/v1/image/assets/TEMP/5dc4829ab10a10d5399e066cd74a5dd26e919756?width=712",
        "https://api.builder.io/api/v1/image/assets/TEMP/563bb083dd31ed4c310f35e5be2ca1eec4222bfa?width=440",
      ],
      features: [
        {
          icon: null, // <LoungeIcon />
          text: "Comfortable lounge spaces to relax and connect between matches",
        },
        {
          icon: null, // <MemberIcon />
          text: "Exclusive members-only access with social seating areas",
        },
      ],
    },
    {
      id: 4,
      title: "Café & Coffee Bar",
      number: "04",
      imageLayout: "single",
      images: [
        "https://api.builder.io/api/v1/image/assets/TEMP/8c587701b3d240e76568b31e8f3e84279ddc6620?width=1160",
      ],
      features: [
        {
          icon: null, // <CoffeeIcon />
          text: "Specialty coffee by Wood Roasters, an award-winning Australian roaster",
        },
        {
          icon: null, // <DrinkIcon />
          text: "Coffee, drinks, and light bites to fuel your game or your workday",
        },
      ],
    },
    {
      id: 5,
      title: "Coworking Spaces",
      number: "05",
      imageLayout: "single",
      images: [
        "https://api.builder.io/api/v1/image/assets/TEMP/d5e3ebf476e768cf5cc81776480eff8860606e0f?width=1160",
      ],
      features: [
        {
          icon: null, // <LaptopIcon />
          text: "Dedicated workspaces with comfortable seating and TVs",
        },
        {
          icon: null, // <VideoIcon />
          text: "Private call booths for meetings or focused work",
        },
      ],
    },
    {
      id: 6,
      title: "Pro Shop",
      number: "06",
      imageLayout: "single",
      images: [
        "https://api.builder.io/api/v1/image/assets/TEMP/9685279b5497611f63b0e790190851bd747fd9c0?width=1160",
      ],
      features: [
        {
          icon: null, // <ShopIcon />
          text: "Premium paddles, rackets, and apparel from leading brands like Wilson and JOOL",
        },
        {
          icon: null, // <ShopIcon />
          text: "Expertly curated equipment to help players of all levels elevate their game",
        },
      ],
    },
  ];
}

// ========================================
// TESTIMONIALS DATA
// ========================================

/**
 * Get all testimonials
 * TODO: Replace with WP REST API fetch — GET /wp-json/wp/v2/testimonials
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  return [
    {
      id: 1,
      category: "Beginner Training",
      rating: 5.0,
      maxRating: 5.0,
      quote:
        "\"The training was fun, well organized, and easy to follow. I quickly gained confidence on the court and truly enjoyed the atmosphere. I'm excited to come back and keep improving!\"",
      authorName: "Martin Goutry",
      authorSubtitle: "Beginner Training",
    },
    {
      id: 2,
      category: "Beginner Training",
      rating: 5.0,
      maxRating: 5.0,
      quote:
        "\"The training was fun, well organized, and easy to follow. I quickly gained confidence on the court and truly enjoyed the atmosphere. I'm excited to come back and keep improving!\"",
      authorName: "Martin Goutry",
      authorSubtitle: "Beginner Training",
    },
    {
      id: 3,
      category: "Beginner Training",
      rating: 5.0,
      maxRating: 5.0,
      quote:
        "\"The training was fun, well organized, and easy to follow. I quickly gained confidence on the court and truly enjoyed the atmosphere. I'm excited to come back and keep improving!\"",
      authorName: "Martin Goutry",
      authorSubtitle: "Beginner Training",
    },
    {
      id: 4,
      category: "Advanced Training",
      rating: 5.0,
      maxRating: 5.0,
      quote:
        "\"Incredible coaching and a very supportive environment. The drills were intense but effective. My serve has improved tremendously since joining. Highly recommend to anyone serious about the sport!\"",
      authorName: "Sarah Chen",
      authorSubtitle: "Advanced Training",
    },
    {
      id: 5,
      category: "Intermediate Training",
      rating: 5.0,
      maxRating: 5.0,
      quote:
        "\"Exactly what I needed to level up my game. The coaches are attentive and the class sizes are perfect. I feel a genuine improvement after every session.\"",
      authorName: "James Okafor",
      authorSubtitle: "Intermediate Training",
    },
    {
      id: 6,
      category: "Beginner Training",
      rating: 5.0,
      maxRating: 5.0,
      quote:
        "\"As someone who'd never played before, I was nervous walking in. The instructors made it so welcoming and fun. Now I'm hooked and I play every week!\"",
      authorName: "Emily Rodriguez",
      authorSubtitle: "Beginner Training",
    },
  ];
}

// ========================================
// LOCATIONS DATA
// ========================================

/**
 * Get all locations
 * NOTE: Icons are React components — these will need to be imported in the component
 * TODO: Replace with WP REST API fetch — GET /wp-json/wp/v2/locations
 */
export async function getLocations(): Promise<Location[]> {
  // Icons will be imported in the component that uses this data
  return [
    {
      id: "homebush",
      name: "Homebush Club",
      status: "available",
      address: ["Homebush, Sydney", "New South Wales 2140, Australia"],
      description:
        "Perfect for newcomers and those looking to refine their foundational skills, this clinic provides a supportive environment for learning and improvement.",
      amenities: [], // Will be populated in component with icon components
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/edca0eb2071de6afc816146f03f622629c2fb896?width=1182",
    },
    {
      id: "alexandria",
      name: "Alexandria Club",
      status: "coming_soon",
      address: ["Alexandria, Sydney", "New South Wales 2015, Australia"],
      description:
        "Our newest location coming soon to Alexandria. A world-class facility designed for serious players and casual enthusiasts alike.",
      amenities: [], // Will be populated in component with icon components
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/edca0eb2071de6afc816146f03f622629c2fb896?width=1182",
    },
  ];
}

// ========================================
// PROGRAMS DATA
// ========================================

/**
 * Get all programs/clinics
 * TODO: Replace with WP REST API fetch — GET /wp-json/wp/v2/programs
 */
export async function getPrograms(): Promise<Program[]> {
  return [
    {
      title: "Women's Beginnersad",
      color: "red",
      price: "$40",
      unit: "per game",
      description:
        "This introductory session is the perfect way to get started! We'll cover the basics of the game, from the rules and scoring to essential techniques like grip, positioning, and basic shots. Whether you're completely new or have some experience, this fun and informative session will help you build confidence on the court and develop a solid foundation in padel.",
    },
    {
      title: "Mens Beginner",
      color: "blue",
      price: "$40",
      unit: "per game",
      description:
        "Join our fun and supportive group clinic designed specifically for beginners! Whether you're new to padel or just starting to play, this clinic will help you master the fundamentals. Our experienced coaches will guide you through the essential techniques and strategies of the game.",
    },
    {
      title: "Group Beginner",
      color: "red",
      price: "$60",
      unit: "per game",
      description:
        "Take your padel skills to the next level in our intermediate clinic! Perfect for those who already know the basics, this clinic focuses on refining your technique, improving shot placement, and enhancing court awareness. Our coaches will push you to improve every aspect of your game.",
    },
    {
      title: "Women's Intermediate",
      color: "blue",
      price: "$80",
      unit: "per game",
      description:
        "This clinic is designed for top players looking to perfect their game and get an edge on their opponents. Focus will be on very advanced techniques/shots, precision, and strategic play. You'll work on improving complex shot combinations and court positioning.",
    },
  ];
}

/**
 * Get program tabs/categories
 * TODO: Replace with WP REST API fetch — GET /wp-json/wp/v2/program-categories
 */
export async function getProgramTabs(): Promise<string[]> {
  return ["Programming", "Coaching", "Events"];
}

// ========================================
// PAGE CONTENT FUNCTIONS
// ========================================

/**
 * Get Homepage content
 * TODO: Replace with WP REST API — GET /wp-json/wp/v2/pages/home?_fields=acf
 * ACF Field Group: "Homepage Content"
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  return {
    hero: {
      title: "Where Elite Competition Meets a Refined Social Atmosphere",
      description: "Perfect for newcomers and those looking to refine their foundational skills, this clinic provides a supportive environment for learning and improvement.",
      ctaPrimaryText: "Book a Court",
      ctaPrimaryUrl: "#",
      ctaSecondaryText: "Become a Member",
      ctaSecondaryUrl: "#",
      videoUrl: "/hero-video.mp4",
    },
    about: {
      label: "about racqueteer",
      title: "The Ultimate Destination for Padel & Pickleball Players",
      description: "Racqueteer is more than just a place to play — it's a hub for the fast-growing world of padel and pickleball. Designed for players of all levels, our club combines professional courts, a welcoming community, and world-class facilities to create an unforgettable playing experience.",
      stat1Number: "25",
      stat1Label: "Courts of Art",
      stat2Number: "8+",
      stat2Label: "Years of Expirience",
      leftImageUrl: "/racket-pickleball.png",
      rightImageUrl: "/racket-padel.png",
      mobileImageUrl: "/rackets-mobile.png",
    },
    locations: {
      label: "locations",
      title: "Play at Your Favorite Location",
      description: "With multiple state-of-the-art locations across Sydney, we make it easy to find a club near you. Each facility features top-tier courts, premium amenities, and a welcoming community of players.",
    },
    programs: {
      label: "programming",
      title: "Find the Perfect Program for You",
      description: "Whether you're a complete beginner or an advanced player, we have programs tailored to your skill level and goals. Our expert coaches will help you improve your game in a fun and supportive environment.",
      tabs: ["Programming", "Coaching", "Events"],
    },
    membership: {
      label: "membership",
      title: "Unlock Unlimited Access with Membership",
      description: "Become a member and enjoy exclusive benefits including priority court bookings, access to premium facilities, member-only events, and much more. Choose the plan that fits your lifestyle.",
      ctaText: "View Membership Options",
      ctaUrl: "/memberships",
      backgroundImageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/4ebfccd93ca7fd0ee50253d8e7dc7c1a7d1e7ad6?width=1920",
    },
    subscriptions: {
      label: "memberships",
      title: "Choose Your Perfect Membership Plan",
      description: "Select the plan that best fits your lifestyle and playing frequency. All memberships include access to our world-class facilities, expert coaching, and vibrant community.",
    },
    testimonials: {
      label: "testimonials",
      title: "What Our Members Say",
      description: "Hear from our community of passionate players who have made Racqueteer their home court.",
    },
    events: {
      title: "Join Our Next Tournament or Social Event",
      description: "From competitive tournaments to casual social mixers, there's always something happening at Racqueteer. Connect with fellow players, challenge yourself, and have fun!",
      ctaText: "View Events Calendar",
      ctaUrl: "#",
      imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/a80df23e61c9d67f39ff7f03997d3f667eb5ef5e?width=1920",
    },
  };
}

/**
 * Get Memberships page content
 * TODO: Replace with WP REST API — GET /wp-json/wp/v2/pages/memberships?_fields=acf
 * ACF Field Group: "Memberships Page Content"
 */
export async function getMembershipsPageContent(): Promise<MembershipsPageContent> {
  return {
    hero: {
      label: "membership",
      title: "become a Member",
      description: "We are thrilled to have you consider becoming a part of our community",
      priceStarting: "$89",
      priceUnit: "/month",
      ctaText: "View plans",
      videoUrl: "/private-events-hero.mp4",
    },
    subscriptionsHeader: {
      label: "memberships",
      title: "Choose Your Perfect Membership Plan",
      description: "Select the plan that best fits your lifestyle and playing frequency. All memberships include access to our world-class facilities.",
    },
    priceCompareHeader: {
      label: "compare plans",
      title: "Compare Membership Features",
      description: "See all the benefits side-by-side to help you choose the right membership level for your needs.",
    },
  };
}

/**
 * Get Private Events page content
 * TODO: Replace with WP REST API — GET /wp-json/wp/v2/pages/private-events?_fields=acf
 * ACF Field Group: "Private Events Page Content"
 */
export async function getPrivateEventsPageContent(): Promise<PrivateEventsPageContent> {
  return {
    hero: {
      label: "private events",
      title: "Host Your Event at Racqueteer",
      description: "From corporate team-building to birthday parties and tournaments, our premium facilities provide the perfect backdrop for any occasion.",
      ctaText: "Enquire Now",
      ctaUrl: "#",
      videoUrl: "/private-events-hero-new.mp4",
    },
    gallery: {
      label: "our facilities",
      title: "World-Class Venues for Memorable Events",
      description: "Explore our stunning courts, lounges, and event spaces designed to accommodate groups of all sizes.",
      images: [
        "https://api.builder.io/api/v1/image/assets/TEMP/d3f8a7b2c1e9f4a6d8e5c2b1a9f7e3d6c4b8a5e2?width=800",
        "https://api.builder.io/api/v1/image/assets/TEMP/a9b7c8d5e2f3a4b6c9d8e5f2a3b7c6d4e8a5b2c1?width=800",
        "https://api.builder.io/api/v1/image/assets/TEMP/c5d8e2f9a3b6c4d7e8f5a2b9c6d3e7f4a8b5c2d1?width=800",
        "https://api.builder.io/api/v1/image/assets/TEMP/e7f2a9b6c3d8e4f5a2b7c9d6e3f8a4b5c2d9e7f1?width=800",
      ],
    },
    logos: {
      label: "trusted by",
      title: "Corporate Partners Who've Hosted with Us",
      description: "Join leading companies who have chosen Racqueteer for their events.",
      logos: [
        "https://api.builder.io/api/v1/image/assets/TEMP/logo1?width=200",
        "https://api.builder.io/api/v1/image/assets/TEMP/logo2?width=200",
        "https://api.builder.io/api/v1/image/assets/TEMP/logo3?width=200",
        "https://api.builder.io/api/v1/image/assets/TEMP/logo4?width=200",
      ],
    },
  };
}

/**
 * Get About page content
 * TODO: Replace with WP REST API — GET /wp-json/wp/v2/pages/about?_fields=acf
 * ACF Field Group: "About Page Content"
 */
export async function getAboutPageContent(): Promise<AboutPageContent> {
  return {
    hero: {
      label: "about us",
      title: "Bringing People Together Through Racquet Sports",
      description: "Racqueteer was founded on a simple belief: racquet sports should be accessible, enjoyable, and community-driven. We've built more than courts—we've built a movement.",
      videoUrl: "/private-events-hero.mp4",
    },
    mission: {
      label: "our mission",
      title: "Creating Spaces Where Players Thrive",
      description: "We're committed to providing world-class facilities, expert coaching, and a welcoming environment where players of all levels can improve, connect, and have fun. Whether you're picking up a paddle for the first time or competing at the highest level, you belong here.",
      imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/mission-image?width=1200",
    },
    contact: {
      label: "get in touch",
      title: "Have Questions? We're Here to Help",
      description: "Whether you're interested in membership, hosting an event, or just want to learn more about Racqueteer, our team is ready to assist you.",
      emailLabel: "Email us",
      email: "info.racqueteer.club@gmail.com",
      phoneLabel: "Call us",
      phone: "+61 4 8123 4567",
      ctaText: "Send a Message",
      ctaUrl: "#",
    },
  };
}

/**
 * Get Careers page content
 * TODO: Replace with WP REST API — GET /wp-json/wp/v2/pages/careers?_fields=acf
 * ACF Field Group: "Careers Page Content"
 */
export async function getCareersPageContent(): Promise<CareersPageContent> {
  return {
    hero: {
      label: "careers",
      title: "Join Our Team",
      description: "Be part of something bigger. At Racqueteer, we're building a community of passionate individuals who love racquet sports and creating exceptional experiences.",
      videoUrl: "/careers-hero.mp4",
    },
    jobListingsHeader: {
      label: "open positions",
      title: "Current Opportunities",
      description: "Explore our available roles and find the perfect fit for your skills and passion.",
    },
    careerContact: {
      label: "don't see a fit?",
      title: "We're Always Looking for Talent",
      description: "Even if there's no open position that matches your skills right now, we'd love to hear from you. Send us your resume and we'll keep you in mind for future opportunities.",
      ctaText: "Send Your Resume",
      ctaUrl: "mailto:careers@racqueteer.club",
      imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/careers-contact?width=1200",
    },
  };
}

/**
 * Get Navbar content
 * TODO: Replace with WP REST API — GET /wp-json/wp/v2/menus/primary or custom endpoint
 * ACF Field Group: "Site Settings > Navigation"
 */
export async function getNavbarContent(): Promise<NavbarContent> {
  return {
    logoUrl: "https://api.builder.io/api/v1/image/assets/TEMP/e0ce3c4174fbb95bf0bda4630ec53dae805dda38?width=418",
    logoAlt: "Racqueteer Pickleball & Padel",
    logoIconUrl: "/logo-icon.png",
    ctaText: "Book a Court",
    ctaUrl: "#",
    menuLinks: [
      { label: "Home", url: "/" },
      { label: "Coaching", url: "#" },
      { label: "Events & Programs", url: "#" },
      { label: "Membership", url: "/memberships" },
      { label: "Private Events", url: "/private-events" },
      { label: "About Us", url: "/about" },
      { label: "Careers", url: "/careers" },
    ],
  };
}

/**
 * Get Footer content
 * TODO: Replace with WP REST API — GET /wp-json/wp/v2/site-settings or custom endpoint
 * ACF Field Group: "Site Settings > Footer"
 */
export async function getFooterContent(): Promise<FooterContent> {
  return {
    logoUrl: "https://api.builder.io/api/v1/image/assets/TEMP/bab5f456f0adedf76650dd841c609588b29971b8?width=234",
    logoAlt: "Racqueteer",
    contactLabel: "Contact Us",
    email: "info.racqueteer.club@gmail.com",
    phone: "+61 4 8123 4567",
    ctaText: "Book a Court",
    ctaUrl: "#",
    menuLabel: "Menu",
    menuLinks: [
      { label: "Membership", url: "/memberships" },
      { label: "Events & Programs", url: "#" },
      { label: "Private Events", url: "/private-events" },
      { label: "Coaching", url: "#" },
      { label: "About Us", url: "/about" },
      { label: "Careers", url: "/careers" },
    ],
    locationsLabel: "Locations",
    locations: [
      {
        name: "Homebush Club",
        address: "Homebush, Sydney. New South Wales 2140, Australia",
      },
      {
        name: "Alexandria Club",
        address: "Alexandria, Sydney. Australia",
      },
    ],
    copyrightText: "©2026 Racqueteer. All Rights Reserved.",
    legalLinks: [
      { label: "Conditions", url: "#" },
      { label: "Terms of Service", url: "#" },
      { label: "Privacy Policy", url: "#" },
    ],
  };
}
