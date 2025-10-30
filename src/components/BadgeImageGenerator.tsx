import { useRef, useEffect } from 'react';

interface BadgeImageGeneratorProps {
  position: number;
  categoryName: string;
  icon: string;
  size?: 'small' | 'medium' | 'large';
  onImageGenerated?: (dataUrl: string) => void;
}

const getMedalImage = (position: number) => {
  switch (position) {
    case 1: return '/badges/medal-gold.png';
    case 2: return '/badges/medal-silver.png';
    case 3: return '/badges/medal-bronze.png';
    default: return '/badges/medal-blue.png';
  }
};

const BadgeImageGenerator = ({ 
  position, 
  categoryName, 
  icon,
  size = 'medium',
  onImageGenerated 
}: BadgeImageGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizeMap = {
    small: 200,
    medium: 300,
    large: 400
  };

  const canvasSize = sizeMap[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const medalImage = new Image();
    medalImage.crossOrigin = 'anonymous';
    medalImage.src = getMedalImage(position);

    medalImage.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Draw medal background
      ctx.drawImage(medalImage, 0, 0, canvasSize, canvasSize);

      // Text settings
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;

      // Draw position number
      ctx.font = `bold ${canvasSize * 0.2}px sans-serif`;
      ctx.fillText(`#${position}`, centerX, centerY - canvasSize * 0.12);

      // Draw category icon
      ctx.font = `${canvasSize * 0.15}px sans-serif`;
      ctx.fillText(icon, centerX, centerY + canvasSize * 0.02);

      // Draw year
      ctx.font = `bold ${canvasSize * 0.1}px sans-serif`;
      ctx.fillText('CHILE 2025', centerX, centerY + canvasSize * 0.16);

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Generate data URL and call callback
      if (onImageGenerated) {
        const dataUrl = canvas.toDataURL('image/png');
        onImageGenerated(dataUrl);
      }
    };

    medalImage.onerror = () => {
      console.error('Failed to load medal image');
    };
  }, [position, icon, size, canvasSize, onImageGenerated]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      className="max-w-full h-auto"
    />
  );
};

export default BadgeImageGenerator;
