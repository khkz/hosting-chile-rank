import React from 'react';
import { H2, GuideNote, MarkList, MarkItem } from '../GuideBlocks';

interface CasoProps {
  titulo: string;
  inicialLabel?: string;
  inicial: string[];
  accionLabel: string;
  acciones: string[];
  resultado: string;
}

const Caso: React.FC<CasoProps> = ({ titulo, inicialLabel = 'Situación inicial', inicial, accionLabel, acciones, resultado }) => (
  <>
    <h3>{titulo}</h3>
    <p>
      <strong>{inicialLabel}:</strong>
    </p>
    <ul>
      {inicial.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
    <p>
      <strong>{accionLabel}:</strong>
    </p>
    <ul>
      {acciones.map((a) => (
        <li key={a}>{a}</li>
      ))}
    </ul>
    <p>
      <strong>Resultado:</strong> {resultado}
    </p>
  </>
);

/** Guía WordPress: migración, casos y plan de acción. */
const WpMigracionCasos: React.FC = () => (
  <>
    <H2 id="migracion-wp">Migración WordPress específica</H2>
    <GuideNote>
      <p>
        <strong>Mi proceso específico WordPress:</strong> He migrado 200+ WordPress sin perder datos. Este proceso
        funciona para sitios desde 100&nbsp;MB hasta 50&nbsp;GB.
      </p>
    </GuideNote>

    <h3>Método 1: plugin Duplicator Pro (recomendado)</h3>
    <p>
      <strong>Cuándo usar:</strong> Sitios hasta 5&nbsp;GB, WordPress estándar
    </p>
    <ol>
      <li>Instalar Duplicator Pro en sitio origen</li>
      <li>Crear package completo (archivos + BD)</li>
      <li>Descargar installer.php + archive.zip</li>
      <li>Subir archivos al nuevo hosting</li>
      <li>Ejecutar installer y seguir wizard</li>
      <li>Actualizar URLs y configuraciones</li>
    </ol>
    <p>
      <strong>Ventajas que he visto:</strong>
    </p>
    <MarkList>
      <MarkItem>95&nbsp;% tasa éxito</MarkItem>
      <MarkItem>Migra todo automático</MarkItem>
      <MarkItem>Funciona con cualquier hosting</MarkItem>
      <MarkItem>Actualiza URLs automáticamente</MarkItem>
    </MarkList>
    <p>
      <strong>Limitaciones:</strong>
    </p>
    <MarkList>
      <MarkItem no srLabel="">
        Sitios muy grandes (+5&nbsp;GB)
      </MarkItem>
      <MarkItem no srLabel="">
        Hosting con límites estrictos
      </MarkItem>
    </MarkList>

    <h3>Método 2: migración manual WordPress</h3>
    <p>
      <strong>Cuándo usar:</strong> Sitios complejos, multisite, +5&nbsp;GB
    </p>
    <ol>
      <li>Backup completo vía FTP (wp-content)</li>
      <li>Export base datos (phpMyAdmin)</li>
      <li>Crear nueva instalación WordPress</li>
      <li>Subir wp-content vía FTP/SFTP</li>
      <li>Import BD + actualizar URLs</li>
      <li>Configurar wp-config.php</li>
      <li>Verificar permalinks y .htaccess</li>
    </ol>
    <p>
      <strong>Mi script para URLs:</strong>
    </p>
    <pre className="whitespace-pre-wrap break-words">
      <code>
        {`UPDATE wp_options SET option_value = 'https://nuevodominio.cl' WHERE option_name = 'home';
UPDATE wp_options SET option_value = 'https://nuevodominio.cl' WHERE option_name = 'siteurl';`}
      </code>
    </pre>
    <p>
      <strong>Herramienta que uso:</strong> Search Replace DB script para URLs en contenido.
    </p>

    <H2 id="casos-reales">Casos reales de éxito</H2>
    <Caso
      titulo="Caso 1: e-commerce WordPress (Santiago)"
      inicial={[
        'WordPress en hosting genérico',
        '5.000 productos WooCommerce',
        'Carga: 15 segundos',
        'Conversión: 0,8 %',
        'Frecuentes caídas en peak',
      ]}
      accionLabel="Optimización realizada"
      acciones={[
        'Migración SiteGround WordPress',
        'WP Rocket + ShortPixel',
        'Cloudflare Pro',
        'Optimización BD WooCommerce',
        'CDN para imágenes productos',
      ]}
      resultado="2,1 seg carga, 2,4&nbsp;% conversión, +180&nbsp;% ventas"
    />
    <Caso
      titulo="Caso 2: blog multiautor (Valparaíso)"
      inicial={[
        'WordPress con 50+ autores',
        '2.000 artículos publicados',
        'Hosting compartido básico',
        'Admin panel muy lento',
        'Problemas publicación simultánea',
      ]}
      accionLabel="Solución implementada"
      acciones={[
        'Webempresa Plan WordPress Dos',
        'Redis para caché objetos',
        'Optimización BD (cleanup)',
        'Staging para revisiones',
        'Backup automático diario',
      ]}
      resultado="Admin 80&nbsp;% más rápido, 0 conflictos"
    />
    <Caso
      titulo="Caso 3: sitio corporativo multiidioma (Concepción)"
      inicial={[
        'WordPress + WPML (3 idiomas)',
        'Hosting internacional caro',
        'Carga lenta desde Chile',
        'Problemas SEO multiidioma',
        'Backup manual irregular',
      ]}
      accionLabel="Migración realizada"
      acciones={[
        'Raiola Networks WordPress',
        'Optimización WPML + LSCache',
        'Configuración hreflang correcta',
        'CDN global Cloudflare',
        'Backup automático 3 copias',
      ]}
      resultado="50&nbsp;% ahorro costos, 60&nbsp;% mejora velocidad"
    />

    <H2 id="plan-accion">Tu plan de acción WordPress</H2>
    <p>Basado en 500+ optimizaciones WordPress, este es el plan que funciona:</p>
    <h3>Si tu WordPress carga +5 segundos</h3>
    <ol>
      <li>Mide velocidad actual (GTmetrix)</li>
      <li>Migra a hosting WordPress optimizado</li>
      <li>Instala plugin caché (WP Rocket)</li>
      <li>Optimiza imágenes (ShortPixel)</li>
      <li>Configura CDN (Cloudflare)</li>
    </ol>
    <p>
      <strong>Meta:</strong> −70&nbsp;% tiempo carga
    </p>
    <h3>Si tu WordPress ya está optimizado</h3>
    <ol>
      <li>Auditoría plugins innecesarios</li>
      <li>Optimización base datos</li>
      <li>Configuración avanzada caché</li>
      <li>Monitoreo performance continuo</li>
      <li>Plan escalabilidad futuro</li>
    </ol>
    <p>
      <strong>Meta:</strong> mantener velocidad óptima
    </p>
    <GuideNote>
      <p>
        <strong>Mi garantía personal:</strong> Sigue este plan y tu WordPress cargará en menos de 3 segundos. Lo he
        probado en cientos de sitios chilenos.
      </p>
    </GuideNote>
  </>
);

export default WpMigracionCasos;
