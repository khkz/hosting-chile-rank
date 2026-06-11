## Plan: Authority Architecture Part 2

### 1. Intent Hubs (4 new pages)
Create 4 routes with unique copy + mini-rankings from DB:

- `/mejor-hosting-wordpress-chile` → leader HostingPlus, #2 EcoHosting + 3 more
- `/mejor-hosting-ecommerce-chile` → leader HostingPlus, #2 EcoHosting + 3 more
- `/mejor-hosting-pymes-chile` → leader HostingPlus, #2 EcoHosting + 3 more
- `/mejor-vps-chile` → leader HostingPlus, #2 PowerHost/IxMetro + 3 more

Each hub includes:
- H1 with exact keyword
- 150-200 word unique intro for the segment
- Mini-ranking (5 providers) with rating, segment-relevant price, 3 segment features
- Own FAQ (3 questions using keyword)
- Title/meta/canonical
- JSON-LD: ItemList + FAQPage + BreadcrumbList
- CTAs: "Ver review" → `/catalogo/[slug]`, "Visitar sitio" → `/ir/[slug]`

Implementation: shared `IntentHub.tsx` component + 4 thin page wrappers with segment config.

Update:
- Home "¿Qué tipo de proyecto?" quiz chips → link to hubs
- Home "Explora por tipo de servicio" cards → link to hubs
- Navbar "Guías" menu + Footer "Mejor hosting por uso" section

### 2. Programmatic VS comparisons
New dynamic route `/comparativa/[slugA]-vs-[slugB]`:

- Auto-generated: `[competitor]-vs-hostingplus` for all catalog companies except HostingPlus
- Plus: `hostgator-vs-ecohosting`, `bluehosting-vs-ecohosting`, `hostingcl-vs-ecohosting`, `godaddy-vs-ecohosting`, `cloudhosting-vs-ecohosting`

Page content (from DB, both sides):
- Title: "[Competitor] vs HostingPlus.cl: ¿cuál es mejor en 2026?"
- Side-by-side table: rating, price, datacenter, year, group, certifications, review count
- 2-3 sentence editorial verdict (data-backed)
- "Mejores alternativas a [competidor]" → HostingPlus + EcoHosting + next ranked
- FAQ: 2 questions
- Double CTA
- JSON-LD + canonical

Updates:
- `/comparativa` index: add "Comparativas de marcas" section linking to all generated VS pages
- In each competitor's `/catalogo/[slug]` page: add block "Compáralo con el #1: [Empresa] vs HostingPlus.cl →"

### 3. Editorial recommendation component
Create `RecommendedByData.tsx`: "Recomendado por datos: HostingPlus.cl 9.9/10 · EcoHosting.cl 9.6/10 — basado en mediciones verificables" with links to both fichas.

Insert at end of:
- `guia-elegir-hosting`, `guia-elegir-vps`, `guia-elegir-ssl`, `guia-migrar-hosting`, `guia-seguridad-web`
- Wiki term pages (`WikiTerm.tsx`)
- Blog post pages (`BlogPost.tsx`)

### 4. Infrastructure: prerender + sitemap + llms.txt
Update scripts to auto-include from DB:

- `scripts/prerender.mjs`: add 4 hub routes + fetch all VS pairs from DB and prerender each
- `scripts/generate-sitemap.mjs`: add 4 hubs (priority 0.9) + all VS pages (priority 0.7) to main sitemap
- `scripts/generate-llms-data.mjs`: add hubs section + VS section listing all comparison URLs

### Routes added to `App.tsx`
4 hub routes + `/comparativa/:pair` dynamic route (preserves existing `/comparativa` index and `/comparativa/:slug` if any — disambiguate by detecting `-vs-` in param).

### Files (new)
- `src/components/hubs/IntentHub.tsx`
- `src/pages/hubs/MejorHostingWordPress.tsx`
- `src/pages/hubs/MejorHostingEcommerce.tsx`
- `src/pages/hubs/MejorHostingPymes.tsx`
- `src/pages/hubs/MejorVPS.tsx`
- `src/pages/ComparativaVs.tsx` (dynamic [slugA]-vs-[slugB])
- `src/components/RecommendedByData.tsx`
- `src/lib/vsPairs.ts` (helper to enumerate all VS pairs)

### Files (edited)
- `src/App.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`
- `src/pages/Index.tsx` (quiz chips + service cards linking)
- `src/pages/Comparativa.tsx` (brand comparison index)
- `src/pages/CatalogoDetalle.tsx` (vs-#1 block)
- 5 guías + `WikiTerm.tsx` + `BlogPost.tsx` (RecommendedByData)
- `scripts/prerender.mjs`, `scripts/generate-sitemap.mjs`, `scripts/generate-llms-data.mjs`

¿Procedo?
