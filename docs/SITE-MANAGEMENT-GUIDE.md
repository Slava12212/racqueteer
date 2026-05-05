# Racqueteer — Site Management Guide

> **Who this document is for:** Content editors and site administrators who need to update text, images, videos, job listings, and other content on the Racqueteer website — without touching any code.

---

## 📌 Access Credentials

| Service | URL | Login |
|---------|-----|-------|
| **WordPress Admin** | *(add WP admin URL here)* | *(add credentials here)* |
| **Vercel Dashboard** | https://vercel.com | *(add credentials here)* |
| **Hosting / FTP** | *(add FTP host here)* | *(add credentials here)* |

> **Note:** WordPress Admin is your main tool for content management. Vercel and Hosting access are only needed for technical deployment tasks.

---

## 🗺️ How the Site Works (in plain terms)

```
WordPress Admin (your CMS)
         ↓  you save content
     GraphQL API
         ↓  data is delivered automatically
   Next.js Website (what visitors see)
         ↓  updates within ~1–5 seconds via webhook
```

- **You edit content in WordPress** — text, images, job listings, etc.
- **The website updates automatically** within a few seconds after you save.
- **No code or deployments are required** for content changes.

---

## 🧭 WordPress Admin Overview

After logging in to WordPress Admin, the left sidebar contains:

| Menu Item | What it manages |
|-----------|----------------|
| **Pages** | The 5 main pages (Home, Memberships, Private Events, About, Careers) |
| **Jobs** | Job listings shown on the Careers page |
| **Testimonials** | Customer reviews shown on the Home page |
| **Membership Plans** | Pricing cards on the Memberships page |
| **Locations** | Club locations shown on Home and About pages |
| **Programs** | Training program cards on the Home page |
| **Site Settings → Navbar** | Navigation header: logo, menu links, CTA button |
| **Site Settings → Footer** | Footer: contacts, menu links, locations, copyright |
| **Settings → Racqueteer** | Webhook configuration (Next.js URL + secret) |

---

## ✏️ Editing Page Content (Blocks)

Each page is built from **ACF Blocks** — content sections that you fill in directly. Think of each block as a section of the page with its own fields.

### Steps to edit a page:

1. Go to **WP Admin → Pages**
2. Click on the page you want to edit
3. In the Gutenberg editor, **click on the block** you want to change
4. The **block fields appear in the right sidebar** (ACF sidebar panel)
5. Edit the fields
6. Click **Update** (top right)
7. **The website updates automatically within ~1–5 seconds**

> ⚠️ If the page doesn't update immediately, wait up to 60 seconds (ISR cache). If still not updated — see Troubleshooting section.

---

## 🌐 Global: Navbar (Header)

**Location:** `WP Admin → Site Settings → Navbar`

| Field | Type | What it changes on the site |
|-------|------|----------------------------|
| **Logo** | Image | Full logo displayed in the header (desktop) |
| **Logo Icon** | Image | Small icon-only logo (mobile / compact view) |
| **Navigation Links** | Repeater | Menu items in the top navigation |
| ↳ Label | Text | Menu item text (e.g. "Memberships") |
| ↳ URL | Text | Page path or full URL (e.g. `/memberships` or `https://...`) |
| **CTA Button Text** | Text | Text on the "Book a Court" button |
| **CTA Button URL** | Text | Where the button links to (e.g. `/memberships`) |

> **URL format:** Use a relative path like `/memberships` for internal pages, or a full URL like `https://...` for external links.

---

## 🌐 Global: Footer

**Location:** `WP Admin → Site Settings → Footer`

| Field | Type | What it changes on the site |
|-------|------|----------------------------|
| **Footer Logo** | Image | Logo displayed in the footer |
| **Contact Email** | Email | Contact email address shown in the footer |
| **Contact Phone** | Text | Phone number shown in the footer |
| **CTA Button Text** | Text | Text on the footer call-to-action button |
| **CTA Button URL** | Text | Where the footer CTA button links to |
| **Menu Links** | Repeater | Footer navigation links |
| ↳ Label | Text | Link text (e.g. "About Us") |
| ↳ URL | Text | Link path (e.g. `/about`) |
| **Locations** | Repeater | Location addresses shown in the footer |
| ↳ Name | Text | Location name (e.g. "Homebush") |
| ↳ Address | Textarea | Multi-line address |
| **Copyright Text** | Text | Copyright line (e.g. "© 2026 Racqueteer. All rights reserved.") |
| **Legal Links** | Repeater | Privacy Policy, Terms, etc. |
| ↳ Label | Text | Link text (e.g. "Privacy Policy") |
| ↳ URL | Text | Link path (e.g. `/privacy-policy`) |

