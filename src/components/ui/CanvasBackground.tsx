'use client';

import { useEffect, useState, useRef } from 'react';
import { renderCanvas } from './canvas';

/**
 * Background Canvas component with proper hydration handling
 */
export function CanvasBackground() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mounted && canvasRef.current) {
      // Call renderCanvas with the canvas element ref
      const cleanup = renderCanvas(canvasRef.current);
      
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
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto"
        aria-hidden="true"
        suppressHydrationWarning
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="bg-skin-base pointer-events-none absolute inset-0 mx-auto"
      suppressHydrationWarning
    />
  );
}
