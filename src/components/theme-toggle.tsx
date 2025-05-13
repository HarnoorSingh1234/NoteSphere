"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import styled from "styled-components"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  
  // Wait until mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  // If not mounted yet, render a placeholder button with the same dimensions
  if (!mounted) {
    return (
      <StyledToggleButton className="placeholder" aria-hidden="true">
        <span className="sr-only">Toggle theme</span>
      </StyledToggleButton>
    )
  }

  return (
    <StyledToggleButton 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={theme}
      aria-label="Toggle theme"
    >
      <Sun className="sun-icon" />
      <Moon className="moon-icon" />
      <span className="sr-only">Toggle theme</span>
    </StyledToggleButton>
  )
}

const StyledToggleButton = styled.button`
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: var(--bg, white);
  border: 0.15em solid var(--text, #050505);
  box-shadow: 0.2em 0.2em 0 var(--accent, #00e0b0);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translate(-0.1em, -0.1em);
    box-shadow: 0.3em 0.3em 0 var(--accent, #00e0b0);
  }
  
  &:active {
    transform: translate(0.1em, 0.1em);
    box-shadow: 0.1em 0.1em 0 var(--accent, #00e0b0);
  }
  
  &.placeholder {
    background: rgba(0, 0, 0, 0.1);
    border-color: transparent;
    box-shadow: none;
    cursor: default;
  }
  
  .sun-icon, .moon-icon {
    width: 1.2rem;
    height: 1.2rem;
    position: absolute;
    color: var(--text, #050505);
    transition: all 0.3s ease;
  }
  
  .sun-icon {
    opacity: 1;
    transform: rotate(0) scale(1);
  }
  
  .moon-icon {
    opacity: 0;
    transform: rotate(90deg) scale(0);
  }
  
  &.dark {
    .sun-icon {
      opacity: 0;
      transform: rotate(-90deg) scale(0);
    }
    
    .moon-icon {
      opacity: 1;
      transform: rotate(0) scale(1);
    }
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`; 