import React from 'react';
import { MessageCircle, Search } from 'lucide-react';

interface NoNoticesFoundProps {
  searchTerm?: string;
}

export default function NoNoticesFound({ searchTerm }: NoNoticesFoundProps) {
  return (
    <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.5em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden p-10 flex flex-col items-center justify-center">
      {/* Pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.8em_0.8em] bg-[-0.4em_-0.4em] pointer-events-none opacity-20"></div>
      
      <div className="flex items-center justify-center w-16 h-16 bg-[#EDDCD9] border-[0.15em] border-[#264143] rounded-full shadow-[0.2em_0.2em_0_#E99F4C] mb-4 transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105">
        {searchTerm ? (
          <Search className="h-8 w-8 text-[#264143]" />
        ) : (
          <MessageCircle className="h-8 w-8 text-[#264143]" />
        )}
      </div>
      
      {searchTerm ? (
        <>
          <p className="text-[#264143] text-lg font-medium">No matching notices found</p>
          <p className="text-[#264143]/60 text-sm text-center mt-2 max-w-md">
            We couldn't find any notices matching "{searchTerm}". 
            Try using different keywords or check back later.
          </p>
        </>
      ) : (
        <>
          <p className="text-[#264143] text-lg font-medium">No notices available</p>
          <p className="text-[#264143]/60 text-sm">Check back later for updates</p>
        </>
      )}
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-6 h-6 bg-white border-r-[0.15em] border-t-[0.15em] border-[#264143] rounded-tr-[0.3em] z-10"></div>
    </div>
  );
}