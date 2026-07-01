import { Helmet } from 'react-helmet-async';

/**
 * Bloque hreflang Fase 2 SEO.
 * Se emite SOLO en tres páginas (home CL, hub LATAM y /pe) para consolidar
 * autoridad entre .cl y .com sin contaminar el resto del sitio.
 * NO incluye es-MX / es-CO / es-AR hasta que esos países se lancen.
 */
const HreflangCluster = () => (
  <Helmet>
    <link rel="alternate" hrefLang="es-CL" href="https://eligetuhosting.cl/" />
    <link rel="alternate" hrefLang="es-PE" href="https://eligetuhosting.com/pe" />
    <link rel="alternate" hrefLang="x-default" href="https://eligetuhosting.com/" />
  </Helmet>
);

export default HreflangCluster;
