'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge'; // Recommended for combining Tailwind classes safely

interface AcademicCardProps {
  title: string;
  tagText: string;
  description: string;
  features: {
    icon: React.ReactNode;
    text: string;
  }[];
  price?: string;
  priceDescription?: string;
  buttonText: string;
  buttonHref: string;
  accentColor?: string;
  secondaryColor?: string;
  type?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'purple' | 'teal';
  className?: string;
}

const AcademicCard: React.FC<AcademicCardProps> = ({
  title,
  tagText,
  description,
  features,
  price,
  priceDescription,
  buttonText,
  buttonHref,
  accentColor,
  secondaryColor,
  type = 'primary',
  className,
}) => {  
  // Color schemes for different card types
  const colorSchemes = {
    primary: {
      primary: accentColor || "#DE5499",
      secondary: secondaryColor || "#E99F4C", 
      accent: "#00C2A8"
    },
    secondary: {
      primary: accentColor || "#E99F4C",
      secondary: secondaryColor || "#DE5499",
      accent: "#2196F3"
    },
    success: {
      primary: accentColor || "#4CAF50",
      secondary: secondaryColor || "#2196F3",
      accent: "#FFC107"
    },
    info: {
      primary: accentColor || "#2196F3",
      secondary: secondaryColor || "#9C27B0",
      accent: "#4CAF50"
    },
    warning: {
      primary: accentColor || "#FF9800",
      secondary: secondaryColor || "#9C27B0",
      accent: "#00BCD4"
    },
    danger: {
      primary: accentColor || "#F44336",
      secondary: secondaryColor || "#FF9800",
      accent: "#8BC34A"
    },
    purple: {
      primary: accentColor || "#9C27B0",
      secondary: secondaryColor || "#00BCD4",
      accent: "#FF9800"
    },
    teal: {
      primary: accentColor || "#009688",
      secondary: secondaryColor || "#FF5722",
      accent: "#9C27B0"
    }
  };
  
  // Get colors based on type
  const colors = colorSchemes[type];
  
  // Define the color variables
  const primaryColor = colors.primary;
  const secondaryColorValue = colors.secondary;
  const accentColorValue = colors.accent;
  
  return (
    <div className={twMerge("relative group", className)}>
      <div 
        className="relative w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] h-auto min-h-[420px] sm:min-h-[480px] bg-white border-[0.25em] sm:border-[0.35em] border-[#050505] rounded-[0.5em] sm:rounded-[0.6em] shadow-[0.5em_0.5em_0_#000,inset_0_0_0_0.15em_rgba(0,0,0,0.05)] sm:shadow-[0.7em_0.7em_0_#000,inset_0_0_0_0.15em_rgba(0,0,0,0.05)] transition-all duration-400 ease-in-out overflow-hidden font-sans origin-center m-2 sm:m-4
                hover:translate-x-[-0.3em] hover:translate-y-[-0.3em] sm:hover:translate-x-[-0.4em] sm:hover:translate-y-[-0.4em] hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-[0.7em_0.7em_0_#000] sm:hover:shadow-[1em_1em_0_#000]
                active:translate-x-[0.05em] active:translate-y-[0.05em] sm:active:translate-x-[0.1em] sm:active:translate-y-[0.1em] active:scale-[0.99] sm:active:scale-[0.98] active:shadow-[0.4em_0.4em_0_#000] sm:active:shadow-[0.5em_0.5em_0_#000]"
      >
        {/* Card pattern grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none opacity-50 transition-opacity duration-400 z-10 group-hover:opacity-100" />
        
        {/* Card overlay dots */}
        <div className="absolute inset-0 bg-[radial-gradient(#cfcfcf_1px,transparent_1px)] bg-[length:1em_1em] bg-[-0.5em_-0.5em] pointer-events-none opacity-0 transition-opacity duration-400 z-10 group-hover:opacity-100" />
        
        {/* Bold pattern */}
        <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 opacity-15 pointer-events-none z-10">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <path strokeDasharray="15 10" strokeWidth={10} stroke="#000" fill="none" d="M0,0 L100,0 L100,100 L0,100 Z" />
          </svg>
        </div>
        
        {/* Top-right star accent */}
        <div 
          className="absolute top-[-0.8em] sm:top-[-1em] right-[-0.8em] sm:right-[-1em] w-12 sm:w-16 h-12 sm:h-16 rotate-45 z-[1]" 
          style={{ backgroundColor: accentColorValue }}
        />
        <div className="absolute top-[0.3em] sm:top-[0.4em] right-[0.3em] sm:right-[0.4em] text-[#050505] text-[1em] sm:text-[1.2em] font-bold z-[2]" aria-hidden="true">★</div>
        
        {/* Card title area */}
        <div 
          className="relative p-[1.1em] sm:p-[1.4em] text-white font-extrabold text-[1em] sm:text-[1.2em] flex flex-col gap-1 items-start border-b-[0.25em] sm:border-b-[0.35em] border-b-[#050505] uppercase tracking-[0.05em] z-20 min-w-[300px] sm:min-w-[350px] overflow-visible"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="bg-white text-[#050505] text-[0.5em] sm:text-[0.6em] font-extrabold py-[0.3em] sm:py-[0.4em] px-[0.6em] sm:px-[0.8em] border-[0.12em] sm:border-[0.15em] border-[#050505] rounded-[0.3em] shadow-[0.15em_0.15em_0_#000] sm:shadow-[0.2em_0.2em_0_#000] uppercase tracking-[0.1em] rotate-3 transition-all duration-300 shrink-0 relative z-10">
            {tagText}
          </span>
          <div className="min-w-0">
            <span className="block break-words" title={title}>{title}</span>
          </div>
          <div 
            className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)_0.5em,transparent_0.5em,transparent_1em)] pointer-events-none opacity-30 z-[-1]" 
          aria-hidden="true"
          />
        </div>
        
        {/* Card body */}
        <div className="relative p-4 sm:p-6 z-20 flex flex-col h-[calc(100%-60px)] sm:h-[calc(100%-80px)]">
          <div className="mb-4 sm:mb-6 text-[#050505] text-[0.85em] sm:text-[0.95em] leading-[1.4] font-medium">
            {description}
          </div>
          
          {/* Feature grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 flex-grow">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-[0.4em] sm:gap-[0.6em] transition-transform duration-200 hover:translate-x-[0.2em] sm:hover:translate-x-[0.3em]">
                <div 
                  className="w-[1.2em] h-[1.2em] sm:w-[1.4em] sm:h-[1.4em] flex items-center justify-center border-[0.1em] sm:border-[0.12em] border-[#050505] rounded-[0.25em] sm:rounded-[0.3em] shadow-[0.15em_0.15em_0_rgba(0,0,0,0.2)] sm:shadow-[0.2em_0.2em_0_rgba(0,0,0,0.2)] transition-all duration-200 group-hover:rotate-[-5deg]"
                  style={{ backgroundColor: secondaryColorValue }}
                >
                  {feature.icon}
                </div>
                <span className="text-[0.75em] sm:text-[0.85em] font-semibold text-[#050505] line-clamp-1" title={feature.text}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
          
          {/* Card actions */}         
          <div className="relative flex flex-wrap justify-between items-center gap-2 sm:gap-3 mt-auto pt-[1em] sm:pt-[1.2em] border-t-[0.12em] sm:border-t-[0.15em] border-t-dashed border-t-[rgba(0,0,0,0.15)]">
            {/* Scissors icon */}
            <span 
              className="absolute top-[-0.7em] sm:top-[-0.8em] left-1/2 transform -translate-x-1/2 rotate-90 bg-white px-[0.4em] sm:px-[0.5em] text-sm sm:text-base text-[rgba(0,0,0,0.4)]"
              aria-hidden="true"
            >
              ✂
            </span>
            
            {price && (
              <div
                className="relative text-[1.5em] sm:text-[1.8em] font-extrabold text-[#050505] bg-white"
              >
                <span className="text-[0.5em] sm:text-[0.6em] font-bold align-top mr-[0.1em]"></span>{price}
                <span className="block text-[0.35em] sm:text-[0.4em] font-semibold text-[rgba(0,0,0,0.6)] mt-[0.2em]">{priceDescription}</span>
                {/* Accent line under price */}
                <div 
                  className="absolute bottom-[0.15em] left-0 w-full h-[0.15em] sm:h-[0.2em] z-[-1] opacity-50" 
                  style={{ backgroundColor: accentColorValue }}
                />
              </div>
            )}
            
            <Link href={buttonHref} className="ml-auto">
              <button 
                className="relative text-white text-[0.8em] sm:text-[0.9em] font-bold py-[0.5em] sm:py-[0.6em]
                mb-8 sm:mb-10 px-[1em] sm:px-[1.2em] border-[0.15em] sm:border-[0.2em] border-[#050505] rounded-[0.3em] sm:rounded-[0.4em] shadow-[0.25em_0.25em_0_#000] sm:shadow-[0.3em_0.3em_0_#000] cursor-pointer transition-all duration-200 overflow-hidden uppercase tracking-[0.05em] whitespace-nowrap
                hover:translate-x-[-0.05em] hover:translate-y-[-0.05em] sm:hover:translate-x-[-0.1em] sm:hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#000] sm:hover:shadow-[0.4em_0.4em_0_#000]
                active:translate-x-[0.05em] active:translate-y-[0.05em] sm:active:translate-x-[0.1em] sm:active:translate-y-[0.1em] active:shadow-[0.1em_0.1em_0_#000] sm:active:shadow-[0.15em_0.15em_0_#000]"
                style={{ backgroundColor: secondaryColorValue }}
                aria-label={buttonText}
              >
                {buttonText} <ArrowRight className="inline-block ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                <div 
                  className="absolute top-0 left-[-100%] w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] transition-[left] duration-600 ease-in-out group-hover:left-[100%]" 
                  aria-hidden="true"
                />
              </button>
            </Link>
          </div>
        </div>
        
        {/* Dots pattern */}
        <div className="absolute bottom-8 mt-2 left-[-2em] w-28 sm:w-32 h-12 sm:h-16 opacity-30 rotate-[-10deg] pointer-events-none z-10" aria-hidden="true">
          <svg viewBox="0 0 80 40">
            <circle fill="#000" r={2.5} cy={10} cx={10} />
            <circle fill="#000" r={2.5} cy={10} cx={30} />
            <circle fill="#000" r={2.5} cy={10} cx={50} />
            <circle fill="#000" r={2.5} cy={10} cx={70} />
            <circle fill="#000" r={2.5} cy={20} cx={20} />
            <circle fill="#000" r={2.5} cy={20} cx={40} />
            <circle fill="#000" r={2.5} cy={20} cx={60} />
            <circle fill="#000" r={2.5} cy={30} cx={10} />
            <circle fill="#000" r={2.5} cy={30} cx={30} />
            <circle fill="#000" r={2.5} cy={30} cx={50} />
            <circle fill="#000" r={2.5} cy={30} cx={70} />
          </svg>
        </div>
        
        {/* Accent shape */}
        <div 
          className="absolute w-8 sm:w-10 h-8 sm:h-10 border-[0.12em] sm:border-[0.15em] border-[#050505] rounded-[0.25em] sm:rounded-[0.3em] rotate-45 bottom-[-1em] sm:bottom-[-1.2em] right-6 sm:right-8 z-0 transition-transform duration-300 group-hover:rotate-[55deg] group-hover:scale-110"
          style={{ backgroundColor: secondaryColorValue }}
          aria-hidden="true"
        />
        
        {/* Corner slice */}
        <div 
          className="absolute bottom-0 left-0 w-5 sm:w-6 h-5 sm:h-6 bg-white border-r-[0.2em] sm:border-r-[0.25em] border-r-[#050505] border-t-[0.2em] sm:border-t-[0.25em] border-t-[#050505] rounded-tr-[0.4em] sm:rounded-tr-[0.5em] z-10"
          aria-hidden="true"
        />
        
        {/* Stamp */}
        <div 
          className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center border-[0.12em] sm:border-[0.15em] border-[rgba(0,0,0,0.3)] rounded-full rotate-[-15deg] opacity-20 z-10"
          aria-hidden="true"
        >
          <span className="text-[0.5em] sm:text-[0.6em] font-extrabold uppercase tracking-[0.05em]">Approved</span>
        </div>
      </div>
    </div>
  );
};

export default AcademicCard;