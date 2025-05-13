'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { motion } from '@/lib/motion-utils'
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/theme-toggle'
import styled from 'styled-components'

export default function Header() {
  // Add client-side only rendering for auth components
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <StyledHeader
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-pattern-grid" />
      <div className="header-overlay-dots" />
      <div className="header-container">
        <div className="header-logo">
          <BookOpen className="logo-icon" />
          <span className="logo-text">NoteSphere</span>
          <div className="logo-accent" />
        </div>
        
        <nav className="header-nav">
          {['home','features', 'how-it-works'].map((id) => (
            <Link
              key={id}
              href={`#${id}`}
              className="nav-link"
            >
              <span>{id.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
            </Link>
          ))}
        </nav>
        
        <div className="header-actions">
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>
          
          {/* Only render auth components on the client */}
          {isMounted ? (
            <>
              <SignedOut>
                <SignInButton>
                  <button className="signin-button">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="signup-button">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          ) : (
            // Placeholders with same dimensions to prevent layout shift
            <div className="auth-placeholders">
              <div className="button-placeholder"></div>
              <div className="button-placeholder"></div>
            </div>
          )}
        </div>
      </div>
      <div className="corner-slice" />
      <div className="accent-shape" />
    </StyledHeader>
  )
}

const StyledHeader = styled(motion.header)`
  --primary: #ff3e00;
  --primary-hover: #ff6d43;
  --secondary: #4d61ff;
  --secondary-hover: #5e70ff;
  --accent: #00e0b0;
  --text: #050505;
  --bg: #ffffff;
  --shadow-color: var(--accent);
  --pattern-color: rgba(0, 0, 0, 0.05);
  
  // Dark mode variables
  .dark & {
    --text: #ffffff;
    --bg: #121212;
    --shadow-color: #00c69a;
    --pattern-color: rgba(255, 255, 255, 0.05);
  }

  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  background: var(--bg);
  border: 0.35em solid var(--text);
  border-top: none;
  border-radius: 0 0 0.6em 0.6em;
  box-shadow: 0.5em 0.5em 0 var(--shadow-color);
  font-family: ui-sans-serif, system-ui, sans-serif;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: top center;

  &:hover {
    transform: translateY(0.1em);
    box-shadow: 0.7em 0.7em 0 var(--shadow-color);
  }
  
  .header-pattern-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        to right,
        var(--pattern-color) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, var(--pattern-color) 1px, transparent 1px);
    background-size: 0.5em 0.5em;
    pointer-events: none;
    opacity: 0.3;
    transition: opacity 0.4s ease;
    z-index: 1;
  }

  .header-overlay-dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(var(--pattern-color) 1px, transparent 1px);
    background-size: 1em 1em;
    background-position: -0.5em -0.5em;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
  }

  &:hover .header-pattern-grid,
  &:hover .header-overlay-dots {
    opacity: 0.5;
  }
  
  .header-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    height: 4.5rem;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    z-index: 2;
  }
  
  .header-logo {
    display: flex;
    align-items: center;
    position: relative;
    gap: 0.6rem;
    font-weight: 800;
    font-size: 1.3rem;
    color: var(--primary);
    
    .logo-icon {
      width: 1.5rem;
      height: 1.5rem;
      position: relative;
      z-index: 1;
      color: var(--text);
    }
    
    .logo-text {
      position: relative;
      z-index: 1;
      color: var(--text);
    }
    
    .logo-accent {
      position: absolute;
      width: 2rem;
      height: 2rem;
      background: var(--accent);
      opacity: 0.2;
      border-radius: 50%;
      left: -0.5rem;
      z-index: 0;
      transition: transform 0.3s ease;
    }
    
    &:hover .logo-accent {
      transform: scale(1.2);
    }
  }
  
  .header-nav {
    display: flex;
    gap: 1.5rem;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  .nav-link {
    text-decoration: none;
    color: var(--text);
    font-weight: 700;
    font-size: 1rem;
    position: relative;
    transition: all 0.3s ease;
    
    span {
      display: block;
      padding: 0.5rem 0.8rem;
      border: 0.15em solid transparent;
      border-radius: 0.4em;
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;
      
      &:hover {
        border-color: var(--text);
        background: var(--bg);
        transform: translate(-0.1em, -0.1em);
        box-shadow: 0.2em 0.2em 0 var(--shadow-color);
      }
      
      &:active {
        transform: translate(0.05em, 0.05em);
        box-shadow: 0.1em 0.1em 0 var(--shadow-color);
      }
    }
    
    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0.2em;
      background: var(--accent);
      transition: width 0.3s ease;
      z-index: 0;
      opacity: 0.6;
    }
    
    &:hover::before {
      width: 80%;
    }
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
  }
  
  .theme-toggle-wrapper {
    margin-right: 0.5rem;
    transform: scale(1.1);
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.2) rotate(5deg);
    }
    
    /* Making sure the theme toggle is visible in both light and dark modes */
    :global(.dark) & button {
      border-color: rgba(255, 255, 255, 0.2);
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    button {
      border: 2px solid var(--text);
      background-color: var(--bg);
      color: var(--text);
    }
  }
  
  .signin-button, .signup-button {
    padding: 0.5rem 1rem;
    border: 0.2em solid var(--text);
    border-radius: 0.4em;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0.3em 0.3em 0 var(--shadow-color);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 100%
      );
      transition: left 0.6s ease;
    }
    
    &:hover {
      transform: translate(-0.1em, -0.1em);
      box-shadow: 0.4em 0.4em 0 var(--shadow-color);
    }
    
    &:hover::before {
      left: 100%;
    }
    
    &:active {
      transform: translate(0.1em, 0.1em);
      box-shadow: 0.15em 0.15em 0 var(--shadow-color);
    }
  }
  
  .signin-button {
    background-color: var(--bg);
    color: var(--text);
  }
  
  .signup-button {
    background-color: var(--primary);
    color: white;
    
    &:hover {
      background-color: var(--primary-hover);
    }
  }

  .corner-slice {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1.5em;
    height: 1.5em;
    background: var(--bg);
    border-right: 0.25em solid var(--text);
    border-top: 0.25em solid var(--text);
    border-radius: 0 0.5em 0 0;
    z-index: 3;
  }

  .accent-shape {
    position: absolute;
    width: 2.5em;
    height: 2.5em;
    background: var(--secondary);
    border: 0.15em solid var(--text);
    border-radius: 0.3em;
    transform: rotate(45deg);
    bottom: -1.2em;
    right: 5em;
    z-index: 0;
    transition: transform 0.3s ease;
  }

  &:hover .accent-shape {
    transform: rotate(55deg) scale(1.1);
  }
  
  /* Placeholder styles for auth buttons during SSR */
  .auth-placeholders {
    display: flex;
    gap: 1rem;
    
    .button-placeholder {
      width: 6rem;
      height: 2.5rem;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 0.4em;
    }
  }
  
  @media (max-width: 768px) {
    .accent-shape {
      right: 2em;
    }
  }
  
  @media (max-width: 480px) {
    .header-container {
      padding: 0 0.5rem;
    }
    
    .header-actions {
      gap: 0.5rem;
    }
    
    .signin-button, .signup-button {
      padding: 0.3rem 0.7rem;
      font-size: 0.8rem;
    }
  }
`;