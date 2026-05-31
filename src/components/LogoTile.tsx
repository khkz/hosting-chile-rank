import React, { useState } from 'react';

interface LogoTileProps {
  name: string;
  logoUrl?: string | null;
  className?: string;
  imgClassName?: string;
  /** Pixel height of the logo image inside the tile. Defaults to 48. */
  maxLogoHeight?: number;
}

/**
 * Renders a logo image inside a fixed-size tile.
 * If the image is missing or fails to load, shows the company name as text fallback.
 * Keeps every tile visually uniform across the page.
 */
const LogoTile: React.FC<LogoTileProps> = ({
  name,
  logoUrl,
  className = '',
  imgClassName = '',
  maxLogoHeight = 48,
}) => {
  const [errored, setErrored] = useState(false);
  const showText = !logoUrl || errored;

  return (
    <div
      className={`flex items-center justify-center bg-white rounded-md px-4 ${className}`}
    >
      {showText ? (
        <span className="text-base md:text-lg font-semibold text-[#2B2D42] text-center leading-tight">
          {name}
        </span>
      ) : (
        <img
          src={logoUrl as string}
          alt={`Logo de ${name}`}
          loading="lazy"
          onError={() => setErrored(true)}
          style={{ maxHeight: maxLogoHeight }}
          className={`w-auto max-w-full object-contain ${imgClassName}`}
        />
      )}
    </div>
  );
};

export default LogoTile;
