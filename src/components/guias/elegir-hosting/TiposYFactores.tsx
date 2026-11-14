import React from 'react';
import { H2, GuideNote, ProsCons } from '../GuideBlocks';

/** Guía «elegir hosting»: experiencia, tipos de hosting y factores clave. */
export const ExperienciaYTipos: React.FC = () => (
  <>
    <H2 id="experiencia">Mi experiencia: el error que me costó caro</H2>
    <p>
      En 2016 lancé mi primera tienda online con el hosting más barato que encontré. Parecía una ganga, ¿verdad?
      Error garrafal. En pleno CyberDay, con 500 visitantes simultáneos, el sitio se cayó por 6 horas. Perdí ventas y
      la confianza de muchos clientes.
    </p>
    <p>
      Desde entonces, aprendí que <strong>el hosting no es un gasto, es una inversión</strong>. Y en esta guía te voy a
      enseñar todo lo que he aprendido para que no cometas mis errores.
    </p>

    <H2 id="tipos-hosting">1. Los tipos de hosting que realmente funcionan en Chile</H2>

    <h3>Hosting compartido: «El departamento estudiantil»</h3>
    <p>
      Es como vivir en un departamento compartido: divides los recursos (cocina, baño, internet) con otros. Perfecto
      para blogs personales, sitios de iglesias o emprendimientos que recién arrancan. <strong>Precio en Chile:</strong>{' '}
      a consultar.
    </p>
    <GuideNote>
      <p>
        <strong>Dato real:</strong> El 73&nbsp;% de los sitios web chilenos funcionan perfectamente con hosting
        compartido. Mi blog personal lleva 4 años en uno y jamás se ha caído.
      </p>
    </GuideNote>
    <ProsCons pros={['Económico', 'Fácil de administrar']} cons={['Recursos limitados']} consLabel="A considerar" />

    <h3>VPS: «Tu oficina propia»</h3>
    <p>
      Imagínate tener tu propia oficina en un edificio corporativo. Tienes tus recursos garantizados, pero compartes la
      infraestructura. Ideal cuando tu web recibe +1.000 visitas diarias o manejas datos sensibles.{' '}
      <strong>Precio en Chile:</strong> a consultar.
    </p>
    <GuideNote>
      <p>
        <strong>Caso real:</strong> Migré la tienda de un cliente de hosting compartido a VPS cuando llegó a 50 pedidos
        diarios. Los tiempos de carga bajaron de 4,2 a 1,8 segundos. Las ventas subieron 23&nbsp;%.
      </p>
    </GuideNote>
    <ProsCons
      pros={['Mayor rendimiento', 'Recursos garantizados']}
      cons={['Conocimientos técnicos']}
      consLabel="A considerar"
    />

    <h3>Hosting WordPress</h3>
    <p>
      Servidores optimizados específicamente para WordPress, con características como caché preconfigurada,
      actualizaciones automáticas y medidas de seguridad específicas.
    </p>
    <ProsCons pros={['Optimizado para WP', 'Fácil de usar']} cons={['Menos flexible']} consLabel="A considerar" />

    <h3>Servidor dedicado</h3>
    <p>
      Un servidor físico completo exclusivo para tu proyecto. Máximo rendimiento y control total sobre la configuración
      y recursos. Ideal para proyectos grandes con alto tráfico.
    </p>
    <ProsCons pros={['Máximo rendimiento', 'Control total']} cons={['Precio elevado']} consLabel="A considerar" />
  </>
);

export const FactoresClave: React.FC = () => (
  <>
    <H2 id="factores-clave">
      2. Los 6 factores que <em>sí</em> importan (y los 3 que te van a estafar)
    </H2>

    <GuideNote tone="caution" title="Cuidado con los hosting amateur en Chile">
      <p>
        Muchos hosting en Chile son servidores amateur sin respaldo técnico real. Antes de contratar, revisa{' '}
        <strong>reclamos.cl</strong> para ver denuncias reales. Asegúrate de que tengan número fijo, dirección física
        donde dirigirse y soporte técnico 24/7. Si solo tienen WhatsApp o email, huye. Cuando tu sitio se caiga a las 3
        AM, vas a agradecer haber elegido profesionales.
      </p>
    </GuideNote>

    <h3>Factor #1: velocidad (el más importante)</h3>
    <p>
      En Chile, si tu web demora más de 3 segundos en cargar, pierdes el 53&nbsp;% de los visitantes. Google también te
      castiga en búsquedas. Punto no negociable: servidores en Chile o máximo en Brasil.
    </p>
    <GuideNote>
      <p>
        <strong>Test real:</strong> Probé el mismo sitio en 5 hostings chilenos. El ganador cargó en 1,2 segundos, el
        peor en 7,8 segundos. ¿Adivinas cuál vendía más?
      </p>
    </GuideNote>

    <h3>Factor #2: uptime real (no prometido)</h3>
    <p>
      Todos prometen 99,9&nbsp;% de uptime, pero la realidad es otra. He monitoreado hosting chilenos durante 2 años.
      Solo 4 de 15 cumplieron realmente esa promesa.
    </p>
    <GuideNote tone="tip">
      <p>
        <strong>Tip de experto:</strong> Pide referencias de clientes reales y revisa StatusPage o similares. Si no
        tienen página de estado público, desconfía.
      </p>
    </GuideNote>

    <h3>Seguridad</h3>
    <p>
      Certificados SSL incluidos, firewalls, protección contra malware, DDoS y backups automáticos son características
      de seguridad esenciales.
    </p>

    <h3>Factor #3: soporte humano (no bots)</h3>
    <p>
      A las 2 AM del domingo se cayó el sitio de un cliente. Necesitaba soporte REAL, no un chatbot que me dice
      «reinicia tu modem». El hosting que respondió en 15 minutos se ganó mi lealtad para siempre.
    </p>
    <GuideNote tone="tip">
      <p>
        <strong>Test que siempre hago:</strong> Antes de contratar, escribo al chat preguntando algo técnico a las 11
        PM. Si responde un humano en menos de 30 minutos, es buena señal.
      </p>
    </GuideNote>

    <h3>Escalabilidad</h3>
    <p>
      Tu hosting debe poder crecer con tu proyecto. Verifica la facilidad para actualizar planes o migrar a servidores
      más potentes cuando sea necesario.
    </p>

    <h3>Precio y relación calidad/precio</h3>
    <p>
      Compara no solo el precio inicial sino también las renovaciones. El hosting más barato no siempre es la mejor
      opción a largo plazo.
    </p>
  </>
);
