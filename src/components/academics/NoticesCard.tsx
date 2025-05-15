import React from 'react';
import Link from 'next/link';
import { Bell, ChevronRight, FileText, Calendar, School } from 'lucide-react';

const NoticesCard = () => {
  return (
    <div className="h-full bg-white border-[0.25em] sm:border-[0.3em] md:border-[0.35em] border-[#264143] rounded-[0.4em] sm:rounded-[0.5em] md:rounded-[0.6em] shadow-[0.3em_0.3em_0_#E99F4C] sm:shadow-[0.35em_0.35em_0_#E99F4C] md:shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden group hover:translate-y-[-0.2em] sm:hover:translate-y-[-0.25em] md:hover:translate-y-[-0.3em] hover:shadow-[0.35em_0.35em_0_#E99F4C] sm:hover:shadow-[0.4em_0.4em_0_#E99F4C] md:hover:shadow-[0.5em_0.5em_0_#E99F4C] transition-all duration-300 relative flex flex-col">
      {/* Pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.8em_0.8em] sm:bg-[length:0.9em_0.9em] md:bg-[length:1em_1em] bg-[-0.4em_-0.4em] sm:bg-[-0.45em_-0.45em] md:bg-[-0.5em_-0.5em] pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      
      {/* Colored header */}
      <div className="bg-[#7BB4B1] py-3 sm:py-4 md:py-5 px-4 sm:px-5 md:px-6 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none opacity-30"></div>
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 relative z-10">
          <div className="flex items-center justify-center w-[2.2rem] h-[2.2rem] bg-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105">
             <Bell className="w-[1.3rem] h-[1.3rem] text-[#264143]" />
            </div>
          <h2 className="text-xl sm:text-xl md:text-2xl font-bold text-white">Notices</h2>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
        <p className="text-sm sm:text-base md:text-base text-[#264143] mb-4 sm:mb-5 md:mb-6">
          Stay updated with the latest announcements, events, and important notifications from your institution.
        </p>
        
        <div className="space-y-3 sm:space-y-3.5 md:space-y-4 mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
            <div className="w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105 bg-[#EDDCD9] flex items-center justify-center flex-shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#264143]" />
            </div>
            <span className="text-sm sm:text-sm md:text-base text-[#264143]">Important announcements</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
            <div className="w-7 h-7 sm:w-7 transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#EDDCD9] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#264143]" />
            </div>
            <span className="text-sm sm:text-sm md:text-base text-[#264143]">Upcoming events</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
            <div className="w-7 h-7 sm:w-7 transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#EDDCD9] flex items-center justify-center flex-shrink-0">
              <School className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#264143]" />
            </div>
            <span className="text-sm sm:text-sm md:text-base text-[#264143]">Academic deadlines</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 sm:pt-5 md:pt-6">
          <Link 
            href="/academics/notices" 
            className="inline-flex items-center justify-center w-full py-2 sm:py-2.5 md:py-3 px-4 sm:px-4 md:px-5 bg-[#7BB4B1] text-white font-bold text-sm sm:text-base md:text-base rounded-md hover:bg-[#6ba3a0] transition-colors group-hover:shadow-[0.15em_0.15em_0_#264143] sm:group-hover:shadow-[0.17em_0.17em_0_#264143] md:group-hover:shadow-[0.2em_0.2em_0_#264143]"
          >
            <span>View All Notices</span>
            <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1.5 sm:ml-1.5 md:ml-2" />
          </Link>
        </div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[1.2em] h-[1.2em] sm:w-[1.3em] sm:h-[1.3em] md:w-[1.5em] md:h-[1.5em] bg-white border-r-[0.15em] sm:border-r-[0.2em] md:border-r-[0.25em] border-t-[0.15em] sm:border-t-[0.2em] md:border-t-[0.25em] border-[#264143] rounded-tr-[0.3em] sm:rounded-tr-[0.4em] md:rounded-tr-[0.5em] z-10"></div>
    </div>
  );
};

export default NoticesCard;