"use client"

import * as React from "react"
import { BookOpen, GraduationCap, Github, Instagram } from "lucide-react"
import styled from 'styled-components'

function Footer() {
  return (
    <StyledFooter>
      <div className="footer-pattern-grid" />
      <div className="footer-overlay-dots" />
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo-wrapper">
              <BookOpen className="logo-icon" />
              <h2 className="logo-text">NoteSphere</h2>
            </div>
            <p className="footer-description">
              The academic hub for sharing and discovering quality course notes.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="section-title">
              <GraduationCap className="section-icon" /> Quick Links
            </h3>
            <nav className="footer-nav">
              <a href="/" className="footer-link">Home</a>
              <a href="/semesters" className="footer-link">Browse Notes</a>
              <a href="/submit" className="footer-link">Submit Notes</a>
              <a href="/about" className="footer-link">About NoteSphere</a>
            </nav>
          </div>
          
          <div className="footer-section">
            <h3 className="section-title">Get In Touch</h3>
            <address className="footer-address">
              <p>Guru Nanak Dev University</p>
              <p>Amritsar, Punjab 143001</p>
              <p>Email: gnducoders@gmail.com</p>
            </address>
          </div>
          
          <div className="footer-section">
            <h3 className="section-title">Connect With Us</h3>
            <div className="social-links">
              <a href="#" className="social-button">
                <Github className="social-icon" />
              </a>
              <a href="#" className="social-button">
                <Instagram className="social-icon" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            © 2025 NoteSphere. Academic resources for students, by students.
          </p>
        </div>
      </div>
      <div className="corner-slice left" />
      <div className="corner-slice right" />
      <div className="accent-shape left" />
      <div className="accent-shape right" />
    </StyledFooter>
  )
}

