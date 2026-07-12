// Static shell for /quienes-somos so crawlers see real content
// (hoy Vite servía el body de Chile). Sin puppeteer.
import fs from 'node:fs/promises';
import { buildHtml } from './lib/shell.mjs';

const canonical = 'https://eligetuhosting.com/quienes-somos';
const title = 'Quiénes somos — EligeTuHosting';
const description = 'Somos un equipo pequeño que evalúa hosting en Chile y LATAM con datos verificables. Sin puntajes inventados, sin equipos ficticios, con divulgación clara de cómo nos financiamos.';

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: canonical,
  name: title,
  description,
  publisher: {
    '@type': 'Organization',
    name: 'EligeTuHosting',
    url: 'https://eligetuhosting.com/',
    email: 'contacto@eligetuhosting.cl',
  },
};

const body = `
  <header>
    <h1>Quiénes somos</h1>
    <p>EligeTuHosting nació porque casi todas las "listas del mejor hosting" del mundo hispano estaban rellenas de puntajes inventados, testimonios falsos y rankings pagados. Nosotros hacemos lo contrario: solo publicamos lo que podemos probar.</p>
  </header>

  <section>
    <h2>Por qué existimos</h2>
    <p>Cuando alguien busca "mejor hosting Chile" hoy, encuentra casi puro afiliado disfrazado de review. Nosotros queríamos un sitio que le sirviera de verdad a una PyME o a un desarrollador: qué proveedor es real, dónde está su datacenter, cómo responde su soporte y qué reclamos existen. Nada de eso requiere inventar cifras — requiere ir a mirar.</p>
    <p>Todo lo que publicamos viene de una de tres fuentes: benchmarks que corremos nosotros mismos, datos públicos (NIC Chile, WHOIS, ASN, registros mercantiles) o reclamos verificados. Cuando no tenemos evidencia, lo decimos.</p>
  </section>

  <section>
    <h2>Quién está detrás</h2>
    <p>Somos un equipo editorial pequeño con experiencia real administrando servidores Linux, cPanel/WHM, WordPress y stacks LAMP/LEMP, además de trabajo con WAFs (ModSecurity, BitNinja, Imunify360) y análisis OSINT. No vamos a inventar nombres ni fotos de "equipo" que no existe: preferimos mostrar la metodología y dejar que los datos hablen.</p>
    <p>Ver también nuestra <a href="/sobre-nosotros">descripción técnica del equipo editorial</a> y la <a href="/metodologia">metodología completa</a>.</p>
  </section>

  <section>
    <h2>Cómo nos financiamos</h2>
    <p>Con comisiones de afiliado. Si alguien contrata hosting a través de uno de nuestros enlaces, el proveedor nos paga una comisión. Eso es todo. No recibimos plata por "subir" empresas en el ranking y no borramos reclamos a cambio de nada.</p>
    <p>Los enlaces afiliados están marcados y aparecen también proveedores con los que <strong>no</strong> tenemos relación comercial. El orden del ranking se calcula con los mismos pesos publicados en <a href="/metodologia">/metodologia</a> y en <a href="/metodologia-benchmark">/metodologia-benchmark</a>.</p>
  </section>

  <section>
    <h2>Cómo verificamos</h2>
    <ul>
      <li><strong>Existencia real:</strong> razón social, RUT/RFC/NIT/CUIT, sitio oficial y WHOIS.</li>
      <li><strong>Datacenter:</strong> "local" solo si la infraestructura está físicamente en el país; si el proveedor revende o opera desde afuera, lo decimos.</li>
      <li><strong>Rendimiento:</strong> uptime y velocidad medidos por nuestros propios probes.</li>
      <li><strong>Reputación:</strong> reclamos públicos procesados y datados. Los agregamos, no los inventamos.</li>
      <li><strong>Datos abiertos:</strong> el dataset completo se publica bajo CC-BY-4.0 en <a href="/datos">/datos</a>.</li>
    </ul>
  </section>

  <section>
    <h2>Cómo contactarnos</h2>
    <p>Si encontraste un error, tenés evidencia que contradice algún dato o querés proponer una corrección, escribinos. Publicamos actualizaciones con fecha cuando la evidencia lo justifica.</p>
    <p>📧 <a href="mailto:contacto@eligetuhosting.cl">contacto@eligetuhosting.cl</a></p>
    <p><small>Respondemos personas reales, no bots. Suele tomar 1–3 días hábiles.</small></p>
  </section>
`;

const headExtra = `<script type="application/ld+json">${JSON.stringify(orgLd)}</script>`;

const html = buildHtml({
  title,
  description,
  canonical,
  locale: 'es',
  headExtra,
  bodyContent: body,
  keywords: 'quienes somos eligetuhosting, equipo eligetuhosting, metodologia hosting, transparencia hosting',
  ogImage: 'https://eligetuhosting.com/og/quienes-somos.png',
});

await fs.mkdir('public/quienes-somos', { recursive: true });
await fs.writeFile('public/quienes-somos/index.html', html, 'utf8');
console.log('✅ /quienes-somos estático generado');
