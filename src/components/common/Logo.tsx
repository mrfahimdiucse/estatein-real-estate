import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "h-10", 
  showText = true,
  variant = 'dark'
}) => {
  return (
    <div className={`flex items-center gap-3 overflow-visible ${className}`}>
      {showText && (
        <div className="flex flex-col justify-center h-full">
          <div className="flex items-baseline">
            <span className={`text-[1.8em] font-black tracking-tighter leading-none ${variant === 'light' ? 'text-white' : 'text-text-primary'}`}>
              ESTATE
            </span>
            <span className="text-[1.8em] font-black tracking-tighter leading-none text-purple-accent">
              IN
            </span>
          </div>
          <div className={`text-[0.6em] font-bold tracking-[0.35em] uppercase leading-none mt-1 ${variant === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
            Premium Real Estate
          </div>
        </div>
      )}
    </div>
  );
};
