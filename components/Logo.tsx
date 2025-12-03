import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-20" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="https://zupimages.net/up/25/49/7vfu.png" 
        alt="Forsa - Opportunity Solutions" 
        className="h-full w-auto object-contain"
        crossOrigin="anonymous"
      />
    </div>
  );
};