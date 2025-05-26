'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowRight, Check, Loader2, Shield } from 'lucide-react';

export default function MakeAdminPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  const handleMakeAdmin = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clerkId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to make user admin');
      }      toast.success('Database role updated to match Clerk admin role');
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('admin in Clerk first')) {
        toast.error('Please contact a super-admin to make you admin in Clerk first');
      } else {
        toast.error('Failed to update database admin role');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 pt-10 md:pt-16 pb-16 md:pb-24 px-4 md:px-6 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[20%] right-[15%] w-[15vw] max-w-[12rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[30%] left-[10%] w-[18vw] max-w-[14rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Card container */}
        <div className="bg-white border-[0.35em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#E99F4C] overflow-hidden p-8 relative">
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          {/* Title with icon */}
          <div className="flex items-center mb-8 gap-4">
            <div className="flex items-center justify-center w-14 h-14 bg-[#7BB4B1]/20 border-[0.2em] border-[#264143] rounded-[0.5em] shadow-[0.2em_0.2em_0_#E99F4C] transition-all duration-200 hover:rotate-[-5deg] hover:scale-105">
              <Shield className="w-7 h-7 text-[#264143]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#264143]">Admin Access</h1>
          </div>
          
          {/* Description */}
          <p className="text-[#264143]/80 text-lg mb-8">
            Granting admin privileges allows you to manage content, users, and settings across the platform. This action requires verification.
          </p>
          
          {/* User info card if user is present */}
          {user && (
            <div className="bg-[#EDDCD9]/30 border-[0.15em] border-[#264143]/10 p-4 rounded-[0.4em] mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border-[0.15em] border-[#264143]/20 overflow-hidden flex-shrink-0">
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#DE5499]/20 flex items-center justify-center text-[#264143] font-bold">
                      {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[#264143]">
                    {user.fullName}
                  </div>
                  <div className="text-sm text-[#264143]/70">
                    {user.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
            <Button 
              onClick={handleMakeAdmin} 
              disabled={loading || success}
              className={`relative overflow-hidden bg-[#7BB4B1] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C] hover:translate-y-[-0.1em] hover:translate-x-[-0.05em] hover:shadow-[0.3em_0.3em_0_#E99F4C] hover:bg-[#6ba3a0] transition-all duration-200 font-bold text-white px-6 py-6 w-full sm:w-auto flex-1 ${
                success ? 'bg-[#6ba3a0]' : ''
              }`}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : success ? (
                <Check className="mr-2 h-5 w-5" />
              ) : (
                <Shield className="mr-2 h-5 w-5" />
              )}
              
              {loading ? 'Processing...' : success ? 'Admin Access Granted' : 'Make Me Admin'}
              
              {/* Shine effect */}
              <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform-gpu transition-transform duration-1000 ease-out group-hover:translate-x-[200%]"></div>
            </Button>
            
            {success && (
              <Link href="/admin/dashboard" className="w-full sm:w-auto">
                <Button 
                  className="bg-[#264143] border-[0.2em] border-[#264143] shadow-[0.2em_0.2em_0_#DE5499] hover:translate-y-[-0.1em] hover:translate-x-[-0.05em] hover:shadow-[0.3em_0.3em_0_#DE5499] hover:bg-[#1a2e30] transition-all duration-200 font-bold text-white px-6 py-6 w-full flex-shrink-0"
                >
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
          
          {/* Info note */}
          <div className="mt-8 text-sm text-[#264143]/70 bg-[#EDDCD9]/20 p-4 rounded-[0.3em] border-l-[0.3em] border-[#E99F4C]">
            <p>Note: Admin privileges should be granted with care. All admin actions are logged and monitored for security purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}