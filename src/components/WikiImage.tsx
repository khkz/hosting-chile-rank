import React from 'react';

interface WikiImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

const WikiImage: React.FC<WikiImageProps> = ({ 
  src, 
  alt, 
  caption, 
  className = "" 
}) => {
  return (
    <figure className={`my-8 ${className}`}>
      <div className="rounded-lg overflow-hidden border border-border bg-card">
        <img 
          src={src}
          alt={alt}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-muted-foreground mt-3 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default WikiImage;