---

## 🏠 Home Page (`/`)

**Location:** `WP Admin → Pages → Home`

### Hero Section
*Full-screen video banner with headline and two buttons.*

| Field | Type | Description |
|-------|------|-------------|
| **Title** | Text | Main headline (e.g. "Sydney's Premier Pickleball & Padel Club") |
| **Description** | Textarea | Subheading paragraph below the title |
| **CTA Primary Text** | Text | Text on the main (red) button |
| **CTA Primary URL** | Text | Link for the main button (e.g. `/memberships`) |
| **CTA Secondary Text** | Text | Text on the secondary (outline) button |
| **CTA Secondary URL** | Text | Link for the secondary button (e.g. `/about`) |
| **Video URL** | Text | Path to the background video file (e.g. `/hero-video-opt.mp4`) |

> **Video files** are stored in the Next.js `public/` folder. To use a new video, a developer needs to upload the file first.

---

### About Section
*Two-column section with photos, statistics, and description text.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label above the title (e.g. "WHO WE ARE") |
| **Title** | Text | Section heading |
| **Description** | Textarea | Body text |
| **Stat 1 Number** | Text | First statistic number (e.g. "12+") |
| **Stat 1 Label** | Text | Label for first stat (e.g. "Courts Available") |
| **Stat 2 Number** | Text | Second statistic number |
| **Stat 2 Label** | Text | Label for second stat |
| **Left Image** | Image | Left photo in the two-image composition |
| **Right Image** | Image | Right photo in the two-image composition |

---

### Locations Section
*Section header only — the location cards are managed via the Locations CPT (see below).*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label (e.g. "OUR LOCATIONS") |
| **Title** | Text | Section heading |
| **Description** | Textarea | Section subheading text |

---

### Programs Section
*Section header + tab navigation — program cards are managed via the Programs CPT.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading |
| **Description** | Textarea | Section subheading |
| **Tabs** | Text | Comma-separated tab names (e.g. `Pickleball,Padel,Tennis`) |

---

### Membership CTA Section
*Full-width banner with background image and a call-to-action.*

> **Note:** This section is currently hidden per client request but the content fields are still maintained.

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading |
| **Description** | Textarea | Body text |
| **CTA Text** | Text | Button text |
| **CTA URL** | Text | Button link |
| **Background Image** | Image | Full-width background photo for this section |

---

### Subscriptions Section (Home)
*Section header only — membership plan cards come from the Membership Plans CPT.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading |
| **Description** | Textarea | Section subheading |

---

### Testimonials Section
*Section header only — testimonial cards come from the Testimonials CPT.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading |
| **Description** | Textarea | Section subheading |

---

### Events Section
*Section with a background image/video and a call-to-action.*

| Field | Type | Description |
|-------|------|-------------|
| **Title** | Text | Section heading |
| **Description** | Textarea | Body text |
| **CTA Text** | Text | Button text (e.g. "Learn More") |
| **CTA URL** | Text | Button link |
| **Image** | Image | Background or feature image for this section |

---

## 💳 Memberships Page (`/memberships`)

**Location:** `WP Admin → Pages → Memberships`

### Membership Hero Section
*Full-screen video hero with headline, pricing teaser, and CTA.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label (e.g. "MEMBERSHIPS") |
| **Title** | Text | Main heading |
| **Description** | Textarea | Subheading paragraph |
| **Price Starting From** | Text | Starting price text (e.g. "$49") |
| **Price Unit** | Text | Price unit (e.g. "/week") |
| **CTA Text** | Text | Button text |
| **Video URL** | Text | Path or URL to the background video |

---

### Subscriptions Detail Section
*Section header — plan cards come from the Membership Plans CPT.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading |
| **Description** | Textarea | Section subheading |

---

### Price Compare Section
*Header section for the comparison table.*

> **Note:** Currently hidden per client request.

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading |
| **Description** | Textarea | Section subheading |

---

## 🎉 Private Events Page (`/private-events`)

**Location:** `WP Admin → Pages → Private Events`

### Private Events Hero Section
*Full-screen video hero.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Main heading |
| **Description** | Textarea | Subheading paragraph |
| **CTA Text** | Text | Button text |
| **CTA URL** | Text | Button link |
| **Video URL** | Text | Path or URL to the background video |

---

### Gallery Section
*Photo grid/gallery.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading |
| **Description** | Textarea | Section subheading |
| **Images** | Gallery | Multiple photos for the gallery (upload via media library) |

> **How to add images to a gallery field:** Click the field → select existing media or upload new images → save.

---

