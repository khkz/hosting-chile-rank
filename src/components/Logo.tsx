
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
        {/* Warm and friendly gradients */}
        <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="30%" stopColor="#FF8E53" />
          <stop offset="70%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#FF5722" />
        </linearGradient>
        
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB74D" />
          <stop offset="50%" stopColor="#FFA726" />
          <stop offset="100%" stopColor="#FF9800" />
        </linearGradient>
        
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="50%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
        
        <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#FFEB3B" />
        </linearGradient>
        
        {/* Soft glow effect */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Soft shadow */}
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.15"/>
        </filter>
      </defs>
      
      {/* Friendly circular background */}
      <circle 
        cx="100" 
        cy="100" 
        r="90" 
        fill="url(#bgGrad)" 
        filter="url(#softShadow)"
      />
      
      {/* Inner glow circle */}
      <circle 
        cx="100" 
        cy="100" 
        r="75" 
        fill="rgba(255,255,255,0.15)" 
        stroke="rgba(255,255,255,0.3)" 
        strokeWidth="1"
      />
      
      {/* Main content container */}
      <g transform="translate(100, 100)">
        {/* Smiley face circle background */}
        <circle 
          cx="-35" 
          cy="-10" 
          r="25" 
          fill="url(#faceGrad)" 
          stroke="url(#accentGrad)" 
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Left eye (normal) */}
        <circle cx="-43" cy="-18" r="3" fill="#333" />
        
        {/* Right eye (wink) - curved line */}
        <path
          d="M-30 -18 Q-27 -21 -24 -18"
          stroke="#333"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Smile */}
        <path
          d="M-45 -5 Q-35 5 -25 -5"
          stroke="#333"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Small blush on cheeks */}
        <ellipse cx="-47" cy="-8" rx="3" ry="2" fill="#FF8A80" opacity="0.6" />
        <ellipse cx="-23" cy="-8" rx="3" ry="2" fill="#FF8A80" opacity="0.6" />
        
        {/* Modern "E" letter */}
        <path
          d="M-5 -35 L-5 35 L35 35 L35 25 L5 25 L5 5 L30 5 L30 -5 L5 -5 L5 -25 L35 -25 L35 -35 Z"
          fill="url(#primaryGrad)"
          filter="url(#glow)"
        />
        
        {/* Friendly accent dots */}
        <circle cx="40" cy="-25" r="4" fill="url(#accentGrad)" opacity="0.9" />
        <circle cx="40" cy="0" r="3" fill="url(#accentGrad)" opacity="0.7" />
        <circle cx="40" cy="25" r="4" fill="url(#accentGrad)" opacity="0.9" />
        
        {/* Connection elements */}
        <path d="M35 -25 Q37 -25 40 -25" stroke="url(#accentGrad)" strokeWidth="2" opacity="0.6" />
        <path d="M35 0 Q37 0 40 0" stroke="url(#accentGrad)" strokeWidth="2" opacity="0.6" />
        <path d="M35 25 Q37 25 40 25" stroke="url(#accentGrad)" strokeWidth="2" opacity="0.6" />
        
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
            {/* Simple smiley */}
            <circle cx="-35" cy="-10" r="15" fill="#FFEB3B" />
            <circle cx="-40" cy="-15" r="2" fill="#333" />
            <path d="M-33 -15 Q-30 -18 -27 -15" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M-42 -5 Q-35 0 -28 -5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            
            {/* Simple E */}
            <rect x="-5" y="-15" width="20" height="4" rx="1" fill="white" />
            <rect x="-5" y="-2" width="15" height="4" rx="1" fill="white" />
            <rect x="-5" y="11" width="20" height="4" rx="1" fill="white" />
            <rect x="-5" y="-15" width="4" height="30" rx="1" fill="white" />
          </>
        )}
      </g>
      
      {/* Outer friendly glow ring */}
      <circle 
        cx="100" 
        cy="100" 
        r="90" 
        fill="none" 
        stroke="url(#accentGrad)" 
        strokeWidth="2" 
        opacity="0.4"
      />
      
      {/* Inner highlight for depth */}
      <circle 
        cx="100" 
        cy="100" 
        r="80" 
        fill="none" 
        stroke="rgba(255,255,255,0.5)" 
        strokeWidth="1" 
        opacity="0.7"
      />
    </svg>
  );
};

export default Logo;
