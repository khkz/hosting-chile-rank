import React from 'react';
import { H2, GuideNote } from '../GuideBlocks';
import ProviderPick from '../ProviderPick';

/**
 * Guía «elegir hosting»: recomendaciones de la guía y conclusión.
 * Texto, orden, etiquetas y enlaces son los de la guía (pendiente 10 del dueño);
 * aquí solo cambia la presentación.
 */
export const Recomendaciones: React.FC = () => (
  <>
    <H2 id="recomendaciones">6. Mi ranking personal después de probar 23 hosting chilenos</H2>

    <GuideNote>
      <p>
        <strong>Transparencia total:</strong> He trabajado con todos estos hostings, algunos me pagan comisión si
        contratas, otros no. Mi ranking se basa en experiencia real con clientes, no en quién paga más.
      </p>
    </GuideNote>

    <p>
      Basados en nuestro análisis de rendimiento, precio, características y valoraciones de usuarios, estas son nuestras
      recomendaciones para diferentes necesidades:
    </p>

    <ProviderPick
      name="HostingPlus"
      label="Mejor opción general"
      href="https://www.hostingplus.cl/"
      rel="noopener noreferrer"
      linkLabel="Ir al sitio de HostingPlus"
    >
      <p>
        Ideal para todo tipo de proyectos que requieran alto rendimiento y soporte de calidad. Su combinación de
        velocidad, seguridad y atención al cliente los posiciona como nuestra principal recomendación.
      </p>
    </ProviderPick>

    <ProviderPick
      name="1Hosting"
      label="Mejor precio"
      href="https://www.1hosting.cl/"
      rel="noopener noreferrer"
      linkLabel="Ir al sitio de 1Hosting"
    >
      <p>
        Excelente opción si buscas una buena relación calidad-precio. Ofrece planes económicos sin sacrificar demasiado
        rendimiento o características esenciales.
      </p>
    </ProviderPick>

    <ProviderPick
      name="EcoHosting"
      label="Más sustentable"
      href="https://www.ecohosting.cl/"
      rel="noopener noreferrer"
      linkLabel="Ir al sitio de EcoHosting"
    >
      <p>
        Si la sustentabilidad ambiental es importante para tu proyecto, EcoHosting ofrece servidores con energías
        renovables sin comprometer el rendimiento técnico.
      </p>
    </ProviderPick>
  </>
);

export const Conclusion: React.FC = () => (
  <>
    <H2 id="conclusion">Conclusión</H2>
    <p>
      Elegir el hosting adecuado es una decisión importante que afectará directamente al rendimiento, seguridad y éxito
      de tu sitio web. Evalúa cuidadosamente tus necesidades, compara las opciones disponibles y prioriza
      características como velocidad, soporte técnico y escalabilidad.
    </p>
    <p>
      Recuerda que el proveedor de hosting más adecuado no siempre es el más barato o el más caro, sino el que mejor se
      adapta a las necesidades específicas de tu proyecto.
    </p>
  </>
);
