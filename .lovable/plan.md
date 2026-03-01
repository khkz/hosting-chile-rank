

## Plan: Update Grupo Casamayor (AS265839) Corporate Data

### Current State
- `hostingcl` and `planetahosting` exist in DB with `corporate_group: "Grupo ISwL (Hosting.cl / PlanetaHosting)"`
- `comparahosting.cl`, `ninjahosting.cl`, `ihost.cl`, `todohosting.cl` are **not** in the DB yet
- `BRAND_ALIASES` in `asn-proxy` already maps `hosting.cl`, `ninjahosting.cl`, `planetahosting.cl` to "Grupo Hosting.cl"
- `hostingASNService.ts` maps AS265839 only to "Hosting.cl"

### Changes

**1. Normalize corporate group name** across all sources to **"Grupo Casamayor"** (the actual owner, Cristian Casamayor):
- Update `hosting_companies` rows for `hostingcl` and `planetahosting` via SQL
- Update `BRAND_ALIASES` in `asn-proxy/index.ts`
- Update AS265839 entry in `hostingASNService.ts`

**2. Add missing brands to `BRAND_ALIASES`** in `asn-proxy/index.ts`:
- `comparahosting.cl` → "Grupo Casamayor"
- `ihost.cl` → "Grupo Casamayor"
- `todohosting.cl` → "Grupo Casamayor"
- `ninjahosting.cl` already there, just rename group

**3. Update `hostingASNService.ts`** AS265839 entry to reflect "Grupo Casamayor" and add a `corporateGroup` field noting all brands.

**4. Insert the missing companies** (`ninjahosting`, `comparahosting`, `ihost`, `todohosting`) into `hosting_companies` with `corporate_group = 'Grupo Casamayor'`, `is_independent = false`, `is_verified = false` so they appear as pending for curation.

### Files Modified
- `supabase/functions/asn-proxy/index.ts` — BRAND_ALIASES updates
- `src/services/hostingASNService.ts` — AS265839 mapping
- New SQL migration — update existing + insert new companies

