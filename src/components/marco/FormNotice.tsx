import React from 'react';

export type FormNoticeStatus = { kind: 'error' | 'success'; text: string } | null;

/**
 * Aviso bajo un formulario: el error con su causa y el paso siguiente
 * (role="alert") o la confirmación (role="status"). Mismo estilo que
 * Callout «caution»: fondo papel y regla de tinta, sin rojo ni verde.
 */
const FormNotice: React.FC<{ status: FormNoticeStatus; className?: string }> = ({ status, className = '' }) =>
  status ? (
    <p
      role={status.kind === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border border-rule border-l-4 border-l-ink bg-paper px-3 py-2.5 text-[15px] leading-snug text-ink ${className}`}
    >
      {status.text}
    </p>
  ) : null;

export default FormNotice;
