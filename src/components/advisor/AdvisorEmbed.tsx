import { MessageCircle } from 'lucide-react';
import AdvisorChat from './AdvisorChat';
import { useEdition } from '@/hooks/useEdition';

/**
 * Asesor con IA incrustado en las portadas de país. Comparte la conversación
 * con el botón flotante: es el mismo asesor, con el mismo nombre.
 */
const AdvisorEmbed = () => {
  const { label } = useEdition();
  return (
    <section
      aria-labelledby="asesor-incrustado"
      className="my-10 overflow-hidden rounded-xl border border-rule bg-white"
    >
      <div className="flex items-start gap-3 border-b border-rule bg-paper px-5 py-4">
        <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-ink-2" aria-hidden />
        <div>
          <h2 id="asesor-incrustado" className="t-h3 text-ink">
            Asesor con IA
          </h2>
          <p className="t-small mt-0.5 text-ink-2">Te ayuda a elegir hosting en {label} en 3 o 4 preguntas.</p>
        </div>
      </div>
      <div className="p-5">
        <AdvisorChat variant="embed" />
      </div>
    </section>
  );
};

export default AdvisorEmbed;
