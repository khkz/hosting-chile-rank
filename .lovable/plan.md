

## Analysis: Admin UX/UI + Data Quality + Content Humanization

### Current Problems Identified

**1. AI Scraper produces hallucinated/generic data**
- BlueHosting has a fabricated address ("Isidora Goyenechea 2800") and generic email
- Descriptions are bland, interchangeable GPT boilerplate ("ofrece servicios de hosting confiables y rápidos")
- Technical details in `HostingCompanyInfo` are hardcoded (always shows "LiteSpeed Enterprise / Apache", "MySQL 8.0") regardless of actual company tech stack
- No confidence indicators on scraped data — admin can't tell what's real vs hallucinated

**2. Admin UX/UI Issues**
- Company Curation and Domain Sniper are separate pages with no cross-navigation
- Dashboard stats don't include pending audits count or data quality metrics
- No bulk actions (verify/curate multiple companies at once)
- Edit dialog is basic — no field-level source attribution ("this came from scraping" vs "manually entered")
- No way to see last scrape date or scrape source per field
- Completeness score doesn't weight critical fields (description quality, not just existence)

**3. Public-facing content feels auto-generated**
- Company descriptions are 1-2 generic sentences
- `CatalogoDetalle` shows hardcoded tech specs table instead of real company data
- No editorial voice, no comparative insights, no "why this matters" context
- Missing: uptime guarantee, payment methods, SSL/migration info that the scraper already extracts but never displays

---

### Plan

#### Task 1: Enhance AI Scraper with Humanization + Confidence Scoring

**Edge function `ai-web-scraper`:**
- Add a `confidence` field per extracted datum (high/medium/low/guessed) to the system prompt
- Add `description_editorial`: a 4-5 sentence editorial-quality description written in third person, mentioning real differentiators, not marketing fluff
- Add `pros` and `cons` arrays (3 each, based on real observations)
- Add `unique_selling_point`: one concrete differentiator
- Instruct GPT to return `null` with `"confidence": "not_found"` instead of inventing data

**New system prompt additions:**
```
- NUNCA inventes datos. Si no encuentras un dato, devuelve null.
- "confidence": object con cada campo y su nivel: "verified" (aparece textualmente), "inferred" (deducido del contexto), "not_found" (no encontrado)
- "description_editorial": Párrafo de 4-5 oraciones en tercera persona, tono periodístico sobrio. Menciona hechos concretos encontrados (año fundación, tecnologías, ubicación). NO uses frases genéricas como "ofrece servicios confiables".
- "pros": 3 ventajas concretas basadas en la web (ej: "Usa LiteSpeed Enterprise, no solo Apache")
- "cons": 3 desventajas o carencias observadas (ej: "No publica dirección física", "Sin información de RUT")
```

#### Task 2: Store Confidence Metadata in Audit Log

- Extend `company_audit_log.scraped_data` to include the confidence object
- In `AuditReviewPanel`, show confidence badges next to each field (green=verified, yellow=inferred, red=not_found)
- Fields marked "not_found" are hidden from approval to prevent committing nulls over existing data

#### Task 3: Fix Hardcoded Tech Specs in Public Pages

**`HostingCompanyInfo.tsx`:**
- Replace the hardcoded technical details table with actual data from `hosting_companies.technologies`, `uptime_guarantee`, `payment_methods`, etc.
- Add new DB columns: `uptime_guarantee`, `has_ssl_free`, `has_migration_free`, `payment_methods` (the scraper already extracts these but they're never saved)
- Display pros/cons if available
- Show `description_editorial` instead of `description` when available (with fallback)

**Migration:** Add columns to `hosting_companies`:
```sql
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS uptime_guarantee text;
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS has_ssl_free boolean DEFAULT false;
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS has_migration_free boolean DEFAULT false;
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS payment_methods text[] DEFAULT '{}';
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS description_editorial text;
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS pros text[] DEFAULT '{}';
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS cons text[] DEFAULT '{}';
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS unique_selling_point text;
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS data_confidence jsonb DEFAULT '{}';
ALTER TABLE hosting_companies ADD COLUMN IF NOT EXISTS last_scraped_at timestamptz;
```

#### Task 4: Admin Dashboard Improvements

**Dashboard (`admin/Dashboard.tsx`):**
- Add "Auditorías Pendientes" stat card linking to `/admin/company-curation`
- Add "Calidad de Datos" metric (average completeness across all companies)

**Company Curation UX:**
- Add data freshness indicator (last scraped date)
- Color-code fields by confidence level in expanded view
- Add "Re-scrapear" button per company that triggers single OSINT scan and creates pending audit
- Show `description_editorial` preview in the card

#### Task 5: Improve OSINT Scanner Batch Flow

**`OSINTScanner.tsx` batch audit:**
- Add the new fields (`description_editorial`, `pros`, `cons`, `confidence`) to the MAPPABLE_FIELDS in `AuditReviewPanel`
- After batch completes, show a summary with data quality metrics (how many fields verified vs inferred)
- Add progress bar instead of just text

#### Task 6: Enrich Public Catalog Pages

**`Catalogo.tsx`:**
- Show `unique_selling_point` as a highlight badge on each card
- Show corporate group badge ("Grupo Haulmer") when applicable
- Add "Verificado por EligeTuHosting" badge for curated+verified companies

**`CatalogoDetalle.tsx`:**
- Replace hardcoded tech table with real `technologies`, `uptime_guarantee`, `payment_methods`
- Show `pros`/`cons` section
- Show `description_editorial` as the main description
- Display data freshness ("Datos actualizados: marzo 2026")
- Show corporate group transparency notice when company belongs to a group

---

### Technical Details

**Files to modify:**
1. `supabase/functions/ai-web-scraper/index.ts` — Enhanced system prompt with confidence + editorial content
2. New migration — Add columns to `hosting_companies`
3. `src/components/admin/AuditReviewPanel.tsx` — Confidence badges, new field mappings
4. `src/components/domain-sniper/OSINTScanner.tsx` — Map new fields in batch save, progress bar
5. `src/components/HostingCompanyInfo.tsx` — Dynamic tech specs from DB data
6. `src/pages/CatalogoDetalle.tsx` — Editorial description, pros/cons, real tech data
7. `src/pages/Catalogo.tsx` — USP badges, corporate group, verified badge
8. `src/pages/admin/Dashboard.tsx` — Pending audits stat, data quality metric
9. `src/pages/admin/CompanyCuration.tsx` — Re-scrape button, confidence colors, freshness
10. `src/integrations/supabase/types.ts` — Updated types

**Data flow:**
```text
Scraper extracts → confidence-tagged JSON
  ↓
Batch inserts → company_audit_log (pending)
  ↓
Admin reviews → AuditReviewPanel (diff + confidence badges)
  ↓
Approved fields → hosting_companies (with editorial content)
  ↓
Public pages → CatalogoDetalle shows real, humanized content
```

