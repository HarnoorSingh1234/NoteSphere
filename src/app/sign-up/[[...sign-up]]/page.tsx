'use client'

import { SignUp } from '@clerk/nextjs'

import AuthenticationWrapper from '@/components/auth/AuthenticationWrapper';

export default function SignUpPage() {
  return (
    <AuthenticationWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <SignUp fallbackRedirectUrl={'/user-dashboard'} 
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