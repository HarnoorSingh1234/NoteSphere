import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="bg-[#EDDCD9] border-[0.35em] border-[#264143] rounded-[0.6em] shadow-[0.5em_0.5em_0_#E99F4C] p-6 mb-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none opacity-30"></div>
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#264143] mb-2">{title}</h1>
        <p className="text-[#264143] opacity-80 md:text-lg">{description}</p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute w-[2em] h-[2em] bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-12 top-[-0.8em] right-[2em] z-0"></div>
      <div className="absolute w-[1.5em] h-[1.5em] bg-[#7BB4B1] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 bottom-[-0.6em] right-[5em] z-0"></div>
    </div>
  );
};

export default PageHeader;