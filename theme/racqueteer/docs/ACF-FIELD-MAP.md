# ACF Field Mapping for Racqueteer WordPress Integration

This document provides a complete reference for setting up ACF Pro field groups and fields for the Racqueteer Next.js site.

## Overview

Each page has its own ACF field group. All text content, URLs, and media references are editable through WordPress admin. The Next.js site will fetch this data via the WP REST API.

---

## 1. Homepage Content

**Field Group Name:** `Homepage Content`  
**Location Rule:** Post Type = Page, Page Template = Homepage  
**WP REST API Endpoint:** `GET /wp-json/wp/v2/pages/home?_fields=acf`

### Hero Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Hero Title | `hero_title` | Text | `HeroSection.title` | Large heading text |
| Hero Description | `hero_description` | Textarea | `HeroSection.description` | Subheading text |
| Hero CTA Primary Text | `hero_cta_primary_text` | Text | `HeroSection.ctaPrimaryText` | Default: "Book a Court" |
| Hero CTA Primary URL | `hero_cta_primary_url` | URL | `HeroSection.ctaPrimaryUrl` | Button link |
| Hero CTA Secondary Text | `hero_cta_secondary_text` | Text | `HeroSection.ctaSecondaryText` | Default: "Become a Member" |
| Hero CTA Secondary URL | `hero_cta_secondary_url` | URL | `HeroSection.ctaSecondaryUrl` | Button link |
| Hero Video URL | `hero_video_url` | File | `HeroSection.videoUrl` | Background video file |

### About Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| About Label | `about_label` | Text | `AboutSection.label` | Small caps label above heading |
| About Title | `about_title` | Text | `AboutSection.title` | Main heading |
| About Description | `about_description` | Textarea | `AboutSection.description` | Body copy |
| Stat 1 Number | `about_stat1_number` | Text | `AboutSection.stat1Number` | e.g., "25" |
| Stat 1 Label | `about_stat1_label` | Text | `AboutSection.stat1Label` | e.g., "Courts of Art" |
| Stat 2 Number | `about_stat2_number` | Text | `AboutSection.stat2Number` | e.g., "8+" |
| Stat 2 Label | `about_stat2_label` | Text | `AboutSection.stat2Label` | e.g., "Years of Experience" |
| Left Image | `about_left_image` | Image | `AboutSection.leftImageUrl` | Pickleball paddle image |
| Right Image | `about_right_image` | Image | `AboutSection.rightImageUrl` | Padel racket image |
| Mobile Image | `about_mobile_image` | Image | `AboutSection.mobileImageUrl` | Combined rackets for mobile |

### Locations Section Header Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Locations Label | `locations_label` | Text | `LocationsSection.label` | Small caps label |
| Locations Title | `locations_title` | Text | `LocationsSection.title` | Main heading |
| Locations Description | `locations_description` | Textarea | `LocationsSection.description` | Body copy |

> **Note:** Individual location data (Homebush, Alexandria) is fetched from the Locations custom post type (see below).

### Programs Section Header Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Programs Label | `programs_label` | Text | `ProgramsSection.label` | Small caps label |
| Programs Title | `programs_title` | Text | `ProgramsSection.title` | Main heading |
| Programs Description | `programs_description` | Textarea | `ProgramsSection.description` | Body copy |
| Programs Tabs | `programs_tabs` | Repeater | `ProgramsSection.tabs` | Tab names (sub-field: `tab_name`) |

> **Note:** Individual program data is fetched from the Programs custom post type (see below).

### Membership Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Membership Label | `membership_label` | Text | `MembershipSection.label` | Small caps label |
| Membership Title | `membership_title` | Text | `MembershipSection.title` | Main heading |
| Membership Description | `membership_description` | Textarea | `MembershipSection.description` | Body copy |
| Membership CTA Text | `membership_cta_text` | Text | `MembershipSection.ctaText` | Button text |
| Membership CTA URL | `membership_cta_url` | URL | `MembershipSection.ctaUrl` | Button link |
| Membership Background Image | `membership_bg_image` | Image | `MembershipSection.backgroundImageUrl` | Section background |

