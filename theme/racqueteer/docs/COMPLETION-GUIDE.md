# Completion Guide - ACF Pro Prep Refactor

This guide provides step-by-step instructions to complete the remaining component refactors.

---

## Quick Reference

**Files you'll be editing:**
- Components: `components/*.tsx` and `components/[page]/*.tsx`
- Page files: `app/*/page.tsx`

**Pattern for every refactor:**
1. Add TypeScript interface import
2. Define Props interface
3. Add props parameter to component function
4. Replace hardcoded strings with `{content.propertyName}`
5. Update page file to fetch & pass content

---

## Example: LocationsSection Refactor

### Step 1: Update Component

**File:** `components/LocationsSection.tsx`

```tsx
// Add at top:
import type { LocationsContent } from "@/types";

interface LocationsSectionProps {
  content: LocationsContent;
}

// Update function signature:
export default function LocationsSection({ content }: LocationsSectionProps) {
  // Keep existing amenities and locations data as-is
  // (they use getLocations() API function)
  
  return (
    <section>
      {/* Replace hardcoded header text */}
      <p className="...uppercase...">{content.label}</p>
      <h2 className="...">{content.title}</h2>
      <p className="...">{content.description}</p>
      
      {/* Rest of component stays the same */}
    </section>
  );
}
```

### Step 2: Update Page File

**File:** `app/page.tsx`

```tsx
// Already imported getHomepageContent
// Just add to JSX:
<LocationsSection content={homepageContent.locations} />
```

---

## Remaining Components - Quick Reference

### Homepage Components

#### LocationsSection
```tsx
// Props to add:
interface LocationsSectionProps {
  content: LocationsContent;  // { label, title, description }
}

// Replace in JSX:
{content.label}
{content.title}
{content.description}
```

#### ProgramsSection
```tsx
// Props to add:
interface ProgramsSectionProps {
  content: ProgramsContent;  // { label, title, description, tabs }
}

// Replace in JSX:
{content.label}
{content.title}
{content.description}
{content.tabs.map(...)}  // for tab navigation
```

#### MembershipSection
```tsx
// Props to add:
interface MembershipSectionProps {
  content: MembershipContent;  // { label, title, description, ctaText, ctaUrl, backgroundImageUrl }
}

// Replace in JSX:
{content.label}
{content.title}
{content.description}
{content.ctaText}
href={content.ctaUrl}
style={{ backgroundImage: `url(${content.backgroundImageUrl})` }}
```

#### HomeSubscriptionsSection
```tsx
// Props to add:
interface HomeSubscriptionsSectionProps {
  content: HomeSubscriptionsContent;  // { label, title, description }
}

// Replace in JSX:
{content.label}
{content.title}
{content.description}
```

#### TestimonialsSection
```tsx
// Props to add:
interface TestimonialsSectionProps {
  content: TestimonialsContent;  // { label, title, description }
}

// Replace in JSX:
{content.label}
{content.title}
{content.description}
```

#### EventsSection
```tsx
// Props to add:
interface EventsSectionProps {
  content: EventsContent;  // { title, description, ctaText, ctaUrl, imageUrl }
}

// Replace in JSX:
{content.title}
{content.description}
{content.ctaText}
href={content.ctaUrl}
src={content.imageUrl}
```

### Memberships Page Components

**File:** `app/memberships/page.tsx`

```tsx
import { getMembershipsPageContent, getNavbarContent, getFooterContent } from "@/lib/api";

export default async function MembershipsPage() {
  const pageContent = await getMembershipsPageContent();
  const navbarContent = await getNavbarContent();
  const footerContent = await getFooterContent();

  return (
    <>
      <Navbar content={navbarContent} />
      <HeroMembership content={pageContent.hero} />
      <SubscriptionsSection content={pageContent.subscriptionsHeader} />
      <PriceCompareSection content={pageContent.priceCompareHeader} />
      <Footer content={footerContent} />
    </>
  );
}
```

