import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 pt-6 md:pt-10 pb-12 md:pb-16 px-4 md:px-6 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden p-8 relative text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EDDCD9] border-[0.15em] border-[#264143]/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#264143]/70">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-[#264143]">Notice not found</h2>
          <p className="mb-6 text-[#264143]/70">The notice you're looking for doesn't exist or has been removed.</p>
          <Link href="/academics/notices">
            <Button className="bg-[#7BB4B1] border-[0.15em] border-[#264143] shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] hover:translate-x-[-0.05em] hover:shadow-[0.2em_0.2em_0_#E99F4C] hover:bg-[#6ba3a0] transition-all duration-200">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notices
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}