### Subscriptions Section Header Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Subscriptions Label | `subscriptions_label` | Text | `HomeSubscriptionsSection.label` | Small caps label |
| Subscriptions Title | `subscriptions_title` | Text | `HomeSubscriptionsSection.title` | Main heading |
| Subscriptions Description | `subscriptions_description` | Textarea | `HomeSubscriptionsSection.description` | Body copy |

> **Note:** Individual membership plan data is fetched from the Membership Plans custom post type (see below).

### Testimonials Section Header Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Testimonials Label | `testimonials_label` | Text | `TestimonialsSection.label` | Small caps label |
| Testimonials Title | `testimonials_title` | Text | `TestimonialsSection.title` | Main heading |
| Testimonials Description | `testimonials_description` | Textarea | `TestimonialsSection.description` | Body copy |

> **Note:** Individual testimonial data is fetched from the Testimonials custom post type (see below).

### Events Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Events Title | `events_title` | Text | `EventsSection.title` | Main heading |
| Events Description | `events_description` | Textarea | `EventsSection.description` | Body copy |
| Events CTA Text | `events_cta_text` | Text | `EventsSection.ctaText` | Button text |
| Events CTA URL | `events_cta_url` | URL | `EventsSection.ctaUrl` | Button link |
| Events Image | `events_image` | Image | `EventsSection.imageUrl` | Section background image |

---

## 2. Memberships Page Content

**Field Group Name:** `Memberships Page Content`  
**Location Rule:** Post Type = Page, Page Template = Memberships  
**WP REST API Endpoint:** `GET /wp-json/wp/v2/pages/memberships?_fields=acf`

### Hero Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Hero Label | `hero_label` | Text | `HeroMembership.label` | Small caps label |
| Hero Title | `hero_title` | Text | `HeroMembership.title` | Main heading |
| Hero Description | `hero_description` | Textarea | `HeroMembership.description` | Body copy |
| Starting Price | `hero_price_starting` | Text | `HeroMembership.priceStarting` | e.g., "$89" |
| Price Unit | `hero_price_unit` | Text | `HeroMembership.priceUnit` | e.g., "/month" |
| Hero CTA Text | `hero_cta_text` | Text | `HeroMembership.ctaText` | Button text |
| Hero Video URL | `hero_video_url` | File | `HeroMembership.videoUrl` | Background video |

### Subscriptions Section Header Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Subscriptions Label | `subscriptions_label` | Text | `SubscriptionsSection.label` | Small caps label |
| Subscriptions Title | `subscriptions_title` | Text | `SubscriptionsSection.title` | Main heading |
| Subscriptions Description | `subscriptions_description` | Textarea | `SubscriptionsSection.description` | Body copy |

### Price Compare Section Header Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Compare Label | `compare_label` | Text | `PriceCompareSection.label` | Small caps label |
| Compare Title | `compare_title` | Text | `PriceCompareSection.title` | Main heading |
| Compare Description | `compare_description` | Textarea | `PriceCompareSection.description` | Body copy |

---

## 3. Private Events Page Content

**Field Group Name:** `Private Events Page Content`  
**Location Rule:** Post Type = Page, Page Template = Private Events  
**WP REST API Endpoint:** `GET /wp-json/wp/v2/pages/private-events?_fields=acf`

### Hero Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Hero Label | `hero_label` | Text | `HeroPrivateEvents.label` | Small caps label |
| Hero Title | `hero_title` | Text | `HeroPrivateEvents.title` | Main heading |
| Hero Description | `hero_description` | Textarea | `HeroPrivateEvents.description` | Body copy |
| Hero CTA Text | `hero_cta_text` | Text | `HeroPrivateEvents.ctaText` | Button text |
| Hero CTA URL | `hero_cta_url` | URL | `HeroPrivateEvents.ctaUrl` | Button link |
| Hero Video URL | `hero_video_url` | File | `HeroPrivateEvents.videoUrl` | Background video |

