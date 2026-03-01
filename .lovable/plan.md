

## Sprint 2: SEO Tecnico

### Cambios requeridos

**1. Instalar `react-helmet-async` y actualizar `main.tsx`**
- Add `react-helmet-async` dependency
- Wrap the app in `<HelmetProvider>` in `main.tsx`

**2. Replace `import { Helmet } from 'react-helmet'` → `import { Helmet } from 'react-helmet-async'` in 36 files:**

Components:
- `src/components/SEO/DynamicMetaTags.tsx`
- `src/components/RSSFeed.tsx`

Pages:
- `src/pages/AcercaDe.tsx`
- `src/pages/ASNChile.tsx`
- `src/pages/ASNDetail.tsx`
- `src/pages/ASNDirectory.tsx`
- `src/pages/Benchmark.tsx`
- `src/pages/Blog.tsx`
- `src/pages/BlogPost.tsx`
- `src/pages/Catalogo.tsx`
- `src/pages/CatalogoDetalle.tsx`
- `src/pages/Certificaciones.tsx`
- `src/pages/Comparativa.tsx`
- `src/pages/Contacto.tsx`
- `src/pages/CotizaHosting.tsx`
- `src/pages/DirectorioHosting.tsx`
- `src/pages/DominiosPremium.tsx`
- `src/pages/GuiaCompletaElegirHosting.tsx`
- `src/pages/GuiaElegirCDN.tsx`
- `src/pages/GuiaElegirHosting.tsx`
- `src/pages/GuiaElegirSSL.tsx`
- `src/pages/GuiaElegirServidorDedicado.tsx`
- `src/pages/GuiaElegirVPS.tsx`
- `src/pages/GuiaHostingWordPress.tsx`
- `src/pages/GuiaMigrarHosting.tsx`
- `src/pages/GuiaSeguridadWeb.tsx`
- `src/pages/MejorHostingChile2026.tsx`
- `src/pages/MejorHostingEcommerceChile.tsx`
- `src/pages/MejorHostingWordPressChile.tsx`
- `src/pages/Ranking.tsx`
- `src/pages/RecursosHosting.tsx`
- `src/pages/Resena.tsx`
- `src/pages/Sitemap.tsx`
- `src/pages/TCOCalculatorPage.tsx`
- `src/pages/UltimosDominios.tsx`
- `src/pages/VotaHosting.tsx`
- `src/pages/WhoisDomain.tsx`
- `src/pages/WikiCategory.tsx`
- `src/pages/WikiIndex.tsx`
- `src/pages/WikiTerm.tsx`
- `src/pages/provider/CompanyProfile.tsx`
- `src/pages/provider/PlanManagement.tsx`
- `src/pages/provider/ProviderDashboard.tsx`
- `src/pages/provider/ReviewResponses.tsx`

**3. Fix `SEOFAQSchema.tsx`**
- Use `<script>` with `dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}` instead of rendering JSON as children

**4. Fix `DynamicMetaTags.tsx`**
- Import `useLocation` from `react-router-dom`
- Replace `window.location.pathname` with `useLocation().pathname`
- Change import from `react-helmet` to `react-helmet-async`

