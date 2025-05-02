// src/components/landing/LandingPage.tsx
'use client'
import Header from './header'
import React from 'react'
import CTASection from './ctasection'
import FeaturesSection from './featuresection'
import HeroSection from './herosection'
import HowItWorksSection from './howitworks'
import { Footer } from './footer'


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  )
}
