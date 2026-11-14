import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Flag from '@/components/data/Flag';
import PageHeader from '@/components/system/PageHeader';
import Section from '@/components/system/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SummaryCard from '@/components/country/edicion/SummaryCard';
import { PUBLISHED_EDITIONS, editionFromPath, editionHref } from '@/lib/countries';

/**
 * Página de un país configurado pero sin ranking público todavía.
 * No se indexa: explica el estado (solo lo que dice el registro de ediciones,
 * sin avances ni plazos inventados) y ofrece las ediciones publicadas.
 */
const CountryVerifying = () => {
  const { pathname } = useLocation();
  const edition = editionFromPath(pathname);
  if (!edition || edition.status !== 'verifying') return <Navigate to="/latam" replace />;

  return (
    <>
      <Helmet>
        <html lang={edition.locale} />
        <title>{`Hosting en ${edition.name}: en verificación | EligeTuHosting`}</title>
        <meta name="description" content={`Estamos verificando a los proveedores de hosting de ${edition.name}. Publicaremos el ranking cuando sus datos estén comprobados.`} />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <Navbar />

      <main>
        <PageHeader
          breadcrumbs={
            <div className="t-label flex flex-wrap items-center gap-2">
              <Flag code={edition.code} size={22} />
              Edición {edition.name}
              <Badge variant="outline">En verificación</Badge>
            </div>
          }
          title={`Estamos verificando a los proveedores de hosting de ${edition.name}.`}
          lead="Antes de publicar un ranking comprobamos, para cada proveedor, su razón social, dónde están sus servidores y que su contacto responda. Hasta terminar, esta página no aparece en buscadores."
          aside={
            <SummaryCard
              label="Estado de verificación"
              className="lg:ml-auto lg:max-w-[26rem]"
              items={[
                { label: 'Estado', value: 'En verificación' },
                { label: `Ranking de ${edition.name}`, value: 'Sin publicar' },
                { label: 'Esta página en buscadores', value: 'No aparece' },
              ]}
            />
          }
        />

        <Section tone="paper" density="tight" aria-label={`Qué puedes hacer mientras verificamos ${edition.name}`}>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="t-h3 text-ink">¿Conoces un proveedor de {edition.name}?</h2>
              <p className="t-body mt-2 max-w-[62ch] text-ink-2">
                Envíanos su sitio, razón social e identificador fiscal. Lo sumamos a la verificación.
              </p>
              <Button asChild className="mt-4">
                <Link to="/contacto">Sugerir un proveedor</Link>
              </Button>
              <p className="t-meta mt-2">En tu mensaje, indica que el proveedor es de {edition.name}.</p>
            </div>
            <div>
              <h2 className="t-h3 text-ink">Países ya publicados</h2>
              <ul className="mt-2">
                {PUBLISHED_EDITIONS.map((e) => (
                  <li key={e.code}>
                    <a
                      href={editionHref(e.code)}
                      className="inline-flex min-h-[44px] items-center gap-2 text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                    >
                      <Flag code={e.code} size={16} />
                      Hosting en {e.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
};

export default CountryVerifying;
