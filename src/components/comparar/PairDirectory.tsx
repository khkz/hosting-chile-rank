import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  getAllVsPairs, getCompetitorPairsGroupedByCompany, ANCHOR_HOSTINGPLUS, ANCHOR_ECOHOSTING, type VsPair,
} from '@/lib/vsPairs';

/** Nombre de marca por slug (de la base); si falta, el slug como último recurso. */
type NameOf = (slug: string) => string;

const PairLink: React.FC<{ pair: VsPair; nameOf: NameOf }> = ({ pair, nameOf }) => (
  <Link
    to={`/comparativa/${pair.pair}`}
    className="flex min-h-11 items-center rounded-lg border border-rule bg-white px-3 py-2 text-[15px] text-ink hover:border-ink"
  >
    {nameOf(pair.a)} vs {nameOf(pair.b)}
  </Link>
);

const grid = 'grid gap-2 sm:grid-cols-2 lg:grid-cols-3';

/** Las 171 comparativas 1 a 1, con nombres de marca en vez de slugs. */
const PairDirectory: React.FC<{ nameOf: NameOf }> = ({ nameOf }) => {
  const all = getAllVsPairs();
  const vsHp = all.filter((p) => p.anchor === ANCHOR_HOSTINGPLUS);
  const vsEh = all.filter((p) => p.anchor === ANCHOR_ECOHOSTING);
  const grouped = getCompetitorPairsGroupedByCompany();
  const groupKeys = Object.keys(grouped).sort((x, y) => nameOf(x).localeCompare(nameOf(y), 'es'));

  return (
    <div className="space-y-10">
      <div>
        <h3 className="t-h3 mb-4 text-ink">Frente a HostingPlus.cl (líder del ranking)</h3>
        <div className={grid}>
          {vsHp.map((p) => <PairLink key={p.pair} pair={p} nameOf={nameOf} />)}
        </div>
      </div>
      <div>
        <h3 className="t-h3 mb-4 text-ink">Frente a EcoHosting.cl</h3>
        <div className={grid}>
          {vsEh.map((p) => <PairLink key={p.pair} pair={p} nameOf={nameOf} />)}
        </div>
      </div>
      <div>
        <h3 className="t-h3 mb-4 text-ink">Entre otros proveedores</h3>
        <div className="divide-y divide-rule border-y border-rule">
          {groupKeys.map((key) => (
            <details key={key} className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <span>
                  {nameOf(key)} <span className="tabular font-normal text-ink-3">({grouped[key].length})</span>
                </span>
                <ChevronDown aria-hidden className="h-5 w-5 shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
              </summary>
              <div className={`${grid} pb-5`}>
                {grouped[key].map((p) => <PairLink key={p.pair} pair={p} nameOf={nameOf} />)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PairDirectory;
