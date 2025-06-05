'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { LogIn, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F2] to-[#EDDCD9]/30 flex items-center justify-center py-12 px-4">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(235,225,220,0.4)_1px,transparent_1px),linear-gradient(rgba(235,225,220,0.4)_1px,transparent_1px)] bg-[length:18px_18px] md:bg-[length:24px_24px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-[15%] right-[5%] w-[15vw] max-w-[8rem] aspect-square bg-[#7BB4B1]/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[8%] w-[18vw] max-w-[10rem] aspect-square bg-[#DE5499]/10 rounded-full blur-xl pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Sign In Card */}
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] shadow-[0.4em_0.4em_0_#7BB4B1] p-6 relative overflow-hidden">
          {/* Corner slice */}
          <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-10"></div>
          
          {/* Pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:0.8em_0.8em] pointer-events-none"></div>
          
          {/* Header */}
          <div className="relative z-[1] mb-6 text-center">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="w-16 h-16 rounded-full bg-[#E99F4C]/20 border-[0.2em] border-[#264143] flex items-center justify-center mx-auto mb-4 shadow-[0.2em_0.2em_0_#DE5499]"
            >
              <LogIn className="w-8 h-8 text-[#264143]" />
            </motion.div>
            <h1 className="text-2xl font-bold text-[#264143]">Welcome Back</h1>
            <p className="text-[#264143]/70 mt-1">Sign in to continue</p>
          </div>
          
          {/* Sign In Component */}
          <div className="relative z-[1]">
            <SignIn 
              appearance={{
                variables: {
                  colorPrimary: '#7BB4B1',
                  colorText: '#264143',
                  colorTextSecondary: 'rgba(38, 65, 67, 0.7)',
                  colorBackground: 'white',
                  colorDanger: '#DE5499',
                  colorSuccess: '#7BB4B1',
                  fontFamily: 'inherit',
                  fontWeight: {
                    normal: '400',
                    medium: '500',
                    bold: '700'
                  },
                  fontSize: '16px',
                  borderRadius: '0.6em',
                  colorInputBackground: 'white',
                },
                elements: {
                  formButtonPrimary: 'bg-[#E99F4C] border-[0.15em] border-[#264143] hover:shadow-[0.2em_0.2em_0_#264143] hover:translate-y-[-0.1em] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#264143] transition-all duration-200',
                  card: 'bg-transparent shadow-none p-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  formFieldInput: 'border-[0.15em] border-[#264143]/40 rounded-[0.4em] focus:border-[#E99F4C] focus:ring-[#E99F4C]',
                  formFieldLabel: 'text-[#264143] font-medium',
                  footerActionText: 'text-[#264143]/70',
                  footerActionLink: 'text-[#7BB4B1] hover:text-[#7BB4B1]/80',
                  identityPreviewEditButton: 'text-[#E99F4C]',
                  formFieldAction: 'text-[#E99F4C]',
                  formFieldErrorText: 'text-[#DE5499]',
                  formResendCodeLink: 'text-[#7BB4B1]',
                  otpCodeFieldInput: 'border-[0.15em] border-[#264143]/40',
                  alternativeMethods: 'text-[#264143] font-medium',
                  socialButtonsBlockButton: 'border-[0.15em] border-[#264143]/30 rounded-[0.4em] hover:bg-[#F9F5F2] transition-colors',
                  socialButtonsIconButton: 'border-[0.15em] border-[#264143]/30 rounded-[0.4em] hover:bg-[#F9F5F2] transition-colors',
                  dividerLine: 'bg-[#264143]/20',
                  dividerText: 'text-[#264143]/60',
                  formHeaderTitle: 'text-[#264143] font-bold',
                  formHeaderSubtitle: 'text-[#264143]/70',
                }
              }}
              fallbackRedirectUrl={'/'}
              signUpUrl="/sign-up"
              oauthFlow="auto"
              
            />
          </div>
          
          {/* Sign Up link */}
          <div className="relative z-[1] mt-6 text-center border-t-[0.15em] border-[#264143]/10 pt-4">
            <p className="text-[#264143]/70 mb-3">Don't have an account yet?</p>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-white text-[#264143] font-bold rounded-[0.4em] border-[0.15em] border-[#264143] hover:bg-[#EDDCD9]/40 hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#DE5499] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#DE5499] transition-all duration-200"
            >
              Create an Account
            </Link>
          </div>
        </div>
        
        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center text-[#264143] hover:text-[#E99F4C] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}