"use client"

import * as React from "react"
import { BookOpen, GraduationCap, Github, Instagram, Contact } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"

function Footer() {
  const [isDarkMode, setIsDarkMode] = React.useState(true)

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <footer className="relative w-full bg-[#EDDCD9] border-t-[0.35em] border-[#264143] pt-16 pb-8 overflow-hidden group">
      {/* Pattern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:1em_1em] pointer-events-none opacity-30 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-50" />
      
      {/* Overlay dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:2em_2em] bg-[-1em_-1em] pointer-events-none opacity-10 transition-opacity duration-300 ease-in-out z-[1] group-hover:opacity-30" />
      
      {/* Decorative elements */}
      <div className="absolute top-[15%] left-[5%] w-[2em] h-[2em] bg-[#DE5499] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-12 shadow-[0.2em_0.2em_0_#E99F4C] transition-transform duration-300 ease-in-out group-hover:rotate-6 group-hover:scale-110" />
      <div className="absolute bottom-[25%] right-[8%] w-[3em] h-[3em] bg-[#E99F4C] border-[0.15em] border-[#264143] rounded-[0.3em] rotate-45 shadow-[0.2em_0.2em_0_#DE5499] transition-transform duration-300 ease-in-out group-hover:rotate-[55deg] group-hover:scale-110" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white border-[0.25em] border-[#264143] rounded-[0.6em] p-8 shadow-[0.5em_0.5em_0_#E99F4C] transition-all duration-300 ease-in-out group-hover:shadow-[0.7em_0.7em_0_#E99F4C]">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Logo and description */}
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="flex items-center justify-center w-[2.2rem] h-[2.2rem] bg-white border-[0.2em] border-[#264143] rounded-[0.4em] shadow-[0.2em_0.2em_0_#E99F4C] transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105">
                  <BookOpen className="w-[1.3rem] h-[1.3rem] text-[#264143]" />
                </div>
                <h2 className="text-2xl font-bold text-[#264143]">NoteSphere</h2>
              </div>
              <p className="mb-6 text-[#264143]/80">
                The academic hub for sharing and discovering quality course notes.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-lg font-bold flex items-center gap-2 text-[#264143]">
                <div className="flex items-center justify-center w-7 h-7 bg-white border-[0.15em] border-[#264143] rounded-[0.3em] transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105 shadow-[0.15em_0.15em_0_#DE5499]">
                  <GraduationCap className="h-4 w-4 text-[#264143]" />
                </div>
                Quick Links
              </h3>
              <nav className="space-y-3 text-sm">
                <Link 
                  href="/" 
                  className="block text-[#264143]/80 hover:text-[#DE5499] transition-colors relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#E99F4C] before:rounded-sm before:border-[0.1em] before:border-[#264143] before:transition-all before:duration-200 hover:before:rotate-45 hover:before:scale-110"
                >
                  Home
                </Link>
                <Link 
                  href="/academics" 
                  className="block text-[#264143]/80 hover:text-[#DE5499] transition-colors relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#E99F4C] before:rounded-sm before:border-[0.1em] before:border-[#264143] before:transition-all before:duration-200 hover:before:rotate-45 hover:before:scale-110"
                >
                  Browse Notes
                </Link>
                <Link 
                  href="/feedback" 
                  className="block text-[#264143]/80 hover:text-[#DE5499] transition-colors relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#E99F4C] before:rounded-sm before:border-[0.1em] before:border-[#264143] before:transition-all before:duration-200 hover:before:rotate-45 hover:before:scale-110"
                >
                  Give Feedback
                </Link>
                <Link 
                  href="/about-us" 
                  className="block text-[#264143]/80 hover:text-[#DE5499] transition-colors relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#E99F4C] before:rounded-sm before:border-[0.1em] before:border-[#264143] before:transition-all before:duration-200 hover:before:rotate-45 hover:before:scale-110"
                >
                  About Us
                </Link>
              </nav>
            </div>
            
            {/* Contact */}
            <div>
               <h3 className="mb-4 text-lg font-bold flex items-center gap-2 text-[#264143]">
               <div className="flex items-center justify-center w-7 h-7 bg-white border-[0.15em] border-[#264143] rounded-[0.3em] transition-all duration-200 ease-in-out hover:rotate-[-5deg] hover:scale-105 shadow-[0.15em_0.15em_0_#DE5499]">
                  <Contact className="h-4 w-4 text-[#264143]" />
                </div>
                Get In Touch
              </h3>
              <address className="space-y-2 text-sm not-italic text-[#264143]/80 border-l-[0.2em] border-[#DE5499] pl-4">
                <p>Hesh Media</p>
                <p>Prem Complex, Circular Rd, Medical Enclave, Amritsar, Punjab 143001</p>
                <p className="flex items-center">
                  Email: 
                  <a 
                    href="mailto:heshmedia21@gmail.com" 
                    className="ml-1 text-[#DE5499] hover:underline"
                  >
                    heshmedia21@gmail.com
                  </a>
                </p>
              </address>
            </div>
            
            {/* Social Links */}
            <div className="relative">
              <h3 className="mb-4 text-lg font-bold text-[#264143]">Connect with the Devs</h3>
              <div className="mb-6 flex space-x-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="https://github.com/HarnoorSingh1234/NoteSphere">
                        <button className="flex items-center cursor-pointer justify-center w-10 h-10 bg-white border-[0.15em] border-[#264143] rounded-full shadow-[0.15em_0.15em_0_#DE5499] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#DE5499] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#DE5499] transition-all duration-200">
                          <Github className="h-5 w-5 cursor-pointer text-[#264143]" />
                          <span className="sr-only">Github</span>
                        </button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="text-black bg-white border-[0.15em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C]">
                      <p>Check out the code!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="https://www.instagram.com/harnoor_singh124/">
                        <button className="flex items-center justify-center cursor-pointer w-10 h-10 bg-white border-[0.15em] border-[#264143] rounded-full shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200">
                          <Instagram className="h-5 cursor-pointer w-5 text-[#264143]" />
                          <span className="sr-only">Instagram</span>
                        </button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border-[0.15em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C]">
                      <p className="text-black">Harnoor Singh</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                  <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="https://www.instagram.com/tdhingra_16/">
                        <button className="flex items-center justify-center cursor-pointer w-10 h-10 bg-white border-[0.15em] border-[#264143] rounded-full shadow-[0.15em_0.15em_0_#E99F4C] hover:translate-y-[-0.1em] hover:shadow-[0.2em_0.2em_0_#E99F4C] active:translate-y-[0.05em] active:shadow-[0.1em_0.1em_0_#E99F4C] transition-all duration-200">
                          <Instagram className="h-5 cursor-pointer w-5 text-[#264143]" />
                          <span className="sr-only">Instagram</span>
                        </button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border-[0.15em] border-[#264143] shadow-[0.2em_0.2em_0_#E99F4C]">
                      <p className="text-black">Tushar Dhingra</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
             
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-5 flex flex-col items-center justify-center gap-4 border-t border-[#264143]/20 pt-4 text-center md:flex-row">
            <p className="text-sm text-[#264143]/70">
              © 2025 NoteSphere 
              <br />
              All rights reserved by <a href="https://www.instagram.com/node.hesh?igsh=M3JxYzBoNHJ3OHlj" target="_blank"><span className="text-blue-700 hover:underline" >Node</span></a>
              <br />
              Powered by <a href="heshmedia.in" target="_blank"><span className="text-blue-700 hover:underline" >Hesh Media</span></a>
            </p>
            
            {/* Corner decorative element */}
            <div className="absolute bottom-0 right-0 w-[2em] h-[2em] bg-[#EDDCD9] border-l-[0.2em] border-t-[0.2em] border-[#264143] rounded-tl-[0.5em] z-20" />
          </div>
        </div>
      </div>
      
      {/* Corner slice */}
      <div className="absolute bottom-0 left-0 w-[2.5em] h-[2.5em] bg-white border-r-[0.25em] border-t-[0.25em] border-[#264143] rounded-tr-[0.8em] z-[3]" />
    </footer>
  )
}

export { Footer }
