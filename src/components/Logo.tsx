
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
    </svg>
  );
};

export default Logo;
