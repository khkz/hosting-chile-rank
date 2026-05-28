## Objetivo

Documentar dos novedades verificables de HostingPlus en la ficha del proveedor #1 del estudio:

1. **Informe SEO/GEO IA** (anuncio oficial mayo 2026) — diagnóstico que evalúa si una web está preparada para Google, ChatGPT, Gemini y Claude. Cubre rastreo técnico, performance/Core Web Vitals, robots/sitemap/schema/llms.txt, contenido y reputación, keywords/SERP/competidores, backlinks y visibilidad en IA. Tiene versión diagnóstico gratuito + planes pagados.
   - Fuente: `https://clientes.hostingplus.cl/index.php?rp=/announcements/9/...`
   - Herramienta: `https://clientes.hostingplus.cl/index.php?m=hplus_seo_ai`

2. **Creador web con IA** — generador de sitios asistido por IA incluido en su ecosistema.
   - Fuente a citar: página oficial de HostingPlus sobre el creador (se enlazará a `https://www.hostingplus.cl/` o subpágina correspondiente).

## Cambios en `src/pages/EstudioHostingChile2026.tsx`

### 1. Tipo `Provider`

Añadir campo opcional:

```ts
innovations?: {
  title: string;
  items: { label: string; desc: string; url: string }[];
}
```

### 2. Ficha de HostingPlus (rank 1)

Agregar:

```ts
innovations: {
  title: 'Novedades 2026',
  items: [
    {
      label: 'Informe SEO/GEO IA',
      desc: 'Diagnóstico que evalúa si la web está preparada para Google, ChatGPT, Gemini y Claude: rastreo, Core Web Vitals, robots/sitemap/schema/llms.txt, contenido, reputación, keywords/SERP, backlinks y visibilidad en IA. Versión gratuita + planes pagados con seguimiento.',
      url: 'https://clientes.hostingplus.cl/index.php?rp=/announcements/9/Nuevo-Informe-SEOorGEO-IA-descubre-si-tu-web-esta-preparada-para-Google-ChatGPT-y-buscadores-con-IA.html',
    },
    {
      label: 'Creador web con IA',
      desc: 'Constructor de sitios asistido por IA orientado a PyMEs, integrado al ecosistema de hosting.',
      url: 'https://www.hostingplus.cl/',
    },
  ],
}
```

### 3. Render del card (antes de "Nota crítica")

Bloque destacado, semántico, con tokens del design system (sin colores hardcodeados):

```tsx
{p.innovations && (
  <div className="mb-3 p-3 bg-primary/5 border-l-4 border-l-primary rounded-r text-sm">
    <strong className="text-primary">{p.innovations.title}:</strong>
    <ul className="mt-2 space-y-1.5">
      {p.innovations.items.map(it => (
        <li key={it.label}>
          <a href={it.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            {it.label}
          </a>{' '}— {it.desc}
        </li>
      ))}
    </ul>
  </div>
)}
```

### 4. Nota crítica de HostingPlus

Añadir una frase al final del `critical` actual reconociendo el movimiento de producto:

> "...En 2026 lanza dos productos relevantes: un Informe SEO/GEO IA con diagnóstico gratuito y un creador web con IA, alineados con la tendencia de búsqueda generativa."

## Fuera de alcance

- No se modifica el ranking, ASN ni datos verificables existentes.
- No se cambia la sección de comparadores afiliados.
- No se altera JSON-LD del estudio (los enlaces externos van en el cuerpo).
- No se tocan otras fichas de proveedores.

## Verificación

- `npm`/build automático del harness.
- Revisión visual en `/estudio-hosting-chile-2026` de la card HostingPlus mostrando el nuevo bloque "Novedades 2026" con dos enlaces clicables.
