'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoadingProvider } from '@/components/ui/LoadingProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  // Use a state to track the initial theme from localStorage
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light') // Default to light instead of system
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  
  // Check if the path is an auth path
  const isAuthPath = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up')
  
  // On client-side, get the theme from localStorage on first render
  useEffect(() => {
    // Mark as mounted to avoid hydration mismatch
    setMounted(true)
    
    // Get theme from localStorage if available
    const savedTheme = localStorage.getItem('notesphere-theme') as 'light' | 'dark' | 'system'
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    // Listen for storage events (if theme is changed in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notesphere-theme' && e.newValue) {
        setTheme(e.newValue as 'light' | 'dark' | 'system')
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  // To avoid hydration mismatch, only render content when mounted
  if (!mounted) {
    // Return empty div with same layout to avoid layout shift
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }
    // If this is an auth path, don't wrap with ClerkProvider as it's already done in the auth layout
  if (isAuthPath) {
    return (
      <ThemeProvider defaultTheme={theme} storageKey="notesphere-theme">
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </ThemeProvider>
    )
  }
  
  // For non-auth paths, wrap with ClerkProvider
  return (
    <ClerkProvider>
      <ThemeProvider defaultTheme={theme} storageKey="notesphere-theme">
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}