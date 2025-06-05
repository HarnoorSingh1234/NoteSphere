'use client';

import { SignUp } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 flex items-center justify-center py-12 px-4">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[15%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Sign Up Card */}
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#DE5499] p-6 relative overflow-hidden">
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          {/* Pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
          
          {/* Header */}
          <div className="relative z-[1] mb-6 text-center">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="w-16 h-16 rounded-full bg-[#7BB4B1]/20 border-[0.2em] border-[#264143] flex items-center justify-center mx-auto mb-4 shadow-[0.2em_0.2em_0_#E99F4C]"
            >
              <UserPlus className="w-8 h-8 text-[#264143]" />
            </motion.div>
            <h1 className="text-2xl font-bold text-[#264143]">Create an Account</h1>
            <p className="text-[#264143]/70 mt-1">Join our community today!</p>
          </div>
          
          {/* Sign Up Component */}
          <div className="relative z-[1]">
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-[#7BB4B1] border-[0.15em] border-[#264143] hover:shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200',
                  card: 'bg-transparent shadow-none p-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  formFieldInput: 'border-[0.15em] border-[#264143]/40 rounded-[0.4em] focus:border-[#7BB4B1] focus:ring-[#7BB4B1]',
                  formFieldLabel: 'text-[#264143] font-medium',
                  footerAction: 'text-[#DE5499] hover:text-[#DE5499]/80',
                  identityPreviewEditButton: 'text-[#7BB4B1]',
                  formFieldAction: 'text-[#7BB4B1]',
                  formFieldErrorText: 'text-[#DE5499]'
                }
              }}
              fallbackRedirectUrl={'/'}
            />
          </div>
        </div>
        
        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center text-[#264143] hover:text-[#7BB4B1] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}