### Gallery Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Gallery Label | `gallery_label` | Text | `GallerySection.label` | Small caps label |
| Gallery Title | `gallery_title` | Text | `GallerySection.title` | Main heading |
| Gallery Description | `gallery_description` | Textarea | `GallerySection.description` | Body copy |
| Gallery Images | `gallery_images` | Gallery | `GallerySection.images` | Image gallery |

### Logos Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Logos Label | `logos_label` | Text | `LogoSection.label` | Small caps label |
| Logos Title | `logos_title` | Text | `LogoSection.title` | Main heading |
| Logos Description | `logos_description` | Textarea | `LogoSection.description` | Body copy |
| Logo Images | `logo_images` | Repeater | `LogoSection.logos` | Logo images (sub-field: `logo_image`) |

---

## 4. About Page Content

**Field Group Name:** `About Page Content`  
**Location Rule:** Post Type = Page, Page Template = About  
**WP REST API Endpoint:** `GET /wp-json/wp/v2/pages/about?_fields=acf`

### Hero Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Hero Label | `hero_label` | Text | `HeroAbout.label` | Small caps label |
| Hero Title | `hero_title` | Text | `HeroAbout.title` | Main heading |
| Hero Description | `hero_description` | Textarea | `HeroAbout.description` | Body copy |
| Hero Video URL | `hero_video_url` | File | `HeroAbout.videoUrl` | Background video |

### Mission Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Mission Label | `mission_label` | Text | `MissionSection.label` | Small caps label |
| Mission Title | `mission_title` | Text | `MissionSection.title` | Main heading |
| Mission Description | `mission_description` | Textarea | `MissionSection.description` | Body copy |
| Mission Image | `mission_image` | Image | `MissionSection.imageUrl` | Section image |

### Contact Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Contact Label | `contact_label` | Text | `ContactSection.label` | Small caps label |
| Contact Title | `contact_title` | Text | `ContactSection.title` | Main heading |
| Contact Description | `contact_description` | Textarea | `ContactSection.description` | Body copy |
| Email Label | `contact_email_label` | Text | `ContactSection.emailLabel` | e.g., "Email us" |
| Email Address | `contact_email` | Email | `ContactSection.email` | Contact email |
| Phone Label | `contact_phone_label` | Text | `ContactSection.phoneLabel` | e.g., "Call us" |
| Phone Number | `contact_phone` | Text | `ContactSection.phone` | Contact phone |
| Contact CTA Text | `contact_cta_text` | Text | `ContactSection.ctaText` | Button text |
| Contact CTA URL | `contact_cta_url` | URL | `ContactSection.ctaUrl` | Button link |

---

## 5. Careers Page Content

**Field Group Name:** `Careers Page Content`  
**Location Rule:** Post Type = Page, Page Template = Careers  
**WP REST API Endpoint:** `GET /wp-json/wp/v2/pages/careers?_fields=acf`

### Hero Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Hero Label | `hero_label` | Text | `HeroCareers.label` | Small caps label |
| Hero Title | `hero_title` | Text | `HeroCareers.title` | Main heading |
| Hero Description | `hero_description` | Textarea | `HeroCareers.description` | Body copy |
| Hero Video URL | `hero_video_url` | File | `HeroCareers.videoUrl` | Background video |

### Job Listings Header Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Jobs Label | `jobs_label` | Text | `JobListingsSection.label` | Small caps label |
| Jobs Title | `jobs_title` | Text | `JobListingsSection.title` | Main heading |
| Jobs Description | `jobs_description` | Textarea | `JobListingsSection.description` | Body copy |

> **Note:** Individual job postings are fetched from the Jobs custom post type (see below).

### Career Contact Section Fields

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Contact Label | `contact_label` | Text | `CareerContactSection.label` | Small caps label |
| Contact Title | `contact_title` | Text | `CareerContactSection.title` | Main heading |
| Contact Description | `contact_description` | Textarea | `CareerContactSection.description` | Body copy |
| Contact CTA Text | `contact_cta_text` | Text | `CareerContactSection.ctaText` | Button text |
| Contact CTA URL | `contact_cta_url` | URL | `CareerContactSection.ctaUrl` | Button link (e.g., mailto:) |
| Contact Image | `contact_image` | Image | `CareerContactSection.imageUrl` | Section background |

