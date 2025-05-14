'use client';

import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { ThemeToggle } from './theme-toggle'
import styled from 'styled-components'
import { BookOpen } from 'lucide-react'
import { LoadingLink } from '@/components/ui/LoadingLink'
import { useNavigation } from '@/lib/useNavigation'

function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  // Check if we're in an environment where we can safely use Clerk components
  const [canUseClerk, setCanUseClerk] = useState(false)
    useEffect(() => {
    // Only enable Clerk components after component is mounted on the client side
    setCanUseClerk(true)
  }, [])

  const { navigate } = useNavigation();
  
  return (
    <StyledNavbar>
      <div className="navbar-pattern-grid" />
      <div className="navbar-overlay-dots" />
      <div className="navbar-container">
        <div className="navbar-logo">
          <LoadingLink href="/" className="logo-link">
            <div className="logo-wrapper">
              <BookOpen className="logo-icon" />
            </div>
            <span className="logo-text">NoteSphere</span>
          </LoadingLink>
        </div>
        
        <div className="navbar-links">
          <LoadingLink href="/academics" className="nav-link">
            <span>Academics</span>
          </LoadingLink>
          <LoadingLink href="/subjects" className="nav-link">
            <span>Subjects</span>
          </LoadingLink>
          <LoadingLink href="/allnotes" className="nav-link">
            <span>All Notes</span>
          </LoadingLink>
          <LoadingLink href="/upload" className="nav-link">
            <span>Upload</span>
          </LoadingLink>
        </div>
          <div className="navbar-actions">
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>
          
          {/* Only render Clerk components when safe to do so and not in admin mode */}          {canUseClerk && !isAdmin ? (
            <div suppressHydrationWarning>
              <SignedOut>
                <SignInButton>
                  <button className="signin-button">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="signup-button">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          ) : null}
          
          {/* In admin mode, don't use Clerk components */}
          {isAdmin && (
            <div className="admin-indicator">
              Admin Mode
            </div>
          )}
        </div>
      </div>
      <div className="corner-slice" />
      <div className="accent-shape" />
    </StyledNavbar>
  )
}

const StyledNavbar = styled.header`
  --primary: #DE5499;
  --primary-hover: #E66BA7;
  --secondary: #264143;
  --secondary-hover: #3A5D60;
  --accent: #E99F4C;
  --text: #264143;
  --bg: var(--bg-skin-card, #EDDCD9);
  --shadow-color: var(--accent);
  --pattern-color: rgba(0, 0, 0, 0.05);

  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background-color: var(--bg);
  border: 0.35em solid var(--secondary);
  border-top: none;
  border-radius: 0 0 0.6em 0.6em;
  box-shadow: 0.5em 0.5em 0 var(--shadow-color);
  padding: 0.5rem 0;
  font-family: ui-sans-serif, system-ui, sans-serif;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: top center;

  &:hover {
    transform: translateY(0.1em);
    box-shadow: 0.7em 0.7em 0 var(--shadow-color);
  }
  
  .navbar-pattern-grid {
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

  .navbar-overlay-dots {
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

  &:hover .navbar-pattern-grid,
  &:hover .navbar-overlay-dots {
    opacity: 0.5;
  }
  
  .navbar-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    z-index: 2;
  }
  
  .navbar-logo {
    display: flex;
    align-items: center;
  }
  
  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    gap: 0.6rem;
    color: var(--text);
    font-weight: 800;
    font-size: 1.3rem;
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.2rem;
    height: 2.2rem;
    background: white;
    border: 0.2em solid var(--text);
    border-radius: 0.4em;
    box-shadow: 0.2em 0.2em 0 var(--shadow-color);
    transition: all 0.2s ease;
    
    &:hover {
      transform: rotate(-5deg) scale(1.05);
    }
  }
  
  .logo-icon {
    width: 1.3rem;
    height: 1.3rem;
  }
  
  .navbar-links {
    display: flex;
    gap: 1.5rem;
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
        border-color: var(--secondary);
        background: white;
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
  
  .navbar-actions {
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
  }
  
  .signin-button, .signup-button {
    padding: 0.5rem 1rem;
    border: 0.2em solid var(--text);
    border-radius: 0.4em;
    font-weight: 700;
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
    background-color: var(--primary);
    color: white;
    
    &:hover {
      background-color: var(--primary-hover);
    }
  }
    .signup-button {
    background-color: white;
    color: var(--text);
  }
  
  .admin-indicator {
    background-color: var(--accent);
    color: var(--text);
    font-weight: 700;
    padding: 0.5rem 1rem;
    border: 0.2em solid var(--text);
    border-radius: 0.4em;
    box-shadow: 0.3em 0.3em 0 var(--shadow-color);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    position: relative;
    font-size: 0.8rem;
  }

  .corner-slice {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1.5em;
    height: 1.5em;
    background: white;
    border-right: 0.25em solid var(--text);
    border-top: 0.25em solid var(--text);
    border-radius: 0 0.5em 0 0;
    z-index: 3;
  }

  .accent-shape {
    position: absolute;
    width: 2.5em;
    height: 2.5em;
    background: var(--primary);
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
  
  @media (max-width: 768px) {
    .navbar-links {
      display: none;
    }
    
    .accent-shape {
      right: 2em;
    }
  }
  
  @media (max-width: 480px) {
    .navbar-container {
      padding: 0 0.5rem;
    }
    
    .logo-text {
      font-size: 1.1rem;
    }
    
    .navbar-actions {
      gap: 0.5rem;
    }
    
    .signin-button, .signup-button {
      padding: 0.3rem 0.7rem;
      font-size: 0.9rem;
    }
  }
`;

export default Navbar