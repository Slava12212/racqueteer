# Racqueteer — Site Management Guide

> **Who this document is for:** Content editors and site administrators who need to update text, images, videos, job listings, and other content on the Racqueteer website — without touching any code.

---

## 📌 Access Credentials

| Service | URL | Login |
|---------|-----|-------|
| **WordPress Admin** | *(add WP admin URL here)* | *(add credentials here)* |

> WordPress Admin is your only tool for content management. Nothing else is needed.

---

## 🗺️ How the Site Works

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
| **Site Settings → Book Modal** | "Book a Court" popup: sports, images, booking URLs |

---

## ✏️ Editing Page Content

Each page is built from content sections. To edit a section:

1. Go to **WP Admin → Pages**
2. Click on the page you want to edit
3. In the editor, **click on the section** you want to change
4. The **section fields appear in the right sidebar**
5. Edit the fields
6. Click **Update** (top right)
7. **The website updates automatically within ~1–5 seconds**

> ⚠️ If the page doesn't update immediately, wait up to 60 seconds. If still not updated — contact your developer.

---

## 🌐 Global: Navbar (Header)

**Location:** `WP Admin → Site Settings → Navbar`

| Field | What it changes on the site |
|-------|----------------------------|
| **Logo (desktop)** | Full logo displayed in the header |
| **Logo Icon (mobile)** | Small icon-only logo for mobile screens |
| **Navigation Links** | Menu items in the top navigation |
| ↳ Label | Menu item text (e.g. "Memberships") |
| ↳ URL | Page path or full URL (e.g. `/memberships` or `https://...`) |
| **CTA Button Text** | Text on the "Book a Court" button |
| **CTA Button URL** | Where the button links to |

---

## 🌐 Global: Footer

**Location:** `WP Admin → Site Settings → Footer`

| Field | What it changes on the site |
|-------|----------------------------|
| **Footer Logo** | Logo displayed in the footer |
| **Contact Email** | Contact email address shown in the footer |
| **Contact Phone** | Phone number shown in the footer |
| **CTA Button Text** | Text on the footer call-to-action button |
| **CTA Button URL** | Where the footer CTA button links to |
| **Menu Links** | Footer navigation links |
| ↳ Label / URL | Link text and address |
| **Locations** | Location addresses shown in the footer |
| ↳ Location Name | Location name (e.g. "Homebush") |
| ↳ Location Address | Multi-line address |
| **Copyright Text** | Copyright line (e.g. "© 2026 Racqueteer. All rights reserved.") |
| **Legal Links** | Privacy Policy, Terms, etc. |
| ↳ Label / URL | Link text and address |

---

## 🎾 Global: Book Modal

**Location:** `WP Admin → Site Settings → Book Modal`

This controls the popup that appears when a visitor clicks "Book a Court".

| Field | What it changes |
|-------|----------------|
| **Modal Title** | Heading inside the popup |
| **Modal Subtitle** | Subheading inside the popup |
| **Sport 1 Title** | Name of the first sport (e.g. "Padel") |
| **Sport 1 Image** | Photo for the first sport option |
| **Sport 1 Button Text** | Button label for Sport 1 |
| **Sport 1 Booking URL** | External booking link for Sport 1 |
| **Sport 2 Title** | Name of the second sport (e.g. "Pickleball") |
| **Sport 2 Image** | Photo for the second sport option |
| **Sport 2 Button Text** | Button label for Sport 2 |
| **Sport 2 Booking URL** | External booking link for Sport 2 |

---

## 🏠 Home Page (`/`)

**Location:** `WP Admin → Pages → Home`

### Hero Section
*Full-screen video banner with headline and two buttons.*

| Field | Description |
|-------|-------------|
| **Title** | Main headline |
| **Description** | Subheading paragraph below the title |
| **CTA Primary Text** | Text on the main (red) button |
| **CTA Primary URL** | Link for the main button (e.g. `/memberships`) |
| **CTA Secondary Text** | Text on the secondary (outline) button |
| **CTA Secondary URL** | Link for the secondary button (e.g. `/about`) |
| **Video URL** | Path to the background video file (e.g. `/hero-video-opt.mp4`) |

> **Video files** are stored on the server. To use a new video, a developer needs to upload the file first.

