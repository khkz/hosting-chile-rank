import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import Logo from './Logo';
import Flag from './data/Flag';
import { ProvenanceTag } from './data/Provenance';
import { useEdition } from '@/hooks/useEdition';
import { useRankingProviders } from '@/features/ranking';
import { formatScore } from '@/lib/format';
import { hasEditorialImages } from '@/lib/editorialImages';
import {
  PUBLISHED_EDITIONS,
  VERIFYING_EDITIONS,
  editionHref,
  rankingPath,
  type Edition,
  type EditionKey,
} from '@/lib/countries';
import { link, methodologyLink, type NavLinkItem } from '@/lib/siteNav';
import { VERIFICATION_DATE_HUMAN } from '@/data/verified2026';

/** Enlaces del pie: 44 px de alto en móvil (toda la fila es tocable), compactos desde 768 px. Foco blanco sobre tinta. */
const LINK =
  'flex min-h-11 items-center gap-2 rounded-sm text-white/75 hover:text-white focus-visible:ring-white focus-visible:ring-offset-ink md:inline-flex md:min-h-0';
const LIST = 'text-sm md:space-y-2';
const HEADING = 'mb-2 text-sm font-semibold text-white md:mb-3';

const FooterLink: React.FC<{ item: NavLinkItem }> = ({ item }) =>
  item.external || /^https?:/.test(item.href) ? (
    <a href={item.href} className={LINK}>
      {item.label}
    </a>
  ) : (
    <Link to={item.href} className={LINK}>
      {item.label}
    </Link>
  );

const Column: React.FC<{ title: string; items: NavLinkItem[] }> = ({ title, items }) => (
  <div>
    <h2 className={HEADING}>{title}</h2>
    <ul className={LIST}>
      {items.map((item) => (
        <li key={`${item.href}-${item.label}`}>
          <FooterLink item={item} />
        </li>
      ))}
    </ul>
  </div>
);

/** Enlaces de la edición activa (columna 2 del pie). */
const editionLinks = (edition: Edition | null): { title: string; items: NavLinkItem[] } => {
  if (!edition) {
    return {
      title: 'Latinoamérica',
      items: [
        { label: 'Índice por país', href: editionHref('LATAM') },
        { label: 'Datos abiertos', href: '/datos' },
        { label: 'Proveedores LATAM (JSON)', href: '/data/proveedores-latam.json', external: true },
      ],
    };
  }
  if (edition.code === 'CL') {
    return {
      title: 'Chile',
      items: [
        { label: 'Ranking 2026', href: '/ranking' },
        { label: 'Catálogo de proveedores', href: '/catalogo' },
        { label: 'Comparativas', href: '/comparativa' },
        { label: 'Benchmark', href: '/benchmark' },
        { label: 'Certificaciones', href: '/certificaciones' },
        { label: 'Mejor hosting WordPress', href: '/mejor-hosting-wordpress-chile' },
        { label: 'Mejor hosting para pymes', href: '/mejor-hosting-pymes-chile' },
        { label: 'Mejor VPS', href: '/mejor-vps-chile' },
        { label: 'Reclamos verificados', href: '/reclamos' },
      ],
    };
  }
  if (edition.status === 'verifying') {
    return {
      title: edition.name,
      items: [
        { label: 'En verificación', href: `/${edition.slug}` },
        { label: 'Sugerir un proveedor', href: '/contacto' },
      ],
    };
  }
  return {
    title: edition.name,
    items: [
      { label: `Ranking ${edition.name} 2026`, href: rankingPath(edition) },
      { label: 'Directorio de proveedores', href: `/${edition.slug}` },
      { label: 'Datacenter en el país', href: `/${edition.slug}/hosting-con-datacenter-local` },
      { label: 'Reputación y reclamos', href: `/${edition.slug}/benchmark` },
      { label: `Datos de ${edition.name} (JSON)`, href: `/data/proveedores-${edition.slug}.json`, external: true },
    ],
  };
};

