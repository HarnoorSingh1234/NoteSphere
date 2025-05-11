"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter, BookOpen, GraduationCap, Disc, Github } from "lucide-react"

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
    <footer className="relative border-t  bg-gradient-to-br from-purple-900/10 to-indigo-900/10 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">NoteSphere</h2>
            </div>
            <p className="mb-6 text-muted-foreground">
              The academic hub for sharing and discovering quality course notes.
            </p>
            
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Quick Links
            </h3>
            <nav className="space-y-2 text-sm">
              <a href="/" className="block transition-colors hover:text-primary">
                Home
              </a>
              <a href="/semesters" className="block transition-colors hover:text-primary">
                Browse Notes
              </a>
              <a href="/submit" className="block transition-colors hover:text-primary">
                Submit Notes
              </a>
              <a href="/about" className="block transition-colors hover:text-primary">
                About NoteSphere
              </a>
             
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Get In Touch</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>Guru Nanak Dev University</p>
              <p>Amritsar, Punjab 143001</p>
              <p>Email: gnducoders@gmail.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Connect With Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">Github</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Join our student community</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
          
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Study tips & highlights</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
             
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 NoteSphere. Academic resources for students, by students.
          </p>
          
        </div>
      </div>
    </footer>
  )
}

export { Footer }