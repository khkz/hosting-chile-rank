import React, { memo } from 'react';

interface PerformanceOptimizedProps {
  children: React.ReactNode;
  className?: string;
  loadingHeight?: string;
}

// High-order component for performance optimization
const PerformanceOptimized: React.FC<PerformanceOptimizedProps> = memo(({
  children,
  className = '',
  loadingHeight = 'h-20'
}) => {
  return (
    <div 
      className={`${className} transform-gpu`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 200px' }}
    >
      {children}
    </div>
  );
});

PerformanceOptimized.displayName = 'PerformanceOptimized';

export default PerformanceOptimized;