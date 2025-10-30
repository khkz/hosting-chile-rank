import { cn } from "@/lib/utils";

interface MedalBadgeProps {
  position: number;
  categoryName: string;
  categoryIcon?: string;
  year?: string;
  size?: 'small' | 'medium' | 'large';
  showCategoryName?: boolean;
  className?: string;
}

const getMedalImage = (position: number) => {
  switch (position) {
    case 1: return '/badges/medal-gold.png';
    case 2: return '/badges/medal-silver.png';
    case 3: return '/badges/medal-bronze.png';
    default: return '/badges/medal-blue.png';
  }
};

const sizeMap = {
  small: { container: 120, text: { position: 'text-xl', category: 'text-xs', year: 'text-xs' } },
  medium: { container: 180, text: { position: 'text-3xl', category: 'text-sm', year: 'text-sm' } },
  large: { container: 240, text: { position: 'text-5xl', category: 'text-base', year: 'text-base' } }
};

const MedalBadge = ({ 
  position, 
  categoryName, 
  categoryIcon = '🏆',
  year = '2025',
  size = 'medium',
  showCategoryName = false,
  className 
}: MedalBadgeProps) => {
  const medalImage = getMedalImage(position);
  const dimensions = sizeMap[size];

  return (
    <div 
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: dimensions.container, height: dimensions.container }}
    >
      {/* Medal background image */}
      <img 
        src={medalImage} 
        alt={`Medalla posición ${position}`}
        className="absolute inset-0 w-full h-full object-contain"
      />
      
      {/* Text overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white font-bold text-center px-2">
        {/* Position number */}
        <div className={cn(
          dimensions.text.position,
          "font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        )}>
          #{position}
        </div>
        
        {/* Category (icon or name) */}
        <div className={cn(
          dimensions.text.category,
          "font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] mt-1"
        )}>
          {showCategoryName ? categoryName.toUpperCase() : categoryIcon}
        </div>
        
        {/* Year */}
        <div className={cn(
          dimensions.text.year,
          "font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] mt-0.5"
        )}>
          CHILE {year}
        </div>
      </div>
    </div>
  );
};

export default MedalBadge;
