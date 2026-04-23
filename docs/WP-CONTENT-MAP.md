# WP Content Map — Racqueteer
> Покрокове наповнення WordPress для Фази 2.  
> Для кожного блоку вказано точні значення полів з поточного фронтенду.

---

## 🗂 Сторінка: Home (`/`)

---

### Блок 1 — `acf/racqueteer-hero` → Hero Section

| Поле | Значення |
|------|----------|
| **Title** | `Where Elite Competition Meets a Refined Social Atmosphere` |
| **Description** | `Perfect for newcomers and those looking to refine their foundational skills, this clinic provides a supportive environment for learning and improvement.` |
| **CTA Primary Text** | `Book a Court` |
| **CTA Primary URL** | `#` |
| **CTA Secondary Text** | `Become a Member` |
| **CTA Secondary URL** | `#` |
| **Video URL** | `/hero-video.mp4` → завантажити файл `public/hero-video.mp4` у Media Library і вставити URL |

---

### Блок 2 — `acf/racqueteer-about` → About Section

| Поле | Значення |
|------|----------|
| **Label** | `about racqueteer` |
| **Title** | `The Ultimate Destination for Padel & Pickleball Players` |
| **Description** | `Racqueteer is more than just a place to play — it's a hub for the fast-growing world of padel and pickleball. Designed for players of all levels, our club combines professional courts, a welcoming community, and world-class facilities to create an unforgettable playing experience.` |
| **Stat 1 Number** | `25` |
| **Stat 1 Label** | `Courts of Art` |
| **Stat 2 Number** | `8+` |
| **Stat 2 Label** | `Years of Experience` |
| **Left Image** | 📷 `public/racket-pickleball.png` → завантажити в Media Library |
| **Right Image** | 📷 `public/racket-padel.png` → завантажити в Media Library |

---

### Блок 3 — `acf/racqueteer-locations` → Locations Section

| Поле | Значення |
|------|----------|
| **Label** | `locations` |
| **Title** | `Play at Your Favorite Location` |
| **Description** | `With multiple state-of-the-art locations across Sydney, we make it easy to find a club near you. Each facility features top-tier courts, premium amenities, and a welcoming community of players.` |

> ℹ️ Картки локацій беруться з CPT `location` — створити окремо (див. нижче).

---

### Блок 4 — `acf/racqueteer-programs` → Programs Section

| Поле | Значення |
|------|----------|
| **Label** | `programming` |
| **Title** | `Find the Perfect Program for You` |
| **Description** | `Whether you're a complete beginner or an advanced player, we have programs tailored to your skill level and goals. Our expert coaches will help you improve your game in a fun and supportive environment.` |
| **Tabs (comma-separated)** | `Programming, Coaching, Events` |

> ℹ️ Картки програм беруться з CPT `program` — створити окремо (див. нижче).

---

### Блок 5 — `acf/racqueteer-membership-cta` → Membership CTA

| Поле | Значення |
|------|----------|
| **Label** | `membership` |
| **Title** | `Unlock Unlimited Access with Membership` |
| **Description** | `Become a member and enjoy exclusive benefits including priority court bookings, access to premium facilities, member-only events, and much more. Choose the plan that fits your lifestyle.` |
| **CTA Text** | `View Membership Options` |
| **CTA URL** | `/memberships` |
| **Background Image** | 📷 Завантажити `public/membership-bg.png` у Media Library |

---

### Блок 6 — `acf/racqueteer-subscriptions` → Subscriptions (Home)

| Поле | Значення |
|------|----------|
| **Label** | `memberships` |
| **Title** | `Choose Your Perfect Membership Plan` |
| **Description** | `Select the plan that best fits your lifestyle and playing frequency. All memberships include access to our world-class facilities, expert coaching, and vibrant community.` |

> ℹ️ Картки планів беруться з CPT `membership` — створити окремо (див. нижче).

---

### Блок 7 — `acf/racqueteer-testimonials` → Testimonials Section

| Поле | Значення |
|------|----------|
| **Label** | `testimonials` |
| **Title** | `What Our Members Say` |
| **Description** | `Hear from our community of passionate players who have made Racqueteer their home court.` |