---

### About Section
*Two-column section with photos, statistics, and description text.*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label above the title (e.g. "WHO WE ARE") |
| **Title** | Section heading |
| **Description** | Body text |
| **Stat 1 Number** | First statistic number (e.g. "12+") |
| **Stat 1 Label** | Label for first stat (e.g. "Courts Available") |
| **Stat 2 Number** | Second statistic number |
| **Stat 2 Label** | Label for second stat |
| **Left Image** | Left photo in the two-image composition |
| **Right Image** | Right photo in the two-image composition |

---

### Locations Section
*Section header only — the location cards are managed via WP Admin → Locations (see below).*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label (e.g. "OUR LOCATIONS") |
| **Title** | Section heading |
| **Description** | Section subheading text |

---

### Programs Section
*Section header — program cards are managed via WP Admin → Programs (see below).*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading |
| **Description** | Section subheading |
| **Tabs** | Comma-separated tab names (e.g. `Pickleball,Padel,Tennis`) |

---

### Membership CTA Section
*Full-width banner with background image and a call-to-action.*

> **Note:** This section is currently hidden per client request but the content fields are still maintained.

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading |
| **Description** | Body text |
| **CTA Text** | Button text |
| **CTA URL** | Button link |
| **Background Image** | Full-width background photo for this section |

---

### Subscriptions Section (Home)
*Section header only — membership plan cards come from WP Admin → Membership Plans (see below).*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading |
| **Description** | Section subheading |

---

### Testimonials Section
*Section header only — testimonial cards come from WP Admin → Testimonials (see below).*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading |
| **Description** | Section subheading |

---

### Events Section
*Section with a background image and a call-to-action.*

| Field | Description |
|-------|-------------|
| **Title** | Section heading |
| **Description** | Body text |
| **CTA Text** | Button text (e.g. "Learn More") |
| **CTA URL** | Button link |
| **Image** | Background or feature image for this section |
| **What Includes** | Repeater — list of included features shown on the right panel |
| ↳ Text | Feature description (e.g. "Private event packages for any occasion") |
| ↳ Icon | Icon style: `Box (Package)` or `VIP (Crown)` |

---

## 💳 Memberships Page (`/memberships`)

**Location:** `WP Admin → Pages → Memberships`

### Membership Hero Section
*Full-screen video hero with headline, pricing teaser, and CTA.*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label (e.g. "MEMBERSHIPS") |
| **Title** | Main heading |
| **Description** | Subheading paragraph |
| **Price Starting** | Starting price text (e.g. "$49") |
| **Price Unit** | Price unit (e.g. "/week") |
| **CTA Button Text** | Button text |
| **CTA Button URL** | Button link |
| **Video URL** | Path or URL to the background video |

---

### Subscriptions Detail Section
*Section header — plan cards come from WP Admin → Membership Plans (see below).*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading |
| **Description** | Section subheading |

---

### Price Compare Section
*Header for the feature comparison table.*

> **Note:** Currently hidden per client request.

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading |
| **Description** | Section subheading |
| **CTA Button Text** | Button text below the comparison table |
| **CTA Button URL** | Button link (e.g. `/memberships`) |

---

## 🎉 Private Events Page (`/private-events`)

**Location:** `WP Admin → Pages → Private Events`

### Private Events Hero Section
*Full-screen video hero with headline, CTA, and feature list.*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Main heading |
| **Description** | Subheading paragraph |
| **CTA Text** | Button text |
| **CTA URL** | Button link |
| **Video URL** | Path or URL to the background video |
| **What Includes** | Repeater — list of included features shown in the hero panel |
| ↳ Text | Feature description (e.g. "Private event packages for any occasion") |
| ↳ Icon | Icon style: `Box (Package)` or `VIP (Crown)` |

---

### Gallery Section
*Photo grid/gallery.*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading |
| **Description** | Section subheading |
| **Images** | Multiple photos for the gallery — select or upload via the media library |

> **How to add images:** Click the Images field → select existing media or upload new images → Save.

---

### Logo Marquee Section
*Scrolling strip of partner/sponsor logos.*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading |
| **Logos** | Partner/sponsor logo images |

---

## ℹ️ About Page (`/about`)

