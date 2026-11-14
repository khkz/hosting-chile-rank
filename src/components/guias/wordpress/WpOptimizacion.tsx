import React from 'react';
import { H2, GuideNote, MarkList, MarkItem } from '../GuideBlocks';

const Problema: React.FC<{ titulo: string; historia: string; causaLabel: string; causa: string; solucion: string }> = ({
  titulo,
  historia,
  causaLabel,
  causa,
  solucion,
}) => (
  <>
    <h3>{titulo}</h3>
    <p>
      <strong>Historia real:</strong> {historia}
    </p>
    <p>
      <strong>{causaLabel}:</strong> {causa}
    </p>
    <p>
      <strong>Solución:</strong> {solucion}
    </p>
  </>
);

/** Guía WordPress: optimizaciones y problemas comunes. */
const WpOptimizacion: React.FC = () => (
  <>
    <H2 id="optimizaciones">Optimizaciones específicas WordPress</H2>
    <GuideNote>
      <p>
        <strong>Mi metodología:</strong> Después de optimizar 500+ WordPress, desarrollé un proceso que mejora la
        velocidad en promedio 70&nbsp;% sin tocar código.
      </p>
    </GuideNote>

    <h3>1. Configuración hosting</h3>
    <h4>PHP optimization</h4>
    <ul>
      <li><strong>PHP 8.1+:</strong> 20&nbsp;% más rápido que 7.4</li>
      <li><strong>OPcache habilitado:</strong> caché código PHP</li>
      <li><strong>Memory limit 512MB+:</strong> para plugins pesados</li>
      <li><strong>Max execution time 300s:</strong> para imports grandes</li>
    </ul>
    <h4>Database optimization</h4>
    <ul>
      <li><strong>MySQL 8.0+:</strong> mejor performance queries</li>
      <li><strong>InnoDB engine:</strong> para todas las tablas</li>
      <li><strong>Query cache activado:</strong> caché consultas BD</li>
      <li><strong>Slow query log:</strong> detectar queries lentas</li>
    </ul>

    <h3>2. Plugins de performance (mi stack)</h3>
    <h4>Caché (obligatorio)</h4>
    <ul>
      <li><strong>WP Rocket (Premium), mi favorito:</strong> plan de pago, todo en uno, fácil configuración</li>
      <li><strong>LiteSpeed Cache (gratis):</strong> solo con hosting LiteSpeed (Raiola, etc.)</li>
    </ul>
    <h4>Optimización de imágenes</h4>
    <ul>
      <li><strong>ShortPixel (mi favorito):</strong> 100 img/mes gratis, luego plan de pago</li>
      <li><strong>Imagify:</strong> 25&nbsp;MB/mes gratis, integra con WP Rocket</li>
    </ul>

    <h3>3. Mi configuración WP Rocket</h3>
    <p>
      <strong>Estas son las configuraciones exactas que uso en 90&nbsp;% de mis proyectos:</strong>
    </p>
    <h4>Caché settings</h4>
    <MarkList>
      <MarkItem>Mobile cache ON</MarkItem>
      <MarkItem>User cache ON</MarkItem>
      <MarkItem>Cache lifespan: 10 hours</MarkItem>
      <MarkItem>Preload cache automático</MarkItem>
    </MarkList>
    <h4>File optimization</h4>
    <MarkList>
      <MarkItem>Minify CSS &amp; JS</MarkItem>
      <MarkItem>Combine CSS files</MarkItem>
      <MarkItem no srLabel="Desactivado: ">
        Combine JS (puede romper)
      </MarkItem>
      <MarkItem>Remove unused CSS</MarkItem>
    </MarkList>

    <H2 id="problemas-comunes">Problemas comunes (y soluciones)</H2>
    <Problema
      titulo="Problema #1: «Mi WordPress está lento»"
      historia="E-commerce cargaba en 12 segundos, perdían 60&nbsp;% visitas."
      causaLabel="Diagnóstico típico"
      causa="Hosting genérico + plugins mal optimizados + imágenes sin comprimir."
      solucion="Cambio a hosting WordPress + WP Rocket + optimización imágenes. Resultado: 2,3 segundos."
    />
    <Problema
      titulo="Problema #2: «Error 500 Internal Server»"
      historia="Blog perdió 3 días de tráfico por error intermitente."
      causaLabel="Causa típica"
      causa="Memory limit insuficiente (128MB) con plugins pesados."
      solucion="Subir memory_limit a 512MB + auditoría plugins + hosting con más recursos."
    />
    <Problema
      titulo="Problema #3: «WordPress se hackea constantemente»"
      historia="Sitio corporativo hackeado 3 veces en 6 meses."
      causaLabel="Causa típica"
      causa="WordPress/plugins desactualizados + hosting sin hardening."
      solucion="Hosting managed WordPress + Wordfence + updates automáticos. Resultado: 0 hackeos en 2 años."
    />
  </>
);

export default WpOptimizacion;