> ℹ️ Відгуки беруться з CPT `testimonial` — створити окремо (див. нижче).

---

### Блок 8 — `acf/racqueteer-events` → Events Section

| Поле | Значення |
|------|----------|
| **Title** | `Join Our Next Tournament or Social Event` |
| **Description** | `From competitive tournaments to casual social mixers, there's always something happening at Racqueteer. Connect with fellow players, challenge yourself, and have fun!` |
| **CTA Text** | `View Events Calendar` |
| **CTA URL** | `#` |
| **Image** | 📷 Завантажити будь-яке фото івенту з Media Library (placeholder з `api.builder.io` більше не потрібен) |

---

## 🗂 Сторінка: Memberships (`/memberships`)

---

### Блок 1 — `acf/racqueteer-membership-hero` → Membership Hero

| Поле | Значення |
|------|----------|
| **Label** | `membership` |
| **Title** | `become a Member` |
| **Description** | `We are thrilled to have you consider becoming a part of our community` |
| **Price Starting** | `$89` |
| **Price Unit** | `/month` |
| **CTA Text** | `View plans` |
| **Video URL** | 🎬 `public/private-events-hero.mp4` → завантажити в Media Library |

---

### Блок 2 — `acf/racqueteer-subscriptions-detail` → Subscriptions Detail

| Поле | Значення |
|------|----------|
| **Label** | `memberships` |
| **Title** | `Choose Your Perfect Membership Plan` |
| **Description** | `Select the plan that best fits your lifestyle and playing frequency. All memberships include access to our world-class facilities.` |

---

### Блок 3 — `acf/racqueteer-price-compare` → Price Compare

| Поле | Значення |
|------|----------|
| **Label** | `compare plans` |
| **Title** | `Compare Membership Features` |
| **Description** | `See all the benefits side-by-side to help you choose the right membership level for your needs.` |

---

## 🗂 Сторінка: Private Events (`/private-events`)

---

### Блок 1 — `acf/racqueteer-private-events-hero` → Private Events Hero

| Поле | Значення |
|------|----------|
| **Label** | `private events` |
| **Title** | `Host Your Event at Racqueteer` |
| **Description** | `From corporate team-building to birthday parties and tournaments, our premium facilities provide the perfect backdrop for any occasion.` |
| **CTA Text** | `Enquire Now` |
| **CTA URL** | `#` |
| **Video URL** | 🎬 `public/private-events-hero-new.mp4` → завантажити в Media Library |

---

### Блок 2 — `acf/racqueteer-gallery` → Gallery Section

| Поле | Значення |
|------|----------|
| **Label** | `our facilities` |
| **Title** | `World-Class Venues for Memorable Events` |
| **Description** | `Explore our stunning courts, lounges, and event spaces designed to accommodate groups of all sizes.` |
| **Images** | 📷 Завантажити реальні фото локації (4+ фото) у Media Library і вибрати через Gallery field |

---

### Блок 3 — `acf/racqueteer-logo-marquee` → Logo Marquee

| Поле | Значення |
|------|----------|
| **Label** | `trusted by` |
| **Title** | `Corporate Partners Who've Hosted with Us` |
| **Logos** | 📷 Завантажити `public/logo1.svg` … `public/logo8.svg` у Media Library і вибрати через Gallery field |

---

## 🗂 Сторінка: About (`/about`)

---

### Блок 1 — `acf/racqueteer-about-hero` → About Hero

| Поле | Значення |
|------|----------|
| **Label** | `about us` |
| **Title** | `Bringing People Together Through Racquet Sports` |
| **Description** | `Racqueteer was founded on a simple belief: racquet sports should be accessible, enjoyable, and community-driven. We've built more than courts—we've built a movement.` |
| **Video URL** | 🎬 `public/private-events-hero.mp4` → завантажити в Media Library |

---

### Блок 2 — `acf/racqueteer-mission` → Mission Section

| Поле | Значення |
|------|----------|
| **Label** | `our mission` |
| **Title** | `Creating Spaces Where Players Thrive` |
| **Description** | `We're committed to providing world-class facilities, expert coaching, and a welcoming environment where players of all levels can improve, connect, and have fun. Whether you're picking up a paddle for the first time or competing at the highest level, you belong here.` |
| **Image** | 📷 Завантажити фото `public/about-hero.png` у Media Library |

