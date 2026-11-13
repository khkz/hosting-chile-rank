import { Sparkles } from 'lucide-react';
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
      className="my-10 overflow-hidden rounded-xl border border-ink/10 bg-white"
    >
      <div className="flex items-start gap-3 border-b border-rule bg-paper px-5 py-4">
        <Sparkles className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden />
        <div>
          <h2 id="asesor-incrustado" className="text-xl font-bold text-ink">
            Asesor con IA
          </h2>
          <p className="text-sm text-ink-2">Te ayuda a elegir hosting en {label} en 3 o 4 preguntas.</p>
        </div>
      </div>
      <div className="p-5">
        <AdvisorChat variant="embed" />
      </div>
    </section>
  );
};

export default AdvisorEmbed;
