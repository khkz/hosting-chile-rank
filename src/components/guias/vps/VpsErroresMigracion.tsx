import React from 'react';
import { H2, GuideNote, MarkList, MarkItem } from '../GuideBlocks';

const ERRORES: { titulo: string; error: string; consecuencia: React.ReactNode }[] = [
  {
    titulo: 'Error #1: elegir VPS por precio sin ver ubicación',
    error: 'Contratar VPS «chileno» que está en Brasil o Argentina para ahorrar unos pesos.',
    consecuencia: <>+100&nbsp;ms latencia = usuarios abandonan la web. Perdiste más en ventas que ahorraste.</>,
  },
  {
    titulo: 'Error #2: migrar sin backup completo',
    error: '«El proveedor me dijo que ellos hacen el backup» y confiar 100 %.',
    consecuencia: 'Se perdieron 2 años de contenido de un blog. Costo de recuperación: muy alto.',
  },
  {
    titulo: 'Error #3: no configurar SSL correctamente',
    error: 'Migrar a VPS y dejar SSL «para después» o configurar mal.',
    consecuencia: <>Google penaliza la web, tráfico −67&nbsp;% en 1 mes. Dolor.</>,
  },
  {
    titulo: 'Error #4: sobredimensionar el VPS inicial',
    error: '«Por si acaso» contratar VPS de 8 GB RAM cuando necesitas 2 GB.',
    consecuencia: 'Pagas de más cada mes durante 2 años.',
  },
];

const FASES: { titulo: string; pasos: string[] }[] = [
  {
    titulo: 'Fase 1: preparación (1 semana antes)',
    pasos: [
      'Hacer backup completo (archivos + base de datos)',
      'Anotar todas las configuraciones especiales',
      'Revisar qué plugins/extensiones usas',
      'Contratar el VPS y configurar accesos',
      'Informar a usuarios que habrá mantenimiento',
    ],
  },
  {
    titulo: 'Fase 2: migración (día D)',
    pasos: [
      'Subir archivos al VPS vía FTP/SSH',
      'Importar base de datos',
      'Configurar DNS para apuntar al nuevo servidor',
      "Instalar SSL (Let's Encrypt o certificado)",
      'Probar todas las funcionalidades críticas',
    ],
  },
  {
    titulo: 'Fase 3: verificación (primeras 48 horas)',
    pasos: [
      'Monitorear uptime y velocidad',
      'Revisar logs de errores',
      'Confirmar que emails funcionan',
      'Verificar formularios y transacciones',
      'Cancelar hosting anterior (solo después de 1 semana)',
    ],
  },
];

/** Guía VPS: errores caros, migración por fases y consejo final. */
const VpsErroresMigracion: React.FC = () => (
  <>
    <H2 id="errores-comunes">3. Los 4 errores más caros que debes evitar</H2>
    {ERRORES.map((e) => (
      <React.Fragment key={e.titulo}>
        <h3>{e.titulo}</h3>
        <p>
          <strong>El error:</strong> {e.error}
        </p>
        <p>
          <strong>Consecuencia real:</strong> {e.consecuencia}
        </p>
      </React.Fragment>
    ))}

    <H2 id="migracion-paso-a-paso">4. Migración paso a paso (checklist de 15 puntos)</H2>
    <GuideNote>
      <p>
        <strong>Tiempo estimado:</strong> 2–4 horas para migración básica. Si es tu primera vez, reserva un fin de
        semana completo por si algo sale mal.
      </p>
    </GuideNote>
    {FASES.map((f) => (
      <React.Fragment key={f.titulo}>
        <h3>{f.titulo}</h3>
        <MarkList>
          {f.pasos.map((p) => (
            <MarkItem key={p}>{p}</MarkItem>
          ))}
        </MarkList>
      </React.Fragment>
    ))}

    <H2 id="consejo-final">Mi consejo final</H2>
    <p>
      VPS no es upgrade automático. Si tu hosting compartido funciona bien, quédate ahí. Pero si ya sientes las
      limitaciones (lentitud, caídas, necesitas más control), VPS es el salto natural antes de servidor dedicado.
    </p>
    <p>
      <strong>Regla de oro:</strong> Empieza con el VPS más básico del proveedor que elijas. Siempre puedes subir
      recursos, pero bajar el plan es más complicado.
    </p>
    <GuideNote tone="tip">
      <p>
        <strong>Tip profesional:</strong> Antes de migrar, haz un backup completo y planifica la migración un fin de
        semana. Murphy siempre ataca en el peor momento.
      </p>
    </GuideNote>
  </>
);

export default VpsErroresMigracion;