const StyledFooter = styled.footer`
  --primary: #ff3e00;
  --primary-hover: #ff6d43;
  --secondary: #4d61ff;
  --secondary-hover: #5e70ff;
  --accent: #00e0b0;
  --text: #050505;
  --bg: #ffffff;
  --shadow-color: var(--accent);
  --pattern-color: rgba(0, 0, 0, 0.05);

  // Dark mode variables
  .dark & {
    --text: #ffffff;
    --bg: #121212;
    --shadow-color: #00c69a;
    --pattern-color: rgba(255, 255, 255, 0.05);
  }

  position: relative;
  width: 100%;
  background: var(--bg);
  border: 0.35em solid var(--text);
  border-bottom: none;
  border-radius: 0.6em 0.6em 0 0;
  box-shadow: 0 -0.5em 0 var(--shadow-color);
  font-family: ui-sans-serif, system-ui, sans-serif;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: bottom center;
  padding: 3rem 0 2rem;

  &:hover {
    transform: translateY(-0.1em);
    box-shadow: 0 -0.7em 0 var(--shadow-color);
  }
  
  .footer-pattern-grid {
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

  .footer-overlay-dots {
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

  &:hover .footer-pattern-grid,
  &:hover .footer-overlay-dots {
    opacity: 0.5;
  }
  
  .container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    z-index: 2;
  }
  
  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 2rem;
    margin-bottom: 2.5rem;
  }
  
  .footer-section {
    position: relative;
  }
  
  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1rem;
  }
  
  .logo-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--primary);
  }
  
  .logo-text {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text);
    margin: 0;
  }
  
  .footer-description {
    font-size: 0.95rem;
    color: var(--text);
    opacity: 0.8;
    line-height: 1.5;
    max-width: 90%;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 1.2rem;
    position: relative;
    
    &::after {
      content: "";
      position: absolute;
      bottom: -0.4rem;
      left: 0;
      width: 2.5em;
      height: 0.2em;
      background: var(--accent);
      border-radius: 0.1em;
    }
  }
  
  .section-icon {
    width: 1rem;
    height: 1rem;
    color: var(--text);
  }
  
  .footer-nav {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  
  .footer-link {
    color: var(--text);
    text-decoration: none;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    width: fit-content;
    position: relative;
    
    &::before {
      content: "→";
      opacity: 0;
      margin-right: 0;
      display: inline-block;
      transform: translateX(-0.5rem);
      transition: all 0.2s ease;
    }
    
    &:hover {
      color: var(--primary);
      
      &::before {
        opacity: 1;
        transform: translateX(-0.2rem);
      }
    }
  }
  
  .footer-address {
    font-style: normal;
    font-size: 0.95rem;
    color: var(--text);
    opacity: 0.8;
    line-height: 1.6;
    
    p {
      margin: 0.3rem 0;
    }
  }
  
  .social-links {
    display: flex;
    gap: 0.8rem;
    margin-top: 0.5rem;
  }
  
  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.4rem;
    height: 2.4rem;
    background: var(--bg);
    border: 0.15em solid var(--text);
    border-radius: 0.4em;
    color: var(--text);
    box-shadow: 0.2em 0.2em 0 var(--shadow-color);
    transition: all 0.2s ease;
    
    &:hover {
      transform: translate(-0.1em, -0.1em);
      box-shadow: 0.3em 0.3em 0 var(--shadow-color);
      background: var(--secondary);
      color: white;
    }
    
    &:active {
      transform: translate(0.05em, 0.05em);
      box-shadow: 0.1em 0.1em 0 var(--shadow-color);
    }
  }
  
  .social-icon {
    width: 1.2rem;
    height: 1.2rem;
  }
  
  .footer-bottom {
    border-top: 0.15em dashed rgba(0, 0, 0, 0.1);
    padding-top: 1.5rem;
    text-align: center;
    position: relative;
    
    .dark & {
      border-top-color: rgba(255, 255, 255, 0.1);
    }
    
    &::before {
      content: "✂";
      position: absolute;
      top: -0.8em;
      left: 50%;
      transform: translateX(-50%) rotate(90deg);
      background: var(--bg);
      padding: 0 0.5em;
      font-size: 1em;
      color: rgba(0, 0, 0, 0.4);
      
      .dark & {
        color: rgba(255, 255, 255, 0.4);
      }
    }
  }
  
  .copyright {
    font-size: 0.9rem;
    color: var(--text);
    opacity: 0.7;
  }
  
  .corner-slice {
    position: absolute;
    top: 0;
    width: 1.5em;
    height: 1.5em;
    background: var(--bg);
    z-index: 3;
    
    &.left {
      left: 0;
      border-right: 0.25em solid var(--text);
      border-bottom: 0.25em solid var(--text);
      border-radius: 0 0 0.5em 0;
    }
    
    &.right {
      right: 0;
      border-left: 0.25em solid var(--text);
      border-bottom: 0.25em solid var(--text);
      border-radius: 0 0 0 0.5em;
    }
  }
  
  .accent-shape {
    position: absolute;
    width: 2.5em;
    height: 2.5em;
    background: var(--primary);
    border: 0.15em solid var(--text);
    border-radius: 0.3em;
    transform: rotate(45deg);
    top: -1.2em;
    z-index: 0;
    transition: transform 0.3s ease;
    
    &.left {
      left: 20%;
    }
    
    &.right {
      right: 20%;
      background: var(--secondary);
    }
  }
  
  &:hover .accent-shape {
    transform: rotate(55deg) scale(1.1);
  }
  
  @media (max-width: 768px) {
    .footer-content {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .accent-shape {
      &.left {
        left: 10%;
      }
      
      &.right {
        right: 10%;
      }
    }
  }
  
  @media (max-width: 480px) {
    padding: 2rem 0 1.5rem;
    
    .container {
      padding: 0 1rem;
    }
    
    .footer-content {
      gap: 1.2rem;
    }
    
    .section-title {
      font-size: 1rem;
    }
    
    .accent-shape {
      width: 2em;
      height: 2em;
    }
  }
`;

export default Footer