**Location:** `WP Admin → Pages → About`

### About Hero Section
*Full-screen video hero.*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Main heading |
| **Description** | Subheading paragraph |
| **Video URL** | Path or URL to the background video |

---

### Mission Section
*Two-column section: text and statistics on one side, image on the other.*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading |
| **Description** | Body text |
| **Image** | Feature photo beside the text |
| **Stat 1 Number** *(Blue)* | First blue statistic number (e.g. "25") |
| **Stat 1 Label** *(Blue)* | Label for first stat (e.g. "Courts") |
| **Stat 2 Number** *(Blue)* | Second blue statistic (leave empty to hide divider) |
| **Stat 2 Label** *(Blue)* | Label for second stat |
| **Stat 3 Number** *(Red)* | First red statistic number (e.g. "5K+") |
| **Stat 3 Label** *(Red)* | Label for first red stat (e.g. "Members") |
| **Stat 4 Number** *(Red)* | Second red statistic (leave empty to hide divider) |
| **Stat 4 Label** *(Red)* | Label for second red stat |

---

### Contact Section
*Contact information block.*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading |
| **Description** | Introductory text |
| **Email** | Contact email address |
| **Phone** | Contact phone number |
| **CTA Text** | Button text (e.g. "Get in Touch") |
| **CTA URL** | Button link |

---

## 👔 Careers Page (`/careers`)

**Location:** `WP Admin → Pages → Careers`

### Careers Hero Section
*Full-screen video hero.*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Main heading |
| **Description** | Subheading paragraph |
| **Video URL** | Path or URL to the background video |

---

### Job Listings Section
*Section header — job cards come from WP Admin → Jobs (see below).*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading (e.g. "Open Positions") |
| **Description** | Section subheading |

---

### Career Contact Section
*"Can't find your role?" contact block.*

| Field | Description |
|-------|-------------|
| **Label** | Small uppercase label |
| **Title** | Section heading |
| **Description** | Body text |
| **CTA Text** | Button text |
| **CTA URL** | Button link (e.g. `mailto:careers@racqueteer.com`) |
| **Image** | Feature image beside the text |

---

## 📦 Managing Custom Post Types

Custom Post Types are standalone content records that feed into block sections automatically. You manage them independently from the pages.

### Jobs (Careers Page)

**Location:** `WP Admin → Jobs`

| Field | Description |
|-------|-------------|
| **Title** *(post title)* | Job title (e.g. "Head Padel Coach") |
| **Category** | Role category (e.g. "Coaching", "Operations", "Hospitality") |
| **Description** | Short role description shown on the card |

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

| Field | Description |
|-------|-------------|
| **Title** *(post title)* | Internal name only (not shown on site) |
| **Category** | Used for filtering tabs (e.g. "Pickleball", "Padel") |
| **Rating** | Star rating number (e.g. `5`) |
| **Max Rating** | Maximum stars (usually `5`) |
| **Quote** | The testimonial text |
| **Author Name** | Customer's name |
| **Author Subtitle** | Role or context (e.g. "Pickleball Member") |

---

### Membership Plans (Memberships / Home Pages)

**Location:** `WP Admin → Membership Plans`

| Field | Description |
|-------|-------------|
| **Title** *(post title)* | Plan name (e.g. "Pro") |
| **Price** | Price string (e.g. "$99/week") |
| **Description** | Short plan description |
| **Button Variant** | Card button colour: `Blue` or `Red` |
| **BG Class** | Technical field — do not change without a developer |
| **Border Class** | Technical field — do not change without a developer |
| **Has Image** | Whether to show a racket image on this card |
| **Values** | Feature list values — `check`, `cross`, or custom text, separated by commas |

> **Display order:** Plans are shown in their WordPress **menu order**. To change the order — use `Quick Edit → Order` or contact your developer.

---

### Locations (Home / About Pages)

**Location:** `WP Admin → Locations`

| Field | Description |
|-------|-------------|
| **Title** *(post title)* | Internal name |
| **Location ID** | Short identifier (e.g. `homebush`) — do not change |
| **Name** | Display name (e.g. "Homebush") |
| **Status** | `Available` or `Coming Soon` |
| **Address** | Address lines (one per line — each line is shown separately on the site) |
| **Description** | Short description of the location |
| **Image** | Location photo |

