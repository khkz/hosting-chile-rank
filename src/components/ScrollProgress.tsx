import React, { useEffect, useState } from 'react';

/** Avance de lectura de la portada: línea fina en tinta, sin rojo ni adornos. */
const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-0.5" aria-hidden>
      <div className="h-full bg-ink/70" style={{ width: `${scrollProgress}%` }} />
    </div>
  );
};

export default ScrollProgress;
