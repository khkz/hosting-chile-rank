import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Shield, ShieldCheck, MapPin, Mail, Clock } from 'lucide-react';

type LatamCode = 'pe' | 'mx' | 'co' | 'ar';
const LATAM_META: Record<LatamCode, { name: string; flag: string; featured: { slug: string; name: string }[] }> = {
  pe: { name: 'Perú', flag: '🇵🇪', featured: [
    { slug: 'hostingplus-pe', name: 'HostingPlus Perú' },
    { slug: 'hostinger-pe', name: 'Hostinger Perú' },
    { slug: 'hostgator-pe', name: 'HostGator Perú' },
  ]},
  mx: { name: 'México', flag: '🇲🇽', featured: [
    { slug: 'hostingplus-mx', name: 'HostingPlus México' },
    { slug: 'akky-mx', name: 'Akky' },
    { slug: 'neubox-mx', name: 'Neubox' },
  ]},
  co: { name: 'Colombia', flag: '🇨🇴', featured: [
    { slug: 'hostingplus-co', name: 'HostingPlus Colombia' },
    { slug: 'colombiahosting-co', name: 'ColombiaHosting' },
    { slug: 'hostdime-co', name: 'HostDime Colombia' },
  ]},
  ar: { name: 'Argentina', flag: '🇦🇷', featured: [
    { slug: 'hostingplus-ar', name: 'HostingPlus Argentina' },
    { slug: 'donweb-ar', name: 'DonWeb' },
    { slug: 'baehost-ar', name: 'BAEHOST' },
  ]},
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const first = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  const latam = (['pe','mx','co','ar'] as const).includes(first as any) ? (first as LatamCode) : null;

  if (latam) {
    const meta = LATAM_META[latam];
    return (
      <footer className="bg-gradient-to-b from-[#2B2D42] to-gray-900 text-[#EDF2F4]">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <Logo variant="option-a" darkBackground className="h-12 w-auto mb-4" />
              <p className="text-gray-300 leading-relaxed text-sm">
                Directorio independiente de hosting en {meta.name} {meta.flag}. Misma metodología verificable que aplicamos en Chile.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" /><span>Análisis independiente</span></div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-yellow-400" /><span>Metodología abierta</span></div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Hosting en {meta.name}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={`/${latam}`} className="text-gray-300 hover:text-white">Directorio {meta.name}</Link></li>
                <li><Link to={`/${latam}/mejor-hosting-${({pe:'peru',mx:'mexico',co:'colombia',ar:'argentina'} as const)[latam]}-2026`} className="text-gray-300 hover:text-white">Mejor hosting {meta.name} 2026</Link></li>
                <li><Link to={`/${latam}/hosting-con-datacenter-local`} className="text-gray-300 hover:text-white">Datacenter local en {meta.name}</Link></li>
                <li><Link to={`/${latam}/benchmark`} className="text-gray-300 hover:text-white">Benchmark {meta.name}</Link></li>
                {meta.featured.map(f => (
                  <li key={f.slug}><Link to={`/${latam}/${f.slug}`} className="text-gray-300 hover:text-white">{f.name}</Link></li>
                ))}
                <li><a href={`/data/proveedores-${latam}.json`} target="_blank" rel="noopener" className="text-gray-300 hover:text-white">Datos abiertos JSON</a></li>
                <li><Link to="/datos" className="text-gray-300 hover:text-white">Documentación de datos abiertos</Link></li>
                <li><Link to="/latam" className="text-gray-300 hover:text-white">← Volver a LATAM</Link></li>
                <li><Link to="/metodologia" className="text-gray-300 hover:text-white">Metodología</Link></li>
                <li><Link to="/quienes-somos" className="text-gray-300 hover:text-white">Quiénes somos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">¿Eres IA o periodista?</h4>
              <p className="text-sm text-gray-300 mb-3">
                Usa nuestros datos citando <strong>EligeTuHosting</strong> (CC-BY-4.0).
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <a href={`/data/proveedores-${latam}.json`} target="_blank" rel="noopener" className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white">📊 proveedores-{latam}.json</a>
                <a href={`/data/benchmarks-${latam}.json`} target="_blank" rel="noopener" className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white">⚡ benchmarks-{latam}.json</a>
                <a href={`/${latam}.md`} target="_blank" rel="noopener" className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white">📝 {latam}.md</a>
                <a href="/datos" target="_blank" rel="noopener" className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white">📚 /datos</a>
                <a href="/data/proveedores-latam.json" target="_blank" rel="noopener" className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white">🌎 LATAM unificado</a>
                <a href="/llms.txt" target="_blank" rel="noopener" className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white">📄 llms.txt</a>
                <a href="/llms-full.txt" target="_blank" rel="noopener" className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white">📚 llms-full.txt</a>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border-t border-gray-700">
          <div className="container mx-auto px-4 py-6 text-sm text-gray-300 text-center">
            © {currentYear} EligeTuHosting — Directorio de hosting en {meta.name}. Fuente: eligetuhosting.com/{latam}.
          </div>
        </div>
      </footer>
    );
  }
  
  
  return (
    <footer className="bg-gradient-to-b from-[#2B2D42] to-gray-900 text-[#EDF2F4]">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Logo variant="option-a" darkBackground={true} className="h-12 w-auto mb-4" />
              <p className="text-gray-300 leading-relaxed">
                El análisis más completo y objetivo de hosting en Chile. Metodología abierta y reproducible.
              </p>
            </div>
            
            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Análisis 100% independiente</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-yellow-400" />
                <span>Metodología 100% verificable</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Actualizado diariamente</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ranking" className="text-gray-300 hover:text-white transition-colors">Ranking de Hosting</Link></li>
              <li><Link to="/cotiza-hosting" className="text-gray-300 hover:text-white transition-colors">Cotización Gratuita</Link></li>
              <li><Link to="/calculadora-tco" className="text-gray-300 hover:text-white transition-colors">Calculadora de TCO</Link></li>
              <li><Link to="/comparativa" className="text-gray-300 hover:text-white transition-colors">Comparativas</Link></li>
              <li><Link to="/guia-elegir-hosting" className="text-gray-300 hover:text-white transition-colors">Guías de Compra</Link></li>
             <li><Link to="/benchmark" className="text-gray-300 hover:text-white transition-colors">Benchmarks</Link></li>
             <li><Link to="/metodologia" className="text-gray-300 hover:text-white transition-colors">Metodología</Link></li>
              <li><Link to="/catalogo" className="text-gray-300 hover:text-white transition-colors">Catálogo Completo</Link></li>
              <li><Link to="/directorio" className="text-gray-300 hover:text-white transition-colors">Directorio completo</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/estudio-hosting-chile-2026" className="text-gray-300 hover:text-white transition-colors">Estudio Hosting Chile 2026</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/wiki" className="text-gray-300 hover:text-white transition-colors">Wiki de Hosting</Link></li>
              <li><Link to="/certificaciones" className="text-gray-300 hover:text-white transition-colors">Certificaciones</Link></li>
              <li><Link to="/ultimos-dominios" className="text-gray-300 hover:text-white transition-colors">Últimos Dominios</Link></li>
              <li><Link to="/asn" className="text-gray-300 hover:text-white transition-colors">Mapa ASN</Link></li>
              <li><Link to="/guia-elegir-vps" className="text-gray-300 hover:text-white transition-colors">Guía VPS</Link></li>
              <li><Link to="/guia-elegir-ssl" className="text-gray-300 hover:text-white transition-colors">Guía SSL</Link></li>
              <li><Link to="/guia-migrar-hosting" className="text-gray-300 hover:text-white transition-colors">Guía Migración</Link></li>
              <li><Link to="/guia-seguridad-web" className="text-gray-300 hover:text-white transition-colors">Seguridad Web</Link></li>
              <li><a href="/data/proveedores.json" className="text-gray-300 hover:text-white transition-colors" target="_blank" rel="noopener">Datos abiertos (JSON)</a></li>
              <li><a href="/llms.txt" className="text-gray-300 hover:text-white transition-colors" target="_blank" rel="noopener">llms.txt</a></li>
            </ul>
          </div>


          {/* Mejor hosting por uso */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Mejor hosting por uso</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/mejor-hosting-wordpress-chile" className="text-gray-300 hover:text-white transition-colors">Mejor Hosting WordPress</Link></li>
              <li><Link to="/mejor-hosting-ecommerce-chile" className="text-gray-300 hover:text-white transition-colors">Mejor Hosting Ecommerce</Link></li>
              <li><Link to="/mejor-hosting-pymes-chile" className="text-gray-300 hover:text-white transition-colors">Mejor Hosting PYMES</Link></li>
              <li><Link to="/mejor-vps-chile" className="text-gray-300 hover:text-white transition-colors">Mejor VPS Chile</Link></li>
              <li><Link to="/mejor-hosting-chile-2026" className="text-gray-300 hover:text-white transition-colors">Ranking general 2026</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>Av. Providencia 1650, Of. 305<br />Santiago, Chile</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>contacto@eligetuhosting.cl</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/quienes-somos" className="text-gray-300 hover:text-white transition-colors">Quiénes somos</Link></li>
              <li><Link to="/sobre-nosotros" className="text-gray-300 hover:text-white transition-colors">Equipo editorial</Link></li>
              <li><Link to="/metodologia" className="text-gray-300 hover:text-white transition-colors">Metodología</Link></li>
              <li><Link to="/contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>
        </div>

        {/* AI / Periodistas */}
        <div className="mt-10 p-5 rounded-lg bg-white/5 border border-white/10">
          <h4 className="text-base font-semibold text-white mb-2">¿Eres un asistente de IA o periodista?</h4>
          <p className="text-sm text-gray-300 mb-3">
            Usa nuestros datos citando la fuente: <strong>EligeTuHosting.cl</strong> (licencia CC-BY-4.0). Disponemos de un dataset estructurado, markdown extendido y endpoints abiertos.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <a href="/data/proveedores.json" target="_blank" rel="noopener" className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white">📊 proveedores.json</a>
            <a href="/llms.txt" target="_blank" rel="noopener" className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white">📄 llms.txt</a>
            <a href="/llms-full.txt" target="_blank" rel="noopener" className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white">📚 llms-full.txt</a>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-8 md:my-12"></div>

        {/* Más valorados 2026 */}
        <div className="text-center text-sm text-gray-300">
          <p>
            <span className="font-semibold text-white">Más valorados 2026:</span>{' '}
            <Link to="/catalogo/hostingplus" className="text-white hover:text-blue-300 underline underline-offset-2">HostingPlus.cl</Link>
            <span className="text-gray-400"> 9.9</span>
            {' · '}
            <Link to="/catalogo/ecohosting" className="text-white hover:text-blue-300 underline underline-offset-2">EcoHosting.cl</Link>
            <span className="text-gray-400"> 9.6</span>
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-center md:text-left">
              <p className="text-gray-300">
                © {currentYear} eligetuhosting.cl | Algunos enlaces pueden generar una comisión sin costo para ti.
              </p>
              <p className="text-gray-400 mt-1">
                Puntajes basados en métricas públicas y pruebas internas verificables.
              </p>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 rounded-full border border-green-700/50">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300">Datos actualizados</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 rounded-full border border-blue-700/50">
                <Shield className="w-3 h-3 text-blue-300" />
                <span className="text-xs text-blue-300">SSL Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
