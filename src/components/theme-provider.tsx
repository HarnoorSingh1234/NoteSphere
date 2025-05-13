"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

// Create a context to store and share theme information
const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Server-side theme is always the default
let serverTheme: Theme = "system"

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "notesphere-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // When component mounts, try to get theme from localStorage
  useEffect(() => {
    setMounted(true)
    
    // Get theme from localStorage
    const currentTheme = localStorage.getItem(storageKey) as Theme
    
    if (currentTheme) {
      setTheme(currentTheme)
    } else {
      // If no theme in localStorage, set the default
      setTheme(defaultTheme)
      localStorage.setItem(storageKey, defaultTheme)
    }
  }, [defaultTheme, storageKey])

  // Apply theme to document when theme changes
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // When theme changes, save it to localStorage
    localStorage.setItem(storageKey, theme)
  }, [theme, mounted, storageKey])

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      
      const updateSystemTheme = () => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(mediaQuery.matches ? "dark" : "light")
      }
      
      mediaQuery.addEventListener("change", updateSystemTheme)
      return () => mediaQuery.removeEventListener("change", updateSystemTheme)
    }
  }, [theme, mounted])
  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      console.log("Setting theme to:", newTheme);
      setTheme(newTheme);
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {mounted ? children : null}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  
  return context
} 