/** Primeros puestos del ranking editorial de Chile (leídos de la base). */
const ChileTopEditorial: React.FC = () => {
  const { data } = useRankingProviders(3);
  const top = (data ?? []).filter((p) => p.overall_rating != null);
  if (!top.length) return null;
  return (
    <div className="mt-6 text-sm">
      <p className="mb-1 flex items-center gap-2 text-white/75 md:mb-2">
        Primeros puestos 2026 <ProvenanceTag kind="editorial" className="!bg-white/10 !text-white" />
      </p>
      <ol className="md:space-y-1">
        {top.map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 tabular">
            <span className="w-4 text-white/75">{i + 1}</span>
            <Link to={`/catalogo/${p.slug}`} className={LINK.replace('text-white/75', 'text-white')}>
              {p.name}
            </Link>
            <span className="text-white/75">{formatScore(p.overall_rating)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

/** Texto de «Sobre estos datos»: la fecha de revisión del ranking de Chile solo se cita en la edición Chile. */
const DataNote: React.FC<{ editionKey: EditionKey }> = ({ editionKey }) => (
  <p>
    <strong className="font-semibold text-white">Sobre estos datos.</strong> Reflejan lo publicado por cada proveedor y
    nuestras mediciones, y se corrigen de forma continua.{' '}
    {editionKey === 'CL' && <>El ranking de Chile se revisó por última vez el {VERIFICATION_DATE_HUMAN}; cada </>}
    {editionKey !== 'CL' && <>Cada </>}
    edición muestra la fecha de sus propios datos. Si ves un dato incorrecto,{' '}
    <Link to="/contacto" className="rounded-sm text-white underline underline-offset-2 focus-visible:ring-white focus-visible:ring-offset-ink">
      avísanos
    </Link>{' '}
    y lo revisamos.
  </p>
);

/**
 * Pie de todas las páginas. Con la barra fija móvil visible, index.css le
 * suma abajo el alto de la barra ([data-site-footer]) para que no tape la
 * última línea.
 */
const Footer = () => {
  // Año del aviso de derechos (no es una fecha de datos).
  const year = new Date().getFullYear();
  const { key, edition } = useEdition();
  const own = editionLinks(edition);

  // Mismo destino que el encabezado: en cada país, su sección «Cómo ordenamos».
  const methodology: NavLinkItem[] = [
    methodologyLink(key),
    link('Cómo medimos (benchmark)', '/metodologia-benchmark', { cl: true }),
    { label: 'Datos abiertos CC-BY', href: '/datos' },
    { label: 'llms.txt', href: '/llms.txt', external: true },
    link('Transparencia', '/transparencia-hosting-chile', { cl: true }),
  ].filter((i): i is NavLinkItem => i !== null);
  const site: NavLinkItem[] = [
    { label: 'Quiénes somos', href: '/quienes-somos' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Corregir un dato', href: '/contacto' },
    { label: 'Blog', href: '/blog' },
    { label: 'Wiki de hosting', href: '/wiki' },
    { label: 'Ingresar', href: '/auth' },
  ];

  return (
    <footer data-site-footer className="bg-ink text-white">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo darkBackground />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
              Ranking de hosting en Latinoamérica con metodología publicada. Cada dato indica si lo medimos,
              si lo declara el proveedor o si es criterio editorial.
            </p>
            {key === 'CL' && <ChileTopEditorial />}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 md:col-span-8">
            <div>
              <h2 className={HEADING}>Ediciones</h2>
              <ul className={LIST}>
                <li>
                  <a href={editionHref('LATAM')} className={LINK}>
                    <Globe className="h-3.5 w-3.5" aria-hidden /> Latinoamérica
                  </a>
                </li>
                {PUBLISHED_EDITIONS.map((e) => (
                  <li key={e.code}>
                    <a href={editionHref(e.code)} className={LINK}>
                      <Flag code={e.code} size={16} /> {e.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="t-meta mt-3 text-white/75">
                En verificación: {VERIFYING_EDITIONS.map((e) => e.name).join(', ')}.
              </p>
            </div>
            <Column title={own.title} items={own.items} />
            <Column title="Metodología y datos" items={methodology} />
            <Column title="Sitio" items={site} />
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-white/15 pt-6 text-[13px] leading-relaxed text-white/75 md:grid-cols-2">
          <p>
            <strong className="font-semibold text-white">Divulgación.</strong> El ranking es editorial, con pesos
            publicados en la metodología. El editor de este sitio mantiene relación comercial con algunos de los
            proveedores listados y algunos enlaces son de afiliado: pueden generar una comisión sin costo adicional
            para ti.
          </p>
          <DataNote editionKey={key} />
        </div>
        <div className="mt-6 flex flex-col gap-1 text-[13px] text-white/75 md:flex-row md:flex-wrap md:gap-x-6">
          <p>© {year} EligeTuHosting. Datos bajo licencia CC-BY-4.0.</p>
          {hasEditorialImages() && <p>Las fotografías del sitio son ilustrativas y fueron generadas con IA.</p>}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
