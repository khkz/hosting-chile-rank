import React from 'react';
import { useLocation } from 'react-router-dom';
import { LogoMark } from './Logo';
import { editionHref, resolveEditionKey } from '@/lib/countries';

/**
 * Si una página falla al renderizar, el resto del sitio sigue en pie: se
 * muestra un aviso con salidas en vez de una pantalla en blanco. Se reinicia
 * al cambiar de ruta, así que "Atrás" y los enlaces vuelven a funcionar.
 * Con `silent`, un fallo se descarta sin mostrar nada (para piezas
 * accesorias como el asesor flotante).
 */

interface BoundaryProps {
  resetKey: string;
  silent?: boolean;
  children: React.ReactNode;
}

class Boundary extends React.Component<BoundaryProps, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[RouteErrorBoundary]', error, info.componentStack);
  }

  componentDidUpdate(prev: BoundaryProps) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.silent) return null;
    return <RouteErrorFallback />;
  }
}

/**
 * Aviso mínimo: no depende de datos ni del encabezado, que también podrían
 * fallar. Su <main> es el destino de «Saltar al contenido» (#contenido),
 * porque aquí no se monta Navbar.
 */
const RouteErrorFallback: React.FC = () => {
  const { pathname } = useLocation();
  const home = editionHref(resolveEditionKey(pathname));
  const action = 'inline-flex min-h-11 items-center rounded-lg px-4 text-[15px] font-semibold';
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-rule bg-white">
        <div className="container flex h-16 items-center">
          <a href={home} className="inline-flex items-center gap-2.5 rounded-sm" aria-label="EligeTuHosting, portada">
            <LogoMark size={30} />
            <span className="text-[19px] font-extrabold tracking-[-0.02em] text-ink" style={{ fontStretch: '112%' }}>
              EligeTuHosting
            </span>
          </a>
        </div>
      </header>
      <main id="contenido" tabIndex={-1} className="container py-12 focus:outline-none md:py-16">
        <div className="max-w-xl">
          <h1 className="t-h1 text-ink">No pudimos mostrar esta página</h1>
          <p className="t-lead mt-4">
            Algo falló al cargarla. El resto del sitio funciona: puedes volver, ir a la portada o recargar para
            intentarlo de nuevo.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={`${action} bg-ink text-white hover:bg-ink-soft`}
            >
              Recargar
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className={`${action} border border-ink/25 bg-white text-ink hover:border-ink hover:bg-paper`}
            >
              Volver
            </button>
            <a href={home} className={`${action} border border-ink/25 bg-white text-ink hover:border-ink hover:bg-paper`}>
              Ir a la portada
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

const RouteErrorBoundary: React.FC<{ silent?: boolean; children: React.ReactNode }> = ({ silent, children }) => {
  const { pathname } = useLocation();
  return (
    <Boundary resetKey={pathname} silent={silent}>
      {children}
    </Boundary>
  );
};

export default RouteErrorBoundary;
