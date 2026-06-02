# 🌐 Website Setup — Step-by-Step Instructions for You

Hi! To get your new website live, I need access to a few things in your GoDaddy account.  
This guide walks you through exactly what to do — step by step, with screenshots in mind.

**It should take you about 10–15 minutes.**

---

## STEP 1 — Log in to GoDaddy

1. Go to **[godaddy.com](https://www.godaddy.com)**
2. Click **Sign In** (top right)
3. Enter your email and password

---

## STEP 2 — Find Your Hosting Details

### 2A — Go to your Hosting

1. After logging in, click your name (top right) → **My Products**
2. Scroll down to find **Web Hosting**
3. Click **Manage** next to your hosting plan

You will be taken to the **cPanel** dashboard.

---

### 2B — Create a New cPanel User for Me *(recommended — safer than sharing your main password)*

Inside cPanel:

1. Scroll down to find **Files** section → click **FTP Accounts**
2. Click **Create FTP Account**
3. Fill in:
   - **Log In:** `developer` (or any username you like)
   - **Password:** create a strong password (write it down!)
   - **Directory:** leave as default (full access)
4. Click **Create FTP Account**
5. **Send me:** the FTP hostname, username, and password

> Alternatively, you can simply share your **cPanel username and password** — I will not store or share it, and you can change it after the work is done.

---

### 2C — Find Your WordPress Admin

1. In cPanel → scroll to **Softaculous Apps Installer** → click **WordPress**
2. You'll see your WordPress installation listed
3. Note the **Admin URL** — it usually looks like:  
   `https://yourdomain.com/wp-admin`
4. If you don't remember your WordPress password:
   - Click **Edit** on your installation
   - Scroll to **Admin Account**
   - Set a new password → click **Save**

---

## STEP 3 — Share WordPress Admin Access With Me

Please send me:

| Field | Example |
|-------|---------|
| WordPress Admin URL | `https://racqueteer.com.au/wp-admin` |
| Username | `admin` |
| Password | your WP admin password |

---

## STEP 4 — Get Your Domain Ready

Your domain is registered with GoDaddy. After I deploy the new website, I will need to **point your domain to the new server (Vercel)**.

I will send you the exact DNS values to enter. Here is how to do it when the time comes:

1. Log in to GoDaddy → click your name → **My Products**
2. Under **Domains**, find your domain → click **DNS** (or **Manage DNS**)
3. I will give you specific records to add/change (takes 2 minutes)

> ✅ No action needed on DNS right now — I will let you know when this step is ready.

---

## STEP 5 — GitHub Account

I will store the website code in a private GitHub repository and give you full ownership.

**If you already have a GitHub account:**
- Send me your GitHub **username** or the **email** you signed up with

**If you don't have a GitHub account:**
1. Go to [github.com](https://github.com) → click **Sign up**
2. Use your business email (e.g. `hello@racqueteer.com.au`)
3. Complete the free signup
4. Send me your **username**

> GitHub is free. You only need an account to own the code — you won't need to use it day-to-day.

---

## STEP 6 — Vercel Account (hosts your new website)

The new website runs on **Vercel** — a fast, reliable hosting platform built for modern websites.  
The free plan is enough to start.

1. Go to [vercel.com](https://vercel.com) → click **Sign Up**
2. Choose **Continue with GitHub** *(easiest — uses the account from Step 5)*
3. Complete signup
4. Send me your **Vercel email address**

> Vercel is free for standard websites. You won't need to configure anything — I handle the deployment for you.

---

## 📬 What to Send Me

Once you've completed the steps above, please send me the following:

```
1. GoDaddy cPanel details:
   - cPanel URL: 
   - Username: 
   - Password: 

2. WordPress Admin:
   - URL: 
   - Username: 
   - Password: 

3. GitHub username: 

4. Vercel email: 

```
## ❓ FAQ

**Q: Will you change anything on my current website?**  
A: No. I will set up everything on the new hosting (Vercel) first. Your current GoDaddy website stays live until we're ready to switch over.

**Q: What happens to my email?**  
A: Nothing. We only change the website (A record / CNAME). Your email (MX records) stays with GoDaddy and is not affected.

**Q: Can I change the password after you're done?**  
A: Absolutely — and I recommend it. Change your WordPress and cPanel passwords once the setup is complete.

**Q: I'm not tech-savvy — can you do this with me on a call?**  
A: Of course! Just let me know and we'll schedule a 15-minute screen-share call.

---

*Thank you for your trust. If anything is unclear, just reply to this message and I'll help straight away.*

