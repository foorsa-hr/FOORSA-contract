import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold text-brand-navy/80">
        {label}
      </label>
      <input
        className={`
          w-full px-3 py-2 rounded-md border border-gray-300 bg-white
          focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 outline-none
          transition-all duration-200 text-brand-navy placeholder:text-gray-400 text-sm
          ${className}
        `}
        {...props}
      />
    </div>
  );
};