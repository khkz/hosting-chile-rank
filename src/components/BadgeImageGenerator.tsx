import { useRef, useEffect } from 'react';

interface BadgeImageGeneratorProps {
  position: number;
  categoryName: string;
  icon: string;
  size?: 'small' | 'medium' | 'large';
  onImageGenerated?: (dataUrl: string) => void;
}

const getPodiumColors = (position: number) => {
  switch (position) {
    case 1: return {
      gradient: { start: '#facc15', end: '#d97706' }, // yellow-400 to amber-600
      border: '#eab308', // yellow-500
      text: '#713f12' // yellow-900
    };
    case 2: return {
      gradient: { start: '#d1d5db', end: '#6b7280' }, // gray-300 to gray-500
      border: '#9ca3af', // gray-400
      text: '#111827' // gray-900
    };
    case 3: return {
      gradient: { start: '#fb923c', end: '#ea580c' }, // orange-400 to orange-600
      border: '#f97316', // orange-500
      text: '#7c2d12' // orange-900
    };
    default: return {
      gradient: { start: '#60a5fa', end: '#2563eb' }, // blue-400 to blue-600
      border: '#3b82f6', // blue-500
      text: '#1e3a8a' // blue-900
    };
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

    const colors = getPodiumColors(position);

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Create circular badge with gradient
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const radius = (canvasSize / 2) - 20;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
    gradient.addColorStop(0, colors.gradient.start);
    gradient.addColorStop(1, colors.gradient.end);

    // Draw circle with gradient
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw border
    ctx.lineWidth = 8;
    ctx.strokeStyle = colors.border;
    ctx.stroke();

    // Add shine effect (top-left white gradient overlay)
    const shineGradient = ctx.createRadialGradient(
      centerX - radius * 0.3,
      centerY - radius * 0.3,
      0,
      centerX - radius * 0.3,
      centerY - radius * 0.3,
      radius * 0.8
    );
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = shineGradient;
    ctx.fill();

    // Draw text - Position number
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${canvasSize * 0.15}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(`#${position}`, centerX, centerY - canvasSize * 0.08);

    // Draw emoji icon
    ctx.font = `${canvasSize * 0.18}px sans-serif`;
    ctx.shadowBlur = 5;
    ctx.fillText(icon, centerX, centerY + canvasSize * 0.05);

    // Draw year
    ctx.font = `bold ${canvasSize * 0.12}px sans-serif`;
    ctx.shadowBlur = 8;
    ctx.fillText('2025', centerX, centerY + canvasSize * 0.18);

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
