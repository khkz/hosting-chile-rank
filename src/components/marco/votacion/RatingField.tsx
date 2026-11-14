import { useId } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RatingFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  /** Id de la ayuda común «1 es muy malo y 5, excelente». */
  helpId: string;
}

/**
 * Escala 1–5 de la votación. Cada número es un radio real (oculto) con su
 * etiqueta visible de 44 px; al llegar con Tab o moverse con las flechas, el
 * número enfocado muestra el anillo de foco. El grupo se nombra con su rótulo
 * y se describe con la ayuda común y, si lo hay, con el error.
 */
function RatingField<T extends FieldValues>({ control, name, label, helpId }: RatingFieldProps<T>) {
  const baseId = useId();
  const labelId = `${baseId}-rotulo`;
  const errorId = `${baseId}-error`;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <p id={labelId} className="text-sm font-medium text-ink">
            {label}
          </p>
          <RadioGroup
            value={field.value ?? ''}
            onValueChange={field.onChange}
            aria-labelledby={labelId}
            aria-describedby={fieldState.error ? `${helpId} ${errorId}` : helpId}
            aria-required
            aria-invalid={fieldState.error ? true : undefined}
            className="flex flex-wrap gap-2"
          >
            {[1, 2, 3, 4, 5].map((v) => {
              const id = `${baseId}-${v}`;
              const checked = field.value === String(v);
              return (
                <div key={v} className="relative">
                  <RadioGroupItem id={id} value={String(v)} className="peer sr-only" />
                  <label
                    htmlFor={id}
                    className={`tabular flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border text-[15px] font-semibold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 ${
                      checked ? 'border-ink bg-ink text-white' : 'border-input bg-white text-ink hover:border-ink hover:bg-paper'
                    }`}
                  >
                    {v}
                  </label>
                </div>
              );
            })}
          </RadioGroup>
          {fieldState.error?.message && (
            <p id={errorId} className="text-sm font-medium text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

export default RatingField;
