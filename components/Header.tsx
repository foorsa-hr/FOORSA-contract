
import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  return (
    <header className="mb-6 relative w-full">
      {/* Top decorative bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-brand-navy via-brand-blue to-brand-beige opacity-20"></div>

      <div className="flex justify-between items-center py-4 px-2">
        
        {/* Right: Title Block */}
        <div className="flex-1 text-right">
             <div className="inline-flex items-center gap-3 border-r-4 border-brand-beige pr-3">
               <div>
                  <h2 className="text-2xl font-black text-brand-navy leading-none">
                    عقد تقديم خدمات
                  </h2>
                  <p className="text-sm font-bold text-brand-blue mt-1">
                    للتقديم للدراسة في الصين
                  </p>
               </div>
             </div>
        </div>

        {/* Center: Slogan */}
        <div className="flex-1 flex justify-center px-4">
            <img 
              src="https://zupimages.net/up/25/48/d34a.png" 
              alt="Slogan" 
              className="h-20 w-auto object-contain opacity-90"
            />
        </div>

        {/* Left: Main Logo + Icon */}
        <div className="flex-1 flex justify-end items-center pl-2 gap-3">
            <Logo className="h-16" />
            <img 
              src="https://zupimages.net/up/25/49/zk70.png" 
              alt="Forsa Icon" 
              className="h-12 w-auto object-contain"
            />
        </div>

      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-gray-200"></div>
    </header>
  );
};