---

### Блок 3 — `acf/racqueteer-contact` → Contact Section

| Поле | Значення |
|------|----------|
| **Label** | `get in touch` |
| **Title** | `Have Questions? We're Here to Help` |
| **Description** | `Whether you're interested in membership, hosting an event, or just want to learn more about Racqueteer, our team is ready to assist you.` |
| **Email** | `info.racqueteer.club@gmail.com` |
| **Phone** | `+61 4 8123 4567` |
| **CTA Text** | `Send a Message` |
| **CTA URL** | `#` |

---

## 🗂 Сторінка: Careers (`/careers`)

---

### Блок 1 — `acf/racqueteer-careers-hero` → Careers Hero

| Поле | Значення |
|------|----------|
| **Label** | `careers` |
| **Title** | `Join Our Team` |
| **Description** | `Be part of something bigger. At Racqueteer, we're building a community of passionate individuals who love racquet sports and creating exceptional experiences.` |
| **Video URL** | 🎬 `public/careers-hero.mp4` → завантажити в Media Library |

---

### Блок 2 — `acf/racqueteer-job-listings` → Job Listings

| Поле | Значення |
|------|----------|
| **Label** | `open positions` |
| **Title** | `Current Opportunities` |
| **Description** | `Explore our available roles and find the perfect fit for your skills and passion.` |

> ℹ️ Вакансії беруться з CPT `job` — створити окремо (див. нижче).

---

### Блок 3 — `acf/racqueteer-career-contact` → Career Contact

| Поле | Значення |
|------|----------|
| **Label** | `don't see a fit?` |
| **Title** | `We're Always Looking for Talent` |
| **Description** | `Even if there's no open position that matches your skills right now, we'd love to hear from you. Send us your resume and we'll keep you in mind for future opportunities.` |
| **CTA Text** | `Send Your Resume` |
| **CTA URL** | `mailto:careers@racqueteer.club` |
| **Image** | 📷 Завантажити будь-яке командне фото у Media Library |

---

## 🗂 CPT: Вакансії (`job`) — для сторінки Careers

> WP Admin → **Jobs** → Add New (8 записів)

| Title | Category | Description |
|-------|----------|-------------|
| `Club Manager` | `Manager` | `Lead daily operations, manage staff scheduling, oversee member relations, and ensure an exceptional experience across all club facilities.` |
| `Assistant Manager` | `Manager` | `Support the Club Manager in daily operations, coordinate events, handle member inquiries, and step in as acting manager when needed.` |
| `Head Pickleball Coach` | `Trainer` | `Design and lead pickleball training programs for all skill levels. Conduct private lessons, group clinics, and competitive development sessions.` |
| `Padel Trainer` | `Trainer` | `Deliver high-energy padel coaching sessions, develop player technique, and help grow the padel community at the club through engaging programs.` |
| `Youth Program Coach` | `Trainer` | `Run junior development programs, create age-appropriate training plans, and build a fun and encouraging environment for young players.` |
| `Lead Barista` | `Barista` | `Manage the club café, craft specialty coffee and drinks, maintain quality standards, and train new barista team members.` |
| `Barista` | `Barista` | `Prepare and serve premium beverages, maintain a clean and welcoming café space, and provide excellent customer service to members and guests.` |
| `Front Desk Associate` | `Manager` | `Welcome members and guests, handle court bookings, answer questions, and ensure smooth check-in and check-out experiences daily.` |

---

## 🗂 CPT: Відгуки (`testimonial`) — для Testimonials

> WP Admin → **Testimonials** → Add New (6 записів)

