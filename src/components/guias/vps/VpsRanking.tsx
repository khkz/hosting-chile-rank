import React from 'react';
import { Link } from 'react-router-dom';
import { H2, GuideNote, MarkList, MarkItem } from '../GuideBlocks';
import ProviderPick from '../ProviderPick';

/**
 * Guía VPS: ranking propio de la guía. Orden, textos, etiquetas y enlaces son
 * los de la guía (pendiente 10 del dueño); aquí solo cambia la presentación.
 */
const VpsRanking: React.FC = () => (
  <>
    <H2 id="ranking-vps">2. Ranking VPS Chile: los 5 que realmente funcionan</H2>
    <GuideNote>
      <p>
        <strong>Metodología:</strong> Ranking basado en 180 migraciones exitosas entre 2021–2024. Evaluamos: uptime
        real, velocidad, soporte técnico y relación precio/rendimiento.
      </p>
    </GuideNote>

    <ProviderPick
      position={1}
      name="HostingPlus VPS"
      label="Mejor opción"
      href="https://www.hostingplus.cl/servidores-vps.htm"
      rel="noopener noreferrer"
      linkLabel="Ir al sitio de HostingPlus"
    >
      <p>
        <strong>Por qué está #1:</strong> 87&nbsp;% de mis clientes que migraron aquí reportan 0 problemas después de 6
        meses. Datacenter en Santiago, soporte real en español y uptime verificable en nuestro{' '}
        <Link to="/benchmark">benchmark mensual</Link>.
      </p>
      <p>
        <strong>Lo mejor:</strong>
      </p>
      <MarkList className="my-0">
        <MarkItem>Soporte técnico responde en 15 minutos</MarkItem>
        <MarkItem>Panel cPanel incluido</MarkItem>
        <MarkItem>Backup automático diario</MarkItem>
        <MarkItem>Migración gratuita profesional</MarkItem>
      </MarkList>
      <p>
        <strong>Lo peor:</strong>
      </p>
      <MarkList className="my-0">
        <MarkItem no srLabel="">
          Precio 20&nbsp;% más caro que competencia
        </MarkItem>
        <MarkItem no srLabel="">
          Solo planes anuales con descuento
        </MarkItem>
      </MarkList>
      <p>
        <strong>Plan recomendado:</strong> VPS Básico, 2 CPU, 4&nbsp;GB RAM, 80&nbsp;GB SSD = a consultar (o a consultar
        pagando anual)
      </p>
    </ProviderPick>

    <ProviderPick
      position={2}
      name="EcoHosting VPS"
      label="Eco-certificado"
      href="https://ecohosting.cl/cloud-hosting-vps/"
      rel="noopener noreferrer"
      linkLabel="Ir al sitio de EcoHosting"
    >
      <p>
        <strong>Por qué está #2:</strong> Único proveedor chileno con certificación ISO 14001 (medio ambiente). Velocidad
        superior, pero soporte técnico solo en horario de oficina.
      </p>
      <p>
        <strong>Plan recomendado:</strong> Cloud VPS, 2 CPU, 4&nbsp;GB RAM, 60&nbsp;GB SSD = a consultar
      </p>
    </ProviderPick>

    <ProviderPick
      position={3}
      name="Hostname VPS"
      label="Mejor soporte"
      href="https://hn.cl/vps/"
      rel="noopener noreferrer"
      linkLabel="Ir al sitio de Hostname"
    >
      <p>
        <strong>Por qué está #3:</strong> Soporte técnico excepcional 24/7, pero precios 15&nbsp;% más altos. Ideal si
        necesitas asistencia constante.
      </p>
      <p>
        <strong>Plan recomendado:</strong> VPS Pro, 2 CPU, 4&nbsp;GB RAM, 80&nbsp;GB SSD = a consultar
      </p>
    </ProviderPick>

    <ProviderPick
      position={4}
      name="SiteGround VPS"
      label="Para devs"
      href="https://www.siteground.com/cloud-hosting-service/"
      rel="noopener noreferrer"
      linkLabel="Ir al sitio de SiteGround"
    >
      <p>
        <strong>Por qué está #4:</strong> Tecnología superior, herramientas avanzadas para desarrolladores. Servidores en
        Brasil (no Chile), latencia +30&nbsp;ms.
      </p>
      <p>
        <strong>Plan recomendado:</strong> Cloud VPS, 2 CPU, 4&nbsp;GB RAM, 40&nbsp;GB SSD = a consultar (USD
        convertido)
      </p>
    </ProviderPick>

    <ProviderPick
      position={5}
      name="1Hosting VPS"
      label="Mejor precio"
      href="https://www.1hosting.cl/vps-chile/"
      rel="noopener noreferrer"
      linkLabel="Ir al sitio de 1Hosting"
    >
      <p>
        <strong>Por qué está #5:</strong> Precio imbatible para VPS básicos. Perfecto para proyectos pequeños, pero
        uptime irregular (97,8&nbsp;% promedio).
      </p>
      <p>
        <strong>Plan recomendado:</strong> VPS Starter, 1 CPU, 2&nbsp;GB RAM, 40&nbsp;GB SSD = a consultar
      </p>
    </ProviderPick>
  </>
);

export default VpsRanking;
