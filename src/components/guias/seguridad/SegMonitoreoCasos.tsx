import React from 'react';
import { H2, GuideNote } from '../GuideBlocks';

interface CasoProps {
  titulo: string;
  datos: [string, React.ReactNode][];
  accionLabel: string;
  acciones: string[];
  cierre: React.ReactNode;
}

const Caso: React.FC<CasoProps> = ({ titulo, datos, accionLabel, acciones, cierre }) => (
  <>
    <h3>{titulo}</h3>
    {datos.map(([k, v]) => (
      <p key={k}>
        <strong>{k}:</strong> {v}
      </p>
    ))}
    <p>
      <strong>{accionLabel}:</strong>
    </p>
    <ul>
      {acciones.map((a) => (
        <li key={a}>{a}</li>
      ))}
    </ul>
    {cierre}
  </>
);

/** Guía de seguridad web: monitoreo, casos y plan de acción. */
const SegMonitoreoCasos: React.FC = () => (
  <>
    <H2 id="monitoreo">Monitoreo y alertas</H2>
    <GuideNote>
      <p>
        <strong>Lección aprendida:</strong> El 70&nbsp;% de mis clientes descubren hackeos porque Google les manda el
        email «Your site may be hacked».
      </p>
      <p>Para entonces, el daño ya está hecho. El monitoreo proactivo es clave.</p>
    </GuideNote>

    <h3>Stack de monitoreo que uso</h3>
    <h4>Herramientas gratuitas</h4>
    <ul>
      <li><strong>Google Search Console:</strong> alertas malware</li>
      <li><strong>UptimeRobot:</strong> monitoreo uptime</li>
      <li><strong>Wordfence:</strong> alertas seguridad</li>
      <li><strong>Google Analytics:</strong> tráfico anómalo</li>
    </ul>
    <h4>Herramientas pagadas</h4>
    <ul>
      <li><strong>Pingdom:</strong> monitoreo avanzado</li>
      <li><strong>Sucuri SiteCheck:</strong> escaneo malware</li>
      <li><strong>StatusCake:</strong> múltiples ubicaciones</li>
      <li><strong>New Relic:</strong> performance profiling</li>
    </ul>

    <h3>Alertas que configuro siempre</h3>
    <h4>Críticas (inmediatas)</h4>
    <ul>
      <li>Sitio caído por más de 5 minutos</li>
      <li>Login admin desde IP no reconocida</li>
      <li>Malware detectado</li>
      <li>Cambios en archivos core</li>
    </ul>
    <h4>Importantes (1–4 horas)</h4>
    <ul>
      <li>Spike de tráfico inusual</li>
      <li>Error 500 frecuente</li>
      <li>SSL próximo a vencer</li>
      <li>Backup falló</li>
    </ul>

    <H2 id="casos-reales">Casos reales de seguridad en Chile</H2>
    <Caso
      titulo="Caso 1: e-commerce hackeado (Valparaíso)"
      datos={[
        ['Situación', 'Tienda online 15.000 productos'],
        ['Ataque', 'Inyección SQL en plugin vulnerable'],
        ['Daño', '8.000 tarjetas robadas, sitio inhabilitado'],
        ['Duración', '3 semanas offline'],
      ]}
      accionLabel="Solución implementada"
      acciones={['WAF Cloudflare Pro', 'Wordfence Premium', 'Hosting con hardening', 'Monitoreo 24/7', 'PCI DSS compliance']}
      cierre={
        <p>
          <strong>Resultado:</strong> 2 años sin incidentes
        </p>
      }
    />
    <Caso
      titulo="Caso 2: blog corporativo (Santiago)"
      datos={[
        ['Situación', 'Blog empresa 500 empleados'],
        ['Ataque', 'Malware SEO spam'],
        ['Daño', <>Ranking Google −80&nbsp;%, reputación</>],
        ['Descubrimiento', '2 semanas después'],
      ]}
      accionLabel="Solución implementada"
      acciones={['Limpieza completa malware', 'Hardening WordPress', 'Escaneo diario automático', 'Google reconsideration']}
      cierre={
        <p>
          <strong>Resultado:</strong> Ranking recuperado en 6 meses
        </p>
      }
    />
    <Caso
      titulo="Caso 3: sitio corporativo (Concepción)"
      datos={[
        ['Situación', 'Sitio institucional sin actualizaciones'],
        ['Ataque', 'Desfiguración + cryptominer'],
        ['Daño', 'Imagen corporativa, recursos servidor'],
        ['Vector', 'WordPress 3 versiones atrasado'],
      ]}
      accionLabel="Prevención simple"
      acciones={['Updates automáticos WordPress', 'Plugin security básico', 'Backup semanal', 'Hosting actualizado']}
      cierre={
        <>
          <p>
            <strong>Costo de prevención:</strong> bajo
          </p>
          <p>
            <strong>Costo de limpieza:</strong> bastante mayor que prevenir
          </p>
        </>
      }
    />

    <H2 id="plan-accion">Plan de acción inmediato</H2>
    <p>Basado en 300+ casos reales, este es el orden de prioridad para asegurar tu sitio:</p>
    <h3>Esta semana (crítico)</h3>
    <ol>
      <li>Cambiar todas las contraseñas a seguras</li>
      <li>Actualizar WordPress y plugins</li>
      <li>Instalar SSL si no tienes</li>
      <li>Configurar backup automático</li>
      <li>Instalar plugin seguridad básico</li>
    </ol>
    <h3>Este mes (importante)</h3>
    <ol>
      <li>Configurar WAF (Cloudflare gratis)</li>
      <li>Activar monitoreo uptime</li>
      <li>Configurar alertas Security</li>
      <li>Revisar plugins innecesarios</li>
      <li>Documentar proceso recuperación</li>
    </ol>
    <GuideNote>
      <p>
        <strong>Mi garantía:</strong> Si implementas estos 10 puntos, reduces tu riesgo de hackeo en 90&nbsp;%. Lo he
        comprobado en cientos de sitios chilenos.
      </p>
    </GuideNote>
  </>
);

export default SegMonitoreoCasos;