---

## 6. Site Settings (Global)

**Field Group Name:** `Site Settings`  
**Location Rule:** Options Page = Site Settings  
**WP REST API Endpoint:** Custom endpoint `/wp-json/racqueteer/v1/site-settings`

### Navigation Settings

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Logo (Desktop) | `nav_logo_url` | Image | `Navbar.logoUrl` | Full logo for desktop |
| Logo Alt Text | `nav_logo_alt` | Text | `Navbar.logoAlt` | Alt text for logo |
| Logo Icon (Mobile) | `nav_logo_icon_url` | Image | `Navbar.logoIconUrl` | Icon logo for mobile |
| CTA Button Text | `nav_cta_text` | Text | `Navbar.ctaText` | Default: "Book a Court" |
| CTA Button URL | `nav_cta_url` | URL | `Navbar.ctaUrl` | Button link |
| Menu Links | `nav_menu_links` | Repeater | `Navbar.menuLinks` | Sub-fields: `link_label`, `link_url` |

### Footer Settings

| Field Label | Field Name | Field Type | Component Prop | Notes |
|-------------|-----------|------------|----------------|-------|
| Footer Logo | `footer_logo_url` | Image | `Footer.logoUrl` | Footer logo |
| Footer Logo Alt Text | `footer_logo_alt` | Text | `Footer.logoAlt` | Alt text |
| Contact Label | `footer_contact_label` | Text | `Footer.contactLabel` | Default: "Contact Us" |
| Contact Email | `footer_email` | Email | `Footer.email` | Contact email |
| Contact Phone | `footer_phone` | Text | `Footer.phone` | Contact phone |
| Footer CTA Text | `footer_cta_text` | Text | `Footer.ctaText` | Button text |
| Footer CTA URL | `footer_cta_url` | URL | `Footer.ctaUrl` | Button link |
| Menu Label | `footer_menu_label` | Text | `Footer.menuLabel` | Default: "Menu" |
| Footer Menu Links | `footer_menu_links` | Repeater | `Footer.menuLinks` | Sub-fields: `link_label`, `link_url` |
| Locations Label | `footer_locations_label` | Text | `Footer.locationsLabel` | Default: "Locations" |
| Locations | `footer_locations` | Repeater | `Footer.locations` | Sub-fields: `location_name`, `location_address` |
| Copyright Text | `footer_copyright` | Text | `Footer.copyrightText` | e.g., "©2026 Racqueteer..." |
| Legal Links | `footer_legal_links` | Repeater | `Footer.legalLinks` | Sub-fields: `link_label`, `link_url` |

---

## 7. Custom Post Types

### Jobs CPT

**Post Type:** `job`  
**WP REST API Endpoint:** `GET /wp-json/wp/v2/jobs`

**ACF Field Group Name:** `Job Details`

| Field Label | Field Name | Field Type | Notes |
|-------------|-----------|------------|-------|
| Job Title | (Post Title) | Built-in | Job position name |
| Job Description | (Post Content) | Built-in | Full job description |
| Job Category | `job_category` | Select | Manager, Trainer, Barista, etc. |
| Posted Date | (Post Date) | Built-in | Publication date |

### Membership Plans CPT

**Post Type:** `membership_plan`  
**WP REST API Endpoint:** `GET /wp-json/wp/v2/membership-plans`

**ACF Field Group Name:** `Membership Plan Details`

| Field Label | Field Name | Field Type | Notes |
|-------------|-----------|------------|-------|
| Plan Name | (Post Title) | Built-in | STARTER, LIGHT, PRO, PRO+ |
| Plan Description | `plan_description` | Text | Short description |
| Plan Price | `plan_price` | Text | e.g., "$89" |
| Button Variant | `plan_button_variant` | Select | blue or red |
| Has Featured Image | `plan_has_image` | True/False | Show badge/star |
| Background Class | `plan_bg_class` | Text | CSS class name |
| Border Class | `plan_border_class` | Text | CSS class name |
| Feature Values | `plan_feature_values` | Repeater | Sub-field: `feature_value` (check/cross/text) |

