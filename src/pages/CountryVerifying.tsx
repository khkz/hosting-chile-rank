import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Flag from '@/components/data/Flag';
import { PUBLISHED_EDITIONS, editionFromPath, editionHref } from '@/lib/countries';

/**
 * Página de un país configurado pero sin ranking público todavía.
 * No se indexa: solo explica el estado y ofrece las ediciones publicadas.
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

      <main className="bg-paper">
        <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
          <p className="flex items-center gap-2 text-sm font-medium text-ink-2">
            <Flag code={edition.code} size={22} />
            {edition.name}
          </p>
          <h1 className="type-display mt-4 text-4xl text-ink md:text-5xl">
            Estamos verificando a los proveedores de hosting de {edition.name}.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-2">
            Antes de publicar un ranking comprobamos, para cada proveedor, su razón social, dónde están sus
            servidores y que su contacto responda. Hasta terminar, esta página no aparece en buscadores.
          </p>

          <div className="mt-10 grid gap-6 border-t border-rule pt-8 sm:grid-cols-2">
            <div>
              <h2 className="text-base font-semibold text-ink">¿Conoces un proveedor de {edition.name}?</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                Envíanos su sitio, razón social e identificador fiscal. Lo sumamos a la verificación.
              </p>
              <Link to="/contacto" className="mt-3 inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-semibold text-white hover:bg-ink-soft">
                Sugerir un proveedor
              </Link>
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink">Países ya publicados</h2>
              <ul className="mt-2 space-y-1.5">
                {PUBLISHED_EDITIONS.map((e) => (
                  <li key={e.code}>
                    <a href={editionHref(e.code)} className="inline-flex items-center gap-2 text-sm text-ink hover:underline underline-offset-4">
                      <Flag code={e.code} size={16} />
                      Hosting en {e.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CountryVerifying;
