import React from 'react';

interface NoticeSkeletonProps {
  count?: number;
}

export default function NoticeSkeleton({ count = 6 }: NoticeSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {Array(count).fill(0).map((_, index) => (
        <div 
          key={index} 
          className="bg-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] overflow-hidden p-3.5 relative"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
            <div className="h-5 bg-[#7BB4B1]/10 rounded-md w-12 animate-pulse"></div>
          </div>
          
          <div className="h-3.5 bg-gray-200 rounded-md w-full animate-pulse mb-2.5"></div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="h-3.5 bg-gray-200 rounded-md w-16 animate-pulse"></div>
              <div className="h-3.5 bg-gray-200 rounded-md w-16 animate-pulse"></div>
            </div>
            
            <div className="flex items-center gap-2.5">
              <div className="h-3.5 bg-gray-200 rounded-md w-6 animate-pulse"></div>
              <div className="h-3.5 bg-gray-200 rounded-md w-6 animate-pulse"></div>
              <div className="h-3.5 bg-gray-200 rounded-md w-4 animate-pulse"></div>
            </div>
          </div>
          
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-white border-r-[0.12em] border-t-[0.12em] border-[#264143] rounded-tr-[0.25em] z-10"></div>
        </div>
      ))}
    </div>
  );
}