
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'favicon';
}

const Logo: React.FC<LogoProps> = ({ className = "", variant = 'full' }) => {
  const baseSize = variant === 'favicon' ? 32 : variant === 'icon' ? 40 : 200;
  
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
        {/* Modern vibrant gradients */}
        <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="30%" stopColor="#EF233C" />
          <stop offset="70%" stopColor="#FF4757" />
          <stop offset="100%" stopColor="#FF3742" />
        </linearGradient>
        
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ECDC4" />
          <stop offset="50%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#0099CC" />
        </linearGradient>
        
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        
        {/* Glow effect */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Soft shadow */}
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.1"/>
        </filter>
      </defs>
      
      {/* Modern circular background with gradient */}
      <circle 
        cx="100" 
        cy="100" 
        r="90" 
        fill="url(#bgGrad)" 
        filter="url(#softShadow)"
      />
      
      {/* Inner circle for depth */}
      <circle 
        cx="100" 
        cy="100" 
        r="75" 
        fill="rgba(255,255,255,0.1)" 
        stroke="rgba(255,255,255,0.2)" 
        strokeWidth="1"
      />
      
      {/* Main "E" letter - modern and bold */}
      <g transform="translate(100, 100)">
        {/* E letter with modern styling */}
        <path
          d="M-25 -35 L-25 35 L20 35 L20 25 L-15 25 L-15 5 L15 5 L15 -5 L-15 -5 L-15 -25 L20 -25 L20 -35 Z"
          fill="url(#primaryGrad)"
          filter="url(#glow)"
        />
        
        {/* Tech accent elements */}
        <circle cx="25" cy="-25" r="6" fill="url(#accentGrad)" />
        <circle cx="25" cy="0" r="4" fill="url(#accentGrad)" opacity="0.8" />
        <circle cx="25" cy="25" r="6" fill="url(#accentGrad)" />
        
        {/* Connection lines for tech feel */}
        <line x1="20" y1="-25" x2="19" y2="-25" stroke="url(#accentGrad)" strokeWidth="2" opacity="0.6" />
        <line x1="20" y1="0" x2="21" y2="0" stroke="url(#accentGrad)" strokeWidth="2" opacity="0.6" />
        <line x1="20" y1="25" x2="19" y2="25" stroke="url(#accentGrad)" strokeWidth="2" opacity="0.6" />
        
        {/* For full variant, add text */}
        {variant === 'full' && (
          <g>
            <text 
              x="0" 
              y="55" 
              textAnchor="middle" 
              fill="url(#primaryGrad)" 
              fontSize="14" 
              fontWeight="700" 
              fontFamily="Montserrat, sans-serif"
              letterSpacing="1px"
            >
              ELIGE TU HOSTING
            </text>
          </g>
        )}
        
        {/* Simplified version for favicon */}
        {variant === 'favicon' && (
          <>
            {/* Simplified E for favicon */}
            <rect x="-15" y="-20" width="25" height="6" rx="2" fill="white" />
            <rect x="-15" y="-3" width="20" height="6" rx="2" fill="white" />
            <rect x="-15" y="14" width="25" height="6" rx="2" fill="white" />
            <rect x="-15" y="-20" width="6" height="40" rx="2" fill="white" />
          </>
        )}
      </g>
      
      {/* Outer glow ring */}
      <circle 
        cx="100" 
        cy="100" 
        r="90" 
        fill="none" 
        stroke="url(#accentGrad)" 
        strokeWidth="2" 
        opacity="0.3"
      />
      
      {/* Subtle highlight */}
      <circle 
        cx="100" 
        cy="100" 
        r="80" 
        fill="none" 
        stroke="rgba(255,255,255,0.4)" 
        strokeWidth="1" 
        opacity="0.6"
      />
    </svg>
  );
};

export default Logo;
