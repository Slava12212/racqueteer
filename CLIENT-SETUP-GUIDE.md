# 🎾 Racqueteer — Step-by-Step Setup Guide (GoDaddy)

> **To:** Client  
> **Time:** approximately 20–30 minutes  
> **Goal:** Create the `cms.racqueteer.com.au` subdomain, install WordPress on it, and share access with the developer

---

## 🗺️ What we're doing and why

Your new website has two parts:

| Address | What it is | Where it lives |
|---------|-----------|---------------|
| `racqueteer.com.au` | Public website (what visitors see) | Vercel (set up by me) |
| `cms.racqueteer.com.au` | WordPress — where you manage content | GoDaddy (your hosting) |

Your job: **create the `cms` subdomain and install WordPress on it**, then share access with me.  
Your email and all other GoDaddy settings **remain completely untouched**.

---

# STEP 1 — Log in to GoDaddy

1. Go to **[godaddy.com](https://www.godaddy.com)**
2. Click **Sign In** (top right)
3. Enter your email and password

---

# STEP 2 — Open your hosting cPanel

1. After logging in, click your name (top right) → **My Products**  
   🔗 Or directly: [account.godaddy.com/products](https://account.godaddy.com/products)
2. Scroll down to the **Web Hosting** section
3. Click the **Manage** button next to your hosting plan

> You will land on the **cPanel** dashboard — your hosting control panel.

---

# STEP 3 — Create the `cms.racqueteer.com.au` subdomain

> This gives WordPress its own address, so the main domain is free to point to the new public website.

1. In cPanel, find the **Domains** section
2. Click **Subdomains**
3. Fill in the form:
   - **Subdomain:** `cms`
   - **Domain:** select `racqueteer.com.au` from the dropdown
   - **Document Root:** leave as auto-filled (`cms.racqueteer.com.au`)
4. Click **Create**

✅ The address `cms.racqueteer.com.au` now exists on your hosting.

---

# STEP 4 — Install WordPress on the subdomain

> GoDaddy lets you install WordPress with one click via Softaculous.

1. In cPanel, find the **Software** section
2. Click **Softaculous Apps Installer** → then **WordPress**  
   *(or search for "WordPress" in the cPanel search bar)*
3. Click the blue **Install Now** button
4. Fill in the installation form:

| Field | What to enter |
|-------|--------------|
| **Choose Protocol** | `https://` |
| **Choose Domain** | select `cms.racqueteer.com.au` |
| **In Directory** | **leave empty** (not `/wp` — just blank) |
| **Site Name** | `Racqueteer` |
| **Site Description** | can leave blank |
| **Admin Username** | create one (e.g. `racqueteer-admin`) — **write it down!** |
| **Admin Password** | create a strong password — **write it down!** |
| **Admin Email** | your business email |
| **Select Language** | English |

5. Scroll down → click **Install**
6. Wait 1–2 minutes. A confirmation with links will appear.

✅ WordPress is now installed at `https://cms.racqueteer.com.au`  
✅ Admin panel: `https://cms.racqueteer.com.au/wp-admin`

---

# STEP 5 — Find your GoDaddy server IP address

> I need this to set up DNS so the `cms` subdomain stays accessible after the main domain is moved to Vercel.

### Option A — via cPanel:

1. In cPanel, look at the **left sidebar** or the **General Information** box
2. Find the line **Shared IP Address** or **IP Address**
3. Copy the numeric IP (looks like: `123.45.67.89`)

### Option B — via GoDaddy My Products:

1. [account.godaddy.com/products](https://account.godaddy.com/products) → **Web Hosting** → **Manage**
2. The IP address is shown at the top of the cPanel page

📌 **Copy and save this IP** — you'll need it in the next step.

---

# STEP 6 — Add a DNS record for the `cms` subdomain

> This makes `cms.racqueteer.com.au` point to your GoDaddy hosting.

1. Go to [godaddy.com](https://www.godaddy.com) → **My Products**
2. Under **Domains**, find `racqueteer.com.au` → click **DNS** (or **Manage DNS**)  
   🔗 Or directly: [dcc.godaddy.com/manage/racqueteer.com.au/dns](https://dcc.godaddy.com/manage/racqueteer.com.au/dns)
3. Scroll down → click **Add New Record**
4. Fill in:

| Field | Value |
|-------|-------|
| **Type** | `A` |
| **Name** | `cms` |
| **Value / Points to** | *(the GoDaddy server IP from Step 5)* |
| **TTL** | 1 Hour (or 3600) |

5. Click **Save**

✅ `cms.racqueteer.com.au` now points to your GoDaddy hosting.

> ⏳ DNS propagates within 15–60 minutes. It's normal if it doesn't load immediately.

---

# STEP 7 — Share access with me

Please send me the following so I can install the theme and connect the site to Vercel:

```
=== ACCESS FOR DEVELOPER ===

WordPress Admin:
  URL:       https://cms.racqueteer.com.au/wp-admin
  Username:  [your admin username from Step 4]
  Password:  [your admin password from Step 4]

GoDaddy Server IP:
  IP:        [the number from Step 5, e.g. 123.45.67.89]
```

> With WordPress Admin access I can install all required plugins and upload the theme directly through the WordPress dashboard — no cPanel access needed.

---

# 📬 Summary — what to send me

| # | What | Done? |
|---|------|-------|
| 1 | WordPress Admin URL + username + password | ☐ |
| 2 | GoDaddy server IP address | ☐ |

---

# ❓ FAQ

**Q: Will my current website change?**  
A: No. I'll set everything up on a new server (Vercel) first. Your existing GoDaddy site stays live until we're ready to switch.

**Q: Will my email be affected?**  
A: Not at all. We only change DNS records related to the website. Your email (MX records) stays completely untouched.

**Q: I'm not very technical — can we do this together?**  
A: Of course! Just let me know and we'll schedule a quick 15-minute screen-share call — I'll walk you through every step.

**Q: Can I change the passwords after you're done?**  
A: Yes, and I recommend it. Once setup is complete, change your WordPress admin password.

**Q: Why a `cms` subdomain instead of just using the main domain for WordPress?**  
A: The main domain `racqueteer.com.au` will point to the new fast public website (Vercel). WordPress stays accessible to you at `cms.racqueteer.com.au/wp-admin` — your content management dashboard.

---

*Thank you for your trust. If anything is unclear, just reply and I'll help straight away.* 🎾

