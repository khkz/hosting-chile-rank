
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <svg
      className={className}
      width="250"
      height="250"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cloud Shape */}
      <path 
        d="M250 180C295 180 330 210 340 250C380 250 400 280 400 310C400 340 380 370 340 370H160C120 370 100 340 100 310C100 280 120 250 160 250C170 210 205 180 250 180Z" 
        fill="#F13E42" 
      />
      
      {/* Text EligeTuHosting */}
      <path 
        d="M55 345V285H145V300H75V305H135V320H75V330H145V345H55Z" 
        fill="#1E2A3B" 
      />
      <path 
        d="M155 345V285H175V330H225V345H155Z" 
        fill="#1E2A3B" 
      />
      <path 
        d="M235 345V285H255V305H275C290 305 300 315 300 325C300 335 290 345 275 345H235ZM255 330H270C280 330 280 320 280 325C280 320 280 320 270 320H255V330Z" 
        fill="#1E2A3B" 
      />
      <path 
        d="M310 345V285H330V305H350V285H370V345H350V320H330V345H310Z" 
        fill="#1E2A3B" 
      />
      <path 
        d="M380 345V285H430C450 285 455 300 455 305C455 315 450 320 440 325C450 325 455 330 455 335V345H435V335C435 330 430 330 425 330H400V345H380ZM400 315H425C430 315 435 315 435 310C435 305 430 300 425 300H400V315Z" 
        fill="#1E2A3B" 
      />
    </svg>
  );
};

export default Logo;
