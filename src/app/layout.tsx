import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import StyledComponentsRegistry from './registry';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Script to prevent theme flash during page loads and ensure theme persistence
function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        // Check localStorage for stored theme
        let theme = localStorage.getItem('notesphere-theme');
        
        // If there's no theme in localStorage, use 'system'
        if (!theme) {
          theme = 'system';
          localStorage.setItem('notesphere-theme', theme);
        }
        
        // Apply the theme to the document
        const root = document.documentElement;
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Clear existing theme classes
        root.classList.remove('light', 'dark');
        
        if (theme === 'dark' || (theme === 'system' && darkModeMediaQuery.matches)) {
          root.classList.add('dark');
        } else {
          root.classList.add('light');
        }
        
        // Listen for storage events to sync theme across tabs/pages
        window.addEventListener('storage', function(e) {
          if (e.key === 'notesphere-theme') {
            const newTheme = e.newValue || 'system';
            
            root.classList.remove('light', 'dark');
            
            if (newTheme === 'dark' || (newTheme === 'system' && darkModeMediaQuery.matches)) {
              root.classList.add('dark');
            } else {
              root.classList.add('light');
            }
          }
        });
        
        // Setup listener for system theme changes
        if (theme === 'system') {
          darkModeMediaQuery.addEventListener('change', (e) => {
            root.classList.remove('light', 'dark');
            root.classList.add(e.matches ? 'dark' : 'light');
          });
        }
      } catch (e) {
        console.error('Failed to set theme', e);
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}

export const metadata: Metadata = {
  title: "NoteSphere - Share Knowledge",
  description: "Share and discover academic notes and study materials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <StyledComponentsRegistry>
          <Providers>
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
