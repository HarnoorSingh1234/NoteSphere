import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function NoNoticesFound() {
  return (
    <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.5em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden p-8 flex flex-col items-center justify-center h-64">
      <MessageCircle className="h-16 w-16 text-[#7BB4B1] mb-4" />
      <p className="text-[#264143] text-lg font-medium">No notices available</p>
      <p className="text-[#264143]/60 text-sm">Check back later for updates</p>
    </div>
  );
}