---

### Programs (Home Page)

**Location:** `WP Admin → Programs`

| Field | Description |
|-------|-------------|
| **Title** *(post title)* | Program name (e.g. "Beginner Pickleball") |
| **Color** | Card accent colour: `Red` or `Blue` |
| **Price** | Price string (e.g. "$25") |
| **Unit** | Price unit (e.g. "per session") |
| **Description** | Short program description |

---

## 🖼️ Working with Media

### Uploading images
`WP Admin → Media → Add New` — drag and drop or click to upload.

### Using images in blocks
When editing a section, **Image** and **Gallery** fields open the media library. You can:
- Select a previously uploaded file
- Upload a new file directly from the field

### Video files
Video fields use a **text field** (not a file upload). Enter:
- A relative path to a file: `/hero-video-opt.mp4`
- A full external URL: `https://cdn.example.com/video.mp4`

> To add a new video file, a developer must upload it to the server and deploy.

---

## ➕ Creating New Pages

1. `WP Admin → Pages → Add New`
2. Set title and **slug** (URL path, e.g. `summer-camp`)
3. Add blocks using the Gutenberg `+` button → **Racqueteer** category
4. Fill in the block fields
5. Click **Publish**
6. The page appears at `https://racqueteer.com/summer-camp` automatically

**Hiding a page (without deleting):**
- Set status to **Draft** → the page returns a 404 error for visitors
- Set back to **Published** → page is live again immediately

---

## ⏱️ How Fast Do Changes Appear?

| Change type | Time to appear |
|-------------|---------------|
| Page section content (text, image) | ~1–5 seconds |
| New/updated Job, Testimonial, Location, Program | ~1–5 seconds |
| Navbar / Footer / Book Modal (Site Settings) | ~1–60 seconds |
| New page published | ~1–5 seconds |
| Page moved to Draft | ~1–5 seconds |
| Maximum wait if webhook failed | 60 minutes (automatic refresh) |

---

## 🐛 Troubleshooting

### Page content didn't update after saving

1. Did you click **Update** (not just close the tab)?
2. Wait up to 60 seconds — the cache refreshes automatically
3. Try opening the page in an **incognito / private** browser window
4. If still not updated — contact your developer

---

### Image shows as a number (e.g. `src="54"`)

This means an older version of the PHP theme is on the server.
- A developer needs to upload the latest `wp/inc/graphql-extensions.php` to the hosting server.

---

### "Please enter a valid URL" error in WP Admin for URL fields

This is fixed in the current version of `acf-blocks.php`. URL fields now accept relative paths like `/memberships`.
- If you see this error, the hosting server has an old version of `acf-blocks.php`.

---

### Job listings not showing on Careers page

- Check that the job is **Published** (not Draft)
- Check that all required fields (Category, Description) are filled in
- Saving the job automatically triggers a page refresh

---

### New page not appearing on the website

- Make sure the page is **Published** (not Draft or Private)
- Verify the page has at least one section block added
- A draft page shows a 404 — publish it to make it live

---

### Logo in header/footer showing wrong image

- Go to `WP Admin → Site Settings → Navbar` (or Footer)
- Make sure the Logo / Footer Logo field has an image selected
- If the field is empty, the site uses the hardcoded default logo

---

## 📋 Quick Reference Checklist

```
To update text on any section:
  WP Admin → Pages → [page name] → click section → edit fields → Update

To update navigation links:
  WP Admin → Site Settings → Navbar

To update footer content:
  WP Admin → Site Settings → Footer

To update the Book a Court popup:
  WP Admin → Site Settings → Book Modal

To add a job listing:
  WP Admin → Jobs → Add New → fill fields → Publish

To add a testimonial:
  WP Admin → Testimonials → Add New → fill fields → Publish

To add a location:
  WP Admin → Locations → Add New → fill fields → Publish

To add a program:
  WP Admin → Programs → Add New → fill fields → Publish

To create a new page:
  WP Admin → Pages → Add New → add sections from Racqueteer category → Publish

To hide a page:
  WP Admin → Pages → [page] → change to Draft → Update

To hide a job:
  WP Admin → Jobs → [job] → change to Draft → Update
```