### Logo Marquee Section
*Scrolling strip of partner/sponsor logos.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading |
| **Logos** | Gallery | Partner/sponsor logo images |

---

## ℹ️ About Page (`/about`)

**Location:** `WP Admin → Pages → About`

### About Hero Section
*Full-screen video hero.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Main heading |
| **Description** | Textarea | Subheading paragraph |
| **Video URL** | Text | Path or URL to the background video |

---

### Mission Section
*Two-column section: text on one side, image on the other.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading |
| **Description** | Textarea | Body text |
| **Image** | Image | Feature photo beside the text |

---

### Contact Section
*Contact information block.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading |
| **Description** | Textarea | Introductory text |
| **Email** | Email | Contact email address |
| **Phone** | Text | Contact phone number |
| **CTA Text** | Text | Button text (e.g. "Get in Touch") |
| **CTA URL** | Text | Button link |

---

## 👔 Careers Page (`/careers`)

**Location:** `WP Admin → Pages → Careers`

### Careers Hero Section
*Full-screen video hero.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Main heading |
| **Description** | Textarea | Subheading paragraph |
| **Video URL** | Text | Path or URL to the background video |

---

### Job Listings Section
*Section header — job cards come from the Jobs CPT (see Managing Jobs below).*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading (e.g. "Open Positions") |
| **Description** | Textarea | Section subheading |

---

### Career Contact Section
*"Can't find your role?" contact block.*

| Field | Type | Description |
|-------|------|-------------|
| **Label** | Text | Small uppercase label |
| **Title** | Text | Section heading |
| **Description** | Textarea | Body text |
| **CTA Text** | Text | Button text |
| **CTA URL** | Text | Button link (e.g. `mailto:careers@racqueteer.com`) |
| **Image** | Image | Feature image beside the text |

---

## 📦 Managing Custom Post Types (CPT)

Custom Post Types are standalone content records that feed into block sections automatically. You manage them independently from the pages.

### Jobs (Careers Page)

**Location:** `WP Admin → Jobs`

Each job listing has:

| Field | Type | Description |
|-------|------|-------------|
| **Title** (post title) | Text | Job title (e.g. "Head Padel Coach") |
| **Category** | Text | Role category (e.g. "Coaching", "Operations", "Hospitality") |
| **Description** | Textarea | Short role description shown on the card |

**How to add a new job:**
1. `WP Admin → Jobs → Add New`
2. Enter the job title
3. Fill in the Category and Description fields
4. Click **Publish**
5. The Careers page updates automatically within ~5 seconds

**How to remove a job from the site without deleting it:**
1. Open the job
2. Change status to **Draft**
3. Click **Update** — the job disappears from the site immediately

---

### Testimonials (Home Page)

**Location:** `WP Admin → Testimonials`

| Field | Type | Description |
|-------|------|-------------|
| **Title** (post title) | Text | Internal name only (not shown on site) |
| **Category** | Text | Used for filtering tabs (e.g. "Pickleball", "Padel") |
| **Rating** | Number | Star rating number (e.g. `5`) |
| **Max Rating** | Number | Maximum stars (usually `5`) |
| **Quote** | Textarea | The testimonial text |
| **Author Name** | Text | Customer's name |
| **Author Subtitle** | Text | Role or context (e.g. "Pickleball Member") |

---

### Membership Plans (Memberships/Home Pages)

**Location:** `WP Admin → Membership Plans`

| Field | Type | Description |
|-------|------|-------------|
| **Title** (post title) | Text | Plan name (e.g. "Pro") |
| **Price** | Text | Price string (e.g. "$99/week") |
| **Description** | Text | Short plan description |
| **Button Variant** | Select | Card button colour: `Blue` or `Red` |
| **BG Class** | Text | Tailwind CSS background class (e.g. `bg-white`) |
| **Border Class** | Text | Tailwind CSS border class |
| **Has Image** | Checkbox | Whether to show a racket image on this card |
| **Values (comma-separated)** | Text | Feature list values: `check`, `cross`, or custom text, separated by commas |

> **Display order:** Plans are shown in their WordPress **menu order** (drag-and-drop order in the WP Admin list view). Use `WP Admin → Membership Plans → Quick Edit → Order` to set numeric order.

---

### Locations (Home / About Pages)

**Location:** `WP Admin → Locations`

| Field | Type | Description |
|-------|------|-------------|
| **Title** (post title) | Text | Internal name |
| **Location ID** | Text | Short identifier (e.g. `homebush`) |
| **Name** | Text | Display name (e.g. "Homebush") |
| **Status** | Select | `Available` or `Coming Soon` |
| **Address** | Textarea | Address lines (one per line — each line is shown separately) |
| **Description** | Textarea | Short description of the location |
| **Image** | Image | Location photo |

