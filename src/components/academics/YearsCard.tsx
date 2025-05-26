import React from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Layers, Calendar, BookMarked } from 'lucide-react';

const YearsCard = () => {
  return (
    <div className="h-full bg-white border-[0.35em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden group hover:translate-y-[-0.3em] hover:translate-x-[-0.1em] hover:shadow-[0.5em_0.5em_0_#E99F4C] transition-all duration-300 relative flex flex-col">
      {/* Card pattern grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-10"></div>
      
      {/* Card overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] bg-[-0.5em_-0.5em] pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10"></div>
      
      {/* Decorative accent shape */}
      <div className="absolute top-[-1.2em] right-[-1.2em] w-10 h-10 bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 z-0 transition-transform duration-300 group-hover:rotate-[55deg] group-hover:scale-110"></div>
      
      {/* Colored header */}
      <div className="bg-[#DE5499] py-4 md:py-5 px-5 md:px-6 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none opacity-30"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center justify-center transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105 w-[2.5rem] h-[2.5rem] bg-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C]">
            <BookOpen className="w-5 h-5 text-[#264143]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Academic Years</h2>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-5 md:p-6 flex flex-col flex-grow relative z-20">
        <p className="text-base text-[#264143] mb-5 md:mb-6">
          Access study materials, notes, and resources organized by academic years and semesters.
        </p>
        
        <div className="space-y-4 mb-5 md:mb-6">
          <div className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-[0.3em]">
            <div className="w-8 h-8 rounded-full transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105 bg-[#EDDCD9] border-[0.12em] border-[#264143] flex items-center justify-center flex-shrink-0 shadow-[0.1em_0.1em_0_rgba(38,65,67,0.2)]">
              <Layers className="w-4 h-4 text-[#264143]" />
            </div>
            <span className="text-sm md:text-base font-medium text-[#264143]">Organized study materials</span>
          </div>
          
          <div className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-[0.3em]">
            <div className="w-8 h-8 rounded-full transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105 bg-[#EDDCD9] border-[0.12em] border-[#264143] flex items-center justify-center flex-shrink-0 shadow-[0.1em_0.1em_0_rgba(38,65,67,0.2)]">
              <Calendar className="w-4 h-4 text-[#264143]" />
            </div>
            <span className="text-sm md:text-base font-medium text-[#264143]">Semester-wise resources</span>
          </div>
          
          <div className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-[0.3em]">
            <div className="w-8 h-8 rounded-full transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105 bg-[#EDDCD9] border-[0.12em] border-[#264143] flex items-center justify-center flex-shrink-0 shadow-[0.1em_0.1em_0_rgba(38,65,67,0.2)]">
              <BookMarked className="w-4 h-4 text-[#264143]" />
            </div>
            <span className="text-sm md:text-base font-medium text-[#264143]">Subject-specific notes</span>
          </div>
        </div>
        
        <div className="mt-auto pt-5 md:pt-6 border-t-[0.15em] border-t-dashed border-t-[rgba(38,65,67,0.15)] relative
                       before:content-['✂'] before:absolute before:top-[-0.8em] before:left-1/2 before:transform before:-translate-x-1/2 before:rotate-90 before:bg-white before:px-[0.5em] before:text-base before:text-[rgba(38,65,67,0.4)]">
          <Link 
            href="/academics/years" 
            className="inline-flex items-center justify-center w-full py-3 px-5 bg-[#DE5499] text-white font-bold text-base rounded-md border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#264143] transition-all duration-200 uppercase tracking-[0.05em]
                     hover:bg-[#d04186] hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:shadow-[0.3em_0.3em_0_#264143]
                     active:translate-x-[0.1em] active:translate-y-[0.1em] active:shadow-[0.1em_0.1em_0_#264143] overflow-hidden
                     before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] before:transition-[left] before:duration-600 before:ease-in-out
                     hover:before:left-[100%]"
          >
            <span>Browse Academic Years</span>
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
      
      {/* Dots pattern */}
      <div className="absolute bottom-8 left-[-2em] w-32 h-16 opacity-0 group-hover:opacity-20 rotate-[-10deg] pointer-events-none z-10 transition-opacity duration-300">
        <svg viewBox="0 0 80 40">
          <circle fill="#264143" r={3} cy={10} cx={10} />
          <circle fill="#264143" r={3} cy={10} cx={30} />
          <circle fill="#264143" r={3} cy={10} cx={50} />
          <circle fill="#264143" r={3} cy={10} cx={70} />
          <circle fill="#264143" r={3} cy={20} cx={20} />
          <circle fill="#264143" r={3} cy={20} cx={40} />
          <circle fill="#264143" r={3} cy={20} cx={60} />
          <circle fill="#264143" r={3} cy={30} cx={10} />
          <circle fill="#264143" r={3} cy={30} cx={30} />
          <circle fill="#264143" r={3} cy={30} cx={50} />
          <circle fill="#264143" r={3} cy={30} cx={70} />
        </svg>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-r-[#264143] border-t-[0.25em] border-t-[#264143] rounded-tr-[0.5em] z-10"></div>
    </div>
  );
};

export default YearsCard;