import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import Logo from './Logo';
import Flag from './data/Flag';
import { ProvenanceTag } from './data/Provenance';
import { useEdition } from '@/hooks/useEdition';
import { useRankingProviders } from '@/features/ranking';
import {
  PUBLISHED_EDITIONS,
  VERIFYING_EDITIONS,
  editionHref,
  rankingPath,
  type Edition,
} from '@/lib/countries';
import { type NavLinkItem } from '@/lib/siteNav';
import { VERIFICATION_DATE_HUMAN } from '@/data/verified2026';

const FooterLink: React.FC<{ item: NavLinkItem }> = ({ item }) =>
  item.external || /^https?:/.test(item.href) ? (
    <a href={item.href} className="text-white/70 hover:text-white">
      {item.label}
    </a>
  ) : (
    <Link to={item.href} className="text-white/70 hover:text-white">
      {item.label}
    </Link>
  );

const Column: React.FC<{ title: string; items: NavLinkItem[] }> = ({ title, items }) => (
  <div>
    <h2 className="mb-3 text-sm font-semibold text-white">{title}</h2>
    <ul className="space-y-2 text-sm">
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
        { label: 'Estado de verificación', href: `/${edition.slug}` },
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
      <p className="mb-2 flex items-center gap-2 text-white/60">
        Primeros puestos 2026 <ProvenanceTag kind="editorial" className="!bg-white/10 !text-white/80" />
      </p>
      <ol className="space-y-1">
        {top.map((p, i) => (
          <li key={p.id} className="flex items-baseline gap-2 tabular">
            <span className="w-4 text-white/50">{i + 1}</span>
            <Link to={`/catalogo/${p.slug}`} className="text-white/80 hover:text-white">
              {p.name}
            </Link>
            <span className="text-white/50">{p.overall_rating!.toFixed(1).replace('.', ',')}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

const Footer = () => {
  const year = new Date().getFullYear();
  const { key, edition } = useEdition();
  const own = editionLinks(edition);

  const methodology: NavLinkItem[] = [
    { label: 'Metodología', href: '/metodologia' },
    { label: 'Cómo medimos (benchmark)', href: '/metodologia-benchmark' },
    { label: 'Datos abiertos CC-BY', href: '/datos' },
    { label: 'llms.txt', href: '/llms.txt', external: true },
    { label: 'Transparencia', href: '/transparencia-hosting-chile' },
  ];
  const site: NavLinkItem[] = [
    { label: 'Quiénes somos', href: '/quienes-somos' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Corregir un dato', href: '/contacto' },
    { label: 'Blog', href: '/blog' },
    { label: 'Wiki de hosting', href: '/wiki' },
    { label: 'Acceso proveedores', href: '/auth' },
  ];

  return (
    <footer className="bg-ink text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo darkBackground />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Ranking de hosting en Latinoamérica con metodología publicada. Cada dato indica si lo medimos,
              si lo declara el proveedor o si es criterio editorial.
            </p>
            {key === 'CL' && <ChileTopEditorial />}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-8">
            <div>
              <h2 className="mb-3 text-sm font-semibold text-white">Ediciones</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href={editionHref('LATAM')} className="inline-flex items-center gap-2 text-white/70 hover:text-white">
                    <Globe className="h-3.5 w-3.5" aria-hidden /> Latinoamérica
                  </a>
                </li>
                {PUBLISHED_EDITIONS.map((e) => (
                  <li key={e.code}>
                    <a href={editionHref(e.code)} className="inline-flex items-center gap-2 text-white/70 hover:text-white">
                      <Flag code={e.code} size={16} /> {e.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-white/50">
                En verificación: {VERIFYING_EDITIONS.map((e) => e.name).join(', ')}.
              </p>
            </div>
            <Column title={own.title} items={own.items} />
            <Column title="Metodología y datos" items={methodology} />
            <Column title="Sitio" items={site} />
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-white/15 pt-6 text-xs leading-relaxed text-white/60 md:grid-cols-2">
          <p>
            <strong className="font-semibold text-white/80">Divulgación.</strong> El ranking es editorial, con pesos
            publicados en la metodología. El editor de este sitio mantiene relación comercial con algunos de los
            proveedores listados y algunos enlaces son de afiliado: pueden generar una comisión sin costo adicional
            para ti.
          </p>
          <p>
            <strong className="font-semibold text-white/80">Sobre estos datos.</strong> Reflejan lo publicado por cada
            proveedor y nuestras mediciones a la fecha de revisión ({VERIFICATION_DATE_HUMAN}), y se corrigen de forma
            continua. Si ves un dato incorrecto,{' '}
            <Link to="/contacto" className="underline underline-offset-2 hover:text-white">
              avísanos
            </Link>{' '}
            y lo revisamos.
          </p>
        </div>
        <p className="mt-6 text-xs text-white/50">© {year} EligeTuHosting. Datos bajo licencia CC-BY-4.0.</p>
      </div>
    </footer>
  );
};

export default Footer;
