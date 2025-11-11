
import React, { useState, useRef, useCallback } from 'react';

interface ImageComparatorProps {
  original: string;
  enhanced: string;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ original, enhanced }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const onMouseMove = (me: MouseEvent) => handleMove(me.clientX);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const onTouchMove = (te: TouchEvent) => handleMove(te.touches[0].clientX);
    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <div 
        ref={containerRef}
        className="relative w-full aspect-video rounded-xl overflow-hidden select-none cursor-ew-resize group shadow-lg border-4 border-white"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <img src={original} alt="Original" className="absolute inset-0 w-full h-full object-contain" draggable="false" />
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden" 
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img src={enhanced} alt="Enhanced" className="absolute inset-0 w-full h-full object-contain" draggable="false" />
        </div>
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white/70 cursor-ew-resize"
          style={{ right: `calc(${100 - sliderPos}% - 0.5px)` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-md group-hover:opacity-100 opacity-80 transition-opacity">
            <i className="fas fa-arrows-alt-h text-primary"></i>
          </div>
        </div>
        <div className="absolute top-2 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
          الأصلية
        </div>
         <div className="absolute top-2 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold" style={{ opacity: sliderPos > 20 ? 1 : 0 }}>
          المحسّنة
        </div>
      </div>
    </div>
  );
};

export default ImageComparator;
