
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';

// Legacy singular → canonical plural reseñas redirect (replace-true ≈ 301 for client navs)
const ResenaSingularRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/resenas/${slug ?? ''}`} replace />;
};
import ScrollToTop from './components/ScrollToTop';
import WhoisRedirect from './components/WhoisRedirect';
import DomainRedirect from './components/DomainRedirect';
import CanonicalRedirect from './components/CanonicalRedirect';
import VsAliasRedirect from './components/VsAliasRedirect';
import StaticSitemap from './components/StaticSitemap';
import StaticRobots from './components/StaticRobots';
import StaticRSSFeed from './components/StaticRSSFeed';
import LlmsTxt from './components/LlmsTxt';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from 'sonner';
import { AuthProvider } from './providers/AuthProvider';
import ComparativaRouteDispatcher from './components/ComparativaRouteDispatcher';
import DirectorioRedirect from './components/DirectorioRedirect';
import SEOOrganization from './components/SEOOrganization';
import ProtectedRoute from './components/ProtectedRoute';
import HomeDispatcher from './components/HomeDispatcher';

const HostingAdvisorFab = React.lazy(() => import('./components/advisor/HostingAdvisorFab'));
const Ranking = React.lazy(() => import('./pages/Ranking'));
const OutboundRedirect = React.lazy(() => import('./pages/OutboundRedirect'));
const Comparativa = React.lazy(() => import('./pages/Comparativa'));
const CotizaHosting = React.lazy(() => import('./pages/CotizaHosting'));
const WhoisDomain = React.lazy(() => import('./pages/WhoisDomain'));
const UltimosDominios = React.lazy(() => import('./pages/UltimosDominios'));
const GuiaElegirHosting = React.lazy(() => import('./pages/GuiaElegirHosting'));
const GuiaElegirVPS = React.lazy(() => import('./pages/GuiaElegirVPS'));
const GuiaElegirServidorDedicado = React.lazy(() => import('./pages/GuiaElegirServidorDedicado'));
const GuiaElegirCDN = React.lazy(() => import('./pages/GuiaElegirCDN'));
const GuiaElegirSSL = React.lazy(() => import('./pages/GuiaElegirSSL'));
const GuiaMigrarHosting = React.lazy(() => import('./pages/GuiaMigrarHosting'));
const GuiaSeguridadWeb = React.lazy(() => import('./pages/GuiaSeguridadWeb'));
const GuiaHostingMasSeguro = React.lazy(() => import('./pages/GuiaHostingMasSeguro'));
const GuiaHostingWordPress = React.lazy(() => import('./pages/GuiaHostingWordPress'));
const GuiaCompletaElegirHosting = React.lazy(() => import('./pages/GuiaCompletaElegirHosting'));
const ErroresComunesHosting = React.lazy(() => import('./pages/ErroresComunesHosting'));
const MejorHostingWordPressChile = React.lazy(() => import('./pages/MejorHostingWordPressChile'));
const MejorHostingEcommerceChile = React.lazy(() => import('./pages/MejorHostingEcommerceChile'));
const HubWordPress = React.lazy(() => import('./pages/hubs/HubWordPress'));
const HubEcommerce = React.lazy(() => import('./pages/hubs/HubEcommerce'));
const HubPymes = React.lazy(() => import('./pages/hubs/HubPymes'));
const HubVPS = React.lazy(() => import('./pages/hubs/HubVPS'));
const AlternativasA = React.lazy(() => import('./pages/AlternativasA'));
const MigrarDe = React.lazy(() => import('./pages/MigrarDe'));
const RecursosHosting = React.lazy(() => import('./pages/RecursosHosting'));
const Resena = React.lazy(() => import('./pages/Resena'));
const Catalogo = React.lazy(() => import('./pages/Catalogo'));
const CatalogoDetalle = React.lazy(() => import('./pages/CatalogoDetalle'));
const Directorio = React.lazy(() => import('./pages/Directorio'));
const Benchmark = React.lazy(() => import('./pages/Benchmark'));
const MetodologiaBenchmark = React.lazy(() => import('./pages/MetodologiaBenchmark'));
const Metodologia = React.lazy(() => import('./pages/Metodologia'));
const MejorHostingChile2026 = React.lazy(() => import('./pages/MejorHostingChile2026'));
const Sitemap = React.lazy(() => import('./pages/Sitemap'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const TCOCalculatorPage = React.lazy(() => import('./pages/TCOCalculatorPage'));
const AcercaDe = React.lazy(() => import('./pages/AcercaDe'));
const SobreNosotros = React.lazy(() => import('./pages/SobreNosotros'));
const QuienesSomos = React.lazy(() => import('./pages/QuienesSomos'));
const ASNDirectory = React.lazy(() => import('./pages/ASNDirectory'));
const ASNDetail = React.lazy(() => import('./pages/ASNDetail'));
const ASNChile = React.lazy(() => import('./pages/ASNChile'));
const WikiIndex = React.lazy(() => import('./pages/WikiIndex'));
const WikiTerm = React.lazy(() => import('./pages/WikiTerm'));
const WikiCategory = React.lazy(() => import('./pages/WikiCategory'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminReputation = React.lazy(() => import('./pages/admin/Reputation'));
const AdminBenchmarkRuns = React.lazy(() => import('./pages/admin/BenchmarkRuns'));
const ReviewModeration = React.lazy(() => import('./pages/admin/ReviewModeration'));
const AdminPublicReviews = React.lazy(() => import('./pages/admin/PublicReviews'));
const Setup = React.lazy(() => import('./pages/admin/Setup'));
const Companies = React.lazy(() => import('./pages/admin/Companies'));
const AdminCertifications = React.lazy(() => import('./pages/admin/Certifications'));
const DataMigration = React.lazy(() => import('./pages/admin/DataMigration'));
const DomainSniper = React.lazy(() => import('./pages/admin/DomainSniper'));
const CompanyCuration = React.lazy(() => import('./pages/admin/CompanyCuration'));
const AdminPrecios = React.lazy(() => import('./pages/admin/Precios'));
const ProviderDashboard = React.lazy(() => import('./pages/provider/ProviderDashboard'));
const CompanyProfile = React.lazy(() => import('./pages/provider/CompanyProfile'));
const PlanManagement = React.lazy(() => import('./pages/provider/PlanManagement'));
const ReviewResponses = React.lazy(() => import('./pages/provider/ReviewResponses'));
const ProviderCertifications = React.lazy(() => import('./pages/provider/Certifications'));
const BadgeGenerator = React.lazy(() => import('./pages/provider/BadgeGenerator'));
const Certificaciones = React.lazy(() => import('./pages/Certificaciones'));
const Auth = React.lazy(() => import('./pages/Auth'));
const NuestroMetodo = React.lazy(() => import('./pages/NuestroMetodo'));
const HostingWordPressBlogPersonal = React.lazy(() => import('./pages/HostingWordPressBlogPersonal'));
const DominiosPremium = React.lazy(() => import('./pages/DominiosPremium'));
const TransparenciaHosting = React.lazy(() => import('./pages/TransparenciaHosting'));
const VsComparison = React.lazy(() => import('./pages/VsComparison'));
const Reclamos = React.lazy(() => import('./pages/Reclamos'));
const VerificarReclamo = React.lazy(() => import('./pages/VerificarReclamo'));
const SeoAudit = React.lazy(() => import('./pages/SeoAudit'));
const SeoDashboard = React.lazy(() => import('./pages/SeoDashboard'));
const EstudioHostingChile2026 = React.lazy(() => import('./pages/EstudioHostingChile2026'));
const Contacto = React.lazy(() => import('./pages/Contacto'));
const VotaHosting = React.lazy(() => import('./pages/VotaHosting'));
const CountryLanding = React.lazy(() => import('./pages/CountryLanding'));
const CountryProviderDetail = React.lazy(() => import('./pages/CountryProviderDetail'));
const CountryBestHosting = React.lazy(() => import('./pages/CountryBestHosting'));
const MejorHostingPeru2026 = React.lazy(() => import('./pages/MejorHostingPeru2026'));
const CountryDatacenterLocal = React.lazy(() => import('./pages/CountryDatacenterLocal'));
const CountryComparativa = React.lazy(() => import('./pages/CountryComparativa'));
const CountryBenchmark = React.lazy(() => import('./pages/CountryBenchmark'));
const DatosAbiertos = React.lazy(() => import('./pages/DatosAbiertos'));
const Latam = React.lazy(() => import('./pages/Latam'));
const HostDimePePilot = React.lazy(() => import('./pages/pilot/HostDimePePilot'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <DomainRedirect />
        <CanonicalRedirect />
        <ScrollToTop />
        <Toaster />
        <Sonner />
        <SEOOrganization />
        <React.Suspense fallback={null}>
          <HostingAdvisorFab />
        </React.Suspense>
        <React.Suspense fallback={null}>
        <Routes>
        {/* Rutas para archivos estáticos */}
        <Route path="/sitemap.xml" element={<StaticSitemap />} />
        <Route path="/robots.txt" element={<StaticRobots />} />
        <Route path="/feed/latest-domains.xml" element={<StaticRSSFeed />} />
        <Route path="/llms.txt" element={<LlmsTxt />} />
        
        {/* Rutas normales de la aplicación */}
        <Route path="/" element={<HomeDispatcher />} />
        <Route path="/latam" element={<Latam />} />
        <Route path="/datos" element={<DatosAbiertos />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/ir/:slug" element={<OutboundRedirect />} />
        <Route path="/comparativa" element={<Comparativa />} />
        <Route path="/cotiza-hosting" element={<CotizaHosting />} />
        <Route path="/domain/:slug" element={<WhoisDomain />} />
        <Route path="/domain/:slug/" element={<WhoisDomain />} />
        
        {/* Rutas de redirección para compatibilidad con URLs antiguas */}
        <Route path="/whois/:slug" element={<WhoisRedirect />} />
        <Route path="/whois/:slug/" element={<WhoisRedirect />} />
        
        <Route path="/ultimos-dominios" element={<UltimosDominios />} />
        <Route path="/guia-elegir-hosting" element={<GuiaElegirHosting />} />
        <Route path="/guia-elegir-vps" element={<GuiaElegirVPS />} />
        <Route path="/guia-elegir-servidor-dedicado" element={<GuiaElegirServidorDedicado />} />
        <Route path="/guia-elegir-cdn" element={<GuiaElegirCDN />} />
        <Route path="/guia-elegir-ssl" element={<GuiaElegirSSL />} />
        <Route path="/guia-migrar-hosting" element={<GuiaMigrarHosting />} />
        <Route path="/guia-seguridad-web" element={<GuiaSeguridadWeb />} />
        <Route path="/guia-hosting-mas-seguro-chile" element={<GuiaHostingMasSeguro />} />
        <Route path="/guia-hosting-wordpress" element={<GuiaHostingWordPress />} />
        <Route path="/guia-completa-elegir-hosting-chile-2026" element={<GuiaCompletaElegirHosting />} />
        <Route path="/guia-completa-elegir-hosting-chile-2025" element={<Navigate to="/guia-completa-elegir-hosting-chile-2026" replace />} />
        <Route path="/guia-completa-elegir-hosting-chile" element={<GuiaCompletaElegirHosting />} />
        <Route path="/errores-comunes-elegir-hosting" element={<ErroresComunesHosting />} />
        <Route path="/errores-comunes-hosting-chile" element={<ErroresComunesHosting />} />
        <Route path="/mejor-hosting-wordpress-chile-2026" element={<MejorHostingWordPressChile />} />
        <Route path="/mejor-hosting-wordpress-chile-2025" element={<Navigate to="/mejor-hosting-wordpress-chile" replace />} />
        <Route path="/mejor-hosting-wordpress-chile" element={<HubWordPress />} />
        <Route path="/mejor-hosting-ecommerce-chile-2026" element={<MejorHostingEcommerceChile />} />
        <Route path="/mejor-hosting-ecommerce-chile-2025" element={<Navigate to="/mejor-hosting-ecommerce-chile" replace />} />
        <Route path="/mejor-hosting-ecommerce-chile" element={<HubEcommerce />} />
        <Route path="/mejor-hosting-pymes-chile" element={<HubPymes />} />
        <Route path="/mejor-vps-chile" element={<HubVPS />} />
        <Route path="/recursos-hosting-chile" element={<RecursosHosting />} />
        <Route path="/reseñas/:slug" element={<Resena />} />
        <Route path="/resenas/:slug" element={<Resena />} />
        {/* Redirect legacy singular /resena/:slug → canonical plural /resenas/:slug */}
        <Route path="/resena/:slug" element={<ResenaSingularRedirect />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/catalogo/:slug" element={<CatalogoDetalle />} />
        <Route path="/directorio" element={<Directorio />} />
        <Route path="/benchmark" element={<Benchmark />} />
        <Route path="/metodologia-benchmark" element={<MetodologiaBenchmark />} />
        <Route path="/metodologia" element={<Metodologia />} />
        <Route path="/mejor-hosting-chile-2026" element={<MejorHostingChile2026 />} />
        <Route path="/mejor-hosting-chile-2025" element={<Navigate to="/mejor-hosting-chile-2026" replace />} />
        <Route path="/mejor-hosting-chile" element={<Navigate to="/mejor-hosting-chile-2026" replace />} />
        <Route path="/calculadora-tco" element={<TCOCalculatorPage />} />
        <Route path="/acerca-de" element={<AcercaDe />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/asn" element={<ASNDirectory />} />
        <Route path="/asn/chile" element={<ASNChile />} />
        <Route path="/asn/:asn" element={<ASNDetail />} />
        <Route path="/wiki" element={<WikiIndex />} />
        <Route path="/wiki/categoria/:categoryId" element={<WikiCategory />} />
        <Route path="/wiki/:slug" element={<WikiTerm />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/nuestro-metodo" element={<NuestroMetodo />} />
        <Route path="/hosting-wordpress-blog-personal-chile" element={<HostingWordPressBlogPersonal />} />
        <Route path="/dominios-premium" element={<DominiosPremium />} />
        <Route path="/transparencia-hosting-chile" element={<TransparenciaHosting />} />
        <Route path="/estudio-hosting-chile-2026" element={<EstudioHostingChile2026 />} />
        <Route path="/investigacion-hosting-chile-2026" element={<EstudioHostingChile2026 />} />
        <Route path="/vs/:rival" element={<VsComparison />} />
        {/* 301 a canonical /vs/:rival para evitar duplicados */}
        <Route path="/comparar/:rival" element={<VsAliasRedirect />} />
        <Route path="/comparativa/:rival" element={<ComparativaRouteDispatcher />} />
        <Route path="/alternativas-a/:slug" element={<AlternativasA />} />
        <Route path="/migrar-de/:slug" element={<MigrarDe />} />
        <Route path="/reclamos" element={<Reclamos />} />
        <Route path="/verificar-reclamo" element={<VerificarReclamo />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/vota-hosting" element={<VotaHosting />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/reviews" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ReviewModeration />
              </ProtectedRoute>
            } />
            <Route path="/admin/resenas" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPublicReviews />
              </ProtectedRoute>
            } />
            <Route path="/admin/reseñas" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPublicReviews />
              </ProtectedRoute>
            } />
            <Route path="/admin/setup" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Setup />
              </ProtectedRoute>
            } />
            <Route path="/admin/empresas" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Companies />
              </ProtectedRoute>
            } />
            <Route path="/admin/certificaciones" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCertifications />
              </ProtectedRoute>
            } />
            <Route path="/admin/migracion" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DataMigration />
              </ProtectedRoute>
            } />
            <Route path="/admin/domain-sniper" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DomainSniper />
              </ProtectedRoute>
            } />
            <Route path="/admin/company-curation" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompanyCuration />
              </ProtectedRoute>
            } />
            <Route path="/admin/reputation" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReputation />
              </ProtectedRoute>
            } />
            <Route path="/admin/benchmark" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminBenchmarkRuns />
              </ProtectedRoute>
            } />
            <Route path="/admin/precios" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPrecios />
              </ProtectedRoute>
            } />
            <Route path="/provider/dashboard" element={
              <ProtectedRoute allowedRoles={['hosting_provider']}>
                <ProviderDashboard />
              </ProtectedRoute>
            } />
            <Route path="/provider/company" element={
              <ProtectedRoute allowedRoles={['hosting_provider']}>
                <CompanyProfile />
              </ProtectedRoute>
            } />
            <Route path="/provider/plans" element={
              <ProtectedRoute allowedRoles={['hosting_provider']}>
                <PlanManagement />
              </ProtectedRoute>
            } />
            <Route path="/provider/reviews" element={
              <ProtectedRoute allowedRoles={['hosting_provider']}>
                <ReviewResponses />
              </ProtectedRoute>
            } />
            <Route path="/provider/certifications" element={
              <ProtectedRoute allowedRoles={['hosting_provider']}>
                <ProviderCertifications />
              </ProtectedRoute>
            } />
            <Route path="/provider/badges" element={
              <ProtectedRoute allowedRoles={['hosting_provider']}>
                <BadgeGenerator />
              </ProtectedRoute>
            } />
            <Route path="/certificaciones" element={<Certificaciones />} />
            <Route path="/seo-audit" element={<SeoAudit />} />
            <Route path="/auditoria-seo" element={<SeoAudit />} />
            <Route path="/dashboard/seo" element={
              <ProtectedRoute>
                <SeoDashboard />
              </ProtectedRoute>
            } />
            {/* Canonical → /catalogo + noindex,follow + redirect cliente */}
            <Route path="/directorio-hosting-chile" element={<DirectorioRedirect />} />
            {/* Country shells on .com (additive — .cl no navega aquí) */}
            {/* Rutas específicas por país (deben ir ANTES de /:slug para ganar el match) */}
            <Route path="/pe/mejor-hosting-peru-2026" element={<MejorHostingPeru2026 />} />
            <Route path="/pe/mejor-hosting-peru" element={<Navigate to="/pe/mejor-hosting-peru-2026" replace />} />
            <Route path="/mx/mejor-hosting-mexico-2026" element={<CountryBestHosting />} />
            <Route path="/co/mejor-hosting-colombia-2026" element={<CountryBestHosting />} />
            <Route path="/ar/mejor-hosting-argentina-2026" element={<CountryBestHosting />} />
            <Route path="/pe/hosting-con-datacenter-local" element={<CountryDatacenterLocal />} />
            <Route path="/mx/hosting-con-datacenter-local" element={<CountryDatacenterLocal />} />
            <Route path="/co/hosting-con-datacenter-local" element={<CountryDatacenterLocal />} />
            <Route path="/ar/hosting-con-datacenter-local" element={<CountryDatacenterLocal />} />
            <Route path="/pe/comparativa/:pair" element={<CountryComparativa />} />
            <Route path="/mx/comparativa/:pair" element={<CountryComparativa />} />
            <Route path="/co/comparativa/:pair" element={<CountryComparativa />} />
            <Route path="/ar/comparativa/:pair" element={<CountryComparativa />} />
            <Route path="/pe/benchmark" element={<CountryBenchmark />} />
            <Route path="/mx/benchmark" element={<CountryBenchmark />} />
            <Route path="/co/benchmark" element={<CountryBenchmark />} />
            <Route path="/ar/benchmark" element={<CountryBenchmark />} />
            <Route path="/pe" element={<CountryLanding />} />
            <Route path="/pe/hostdime-pe" element={<HostDimePePilot />} />
            <Route path="/pe/:slug" element={<CountryProviderDetail />} />
            <Route path="/pe/*" element={<CountryLanding />} />
            <Route path="/mx" element={<CountryLanding />} />
            <Route path="/mx/:slug" element={<CountryProviderDetail />} />
            <Route path="/mx/*" element={<CountryLanding />} />
            <Route path="/co" element={<CountryLanding />} />
            <Route path="/co/:slug" element={<CountryProviderDetail />} />
            <Route path="/co/*" element={<CountryLanding />} />
            <Route path="/ar" element={<CountryLanding />} />
            <Route path="/ar/:slug" element={<CountryProviderDetail />} />
            <Route path="/ar/*" element={<CountryLanding />} />
            <Route path="*" element={<NotFound />} />
      </Routes>
      </React.Suspense>
    </Router>
    </AuthProvider>
  );
}

export default App;
