'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, LogIn, UserCircle, BookmarkPlus, Settings } from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

/**
 * Navigation bar component with authentication controls using Clerk
 */
const Navbar = () => {
  const pathname = usePathname();
  const { isLoaded, user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    if (isLoaded && user) {
      // Check user's role from metadata
      const userRole = user.publicMetadata.role;
      setIsAdmin(userRole === 'ADMIN');
    }
  }, [isLoaded, user]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#EDDCD9] border-[0.35em] border-t-0 border-[#264143] rounded-b-[0.6em] shadow-[0.5em_0.5em_0_#E99F4C] py-2 font-sans overflow-hidden transition-all duration-300 ease-in-out origin-top-center hover:translate-y-[0.1em] hover:shadow-[0.7em_0.7em_0_#E99F4C] group">
      {/* Pattern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:0.5em_0.5em] pointer-events-none opacity-30 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-50" />
      
      {/* Overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] bg-[-0.5em_-0.5em] pointer-events-none opacity-0 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-50" />
      
      <div className="relative w-full max-w-[1200px] mx-auto flex items-center justify-between px-4 z-[2]">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 no-underline text-[#264143] font-extrabold text-[1.3rem]">
            <div className="flex items-center justify-center w-[2.2rem] h-[2.2rem] bg-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105">
              <BookOpen className="w-[1.3rem] h-[1.3rem]" />
            </div>
            <span>NoteSphere</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Navigation links - show different links based on auth state */}
          <SignedIn>
            <nav className="hidden md:flex gap-6">
              {isAdmin ? (
                // Admin navigation links
                [ 'Academics' ].map((item) => {
                  const isActive = pathname === `/${item.toLowerCase()}`;
                  return (
                    <Link 
                      key={item} 
                      href={`/${item.toLowerCase()}`} 
                      className="no-underline text-[#264143] font-bold text-base relative transition-all duration-300 ease-in-out group"
                    >
                      <span className={`block px-3 py-2 border-[0.15em] rounded-[0.4em] transition-all duration-300 ease-in-out relative z-[1] 
                        ${isActive 
                          ? 'border-[#264143] bg-white translate-x-[-0.1em] translate-y-[-0.1em] shadow-[0.2em_0.2em_0_#E99F4C]' 
                          : 'border-transparent hover:border-[#264143] hover:bg-white hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C]'
                        } active:translate-x-[0.05em] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C]`}>
                        {item}
                      </span>
                      <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[0.2em] bg-[#E99F4C] transition-all duration-300 ease-in-out z-0 opacity-60 
                        ${isActive ? 'w-[80%]' : 'w-0 group-hover:w-[80%]'}`}>
                      </span>
                    </Link>
                  );
                })
              ) : (
                // Regular user navigation links
                ['Academics' , 'About-Us'].map((item) => {
                  const isActive = pathname === `/${item.toLowerCase()}` 
                  return (
                    <Link 
                      key={item} 
                      href={`/${item.toLowerCase()}` } 
                      className="no-underline text-[#264143] font-bold text-base relative transition-all duration-300 ease-in-out group"
                    >
                      <span className={`block px-3 py-2 border-[0.15em] rounded-[0.4em] transition-all duration-300 ease-in-out relative z-[1] 
                        ${isActive 
                          ? 'border-[#264143] bg-white translate-x-[-0.1em] translate-y-[-0.1em] shadow-[0.2em_0.2em_0_#E99F4C]' 
                          : 'border-transparent hover:border-[#264143] hover:bg-white hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C]'
                        } active:translate-x-[0.05em] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C]`}>
                        {item}
                      </span>
                      <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[0.2em] bg-[#E99F4C] transition-all duration-300 ease-in-out z-0 opacity-60 
                        ${isActive ? 'w-[80%]' : 'w-0 group-hover:w-[80%]'}`}>
                      </span>
                    </Link>
                  );
                })
              )}
            </nav>
          </SignedIn>
          
          <SignedOut>
            <nav className="hidden md:flex gap-6">
              {['academic'].map((item) => {
                const isActive = pathname === `/${item}`;
                return (
                  <Link 
                    key={item} 
                    href={`/${item}`} 
                    className="no-underline text-[#264143] font-bold text-base relative transition-all duration-300 ease-in-out group"
                  >
                    <span className={`block px-3 py-2 border-[0.15em] rounded-[0.4em] transition-all duration-300 ease-in-out relative z-[1] 
                      ${isActive 
                        ? 'border-[#264143] bg-white translate-x-[-0.1em] translate-y-[-0.1em] shadow-[0.2em_0.2em_0_#E99F4C]' 
                        : 'border-transparent hover:border-[#264143] hover:bg-white hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C]'
                      } active:translate-x-[0.05em] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C]`}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </span>
                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[0.2em] bg-[#E99F4C] transition-all duration-300 ease-in-out z-0 opacity-60 
                      ${isActive ? 'w-[80%]' : 'w-0 group-hover:w-[80%]'}`}>
                    </span>
                  </Link>
                );
              })}
            </nav>
          </SignedOut>
          
          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <SignedIn>
              {/* User is signed in - Show different button based on role */}
              {isAdmin ? (
                <Link 
                  href="/admin/dashboard" 
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-[#264143] font-bold text-base border-[0.15em] border-transparent rounded-[0.4em] hover:border-[#264143] hover:bg-white hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C] active:translate-x-[0.05em] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link 
                  href="/profile" 
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-[#264143] font-bold text-base border-[0.15em] border-transparent rounded-[0.4em] hover:border-[#264143] hover:bg-white hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C] active:translate-x-[0.05em] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
              )}
              
              {/* My Notes button shows for both admin and regular users */}
              <Link 
                href="/your-notes" 
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-[#264143] font-bold text-base border-[0.15em] border-transparent rounded-[0.4em] hover:border-[#264143] hover:bg-white hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C] active:translate-x-[0.05em] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200"
              >
                <BookmarkPlus className="w-5 h-5" />
                <span>My Notes</span>
              </Link>
              
              {/* UserButton from Clerk */}
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    avatarBox: "border-2 border-[#264143] transition-all duration-200"
                  }
                }}
              />
            </SignedIn>
            
            <SignedOut>
              {/* User is signed out */}
              <Link 
                href="/sign-up" 
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-white font-bold text-base bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] hover:translate-x-[-0.1em] hover:translate-y-[-0.1em] hover:bg-[#E66BA7] hover:shadow-[0.3em_0.3em_0_#E99F4C] active:translate-x-[0.05em] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200"
              >
                <UserCircle className="w-5 h-5" />
                <span>Sign Up</span>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[1.5em] h-[1.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.5em] z-[3]" />
      
      {/* Accent shape */}
      <div className="absolute w-[2.5em] h-[2.5em] bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 bottom-[-1.2em] right-[5em] z-0 transition-transform duration-300 ease-in-out group-hover:rotate-[55deg] group-hover:scale-110 md:right-[5em] sm:right-[2em]" />
    </header>
  );
};

export default Navbar;