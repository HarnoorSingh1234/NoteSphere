import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <div className="mt-12 bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none opacity-30"></div>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-[#264143] mb-4">About Academic Resources</h2>
        <p className="text-[#264143] opacity-80">
          NoteSphere helps you organize and access all your academic resources in one place. 
          Stay updated with notices, explore course materials by academic years, and collaborate with fellow students.
          Sign up to contribute your own notes and materials!
        </p>
      </div>
      
      {/* Decorative element */}
      <div className="absolute w-[2em] h-[2em] bg-[#E99F4C] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-[-12deg] bottom-[-0.8em] right-[2em] z-0"></div>
    </div>
  );
};

export default InfoSection;