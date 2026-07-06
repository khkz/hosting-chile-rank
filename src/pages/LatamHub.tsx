import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { COUNTRIES, DOT_COM_COUNTRIES } from '@/lib/country';


/**
 * Hub LATAM en la raíz de eligetuhosting.com.
 * NO consulta hosting_companies (country=null → no filtres a vacío).
 * NO duplica el contenido de Chile: enlaza al .cl.
 */
const LatamHub = () => {
  return (
    <>
      <Helmet>
        <html lang="es" />
        <title>Elige Tu Hosting LATAM — Hosting verificado por país</title>
        <meta
          name="description"
          content="Comparativas independientes de hosting en Latinoamérica. Elige tu país para ver el ranking auditado de proveedores."
        />
        <link rel="canonical" href="https://eligetuhosting.com/" />
        <meta name="robots" content="index,follow" />
        <link rel="alternate" hrefLang="es-CL" href="https://eligetuhosting.cl/" />
        <link rel="alternate" hrefLang="es-PE" href="https://eligetuhosting.com/pe" />
        <link rel="alternate" hrefLang="es-MX" href="https://eligetuhosting.com/mx" />
        <link rel="alternate" hrefLang="es-CO" href="https://eligetuhosting.com/co" />
        <link rel="alternate" hrefLang="es-AR" href="https://eligetuhosting.com/ar" />
        <link rel="alternate" hrefLang="x-default" href="https://eligetuhosting.com/latam" />
      </Helmet>


      <Navbar />

      <main className="min-h-[70vh] container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EF233C]/10 text-[#EF233C] text-sm font-medium mb-6">
            <Globe className="h-4 w-4" />
            Hub LATAM
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#2B2D42] mb-4">
            Elige tu país
          </h1>
          <p className="text-lg text-[#2B2D42]/70 mb-10 max-w-2xl mx-auto">
            Publicamos rankings auditados de hosting por país: ASN, datacenter,
            reclamos verificados y trayectoria. Selecciona tu mercado para ver
            los proveedores verificados.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Chile vive en .cl */}
            <a
              href={COUNTRIES.CL.origin}
              className="group bg-white border border-[#2B2D42]/10 rounded-xl p-6 text-left hover:border-[#EF233C] hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-2">{COUNTRIES.CL.flag}</div>
              <div className="font-semibold text-[#2B2D42] text-lg">
                {COUNTRIES.CL.name}
              </div>
              <div className="text-xs text-[#2B2D42]/60 mt-1">
                Ranking publicado · eligetuhosting.cl
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-sm text-[#EF233C] font-medium">
                Ver ranking <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </a>

            {DOT_COM_COUNTRIES.map((c) => {
              const isPublished = c.code === 'PE' || c.code === 'MX' || c.code === 'CO' || c.code === 'AR';
              return (
                <Link
                  key={c.code}
                  to={`/${c.slug}`}
                  className="group bg-white border border-[#2B2D42]/10 rounded-xl p-6 text-left hover:border-[#EF233C] hover:shadow-md transition-all"
                >
                  <div className="text-3xl mb-2">{c.flag}</div>
                  <div className="font-semibold text-[#2B2D42] text-lg">
                    {c.name}
                  </div>
                  <div className="text-xs text-[#2B2D42]/60 mt-1">
                    {isPublished ? 'Directorio publicado' : 'Próximamente · verificando proveedores'}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm text-[#EF233C] font-medium">
                    {isPublished ? 'Ver directorio' : 'Ver estado'} <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 text-xs text-[#2B2D42]/50">
            No publicamos rankings sin datos verificables. Misma metodología en
            cada país: ASN, datacenter, reclamos, trayectoria.
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default LatamHub;