### Testimonials CPT

**Post Type:** `testimonial`  
**WP REST API Endpoint:** `GET /wp-json/wp/v2/testimonials`

**ACF Field Group Name:** `Testimonial Details`

| Field Label | Field Name | Field Type | Notes |
|-------------|-----------|------------|-------|
| Testimonial Quote | (Post Content) | Built-in | The testimonial text |
| Author Name | `testimonial_author_name` | Text | Person's name |
| Author Subtitle | `testimonial_author_subtitle` | Text | e.g., "Beginner Training" |
| Rating | `testimonial_rating` | Number | e.g., 5.0 |
| Max Rating | `testimonial_max_rating` | Number | e.g., 5.0 |
| Category | `testimonial_category` | Select | Beginner/Intermediate/Advanced Training |

### Locations CPT

**Post Type:** `location`  
**WP REST API Endpoint:** `GET /wp-json/wp/v2/locations`

**ACF Field Group Name:** `Location Details`

| Field Label | Field Name | Field Type | Notes |
|-------------|-----------|------------|-------|
| Location Name | (Post Title) | Built-in | e.g., "Homebush Club" |
| Location Status | `location_status` | Select | available or coming_soon |
| Address Line 1 | `location_address_1` | Text | First line of address |
| Address Line 2 | `location_address_2` | Text | Second line of address |
| Description | `location_description` | Textarea | Location description |
| Featured Image | (Post Thumbnail) | Built-in | Location photo |
| Amenities | `location_amenities` | Repeater | Sub-fields: `amenity_label` (text) |

### Programs CPT

**Post Type:** `program`  
**WP REST API Endpoint:** `GET /wp-json/wp/v2/programs`

**ACF Field Group Name:** `Program Details`

| Field Label | Field Name | Field Type | Notes |
|-------------|-----------|------------|-------|
| Program Title | (Post Title) | Built-in | Program name |
| Program Color | `program_color` | Select | red or blue |
| Program Price | `program_price` | Text | e.g., "$40" |
| Price Unit | `program_price_unit` | Text | e.g., "per game" |
| Program Description | (Post Content) | Built-in | Full description |
| Program Category | `program_category` | Select | Programming, Coaching, Events |

---

## Implementation Notes

### WordPress Developer Instructions

1. **Create all ACF field groups** as specified above using ACF Pro
2. **Set up custom post types** (Jobs, Membership Plans, Testimonials, Locations, Programs)
3. **Enable REST API** for all custom post types and ACF fields
4. **Create a custom endpoint** for Site Settings: `/wp-json/racqueteer/v1/site-settings`
5. **Populate initial content** using the hardcoded defaults from `lib/api.ts` as reference

### Next.js Developer Instructions

1. **Update `lib/api.ts`** functions to fetch from WP REST API instead of returning hardcoded data
2. **Add error handling** for failed API calls
3. **Implement caching** (consider ISR or on-demand revalidation)
4. **Add loading states** where appropriate
5. **Test all pages** to ensure data flows correctly from WordPress to Next.js

### REST API Field Mapping

When fetching from WordPress, the ACF fields will be available under the `acf` key in the response:

```json
{
  "id": 123,
  "title": { "rendered": "Homepage" },
  "acf": {
    "hero_title": "Where Elite Competition...",
    "hero_description": "Perfect for newcomers...",
    // ... all other ACF fields
  }
}
```

Map these ACF field names to the TypeScript interface properties as documented in this file.

---

## Summary

- **5 page-level ACF field groups** (Homepage, Memberships, Private Events, About, Careers)
- **1 global site settings field group** (Navigation & Footer)
- **5 custom post types** (Jobs, Membership Plans, Testimonials, Locations, Programs)
- **~100+ total ACF fields** across all groups
- All fields map to TypeScript interfaces defined in `types/index.ts`
- All data flows through `lib/api.ts` functions

This ensures complete separation of concerns: WordPress manages content, Next.js handles presentation.