#### HeroMembership
```tsx
// Props:
interface HeroMembershipProps {
  content: MembershipHeroContent;
}

// Replace:
{content.label}
{content.title}
{content.description}
{content.priceStarting}
{content.priceUnit}
{content.ctaText}
src={content.videoUrl}
```

#### SubscriptionsSection
```tsx
// Props:
interface SubscriptionsSectionProps {
  content: SubscriptionsHeaderContent;
}

// Replace header only:
{content.label}
{content.title}
{content.description}
// Keep getMembershipPlans() call for card data
```

#### PriceCompareSection
```tsx
// Props:
interface PriceCompareSectionProps {
  content: PriceCompareHeaderContent;
}

// Replace header only:
{content.label}
{content.title}
{content.description}
// Keep getPriceCompareData() call for table data
```

### Private Events Page Components

**File:** `app/private-events/page.tsx`

```tsx
import { getPrivateEventsPageContent, getNavbarContent, getFooterContent } from "@/lib/api";

export default async function PrivateEventsPage() {
  const pageContent = await getPrivateEventsPageContent();
  const navbarContent = await getNavbarContent();
  const footerContent = await getFooterContent();

  return (
    <>
      <Navbar content={navbarContent} />
      <HeroPrivateEvents content={pageContent.hero} />
      <GallerySection content={pageContent.gallery} />
      <LogoSection content={pageContent.logos} />
      <Footer content={footerContent} />
    </>
  );
}
```

#### HeroPrivateEvents
```tsx
// Props:
interface HeroPrivateEventsProps {
  content: PrivateEventsHeroContent;
}

// Replace:
{content.label}
{content.title}
{content.description}
{content.ctaText}
href={content.ctaUrl}
src={content.videoUrl}
```

#### GallerySection
```tsx
// Props:
interface GallerySectionProps {
  content: GalleryContent;
}

// Replace:
{content.label}
{content.title}
{content.description}
{content.images.map((img) => <img src={img} ... />)}
```

#### LogoSection
```tsx
// Props:
interface LogoSectionProps {
  content: LogoContent;
}

// Replace:
{content.label}
{content.title}
{content.description}
{content.logos.map((logo) => <img src={logo} ... />)}
```

### About Page Components

**File:** `app/about/page.tsx`

```tsx
import { getAboutPageContent, getNavbarContent, getFooterContent } from "@/lib/api";

export default async function AboutPage() {
  const pageContent = await getAboutPageContent();
  const navbarContent = await getNavbarContent();
  const footerContent = await getFooterContent();

  return (
    <>
      <Navbar content={navbarContent} />
      <HeroAbout content={pageContent.hero} />
      <MissionSection content={pageContent.mission} />
      <ContactSection content={pageContent.contact} />
      <Footer content={footerContent} />
    </>
  );
}
```

#### HeroAbout
```tsx
// Props:
interface HeroAboutProps {
  content: AboutHeroContent;
}

// Replace:
{content.label}
{content.title}
{content.description}
src={content.videoUrl}
```

#### MissionSection
```tsx
// Props:
interface MissionSectionProps {
  content: MissionContent;
}

// Replace:
{content.label}
{content.title}
{content.description}
src={content.imageUrl}
```

#### ContactSection
```tsx
// Props:
interface ContactSectionProps {
  content: ContactContent;
}

// Replace:
{content.label}
{content.title}
{content.description}
{content.emailLabel}
href={`mailto:${content.email}`}
{content.email}
{content.phoneLabel}
href={`tel:${content.phone.replace(/\s/g, '')}`}
{content.phone}
{content.ctaText}
href={content.ctaUrl}
```

### Careers Page Components

**File:** `app/careers/page.tsx`

