import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 pt-6 md:pt-10 pb-12 md:pb-16 px-4 md:px-6 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden p-6 md:p-8 relative">
          <div className="mb-6">
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
            
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-8" />
          </div>
          
          <Skeleton className="h-[60vh] w-full mb-8" />
          
          <div className="flex items-center gap-6 mb-8">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          
          <Skeleton className="h-px w-full mb-8" />
          
          <div className="mb-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-24 w-full mb-3" />
                <div className="flex justify-end">
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            </div>
          </div>
          
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <div className="bg-[#EDDCD9]/10 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}