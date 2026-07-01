import { Fragment } from 'react';

/**
 * Bloque hreflang Fase 2 SEO.
 *
 * IMPORTANTE: NO usamos un <Helmet> separado aquí. En el prerender con
 * react-helmet-async, tener DOS <Helmet> en la misma página hacía que el
 * title/canonical de la página quedaran con los defaults del index.html
 * (bug detectado en /pe tras Fase 2). En su lugar, exportamos las etiquetas
 * como children para que cada página las incluya DENTRO de su único <Helmet>.
 *
 * Uso:
 *   <Helmet>
 *     <title>...</title>
 *     <link rel="canonical" href="..." />
 *     {hreflangLinks()}
 *   </Helmet>
 *
 * Se emite SOLO en tres páginas (home CL, hub LATAM y /pe) para consolidar
 * autoridad entre .cl y .com sin contaminar el resto del sitio.
 * NO incluye es-MX / es-CO / es-AR hasta que esos países se lancen.
 */
export const hreflangLinks = () => (
  <Fragment>
    <link rel="alternate" hrefLang="es-CL" href="https://eligetuhosting.cl/" />
    <link rel="alternate" hrefLang="es-PE" href="https://eligetuhosting.com/pe" />
    <link rel="alternate" hrefLang="es-MX" href="https://eligetuhosting.com/mx" />
    <link rel="alternate" hrefLang="es-CO" href="https://eligetuhosting.com/co" />
    <link rel="alternate" hrefLang="es-AR" href="https://eligetuhosting.com/ar" />
    <link rel="alternate" hrefLang="x-default" href="https://eligetuhosting.com/" />
  </Fragment>
);

export default hreflangLinks;
