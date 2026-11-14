import { cn } from "@/lib/utils";

interface MedalBadgeProps {
  position: number;
  categoryName: string;
  /** Heredado: ya no se dibuja (los íconos son de lucide, nunca emojis). */
  categoryIcon?: string;
  year?: string;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  showCategoryName?: boolean;
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

const ICON_PX = { tiny: 20, small: 28, medium: 36, large: 44 } as const;

/**
 * Sello de certificación: medalla pequeña como ícono y el texto al lado, legible
 * (nada de texto sobre la imagen ni letra bajo 12 px).
 */
const MedalBadge = ({
  position,
  categoryName,
  size = 'medium',
  className,
}: MedalBadgeProps) => {
  const px = ICON_PX[size];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border border-rule bg-white py-1 pl-1 pr-2.5 text-ink",
        className,
      )}
    >
      <img src={getMedalImage(position)} alt="" width={px} height={px} className="shrink-0 object-contain" />
      <span className="text-sm font-semibold leading-tight">
        Puesto {position} en {categoryName}
      </span>
    </span>
  );
};

export default MedalBadge;
