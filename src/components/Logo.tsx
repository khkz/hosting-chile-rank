
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'favicon';
}

const Logo: React.FC<LogoProps> = ({ className = "", variant = 'full' }) => {
  const baseSize = variant === 'favicon' ? 32 : variant === 'icon' ? 40 : 250;
  
  return (
    <svg
      className={className}
      width={baseSize}
      height={baseSize}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradientes modernos */}
        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF233C" />
          <stop offset="50%" stopColor="#FF4757" />
          <stop offset="100%" stopColor="#C53030" />
        </linearGradient>
        
        <linearGradient id="secondaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2B2D42" />
          <stop offset="100%" stopColor="#3A3D5C" />
        </linearGradient>
        
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#0099CC" />
        </linearGradient>
        
        {/* Sombra para profundidad */}
        <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
          <feOffset dx="2" dy="2" result="offset"/>
          <feFlood floodColor="#00000040"/>
          <feComposite in="SourceGraphic" in2="offset" operator="over"/>
        </filter>
      </defs>
      
      {/* Círculo de fondo con gradiente */}
      <circle cx="100" cy="100" r="85" fill="url(#secondaryGradient)" filter="url(#dropshadow)" />
      
      {/* Elementos de servidor/hosting */}
      <g transform="translate(100, 100)">
        {/* Servidor principal */}
        <rect x="-35" y="-25" width="70" height="50" rx="8" fill="url(#primaryGradient)" />
        
        {/* Líneas de conexión/datos */}
        <rect x="-30" y="-15" width="60" height="3" rx="1.5" fill="white" opacity="0.9" />
        <rect x="-30" y="-8" width="45" height="3" rx="1.5" fill="white" opacity="0.7" />
        <rect x="-30" y="-1" width="50" height="3" rx="1.5" fill="white" opacity="0.8" />
        <rect x="-30" y="6" width="35" height="3" rx="1.5" fill="white" opacity="0.6" />
        <rect x="-30" y="13" width="55" height="3" rx="1.5" fill="white" opacity="0.8" />
        
        {/* Indicador de estado activo */}
        <circle cx="25" cy="-15" r="4" fill="url(#accentGradient)" />
        <circle cx="25" cy="-15" r="2" fill="white" />
        
        {/* Elementos de conectividad */}
        <g opacity="0.8">
          {/* Nodos de conexión */}
          <circle cx="-50" cy="40" r="8" fill="url(#accentGradient)" />
          <circle cx="0" cy="50" r="8" fill="url(#accentGradient)" />
          <circle cx="50" cy="40" r="8" fill="url(#accentGradient)" />
          
          {/* Líneas de conexión */}
          <line x1="-42" y1="32" x2="-8" y2="42" stroke="url(#accentGradient)" strokeWidth="2" opacity="0.6" />
          <line x1="8" y1="42" x2="42" y2="32" stroke="url(#accentGradient)" strokeWidth="2" opacity="0.6" />
          <line x1="0" y1="25" x2="0" y2="42" stroke="url(#accentGradient)" strokeWidth="2" opacity="0.6" />
        </g>
        
        {/* Texto "E" estilizado para versión icon */}
        {variant === 'icon' && (
          <text x="0" y="8" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold" fontFamily="Montserrat">
            E
          </text>
        )}
      </g>
      
      {/* Efectos de brillo */}
      <circle cx="100" cy="100" r="85" fill="none" stroke="url(#accentGradient)" strokeWidth="2" opacity="0.3" />
      <circle cx="100" cy="100" r="75" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
    </svg>
  );
};

export default Logo;
