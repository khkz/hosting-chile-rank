import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe } from 'lucide-react';
import { COUNTRIES, CountryCode } from '@/lib/country';

/**
 * Shell de país en el dominio .com. Reutiliza Navbar/Footer y muestra
 * un estado "Próximamente" hasta que existan proveedores verificados
 * para ese país. NO modifica el comportamiento del .cl.
 */
const CountryLanding = () => {
  const { country = '' } = useParams();
  const code = country.toUpperCase() as CountryCode;
  const info = COUNTRIES[code] ?? COUNTRIES.PE;

  const canonical = `https://eligetuhosting.com/${info.slug}`;
  const title = `Mejor hosting en ${info.name} 2026 — Elige Tu Hosting`;
  const description = `Comparativa independiente de hosting en ${info.name}. Estamos verificando proveedores locales. Mientras tanto, revisa el ranking maestro auditado.`;

  return (
    <>
      <Helmet>
        <html lang={info.locale} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={canonical} />
        <meta name="robots" content="index,follow" />
      </Helmet>

      <Navbar />

      <main className="min-h-[60vh] container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EF233C]/10 text-[#EF233C] text-sm font-medium mb-6">
            <Globe className="h-4 w-4" />
            {info.flag} Versión {info.name}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#2B2D42] mb-4">
            Hosting en {info.name}
          </h1>
          <p className="text-lg text-[#2B2D42]/70 mb-8">
            Estamos verificando proveedores locales en {info.name} con la misma
            metodología que aplicamos en Chile: ASN, datacenter, reclamos y
            trayectoria. Próximamente publicaremos el ranking auditado.
          </p>

          <div className="bg-white border border-[#2B2D42]/10 rounded-xl p-6 md:p-8 text-left mb-8">
            <h2 className="text-xl font-semibold text-[#2B2D42] mb-3">
              Mientras tanto
            </h2>
            <p className="text-[#2B2D42]/70 mb-4">
              Puedes consultar el ranking maestro auditado para Chile como
              referencia metodológica, y los proveedores con presencia regional
              (HostingPlus, EcoHosting) suelen operar también en {info.name}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="cta-primary">
                <a href="https://eligetuhosting.cl/ranking" className="flex items-center gap-2">
                  Ver ranking maestro (Chile)
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contacto">Sugerir un proveedor</Link>
              </Button>
            </div>
          </div>

          <p className="text-xs text-[#2B2D42]/50">
            No publicamos rankings sin datos verificables. Si conoces un
            proveedor relevante en {info.name}, escríbenos.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CountryLanding;
