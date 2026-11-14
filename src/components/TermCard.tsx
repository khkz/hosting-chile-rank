import React from 'react';
import { Link } from 'react-router-dom';
import { WikiTerm, wikiCategories } from '@/data/wiki/terms';
import { CmsTag, LevelTag, WikiCategoryIcon } from '@/components/lectura/wiki';

interface TermCardProps {
  term: WikiTerm;
  variant?: 'default' | 'compact';
}

/** Toda la tarjeta lleva al término; el enlace es el título (un solo foco por tarjeta). */
const cardClass =
  'relative flex h-full flex-col rounded-xl border border-rule bg-white transition-colors hover:border-ink/40 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2';
const stretched = 'after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none';

const TermCard: React.FC<TermCardProps> = ({ term, variant = 'default' }) => {
  const href = `/wiki/${term.slug}`;

  if (variant === 'compact') {
    return (
      <article className={`${cardClass} p-4`}>
        <h3 className="font-semibold leading-snug text-ink">
          <Link to={href} className={stretched}>
            {term.title}
          </Link>
        </h3>
        <p className="t-small mt-1.5 line-clamp-2 text-ink-2">{term.shortDefinition}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          <CmsTag cms={term.cms} />
          <LevelTag level={term.level} />
        </div>
      </article>
    );
  }

  const category = wikiCategories.find((c) => c.id === term.category);
  const reqs = term.hostingRequirements ?? [];

  return (
    <article className={`${cardClass} p-5`}>
      {category && (
        <p className="t-meta flex items-center gap-1.5">
          <WikiCategoryIcon name={category.icon} className="h-4 w-4 text-ink-3" />
          {category.name}
        </p>
      )}
      <h3 className="t-h3 mt-2 text-ink">
        <Link to={href} className={stretched}>
          {term.title}
        </Link>
      </h3>
      <p className="t-small mt-2 line-clamp-3 text-ink-2">{term.shortDefinition}</p>
      {reqs.length > 0 && (
        <p className="t-meta mt-3">
          Requiere: {reqs.slice(0, 2).join(', ')}
          {reqs.length > 2 && '…'}
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <CmsTag cms={term.cms} />
        <LevelTag level={term.level} />
      </div>
    </article>
  );
};

export default TermCard;
