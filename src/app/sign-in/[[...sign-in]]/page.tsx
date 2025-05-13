'use client'

import { SignIn } from '@clerk/nextjs'

import AuthenticationWrapper from '@/components/auth/AuthenticationWrapper';

export default function SignInPage() {
  return (
    <AuthenticationWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <SignIn fallbackRedirectUrl={'/user-dashboard'} 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-md rounded-lg"
            }
          }}
        />
      </div>
    </AuthenticationWrapper>
  )
}