```tsx
import { getCareersPageContent, getNavbarContent, getFooterContent } from "@/lib/api";

export default async function CareersPage() {
  const pageContent = await getCareersPageContent();
  const navbarContent = await getNavbarContent();
  const footerContent = await getFooterContent();

  return (
    <>
      <Navbar content={navbarContent} />
      <HeroCareers content={pageContent.hero} />
      <JobListingsSection content={pageContent.jobListingsHeader} />
      <CareerContactSection content={pageContent.careerContact} />
      <Footer content={footerContent} />
    </>
  );
}
```

#### HeroCareers
```tsx
// Props:
interface HeroCareersProps {
  content: CareersHeroContent;
}

// Replace:
{content.label}
{content.title}
{content.description}
src={content.videoUrl}
```

#### JobListingsSection
```tsx
// Props:
interface JobListingsSectionProps {
  content: JobListingsHeaderContent;
}

// Replace header only:
{content.label}
{content.title}
{content.description}
// Keep getJobs() call for job cards
```

#### CareerContactSection
```tsx
// Props:
interface CareerContactSectionProps {
  content: CareerContactContent;
}

// Replace:
{content.label}
{content.title}
{content.description}
{content.ctaText}
href={content.ctaUrl}
src={content.imageUrl}
```

---

## Testing Checklist

After each component refactor:

1. **TypeScript check:**
   ```bash
   cd projects/racqueteer-next
   npm run build
   ```

2. **Visual check:**
   - Visit the page in browser (http://localhost:3042)
   - Verify text appears correctly
   - Verify no layout shifts
   - Verify no missing content

3. **HTTP status check:**
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3042
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3042/memberships
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3042/private-events
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3042/about
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3042/careers
   ```
   All should return `200`.

---

## Tips

### Finding Hardcoded Text
```bash
# Search for likely hardcoded strings in a component:
grep -n '"[A-Z]' components/SomeSection.tsx
grep -n "'" components/SomeSection.tsx | grep -v className
```

### Verifying Types Are Available
All types are already defined in `types/index.ts`. Check there if you're unsure of a property name.

### Checking API Function Exists
All page-level content functions are already in `lib/api.ts`:
- `getHomepageContent()`
- `getMembershipsPageContent()`
- `getPrivateEventsPageContent()`
- `getAboutPageContent()`
- `getCareersPageContent()`
- `getNavbarContent()`
- `getFooterContent()`

---

## Common Patterns

### Replace a simple text field:
```tsx
// Before:
<h2>Hardcoded Title</h2>

// After:
<h2>{content.title}</h2>
```

### Replace a link:
```tsx
// Before:
<a href="/memberships">Become a Member</a>

// After:
<a href={content.url}>{content.text}</a>
```

### Replace an image:
```tsx
// Before:
<img src="/hero-video.mp4" alt="Hero" />

// After:
<img src={content.videoUrl} alt="Hero" />
```

### Replace a button:
```tsx
// Before:
<button>Book Now</button>

// After:
<button>{content.ctaText}</button>
```

---

## Final Step: Update Homepage

**File:** `app/page.tsx`

Replace the placeholder sections with content props:

```tsx
export default async function HomePage() {
  const homepageContent = await getHomepageContent();
  const navbarContent = await getNavbarContent();
  const footerContent = await getFooterContent();

  return (
    <div className="overflow-x-hidden">
      <Navbar content={navbarContent} />
      <HeroSection content={homepageContent.hero} />
      <AboutSection content={homepageContent.about} />
      <LocationsSection content={homepageContent.locations} />
      <ProgramsSection content={homepageContent.programs} />
      <MembershipSection content={homepageContent.membership} />
      <HomeSubscriptionsSection content={homepageContent.subscriptions} />
      <TestimonialsSection content={homepageContent.testimonials} />
      <EventsSection content={homepageContent.events} />
      <Footer content={footerContent} />
    </div>
  );
}
```

---

## Done!

When all components are refactored and all 5 pages return 200:

1. ✅ Run final build: `npm run build`
2. ✅ Visual regression test each page
3. ✅ Mark REFACTOR-STATUS.md as complete
4. ✅ Commit changes

The site is now ready for WordPress/ACF Pro integration!
