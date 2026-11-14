import React from 'react';
import { Link } from 'react-router-dom';
import { H2, GuideNote } from '../GuideBlocks';

const Senal: React.FC<{ titulo: string; sintoma: React.ReactNode; solucion: string; caso: React.ReactNode }> = ({
  titulo,
  sintoma,
  solucion,
  caso,
}) => (
  <>
    <h3>{titulo}</h3>
    <p>
      <strong>Síntoma:</strong> {sintoma}
    </p>
    <p>
      <strong>Solución VPS:</strong> {solucion}
    </p>
    <GuideNote>
      <p>
        <strong>Caso real:</strong> {caso}
      </p>
    </GuideNote>
  </>
);

/** Guía VPS: la lección, las 5 señales y cuándo no hace falta un VPS. */
const VpsSenales: React.FC = () => (
  <>
    <H2 id="experiencia">4 años después: la lección más cara que aprendí</H2>
    <p>
      En 2021 migré a un restaurante a un VPS «premium» sobredimensionado. En 3 meses quebró.{' '}
      <strong>No porque el VPS fuera malo, sino porque no necesitaba VPS.</strong> Con su tráfico real (150 visitas
      diarias), un hosting compartido le sobraba.
    </p>
    <p>
      <strong>Lección brutal:</strong> VPS no es sinónimo de éxito. Es una herramienta cara para problemas específicos.
      Si no tienes el problema, no necesitas la herramienta.
    </p>

    <H2 id="senales-vps">
      1. Las 5 señales de que <em>sí</em> necesitas VPS (basado en 180 casos reales)
    </H2>
    <Senal
      titulo="Señal #1: tu web se cae con más de 100 usuarios simultáneos"
      sintoma="Error 508, página no carga, usuarios reportan «no funciona» en horarios peak."
      solucion="Recursos garantizados que nadie más puede usar, sin importar cuántos usuarios tengas."
      caso="Clínica Dental Providencia: 50 reservas diarias, se caía cada lunes en la mañana. Un VPS básico = problema resuelto hace 8 meses."
    />
    <Senal
      titulo="Señal #2: necesitas instalar software específico"
      sintoma="Tu desarrollador dice «necesitamos Node.js 18», «hay que instalar Redis», «requiere Python 3.11»."
      solucion="Control total del servidor, instalas lo que quieras cuando quieras."
      caso="Ferretería Industrial Maipú: sistema de inventario personalizado con base de datos especial. En hosting compartido = imposible. En VPS = funcionando 24/7 desde hace 2 años."
    />
    <Senal
      titulo="Señal #3: tu web carga lento (más de 3 segundos)"
      sintoma="Google PageSpeed bajo 70, usuarios se quejan de lentitud, conversiones bajando."
      solucion="CPU y RAM dedicados = velocidad constante, sin competir por recursos."
      caso={<>Fintech Santiago: app tardaba 8 segundos en cargar dashboard. Un VPS adecuado = tiempo de carga bajo 1 segundo, conversiones +34&nbsp;%.</>}
    />
    <Senal
      titulo="Señal #4: manejas transacciones o datos sensibles"
      sintoma="E-commerce, sistema de pagos, datos de clientes, información médica/legal."
      solucion="Aislamiento completo + posibilidad de configurar seguridad personalizada."
      caso="Tienda Ropa Online Las Condes: 200 pedidos diarios, datos de tarjetas. VPS con SSL personalizado = 0 problemas de seguridad en 18 meses."
    />
    <Senal
      titulo="Señal #5: tu negocio depende 100&nbsp;% de la web"
      sintoma="Si tu web se cae, pierdes dinero inmediatamente. No tienes tienda física de respaldo."
      solucion="Uptime superior + control total para resolver problemas rápido."
      caso={
        <>
          Consultora Marketing Digital: 100&nbsp;% ingresos online. Una caída de 2 horas representa una pérdida material
          grande. La elección de VPS premium debe ir acompañada de un proveedor con uptime verificable (ver{' '}
          <Link to="/benchmark">/benchmark</Link>).
        </>
      }
    />

    <GuideNote tone="caution" title="Cuándo no necesitas VPS">
      <ul>
        <li>Web personal o blog con menos de 500 visitas diarias</li>
        <li>Sitio corporativo básico (solo información, sin funcionalidades)</li>
        <li>Proyecto en fase de prototipo o testeo</li>
        <li>Presupuesto acotado para hosting</li>
      </ul>
    </GuideNote>
  </>
);

export default VpsSenales;
