import React from 'react';
import { H2, GuideNote } from '../GuideBlocks';
import ProviderPick from '../ProviderPick';

/**
 * Guía WordPress: ranking propio de la guía. Orden, textos y etiquetas son los
 * de la guía (pendiente 10 del dueño); aquí solo cambia la presentación.
 */
const WpRanking: React.FC = () => (
  <>
    <H2 id="ranking-proveedores">Ranking proveedores WordPress Chile</H2>

    <ProviderPick position={1} name="HostingPlus: WordPress optimizado" label="Mejor hosting local Chile">
      <p>
        <strong>Por qué es #1:</strong>
      </p>
      <ul>
        <li>LiteSpeed + LSCache automático</li>
        <li>WordPress preoptimizado</li>
        <li>SSL gratuito incluido</li>
        <li>Servidores en Chile</li>
        <li>Soporte técnico en español</li>
      </ul>
      <p>
        <strong>Mi experiencia:</strong> HostingPlus es el líder chileno en WordPress. Sus servidores locales dan
        velocidades increíbles desde Chile, y su soporte entiende nuestro mercado.
      </p>
      <p>
        <strong>Precios Chile:</strong> a consultar (planes Básico, Plus y Pro).
      </p>
    </ProviderPick>

    <ProviderPick position={2} name="Ecohosting: WordPress sustentable" label="Hosting más sustentable">
      <p>
        <strong>Fortalezas:</strong>
      </p>
      <ul>
        <li>Hosting 100&nbsp;% verde certificado</li>
        <li>Servidores SSD en Chile</li>
        <li>Soporte técnico local experto</li>
        <li>Backup automático diario</li>
        <li>WordPress preinstalado</li>
      </ul>
      <p>
        <strong>Mi experiencia:</strong> Ecohosting combina performance con sustentabilidad. Ideal para empresas con
        conciencia ambiental que no quieren sacrificar velocidad.
      </p>
      <p>
        <strong>Precios Chile:</strong> a consultar (planes Eco Básico, Eco Plus y Eco Pro).
      </p>
    </ProviderPick>

    <ProviderPick position={3} name="1Hosting: simple y rápido" label="Mejor para principiantes">
      <p>
        <strong>Fortalezas:</strong>
      </p>
      <ul>
        <li>Interfaz súper simple</li>
        <li>WordPress 1-click install</li>
        <li>Precio muy accesible</li>
        <li>Servidores rápidos</li>
        <li>Ideal para principiantes</li>
      </ul>
      <p>
        <strong>Mi experiencia:</strong> Perfecto para quienes empiezan con WordPress. Panel de control intuitivo y
        configuración automática.
      </p>
      <p>
        <strong>Precios Chile:</strong> a consultar (planes Starter, Business y Premium).
      </p>
    </ProviderPick>

    <GuideNote>
      <p>
        <strong>Mi recomendación personal:</strong> Para 90&nbsp;% de casos WordPress en Chile, HostingPlus es la mejor
        opción. Servidores locales + soporte en español + precio justo = combinación perfecta.
      </p>
    </GuideNote>
  </>
);

export default WpRanking;
