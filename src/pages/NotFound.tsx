import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/system/PageHeader';
import EditorialImage from '@/components/media/EditorialImage';
import SmartLink from '@/components/marco/SmartLink';
import { Button } from '@/components/ui/button';
import { useEdition } from '@/hooks/useEdition';
import { editionHref } from '@/lib/countries';
import { link, sectionsFor } from '@/lib/siteNav';

const rowLink =
  'flex min-h-11 items-center justify-between gap-3 border-b border-rule py-2 text-[15px] font-medium text-ink hover:text-ink-2';

/**
 * Página no encontrada: dice qué pasó y ofrece un camino claro de vuelta
 * (la portada de la edición y sus secciones). Sin imagen publicada, se ve completa igual.
 */
const NotFound = () => {
  const { key, label } = useEdition();
  const home = editionHref(key);
  const sections = sectionsFor(key);
  const guide = link('Cómo elegir hosting', '/guia-elegir-hosting', { cl: true });
  const more = sections.some((s) => s.href === guide.href) ? sections : [...sections, guide];

  React.useEffect(() => {
    document.title = 'Página no encontrada | EligeTuHosting';
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="404"
          lead="Página no encontrada. Puede que el enlace tenga un error o que la página haya cambiado de dirección."
          actions={
            <Button asChild variant="brand">
              {home.startsWith('/') ? (
                <Link to={home}>Ir a la portada de {label}</Link>
              ) : (
                <a href={home}>Ir a la portada de {label}</a>
              )}
            </Button>
          }
          aside={
            <EditorialImage name="sin-resultados" className="aspect-[4/3]" sizes="(min-width: 1024px) 40vw, 100vw" />
          }
        />
        <section aria-labelledby="seguir-por-aqui" className="container py-10 md:py-14">
          <div className="max-w-xl">
            <h2 id="seguir-por-aqui" className="t-h3 text-ink">
              O sigue por aquí
            </h2>
            <ul className="mt-3 border-t border-rule">
              {more.map((item) => (
                <li key={item.href}>
                  <SmartLink item={item} className={rowLink}>
                    {item.label}
                    <ChevronRight className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                  </SmartLink>
                </li>
              ))}
            </ul>
            <p className="t-small mt-6 text-ink-2">
              ¿Llegaste aquí desde un enlace de nuestro sitio?{' '}
              <Link to="/contacto" className="rounded-sm font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                Avísanos
              </Link>{' '}
              y lo corregimos.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
