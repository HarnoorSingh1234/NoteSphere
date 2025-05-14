'use client';

import { useEffect, useState, useRef } from 'react';
import { renderCanvas } from './canvas';

/**
 * Enhanced Background Canvas component with proper hydration handling
 */
export function CanvasBackground() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mounted && canvasRef.current) {
      // Call renderCanvas with the canvas element ref and enhanced options
      const cleanup = renderCanvas(canvasRef.current, {
        prominent: true, // Enable prominent mode
        themeColors: {
          light: {
            primary: '#DE5499',
            secondary: '#E99F4C',
            background: '#EDDCD9'
          },
          dark: {
            primary: '#DE5499',
            secondary: '#E99F4C',
            background: '#264143'
          }
        }
      });
      
      return () => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      };
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    // Return an empty div with the same styling as canvas during SSR
    // to prevent hydration mismatch
    return (
      <div
        className="bg-[#EDDCD9] dark:bg-[#264143] pointer-events-none h-full w-full"
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="bg-[#EDDCD9] dark:bg-[#264143] pointer-events-none h-full w-full"
    />
  );
}