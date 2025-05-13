// src/components/landing/LandingPage.tsx
'use client'
import Header from './header'
import React, { useEffect } from 'react'
import CTASection from './ctasection'
import FeaturesSection from './featuresection'
import HeroSection from './herosection'
import HowItWorksSection from './howitworks'
import Footer from './footer'
import { renderCanvas } from '@/components/ui/canvas'
import styled from 'styled-components'

export default function LandingPage() {
  useEffect(() => {
    // Make sure we're keeping the light mode as default
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    }
    
    // Initialize canvas animation
    renderCanvas();
  }, []);

  return (
    <StyledLandingPage>
      <canvas
        className="background-canvas"
        id="canvas"
      ></canvas>
      <Header />

      <main className="main-content">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      
      <Footer />
    </StyledLandingPage>
  )
}

const StyledLandingPage = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  
  .background-canvas {
    background: var(--bg-skin-base, #ffffff);
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }
  
  .main-content {
    flex: 1;
    position: relative;
    z-index: 1;
  }
`;
