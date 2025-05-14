'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
  type = 'primary'
}) => {  // Color schemes for different card types
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
    <div className="relative group">
      <div 
        className="relative w-72 h-[500px] bg-white border-[0.35em] border-[#050505] rounded-[0.6em] shadow-[0.7em_0.7em_0_#000,inset_0_0_0_0.15em_rgba(0,0,0,0.05)] transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden font-sans origin-center m-4
                hover:translate-x-[-0.4em] hover:translate-y-[-0.4em] hover:scale-[1.02] hover:shadow-[1em_1em_0_#000]
                active:translate-x-[0.1em] active:translate-y-[0.1em] active:scale-[0.98] active:shadow-[0.5em_0.5em_0_#000]"
      >
        {/* Card pattern grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none opacity-50 transition-opacity duration-400 z-10 group-hover:opacity-100"></div>
        
        {/* Card overlay dots */}
        <div className="absolute inset-0 bg-[radial-gradient(#cfcfcf_1px,transparent_1px)] bg-[length:1em_1em] bg-[-0.5em_-0.5em] pointer-events-none opacity-0 transition-opacity duration-400 z-10 group-hover:opacity-100"></div>
        
        {/* Bold pattern */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-15 pointer-events-none z-10">
          <svg viewBox="0 0 100 100">
            <path strokeDasharray="15 10" strokeWidth={10} stroke="#000" fill="none" d="M0,0 L100,0 L100,100 L0,100 Z" />
          </svg>
        </div>
        
        {/* Top-right star accent */}
        <div 
          className="absolute top-[-1em] right-[-1em] w-16 h-16 rotate-45 z-[1]" 
          style={{ backgroundColor: accentColorValue }}
        ></div>
        <div className="absolute top-[0.4em] right-[0.4em] text-[#050505] text-[1.2em] font-bold z-[2]">★</div>
        
        {/* Card title area */}
        <div 
          className="relative p-[1.4em] text-white font-extrabold text-[1.2em] flex justify-between items-center border-b-[0.35em] border-b-[#050505] uppercase tracking-[0.05em] z-20 overflow-hidden
                     before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)_0.5em,transparent_0.5em,transparent_1em)] before:pointer-events-none before:opacity-30"
          style={{ backgroundColor: primaryColor }}
        >
          <span>{title}</span>
          <span className="bg-white text-[#050505] text-[0.6em] font-extrabold py-[0.4em] px-[0.8em] border-[0.15em] border-[#050505] rounded-[0.3em] shadow-[0.2em_0.2em_0_#000] uppercase tracking-[0.1em] rotate-3 transition-all duration-300
                         group-hover:rotate-[-2deg] group-hover:scale-110 group-hover:shadow-[0.25em_0.25em_0_#000]">
            {tagText}
          </span>
        </div>
        
        {/* Card body */}
        <div className="relative p-6 z-20 flex flex-col h-[calc(100%-80px)]">
          <div className="mb-6 text-[#050505] text-[0.95em] leading-[1.4] font-medium">
            {description}
          </div>
          
          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-[0.6em] transition-transform duration-200 hover:translate-x-[0.3em]">
                <div 
                  className="w-[1.4em] h-[1.4em] flex items-center justify-center border-[0.12em] border-[#050505] rounded-[0.3em] shadow-[0.2em_0.2em_0_rgba(0,0,0,0.2)] transition-all duration-200
                             group-hover:rotate-[-5deg]"
                  style={{ backgroundColor: secondaryColorValue }}
                >
                  {feature.icon}
                </div>
                <span className="text-[0.85em] font-semibold text-[#050505]">{feature.text}</span>
              </div>
            ))}
          </div>
          
          {/* Card actions */}         
           <div className="flex flex-wrap justify-between items-center gap-3 mt-auto pt-[1.2em] border-t-[0.15em] border-t-dashed border-t-[rgba(0,0,0,0.15)] relative
                         before:content-['✂'] before:absolute before:top-[-0.8em] before:left-1/2 before:transform before:-translate-x-1/2 before:rotate-90 before:bg-white before:px-[0.5em] before:text-base before:text-[rgba(0,0,0,0.4)]">
            {price && (
              <div 
                style={{ "--accent-color": accentColorValue } as React.CSSProperties}
                className="relative text-[1.8em] font-extrabold text-[#050505] bg-white
                         before:content-[''] before:absolute before:bottom-[0.15em] before:left-0 before:w-full before:h-[0.2em] before:z-[-1] before:opacity-50 before:bg-[var(--accent-color)]"
              >
                <span className="text-[0.6em] font-bold align-top mr-[0.1em]">$</span>{price}
                <span className="block text-[0.4em] font-semibold text-[rgba(0,0,0,0.6)] mt-[0.2em]">{priceDescription}</span>
              </div>
            )}
            <Link href={buttonHref} className="loading-link ml-auto">
              <button 
                className="relative text-white text-[0.9em] font-bold py-[0.6em]
                mb-10 px-[1.2em] border-[0.2em] border-[#050505] rounded-[0.4em] shadow-[0.3em_0.3em_0_#000] cursor-pointer transition-all duration-200 overflow-hidden uppercase tracking-[0.05em] whitespace-nowrap
                           before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] before:transition-[left] before:duration-600 before:ease-in-out
                           hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:shadow-[0.4em_0.4em_0_#000] hover:before:left-[100%]
                           active:translate-x-[0.1em] active:translate-y-[0.1em] active:shadow-[0.15em_0.15em_0_#000]"
                style={{ backgroundColor: secondaryColorValue }}
              >
                {buttonText} <ArrowRight className="inline-block ml-2 h-4 w-4" />              </button>
            </Link>
          </div>
        </div>
        
        {/* Dots pattern */}
        <div className="absolute bottom-8 mt-2 left-[-2em] w-32 h-16 opacity-30 rotate-[-10deg] pointer-events-none z-10">
          <svg viewBox="0 0 80 40">
            <circle fill="#000" r={3} cy={10} cx={10} />
            <circle fill="#000" r={3} cy={10} cx={30} />
            <circle fill="#000" r={3} cy={10} cx={50} />
            <circle fill="#000" r={3} cy={10} cx={70} />
            <circle fill="#000" r={3} cy={20} cx={20} />
            <circle fill="#000" r={3} cy={20} cx={40} />
            <circle fill="#000" r={3} cy={20} cx={60} />
            <circle fill="#000" r={3} cy={30} cx={10} />
            <circle fill="#000" r={3} cy={30} cx={30} />
            <circle fill="#000" r={3} cy={30} cx={50} />
            <circle fill="#000" r={3} cy={30} cx={70} />
          </svg>
        </div>
        
        {/* Accent shape */}
        <div 
          className="absolute w-10 h-10 border-[0.15em] border-[#050505] rounded-[0.3em] rotate-45 bottom-[-1.2em] right-8 z-0 transition-transform duration-300 
                     group-hover:rotate-[55deg] group-hover:scale-110"
          style={{ backgroundColor: secondaryColorValue }}
        ></div>
        
        {/* Corner slice */}
        <div className="absolute bottom-0 left-0 w-6 h-6 bg-white border-r-[0.25em] border-r-[#050505] border-t-[0.25em] border-t-[#050505] rounded-tr-[0.5em] z-10"></div>
        
        {/* Stamp */}
        <div className="absolute bottom-6 left-6 w-16 h-16 flex items-center justify-center border-[0.15em] border-[rgba(0,0,0,0.3)] rounded-full rotate-[-15deg] opacity-20 z-10">
          <span className="text-[0.6em] font-extrabold uppercase tracking-[0.05em]">Approved</span>
        </div>
      </div>
    </div>
  );
};

export default AcademicCard;