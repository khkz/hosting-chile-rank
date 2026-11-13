import React from 'react';

interface LogoProps {
  className?: string;
  /** Se mantienen por compatibilidad; todas dibujan la marca vigente. */
  variant?: 'full' | 'icon' | 'favicon' | 'option-a' | 'option-b';
  darkBackground?: boolean;
  /** Edición que acompaña a la marca: "Chile", "Perú", "Latinoamérica"… */
  edition?: string;
}

/**
 * Marca: una "E" formada por tres filas de ranking; la fila superior, la del
 * primer puesto, en rojo. El nombre va en Archivo expandido.
 */
export const LogoMark: React.FC<{ size?: number; className?: string; onDark?: boolean }> = ({ size = 28, className = '', onDark = false }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={`shrink-0 ${className}`} aria-hidden>
    <rect width="32" height="32" rx="7" fill={onDark ? '#1B3150' : '#0F2238'} />
    <rect x="8" y="8" width="3.4" height="16" rx="1" fill="#FFFFFF" />
    <rect x="8" y="8" width="16" height="3.4" rx="1" fill="#FF4D61" />
    <rect x="8" y="14.3" width="11" height="3.4" rx="1" fill="#FFFFFF" />
    <rect x="8" y="20.6" width="15" height="3.4" rx="1" fill="#FFFFFF" />
  </svg>
);

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full', darkBackground = false, edition }) => {
  if (variant === 'icon' || variant === 'favicon') {
    return <LogoMark className={className} />;
  }
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={30} onDark={darkBackground} />
      <span className="flex items-baseline gap-2.5 leading-none">
        <span
          className={`text-[19px] font-extrabold tracking-[-0.02em] ${darkBackground ? 'text-white' : 'text-ink'}`}
          style={{ fontStretch: '112%' }}
        >
          EligeTuHosting
        </span>
        {edition && (
          <span
            className={`hidden sm:inline border-l pl-2.5 text-sm font-medium ${
              darkBackground ? 'border-white/25 text-white/75' : 'border-rule text-ink-2'
            }`}
          >
            {edition}
          </span>
        )}
      </span>
    </span>
  );
};

export default Logo;
