import React from 'react';
import { Award, Building2, Cpu, House, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Section from '@/components/system/Section';

const CATEGORIES: { title: string; caption: string; href: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { title: 'Mejor hosting 2026', caption: 'Ranking general', href: '/mejor-hosting-chile-2026', Icon: Award },
  { title: 'Hosting WordPress', caption: 'Para sitios WordPress', href: '/mejor-hosting-wordpress-chile', Icon: House },
  { title: 'Hosting e-commerce', caption: 'WooCommerce y tiendas', href: '/mejor-hosting-ecommerce-chile', Icon: ShoppingBag },
  { title: 'Hosting para pymes', caption: 'Correo y sitio de empresa', href: '/mejor-hosting-pymes-chile', Icon: Building2 },
  { title: 'VPS en Chile', caption: 'KVM, NVMe y acceso root', href: '/mejor-vps-chile', Icon: Cpu },
];

/** Accesos por tipo de servicio: celdas con reglas, íconos en tinta, sin tarjetas con sombra. */
const Categories = () => (
  <Section id="por-tipo" tone="paper" title="Explora por tipo de servicio" density="tight">
    <ul className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
      {CATEGORIES.map(({ title, caption, href, Icon }) => (
        <li key={href} className="bg-white">
          <Link to={href} className="group flex h-full min-h-[44px] flex-col gap-2 p-5 hover:bg-paper">
            <Icon className="h-5 w-5 text-ink-2" aria-hidden />
            <span className="font-semibold text-ink underline decoration-transparent underline-offset-4 group-hover:decoration-ink">
              {title}
            </span>
            <span className="t-small text-ink-2">{caption}</span>
          </Link>
        </li>
      ))}
    </ul>
  </Section>
);

export default Categories;
