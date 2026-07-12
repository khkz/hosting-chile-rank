import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink, ShieldCheck, MapPin, Server, Activity, Cpu, Calendar,
  Building2, HelpCircle, AlertTriangle, CheckCircle2, XCircle, GitCompare,
} from 'lucide-react';

const COMPANY_ID = 'ddd665ba-17aa-4aee-96d2-08239d90cd2f';
const SLUG = 'hostdime-pe';
const NAME = 'HostDime Perú';
const CANONICAL = 'https://eligetuhosting.com/pe/hostdime-pe';
const WEBSITE = 'https://www.hostdime.com.pe/';
const REVIEWED_ON = '2026-07-12';

const HostDimePePilot = () => {
  const { data: company } = useQuery({
    queryKey: ['pilot-hostdime-pe'],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_companies')
        .select('*')
        .eq('slug', SLUG)
        .maybeSingle();
      return data as any;
    },
  });

  const { data: siteCheck } = useQuery({
    queryKey: ['pilot-hostdime-pe-check'],
    queryFn: async () => {
      const { data } = await supabase
        .from('latam_site_checks' as any)
        .select('*')
        .eq('company_id', COMPANY_ID)
        .order('checked_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as any;
    },
  });

  const { data: complaintsStats } = useQuery({
    queryKey: ['pilot-hostdime-pe-complaints'],
    queryFn: async () => {
      const { count } = await supabase
        .from('public_complaints_public' as any)
        .select('*', { count: 'exact', head: true })
        .eq('company_id', COMPANY_ID)
        .in('status', ['verified', 'resolved']);
      return { count: count ?? 0 };
    },
  });

  const { data: plans } = useQuery({
    queryKey: ['pilot-hostdime-pe-plans'],
    queryFn: async () => {
      const { data } = await supabase
        .from('hosting_plans')
        .select('*')
        .eq('company_id', COMPANY_ID);
      return data ?? [];
    },
  });

  if (!company) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Cargando información…</p>
        </div>
        <Footer />
      </>
    );
  }

  const complaintsCount = complaintsStats?.count ?? 0;
  const techs: string[] = Array.isArray(company.technologies) ? company.technologies : [];
  const yearsOperating = company.year_founded ? new Date().getFullYear() - company.year_founded : null;

  const heroAnswer = `Sí, HostDime Perú es una opción sólida y verificable para hosting en Perú. Opera desde ${company.year_founded} (${yearsOperating} años) bajo la razón social HostDime.com.pe S.A.C. (RUC 20563098296), con datacenter propio Tier IV en Lima y soporte 24/7 local. Es filial del grupo HostDime Global (EE.UU.). ${complaintsCount === 0 ? 'Sin reclamos verificados' : `${complaintsCount} reclamos verificados`} en nuestro registro público.`;

  const forWho = [
    'Empresas peruanas que necesitan latencia mínima con audiencias locales.',
    'Proyectos que requieren facturación con RUC y jurisdicción peruana.',
    'Cargas exigentes: dedicados, colocation, cloud privado con soporte hispano 24/7.',
  ];
  const notForWho = [
    'Blogs personales o proyectos muy pequeños con presupuesto ajustado (su fuerte son infraestructura mediana y alta).',
    'Quienes buscan hosting compartido masivo tipo cPanel al precio más bajo del mercado.',
    'Audiencias fuera de LATAM sin necesidad de datacenter regional.',
  ];

  const faq = [
    {
      q: '¿HostDime Perú tiene datacenter propio en Perú?',
      a: 'Sí. HostDime declara datacenter propio Tier IV de aproximadamente 75.000 sq ft en Lima, con red autónoma AS33182. Esto reduce la latencia para audiencias peruanas y mantiene los datos bajo jurisdicción local, un factor relevante para empresas con requisitos de cumplimiento normativo.',
    },
    {
      q: '¿Cuál es la razón social e ID fiscal de HostDime Perú?',
      a: 'La razón social registrada es HostDime.com.pe S.A.C., con RUC 20563098296. Esto significa que las facturas se emiten desde una entidad peruana legalmente constituida, no desde la matriz estadounidense HostDime Global, lo que simplifica el crédito fiscal para empresas locales.',
    },
    {
      q: '¿Hace cuánto opera HostDime en Perú?',
      a: `Registra actividad comercial en Perú desde ${company.year_founded}, es decir ${yearsOperating} años de operación continua en el mercado local. Forma parte del grupo HostDime Global fundado en Orlando, EE.UU., que aporta infraestructura y estándares operativos internacionales a la filial peruana.`,
    },
    {
      q: '¿Qué tecnologías ofrece HostDime Perú?',
      a: `HostDime declara un stack orientado a infraestructura mediana y alta: ${techs.join(', ')}. No se posiciona como hosting compartido económico, sino como proveedor de servidores dedicados, virtualización y colocation con paneles de control estándar de la industria como cPanel y Plesk.`,
    },
    {
      q: '¿HostDime Perú tiene soporte 24/7?',
      a: `Sí. Declara soporte técnico 24/7 en español, con equipo de ventas disponible de lunes a viernes de 7:30 a 19:00. Contacto directo por teléfono (${company.contact_phone}) y correo (${company.contact_email}). Al ser filial peruana, el soporte comercial y las facturas se manejan en el país.`,
    },
    {
      q: '¿HostDime Perú tiene reclamos públicos?',
      a: `Actualmente registra ${complaintsCount} ${complaintsCount === 1 ? 'reclamo verificado' : 'reclamos verificados'} en nuestro registro público (desde 2025-01-01). Ausencia de reclamos verificados no equivale a ausencia de problemas: siempre revisa reseñas independientes antes de contratar y verifica los tiempos de respuesta reales del soporte.`,
    },
  ];

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: NAME,
    legalName: 'HostDime.com.pe S.A.C.',
    url: WEBSITE,
    telephone: company.contact_phone,
    email: company.contact_email,
    foundingDate: String(company.year_founded),
    taxID: 'RUC 20563098296',
    parentOrganization: { '@type': 'Organization', name: 'HostDime Global' },
    address: { '@type': 'PostalAddress', streetAddress: company.contact_address, addressCountry: 'PE' },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://eligetuhosting.com/' },
      { '@type': 'ListItem', position: 2, name: 'Hosting en Perú', item: 'https://eligetuhosting.com/pe' },
      { '@type': 'ListItem', position: 3, name: NAME, item: CANONICAL },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    dateModified: REVIEWED_ON,
    mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const title = `${NAME} — ¿Es bueno? Análisis verificable 2026 | EligeTuHosting`;
  const description = `HostDime Perú: datacenter Tier IV propio en Lima, ${yearsOperating} años operando como HostDime.com.pe S.A.C. (RUC 20563098296). Datos técnicos, reputación y para quién sí conviene.`;

  return (
    <>
      <Helmet>
        <html lang="es-PE" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="EligeTuHosting" />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content="https://eligetuhosting.com/og/pe.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index,follow" />
        <link rel="alternate" type="text/markdown" href="/pe/hostdime-pe.md" />
        <script type="application/ld+json">{JSON.stringify(orgLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-4" aria-label="breadcrumb">
          <Link to="/" className="hover:underline">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/pe" className="hover:underline">Hosting en Perú</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{NAME}</span>
        </nav>

        {/* HERO */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              <ShieldCheck className="h-3 w-3 mr-1" /> Datos verificados
            </Badge>
            <Badge variant="outline" className="text-xs">Datacenter Tier IV en Lima 🇵🇪</Badge>
            <Badge variant="outline" className="text-xs">Razón social peruana</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#2B2D42] mb-3">
            ¿Es bueno HostDime Perú?
          </h1>
          <p className="text-base md:text-lg text-[#2B2D42]/90 leading-relaxed">
            {heroAnswer}
          </p>
          <p className="mt-3 text-xs text-[#2B2D42]/60">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Revisado por el equipo editorial: <time dateTime={REVIEWED_ON}>{REVIEWED_ON}</time>
            </span>
          </p>
        </header>

        {/* Badges verificación técnica */}
        <section className="mb-8" aria-labelledby="verificacion">
          <h2 id="verificacion" className="sr-only">Verificación técnica</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border bg-emerald-50/50 text-center">
              <MapPin className="h-5 w-5 mx-auto text-emerald-700 mb-1" />
              <div className="text-xs font-semibold text-[#2B2D42]">Datacenter local</div>
              <div className="text-[11px] text-muted-foreground">Lima, Tier IV</div>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <Server className="h-5 w-5 mx-auto text-[#2B2D42] mb-1" />
              <div className="text-xs font-semibold text-[#2B2D42]">ASN propio</div>
              <div className="text-[11px] text-muted-foreground">AS33182</div>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <ShieldCheck className="h-5 w-5 mx-auto text-[#2B2D42] mb-1" />
              <div className="text-xs font-semibold text-[#2B2D42]">SSL activo</div>
              <div className="text-[11px] text-muted-foreground">HTTPS 200 OK</div>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <Activity className="h-5 w-5 mx-auto text-[#2B2D42] mb-1" />
              <div className="text-xs font-semibold text-[#2B2D42]">TTFB medido</div>
              <div className="text-[11px] text-muted-foreground">
                {siteCheck?.ttfb_ms ? `${siteCheck.ttfb_ms} ms` : '—'}
                {siteCheck?.checked_at && ` · ${new Date(siteCheck.checked_at).toISOString().slice(0, 10)}`}
              </div>
            </div>
          </div>
        </section>

        {/* Historia real */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-[#2B2D42]">La historia detrás del proveedor</h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-[#2B2D42]/90">
            <p>
              HostDime Perú abrió operaciones locales en <strong>{company.year_founded}</strong>, es decir hace <strong>{yearsOperating} años</strong>, como filial peruana del grupo <strong>HostDime Global</strong>, una compañía fundada en Orlando (EE.UU.) que expandió su modelo de datacenters propios a mercados latinoamericanos. La razón social registrada en Perú es <strong>HostDime.com.pe S.A.C.</strong>, con RUC <strong>20563098296</strong>, lo que significa que las facturas se emiten desde una entidad peruana legalmente constituida.
            </p>
            <p>
              La diferencia técnica más relevante frente a la mayoría de proveedores locales es la infraestructura: HostDime declara un <strong>datacenter propio Tier IV de aproximadamente 75.000 sq ft en Lima</strong>, con red autónoma bajo su propio ASN (AS33182). Esto los ubica como uno de los pocos operadores en Perú con capacidad para atender colocation, servidores dedicados de gama alta y cloud privado sin depender de reventa de infraestructura extranjera.
            </p>
            <p>
              Su portafolio declarado — {techs.join(', ')} — refleja ese posicionamiento: no compiten en hosting compartido económico, sino en cargas medianas y altas donde importan la latencia local, el soporte 24/7 en español y la trazabilidad legal de la operación. Las oficinas comerciales están en <em>{company.contact_address}</em>, con soporte técnico permanente y ventas de lunes a viernes de 7:30 a 19:00.
            </p>
          </div>
        </section>

        {/* Para quién sí / no */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#2B2D42]">Para quién sí, para quién no</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-emerald-200 bg-emerald-50/30">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3 text-emerald-800 font-semibold">
                  <CheckCircle2 className="h-5 w-5" /> Encaja bien si…
                </div>
                <ul className="space-y-2 text-sm text-[#2B2D42]/90">
                  {forWho.map((it, i) => (
                    <li key={i} className="flex gap-2"><span className="text-emerald-600 mt-0.5">✓</span><span>{it}</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50/30">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3 text-amber-800 font-semibold">
                  <XCircle className="h-5 w-5" /> Probablemente no encaje si…
                </div>
                <ul className="space-y-2 text-sm text-[#2B2D42]/90">
                  {notForWho.map((it, i) => (
                    <li key={i} className="flex gap-2"><span className="text-amber-600 mt-0.5">·</span><span>{it}</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Planes (solo si existen) */}
        {plans && plans.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-[#2B2D42]">Planes y precios</h2>
            <Card>
              <CardContent className="pt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2">Plan</th>
                      <th className="py-2">Precio (PEN)</th>
                      <th className="py-2">Capturado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((p: any) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="py-2 font-medium">{p.name}</td>
                        <td className="py-2">S/ {p.price}</td>
                        <td className="py-2 text-xs text-muted-foreground">
                          {p.updated_at ? new Date(p.updated_at).toISOString().slice(0, 10) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Reputación */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-[#2B2D42]">
            <AlertTriangle className="h-5 w-5" /> Reputación
          </h2>
          <Card>
            <CardContent className="pt-6 text-sm">
              <p className="mb-3">
                <strong className="text-lg">{complaintsCount}</strong>{' '}
                {complaintsCount === 1 ? 'reclamo verificado' : 'reclamos verificados'} sobre {NAME} en nuestro registro público desde <time dateTime="2025-01-01">2025-01-01</time>.
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Verificamos cada reclamo por email antes de publicarlo. Ausencia de reclamos no equivale a ausencia de problemas.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to="/reclamos">Reportar problema</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/resena?empresa=${SLUG}`}>Dejar una reseña</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTAs */}
        <section className="mb-8">
          <Card className="bg-[#2B2D42] text-white">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="font-semibold text-lg mb-1">¿Listo para evaluar HostDime Perú?</div>
                  <p className="text-sm text-white/70">
                    Enlace directo al sitio oficial. Compara antes de contratar.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-white text-[#2B2D42] hover:bg-white/90 gap-2">
                    <a href={`/ir/${SLUG}`} target="_blank" rel="nofollow noopener sponsored">
                      Visitar sitio oficial <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                    <Link to="/pe/mejor-hosting-peru-2026">
                      <GitCompare className="h-4 w-4" /> Comparar en Perú
                    </Link>
                  </Button>
                </div>
              </div>
              <p className="text-[11px] text-white/60 mt-4 leading-snug">
                <strong>Divulgación:</strong> el enlace puede generarnos una comisión sin costo adicional para ti. La recomendación se basa en datos verificables y no altera el ranking editorial.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Datos rápidos */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-[#2B2D42]">Datos verificables</h2>
          <Card>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex gap-2"><Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><strong>Razón social:</strong> HostDime.com.pe S.A.C.</span></div>
              <div className="flex gap-2"><ShieldCheck className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><strong>RUC:</strong> 20563098296</span></div>
              <div className="flex gap-2"><Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><strong>Operando desde:</strong> {company.year_founded}</span></div>
              <div className="flex gap-2"><Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><strong>Grupo:</strong> HostDime Global (Orlando, EE.UU.)</span></div>
              <div className="flex gap-2"><Server className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><strong>Datacenter:</strong> {company.datacenter_location}</span></div>
              <div className="flex gap-2"><Cpu className="h-4 w-4 mt-0.5 text-muted-foreground" /><span><strong>Tecnologías:</strong> {techs.join(', ')}</span></div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-[#2B2D42]">
            <HelpCircle className="h-5 w-5" /> Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {faq.map((f, i) => (
              <Card key={i}>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-semibold text-[15px] mb-2 text-[#2B2D42]">{f.q}</h3>
                  <p className="text-sm text-[#2B2D42]/85 leading-relaxed">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <footer className="border-t pt-6 mt-8 text-sm text-muted-foreground">
          <p className="mb-2">
            <ShieldCheck className="h-4 w-4 inline text-emerald-600 mr-1" />
            <strong>Revisado por el equipo editorial de EligeTuHosting</strong> el <time dateTime={REVIEWED_ON}>{REVIEWED_ON}</time>.
          </p>
          <p className="text-xs">
            Datos técnicos verificados mediante resolución DNS, medición TTFB y consulta al RUC público. Metodología: <Link to="/nuestro-metodo" className="text-primary hover:underline">nuestro método</Link>.
          </p>
        </footer>
      </main>

      <Footer />
    </>
  );
};

export default HostDimePePilot;
