
import React from 'react';

export const Watermark: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center gap-8 opacity-[0.06]">
      <img 
        src="https://zupimages.net/up/25/49/zk70.png" 
        alt="Watermark Icon" 
        className="h-72 w-auto object-contain grayscale"
      />
      <img 
        src="https://zupimages.net/up/25/49/7vfu.png" 
        alt="Watermark Logo Text" 
        className="h-48 w-auto object-contain grayscale"
      />
    </div>
  );
};
