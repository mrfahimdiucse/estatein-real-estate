import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CallToActionProps {
  className?: string;
}

export const CallToAction: React.FC<CallToActionProps> = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <section className={`px-4 sm:px-6 lg:px-20 mb-20 sm:mb-24 ${className}`}>
      <div className="bg-bg-card border-y border-border-card relative overflow-hidden min-h-[300px] py-12 lg:py-0 flex items-center shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-6 sm:grid-cols-10 h-full w-full">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="border border-white/5 h-20" />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-10 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              Start Your Real Estate <br className="hidden sm:block" /> Journey Today
            </h2>
            <p className="text-gray-400 text-sm lg:text-base leading-relaxed opacity-80">
              Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice, Estatein is here to assist you every step of the way. Take the first step towards your real estate goals today.
            </p>
          </div>
          <button 
            onClick={() => navigate('/properties')} 
            className="btn-primary px-10 py-5 whitespace-nowrap shadow-xl shadow-purple-accent/20 hover:scale-105 active:scale-95 transition-all text-base font-bold"
          >
            Explore Properties
          </button>
        </div>
      </div>
    </section>
  );
};
