# Hero Section Rules (do not forget)

## Hero must ALWAYS be full-screen on mobile

The hero section (homepage, memberships, careers, etc.) must always fill the entire viewport — text and buttons at the bottom, video/image properly visible.

**Why this keeps breaking:** There's a global CSS override in `app/globals.css` that strips `min-height` from `.min-h-screen` on mobile (<1024px):

```css
@media (max-width: 1023px) {
  .min-h-screen { min-height: auto !important; }
}
```

This was added for non-hero sections (About, Amenities, Programs, etc.) that shouldn't force full-screen on mobile. But it also catches hero sections.

**The fix:** Any hero section must use **both** `min-h-screen` AND `hero-min-h-screen`:

```tsx
className="relative min-h-screen hero-min-h-screen overflow-hidden ..."
```

The `.hero-min-h-screen` class is defined AFTER `.min-h-screen` in the same media query block in `globals.css`, so it overrides with `min-height: 100vh !important; min-height: 100dvh !important;`.

**Files that need this:**
- `components/HeroSection.tsx` — homepage hero ✅
- `components/membership/HeroMembership.tsx` — memberships hero ✅
- `components/careers/HeroCareers.tsx` — careers hero ✅
- Any new hero section added in the future

**The CSS is defined in `app/globals.css`:**
```css
@media (max-width: 1023px) {
  .min-h-screen { min-height: auto !important; }
  .hero-min-h-screen {
    min-height: 100vh !important;
    min-height: 100dvh !important;
  }
}
```

## Text and CTAs at the bottom

Hero content (title, description, buttons) should always be positioned at the bottom of the hero section, not centered. Use `flex-1` spacer or `mt-auto` + `justify-end` to push content down.