---

### Programs (Home Page)

**Location:** `WP Admin → Programs`

| Field | Type | Description |
|-------|------|-------------|
| **Title** | Text | Program name (e.g. "Beginner Pickleball") |
| **Color** | Select | Card accent colour: `Red` or `Blue` |
| **Price** | Text | Price string (e.g. "$25") |
| **Unit** | Text | Price unit (e.g. "per session") |
| **Description** | Textarea | Short program description |

---

## ➕ Creating New Pages

Any new page you create in WordPress automatically appears on the website:

1. `WP Admin → Pages → Add New`
2. Set title and **slug** (URL path, e.g. `summer-camp`)
3. Add ACF blocks to the page using the Gutenberg `+` button → **Racqueteer** category
4. Fill in the block fields
5. Click **Publish**
6. The page appears at `https://racqueteer.com/summer-camp` automatically

**Hiding a page (without deleting):**
- Set status to **Draft** → the page returns a 404 error for visitors
- Set back to **Published** → page is live again immediately

---

## 🖼️ Working with Media

### Uploading images
`WP Admin → Media → Add New` — drag and drop or click to upload.

### Using images in blocks
When editing a block, **Image** and **Gallery** fields open the media library. You can:
- Select a previously uploaded file
- Upload a new file directly from the field

### Video files
Video fields use a **Text field** (not a file upload). Enter:
- A relative path to a file in the Next.js `public/` folder: `/hero-video-opt.mp4`
- A full external URL: `https://cdn.example.com/video.mp4`

> To add a new video file, a developer must upload it to the `public/` folder and deploy.

### Image display note
Images uploaded to WordPress Media Library are automatically converted from internal IDs to public URLs by the server. You will always see the correct URL in the ACF field after saving.

---

## ⏱️ How Fast Do Changes Appear?

| Change type | Time to appear |
|-------------|---------------|
| Page block content (text, image) | ~1–5 seconds (webhook) |
| New/updated Job, Testimonial, Location | ~1–5 seconds (webhook) |
| Navbar / Footer (Site Settings) | ~1–60 seconds |
| New page published | ~1 second (webhook triggers ISR) |
| Page moved to Draft | ~1 second (page becomes 404) |
| Maximum wait if webhook failed | 60 minutes (automatic ISR refresh) |

---

## 🐛 Troubleshooting

### Page content didn't update after saving

1. Did you click **Update** (not just close the tab)?
2. Wait up to 60 seconds — ISR cache refreshes automatically
3. Check `WP Admin → Settings → Racqueteer` — make sure Next.js URL and Secret are filled in
4. Manual cache clear via terminal (developer action):
   ```
   POST https://racqueteer.vercel.app/api/revalidate?secret=YOUR_SECRET
   Body: {"slug": "/"}
   ```

### Image shows as a number (e.g. `src="54"`)

This means an older version of the PHP theme is on the server.
- A developer needs to upload the latest `wp/inc/graphql-extensions.php` (v19+) to the hosting server.

### "Please enter a valid URL" error in WP Admin for URL fields

This is fixed in the current version of `acf-blocks.php`. URL fields now accept relative paths like `/memberships`.
- If you see this error, the hosting server has an old version of `acf-blocks.php`.

### Job listings not showing on Careers page

- Check that the job is **Published** (not Draft)
- Check that all required fields (Category, Description) are filled in
- Saving the job automatically triggers a page refresh

### New page not appearing on the website

- Make sure the page is **Published** (not Draft or Private)
- Verify the page has at least one ACF block added
- A draft page shows a 404 — publish it to make it live

### Logo in header/footer showing wrong image

- Go to `WP Admin → Site Settings → Navbar` (or Footer)
- Make sure the Logo / Footer Logo field has an image selected
- If the field is empty, the site uses the hardcoded default logo

---

## 📋 Quick Reference Checklist

```
To update text on any section:
  WP Admin → Pages → [page name] → click block → edit fields → Update

To update navigation links:
  WP Admin → Site Settings → Navbar

To update footer content:
  WP Admin → Site Settings → Footer

To add a job listing:
  WP Admin → Jobs → Add New → fill fields → Publish

To add a testimonial:
  WP Admin → Testimonials → Add New → fill fields → Publish

To add a location:
  WP Admin → Locations → Add New → fill fields → Publish

To create a new page:
  WP Admin → Pages → Add New → add blocks from Racqueteer category → Publish

To hide a page:
  WP Admin → Pages → [page] → change to Draft → Update
```