| Author Name | Subtitle | Rating | Quote |
|-------------|----------|--------|-------|
| `Martin Goutry` | `Beginner Training` | `5.0` | `"The training was fun, well organized, and easy to follow. I quickly gained confidence on the court and truly enjoyed the atmosphere. I'm excited to come back and keep improving!"` |
| `Martin Goutry` | `Beginner Training` | `5.0` | *(те саме)* |
| `Martin Goutry` | `Beginner Training` | `5.0` | *(те саме)* |
| `Sarah Chen` | `Advanced Training` | `5.0` | `"Incredible coaching and a very supportive environment. The drills were intense but effective. My serve has improved tremendously since joining. Highly recommend to anyone serious about the sport!"` |
| `James Okafor` | `Intermediate Training` | `5.0` | `"Exactly what I needed to level up my game. The coaches are attentive and the class sizes are perfect. I feel a genuine improvement after every session."` |
| `Emily Rodriguez` | `Beginner Training` | `5.0` | `"As someone who'd never played before, I was nervous walking in. The instructors made it so welcoming and fun. Now I'm hooked and I play every week!"` |

---

## 🗂 CPT: Плани членства (`membership`) — для Subscriptions

> WP Admin → **Memberships** → Add New (4 записи)

| Name | Price | Description | Button Style |
|------|-------|-------------|--------------|
| `STARTER` | `$89` | `Perfect for getting started` | `blue` |
| `LIGHT` | `$135` | `Great choice to begin your journey` | `blue` |
| `PRO` | `$189` | `Ideal for launching your experience` | `red` |
| `PRO+` | `$397` | `Best suited for your first steps` | `red` |

---

## 🗂 CPT: Локації (`location`) — для Locations Section

> WP Admin → **Locations** → Add New (2 записи)

### Homebush Club
| Поле | Значення |
|------|----------|
| **Name** | `Homebush Club` |
| **Status** | `available` |
| **Address Line 1** | `Homebush, Sydney` |
| **Address Line 2** | `New South Wales 2140, Australia` |
| **Description** | `Perfect for newcomers and those looking to refine their foundational skills, this clinic provides a supportive environment for learning and improvement.` |
| **Image** | 📷 Завантажити фото клубу у Media Library |

### Alexandria Club
| Поле | Значення |
|------|----------|
| **Name** | `Alexandria Club` |
| **Status** | `coming_soon` |
| **Address Line 1** | `Alexandria, Sydney` |
| **Address Line 2** | `New South Wales 2015, Australia` |
| **Description** | `Our newest location coming soon to Alexandria. A world-class facility designed for serious players and casual enthusiasts alike.` |
| **Image** | 📷 Завантажити фото клубу у Media Library |

---

## 🗂 CPT: Програми (`program`) — для Programs Section

> WP Admin → **Programs** → Add New (4 записи)

| Title | Color | Price | Unit | Description |
|-------|-------|-------|------|-------------|
| `Women's Beginners` | `red` | `$40` | `per game` | `This introductory session is the perfect way to get started! We'll cover the basics of the game, from the rules and scoring to essential techniques like grip, positioning, and basic shots.` |
| `Mens Beginner` | `blue` | `$40` | `per game` | `Join our fun and supportive group clinic designed specifically for beginners! Whether you're new to padel or just starting to play, this clinic will help you master the fundamentals.` |
| `Group Beginner` | `red` | `$60` | `per game` | `Take your padel skills to the next level in our intermediate clinic! Perfect for those who already know the basics, this clinic focuses on refining your technique.` |
| `Women's Intermediate` | `blue` | `$80` | `per game` | `This clinic is designed for top players looking to perfect their game and get an edge on their opponents. Focus on advanced techniques, precision, and strategic play.` |

---

## 📁 Медіафайли для завантаження в Media Library

> WP Admin → Media → Add New

| Файл | Де використовується |
|------|---------------------|
| `public/hero-video.mp4` або `hero-video-opt.mp4` | Hero Section (Home) |
| `public/private-events-hero-new.mp4` або `*-opt.mp4` | Private Events Hero |
| `public/private-events-hero.mp4` | Membership Hero, About Hero |
| `public/careers-hero.mp4` | Careers Hero |
| `public/racket-pickleball.png` | About Section — Left Image |
| `public/racket-padel.png` | About Section — Right Image |
| `public/membership-bg.png` | Membership CTA — Background |
| `public/about-hero.png` | Mission Section — Image |
| `public/logo1.svg` … `logo8.svg` | Logo Marquee (8 логотипів) |

> 💡 **Порада:** Для відео краще завантажувати оптимізовані версії (`*-opt.mp4`) — менший розмір файлу.

