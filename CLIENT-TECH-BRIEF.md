# Technical Deployment Brief — Racqueteer Website

**To:** Your IT / Technical Contact  
**From:** Web Developer  
**Date:** May 2026  
**Re:** New Website Deployment — Access Requirements & Planned Changes

---

## Overview

We are deploying a new custom website for Racqueteer using the following stack:

- **CMS:** Your **existing WordPress install on GoDaddy** — we are not replacing it, just adding our theme and plugins to it
- **Frontend:** Next.js 14 (deployed to Vercel)
- **Data layer:** WPGraphQL (GraphQL API exposed from WordPress)

WordPress stays exactly where it is on GoDaddy. The public-facing website runs on Vercel and fetches all content from WordPress via GraphQL. **No new WordPress install is needed.**

---

## What We Are NOT Changing

| Item | Status |
|------|--------|
| GoDaddy account ownership | ✅ Untouched |
| Email / MX records | ✅ Untouched |
| Domain registrar (GoDaddy) | ✅ Untouched |
| GoDaddy hosting plan | ✅ Untouched |

---

## What We ARE Changing

### 1. WordPress — Theme + Plugin Installation

We need to install **1 theme + 4 plugins** into WordPress via WP Admin:

| Item | Source | Cost |
|------|--------|------|
| **Racqueteer Theme** | Provided by us | Included |
| **Advanced Custom Fields PRO** | acf.com | ~$49/yr (client license needed) |
| **WPGraphQL** | wordpress.org | Free |
| **WPGraphQL for ACF** | wpgraphql.com | Free |
| **WPGraphQL Content Blocks** | wordpress.org | Free |

> ⚠️ **Important:** Installing a theme requires either **WP Admin access** (Appearance → Themes → Upload Theme) or **cPanel / FTP access** to upload files to the server. Without one of these, we cannot install the theme. Please confirm which access option is available.

### 2. One-Click Demo Import

After theme activation, a single button press in WP Admin automatically creates:

- ✅ All 5 pages (Home, Memberships, Private Events, About, Careers) with full content
- ✅ All jobs, testimonials, locations, amenities, programs, membership plans
- ✅ All media/images (bundled inside the theme — no external downloads)
- ✅ Navbar, Footer, Book Modal structure
- ✅ WordPress & WPGraphQL settings configured automatically

> **No manual content entry required.** The entire site structure and content is set up automatically.

### 3. Post-Import: Update Client-Specific Details

After the one-click import, only these items need to be updated:

| What | Estimated Time |
|------|---------------|
| Set real booking URL (CTA button) | 1 min |
| Set real booking URLs in Book Modal (Padel + Pickleball) | 2 min |
| Update contact email and phone | 1 min |
| Upload real partner logos (Private Events page) | 5 min |

**Total: ~10 minutes of post-import configuration.**

---

### 4. DNS Setup — How It Works With WordPress

When the domain is pointed to Vercel, here is how the two systems coexist:

```
racqueteer.com.au        → Vercel (Next.js frontend — public website)
cms.racqueteer.com.au    → GoDaddy hosting (WordPress backend — admin only)
```

- The **main domain** (`racqueteer.com.au`) is pointed to Vercel via a CNAME/A record
- WordPress moves to a **subdomain** (e.g. `cms.racqueteer.com.au`) — this requires adding one A record in GoDaddy DNS pointing to the GoDaddy server IP
- WordPress continues to run normally on GoDaddy hosting — nothing changes on the hosting side
- The Next.js frontend on Vercel fetches all content from `cms.racqueteer.com.au/graphql`
- The client manages content at `cms.racqueteer.com.au/wp-admin` as usual

> ✅ Email (MX records) remains completely untouched — email is not affected by any of these changes.  
> ✅ We can keep the old site live right up until cutover — zero downtime.

**DNS changes needed (2–3 records total):**

| Record | Type | Points To | Purpose |
|--------|------|-----------|---------|
| `@` or `www` | A / CNAME | Vercel | Public website → Next.js |
| `cms` | A | GoDaddy server IP | WordPress admin stays accessible |
| *(no change)* | MX | *(existing)* | Email — untouched |

We will provide the exact record values when ready.

---

### 5. Vercel — New Frontend Hosting (separate from GoDaddy)

The Next.js frontend will be deployed to **Vercel** (vercel.com). Entirely separate from GoDaddy.

- Vercel provides automatic SSL (HTTPS) at no cost
- GoDaddy hosting remains active for WordPress backend
- The Vercel account will be owned and controlled by the client

---

## Minimum Access Required

To proceed, we need **one of the following**:

### Option A — We handle everything (preferred for speed)

Please provide:

```
WordPress Admin:
  URL:       https://[yourdomain]/wp-admin
  Username:  (Administrator-level account)
  Password:  

cPanel or FTP (needed to upload the theme):
  Host / URL:
  Username:
  Password:

When ready for DNS cutover — make these changes in GoDaddy DNS:
  (we will supply exact record values at that time)
```

### Option B — Your tech person handles the install

Your tech person:
1. Installs the 4 plugins listed above
2. Installs and activates the Racqueteer theme (zip provided by us) — via WP Admin or cPanel
3. Goes to **Tools → 🎾 Racqueteer Import** and clicks **Import Demo Content**
4. Shares the WPGraphQL endpoint URL: `https://[yourdomain]/graphql`

And when ready — adds the DNS records we supply.

---

## Security Notes

- WP Admin access can be revoked immediately after setup
- cPanel/FTP credentials should be changed after deployment is complete
- The Vercel account will be owned and controlled by the client

---

## Questions?

Happy to jump on a 15-minute call to walk through this with your tech person directly — just let us know a convenient time.
