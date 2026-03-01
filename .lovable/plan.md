

## Sprint 1: Rendimiento

### 1. Lazy loading en Index.tsx
- Keep eager: `Navbar`, `Hero`, `StatsTicker`, `ScrollProgress`, `DynamicMetaTags`, `SEOReviewSchema`, `SEOFAQSchema`
- Convert to `React.lazy()` + `<Suspense>`: `BeforeAfter`, `HostingQuiz`, `HostingRanking`, `Benefits`, `Testimonial`, `Migration`, `Categories`, `FAQ`, `UltimasBusquedas`, `TransparencyNotice`, `FinalCTA`, `CertificationsBanner`, `Footer`, `StickyCTA`, `MiniNav`, `ExitModal`, `SocialProofFeed`, `TrustReport`, `OpenDataBadge`
- Wrap lazy components in `<Suspense fallback={null}>` (or a minimal skeleton)

### 2. Optimizar Google Fonts
- **Remove** `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');` from line 1 of `src/index.css`
- The font is already correctly loaded in `index.html` via `<link rel="preconnect">` + `<link href="...fonts.googleapis.com/css2?family=Montserrat...&display=swap">` — so this is a duplicate that blocks rendering

### 3. Dimensiones explícitas en imágenes Hero
- Add `width={1200} height={800}` to the desktop hero image (`hero-person.png`)
- Add `width={800} height={600}` to the mobile hero image (`hero-people.png`)
- These prevent CLS while the images load

