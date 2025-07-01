
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'favicon' | 'option-a' | 'option-b';
}

const Logo: React.FC<LogoProps> = ({ className = "", variant = 'option-a' }) => {
  // Opción A: Checkmark integrado
  if (variant === 'option-a' || variant === 'full') {
    return (
      <svg
        className={className}
        width="200"
        height="40"
        viewBox="0 0 200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2B2D42" />
            <stop offset="100%" stopColor="#1a1c2e" />
          </linearGradient>
          
          <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#388E3C" />
          </linearGradient>
        </defs>
        
        {/* Texto principal */}
        <text 
          x="5" 
          y="28" 
          fill="url(#textGrad)" 
          fontSize="20" 
          fontWeight="700" 
          fontFamily="Montserrat, sans-serif"
          letterSpacing="0.5px"
        >
          EligeTuHosting
        </text>
        
        {/* Checkmark sutil integrado en la "i" */}
        <circle cx="97" cy="12" r="6" fill="url(#checkGrad)" opacity="0.9" />
        <path
          d="M94 12 L96 14 L100 10"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Punto original de la "i" oculto, reemplazado por checkmark */}
      </svg>
    );
  }
  
  // Opción B: Shield minimalista
  if (variant === 'option-b') {
    return (
      <svg
        className={className}
        width="200"
        height="40"
        viewBox="0 0 200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="textGradB" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2B2D42" />
            <stop offset="100%" stopColor="#1a1c2e" />
          </linearGradient>
          
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1976D2" />
            <stop offset="100%" stopColor="#1565C0" />
          </linearGradient>
        </defs>
        
        {/* Shield minimalista integrado en la "E" */}
        <path
          d="M8 8 L8 32 L20 32 L20 27 L13 27 L13 22 L19 22 L19 18 L13 18 L13 13 L20 13 L20 8 Z"
          fill="url(#textGradB)"
        />
        
        {/* Shield sutil en la esquina superior de la E */}
        <path
          d="M6 6 Q6 4 8 4 Q10 4 10 6 L10 10 Q8 12 6 10 Z"
          fill="url(#shieldGrad)"
          opacity="0.8"
        />
        
        {/* Resto del texto */}
        <text 
          x="25" 
          y="28" 
          fill="url(#textGradB)" 
          fontSize="20" 
          fontWeight="700" 
          fontFamily="Montserrat, sans-serif"
          letterSpacing="0.5px"
        >
          ligeTuHosting
        </text>
      </svg>
    );
  }
  
  // Versión para favicon
  if (variant === 'favicon') {
    return (
      <svg
        className={className}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="6" fill="#2B2D42"/>
        <rect x="8" y="8" width="16" height="3" rx="1" fill="white"/>
        <rect x="8" y="14" width="12" height="3" rx="1" fill="white"/>
        <rect x="8" y="20" width="16" height="3" rx="1" fill="white"/>
        <rect x="8" y="8" width="3" height="15" rx="1" fill="white"/>
        <circle cx="26" cy="10" r="3" fill="#4CAF50"/>
        <path d="M24.5 10 L25.5 11 L27.5 9" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  
  // Versión solo icono
  if (variant === 'icon') {
    return (
      <svg
        className={className}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="8" fill="#2B2D42"/>
        <rect x="10" y="10" width="20" height="4" rx="2" fill="white"/>
        <rect x="10" y="18" width="15" height="4" rx="2" fill="white"/>
        <rect x="10" y="26" width="20" height="4" rx="2" fill="white"/>
        <rect x="10" y="10" width="4" height="20" rx="2" fill="white"/>
        <circle cx="32" cy="12" r="4" fill="#4CAF50"/>
        <path d="M30 12 L31.5 13.5 L34 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  
  // Default fallback
  return (
    <svg
      className={className}
      width="200"
      height="40"
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text 
        x="5" 
        y="28" 
        fill="#2B2D42" 
        fontSize="20" 
        fontWeight="700" 
        fontFamily="Montserrat, sans-serif"
      >
        EligeTuHosting
      </text>
    </svg>
  );
};

export default Logo;
