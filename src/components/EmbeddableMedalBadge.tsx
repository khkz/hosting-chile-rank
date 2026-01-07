import { cn } from "@/lib/utils";

interface EmbeddableMedalBadgeProps {
  position: number;
  categoryName: string;
  categoryIcon?: string;
  companyName: string;
  year?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const getMedalImage = (position: number) => {
  const timestamp = '?v=2';
  switch (position) {
    case 1: return `/badges/medal-gold.png${timestamp}`;
    case 2: return `/badges/medal-silver.png${timestamp}`;
    case 3: return `/badges/medal-bronze.png${timestamp}`;
    default: return `/badges/medal-blue.png${timestamp}`;
  }
};

const sizeConfig = {
  small: { 
    container: 'w-40', 
    medal: 'w-28 h-28',
    position: 'text-2xl', 
    category: 'text-xs', 
    year: 'text-xs',
    company: 'text-sm',
    footer: 'text-[10px]'
  },
  medium: { 
    container: 'w-56', 
    medal: 'w-40 h-40',
    position: 'text-4xl', 
    category: 'text-sm', 
    year: 'text-sm',
    company: 'text-lg',
    footer: 'text-xs'
  },
  large: { 
    container: 'w-72', 
    medal: 'w-52 h-52',
    position: 'text-6xl', 
    category: 'text-base', 
    year: 'text-base',
    company: 'text-2xl',
    footer: 'text-sm'
  }
};

const EmbeddableMedalBadge = ({ 
  position, 
  categoryName, 
  categoryIcon = '🏆',
  companyName,
  year = '2026',
  size = 'medium',
  className 
}: EmbeddableMedalBadgeProps) => {
  const medalImage = getMedalImage(position);
  const config = sizeConfig[size];

  return (
    <div className={cn(
      "inline-flex flex-col items-center justify-center gap-3 p-4 bg-background rounded-lg border-2 border-border shadow-lg",
      config.container,
      className
    )}>
      {/* Medal with text overlay */}
      <div className="relative inline-flex items-center justify-center">
        <img 
          src={medalImage} 
          alt={`Medalla posición ${position}`}
          className={cn("object-contain", config.medal)}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold text-center px-2">
          <div className={cn(config.position, "font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]")}>
            #{position}
          </div>
          <div className={cn(config.category, "font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] mt-1")}>
            {categoryIcon}
          </div>
          <div className={cn(config.year, "font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] mt-0.5")}>
            CHILE {year}
          </div>
        </div>
      </div>

      {/* Company name */}
      <div className={cn(
        config.company,
        "font-bold text-foreground text-center"
      )}>
        {companyName}
      </div>

      {/* Certification footer */}
      <div className={cn(
        config.footer,
        "text-muted-foreground text-center leading-tight"
      )}>
        Certificado por<br />
        <span className="font-semibold text-primary">EligeTuHosting.cl</span>
      </div>
    </div>
  );
};

export default EmbeddableMedalBadge;
