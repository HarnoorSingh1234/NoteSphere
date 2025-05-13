'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

interface NavigationCardProps {
  title: string;
  tagText: string;
  description: string;
  features: {
    icon: React.ReactNode;
    text: string;
  }[];
  price?: string;
  priceDescription?: string;
  buttonText: string;
  buttonHref: string;
  accentColor?: string;
  secondaryColor?: string;
}

const NavigationCard = ({
  title,
  tagText,
  description,
  features,
  price,
  priceDescription,
  buttonText,
  buttonHref,
  accentColor = "#ff3e00",
  secondaryColor = "#4d61ff"
}: NavigationCardProps) => {
  return (
    <StyledWrapper $accentColor={accentColor} $secondaryColor={secondaryColor}>
      <div className="card">
        <div className="card-pattern-grid" />
        <div className="card-overlay-dots" />
        <div className="bold-pattern">
          <svg viewBox="0 0 100 100">
            <path strokeDasharray="15 10" strokeWidth={10} stroke="#000" fill="none" d="M0,0 L100,0 L100,100 L0,100 Z" />
          </svg>
        </div>
        <div className="card-title-area">
          <span>{title}</span>
          <span className="card-tag">{tagText}</span>
        </div>
        <div className="card-body">
          <div className="card-description">
            {description}
          </div>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <div className="feature-item" key={index}>
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <span className="feature-text">{feature.text}</span>
              </div>
            ))}
          </div>
          <div className="card-actions">
            {price && (
              <div className="price">
                <span className="price-currency">$</span>{price}
                <span className="price-period">{priceDescription}</span>
              </div>
            )}
            <Link href={buttonHref}>
              <button className="card-button">{buttonText}</button>
            </Link>
          </div>
        </div>
        <div className="dots-pattern">
          <svg viewBox="0 0 80 40">
            <circle fill="#000" r={3} cy={10} cx={10} />
            <circle fill="#000" r={3} cy={10} cx={30} />
            <circle fill="#000" r={3} cy={10} cx={50} />
            <circle fill="#000" r={3} cy={10} cx={70} />
            <circle fill="#000" r={3} cy={20} cx={20} />
            <circle fill="#000" r={3} cy={20} cx={40} />
            <circle fill="#000" r={3} cy={20} cx={60} />
            <circle fill="#000" r={3} cy={30} cx={10} />
            <circle fill="#000" r={3} cy={30} cx={30} />
            <circle fill="#000" r={3} cy={30} cx={50} />
            <circle fill="#000" r={3} cy={30} cx={70} />
          </svg>
        </div>
        <div className="accent-shape" />
        <div className="corner-slice" />
        <div className="stamp">
          <span className="stamp-text">Approved</span>
        </div>
      </div>
    </StyledWrapper>
  );
}

interface StyledWrapperProps {
  $accentColor: string;
  $secondaryColor: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .card {
    --primary: ${props => props.$accentColor};
    --primary-hover: ${props => {
      const color = props.$accentColor;
      // Lighten the color for hover state
      return color.includes('#') 
        ? color.replace(/#/, '#ff') 
        : color;
    }};
    --secondary: ${props => props.$secondaryColor};
    --secondary-hover: ${props => {
      const color = props.$secondaryColor;
      // Lighten the color for hover state
      return color.includes('#') 
        ? color.replace(/#/, '#5e') 
        : color;
    }};
    --accent: #00e0b0;
    --text: #050505;
    --bg: #ffffff;
    --shadow-color: #000000;
    --pattern-color: #cfcfcf;

    position: relative;
    width: 20em;
    background: var(--bg);
    border: 0.35em solid var(--text);
    border-radius: 0.6em;
    box-shadow:
      0.7em 0.7em 0 var(--shadow-color),
      inset 0 0 0 0.15em rgba(0, 0, 0, 0.05);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    overflow: hidden;
    font-family: ui-sans-serif, system-ui, sans-serif;
    transform-origin: center;
    margin: 1em;
  }

  .card:hover {
    transform: translate(-0.4em, -0.4em) scale(1.02);
    box-shadow: 1em 1em 0 var(--shadow-color);
  }

  .card:hover .card-pattern-grid,
  .card:hover .card-overlay-dots {
    opacity: 1;
  }

  .card:active {
    transform: translate(0.1em, 0.1em) scale(0.98);
    box-shadow: 0.5em 0.5em 0 var(--shadow-color);
  }

  .card::before {
    content: "";
    position: absolute;
    top: -1em;
    right: -1em;
    width: 4em;
    height: 4em;
    background: var(--accent);
    transform: rotate(45deg);
    z-index: 1;
  }

  .card::after {
    content: "★";
    position: absolute;
    top: 0.4em;
    right: 0.4em;
    color: var(--text);
    font-size: 1.2em;
    font-weight: bold;
    z-index: 2;
  }

  .card-pattern-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.05) 1px,
        transparent 1px
      ),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 0.5em 0.5em;
    pointer-events: none;
    opacity: 0.5;
    transition: opacity 0.4s ease;
    z-index: 1;
  }

  .card-overlay-dots {
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

  .bold-pattern {
    position: absolute;
    top: 0;
    right: 0;
    width: 6em;
    height: 6em;
    opacity: 0.15;
    pointer-events: none;
    z-index: 1;
  }

  .card-title-area {
    position: relative;
    padding: 1.4em;
    background: var(--primary);
    color: var(--bg);
    font-weight: 800;
    font-size: 1.2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.35em solid var(--text);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    z-index: 2;
    overflow: hidden;
  }

  .card-title-area::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.1) 0.5em,
      transparent 0.5em,
      transparent 1em
    );
    pointer-events: none;
    opacity: 0.3;
  }

  .card-tag {
    background: var(--bg);
    color: var(--text);
    font-size: 0.6em;
    font-weight: 800;
    padding: 0.4em 0.8em;
    border: 0.15em solid var(--text);
    border-radius: 0.3em;
    box-shadow: 0.2em 0.2em 0 var(--shadow-color);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transform: rotate(3deg);
    transition: all 0.3s ease;
  }

  .card:hover .card-tag {
    transform: rotate(-2deg) scale(1.1);
    box-shadow: 0.25em 0.25em 0 var(--shadow-color);
  }

  .card-body {
    position: relative;
    padding: 1.5em;
    z-index: 2;
  }

  .card-description {
    margin-bottom: 1.5em;
    color: var(--text);
    font-size: 0.95em;
    line-height: 1.4;
    font-weight: 500;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
    margin-bottom: 1.5em;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.6em;
    transition: transform 0.2s ease;
  }

  .feature-item:hover {
    transform: translateX(0.3em);
  }

  .feature-icon {
    width: 1.4em;
    height: 1.4em;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary);
    border: 0.12em solid var(--text);
    border-radius: 0.3em;
    box-shadow: 0.2em 0.2em 0 rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }

  .feature-item:hover .feature-icon {
    background: var(--secondary-hover);
    transform: rotate(-5deg);
  }

  .feature-icon svg {
    width: 0.9em;
    height: 0.9em;
    fill: var(--bg);
  }

  .feature-text {
    font-size: 0.85em;
    font-weight: 600;
    color: var(--text);
  }

  .card-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5em;
    padding-top: 1.2em;
    border-top: 0.15em dashed rgba(0, 0, 0, 0.15);
    position: relative;
  }

  .card-actions::before {
    content: "✂";
    position: absolute;
    top: -0.8em;
    left: 50%;
    transform: translateX(-50%) rotate(90deg);
    background: var(--bg);
    padding: 0 0.5em;
    font-size: 1em;
    color: rgba(0, 0, 0, 0.4);
  }

  .price {
    position: relative;
    font-size: 1.8em;
    font-weight: 800;
    color: var(--text);
    background: var(--bg);
  }

  .price::before {
    content: "";
    position: absolute;
    bottom: 0.15em;
    left: 0;
    width: 100%;
    height: 0.2em;
    background: var(--accent);
    z-index: -1;
    opacity: 0.5;
  }

  .price-currency {
    font-size: 0.6em;
    font-weight: 700;
    vertical-align: top;
    margin-right: 0.1em;
  }

  .price-period {
    display: block;
    font-size: 0.4em;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 0.2em;
  }

  .card-button {
    position: relative;
    background: var(--secondary);
    color: var(--bg);
    font-size: 0.9em;
    font-weight: 700;
    padding: 0.7em 1.2em;
    border: 0.2em solid var(--text);
    border-radius: 0.4em;
    box-shadow: 0.3em 0.3em 0 var(--shadow-color);
    cursor: pointer;
    transition: all 0.2s ease;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .card-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    transition: left 0.6s ease;
  }

  .card-button:hover {
    background: var(--secondary-hover);
    transform: translate(-0.1em, -0.1em);
    box-shadow: 0.4em 0.4em 0 var(--shadow-color);
  }

  .card-button:hover::before {
    left: 100%;
  }

  .card-button:active {
    transform: translate(0.1em, 0.1em);
    box-shadow: 0.15em 0.15em 0 var(--shadow-color);
  }

  .dots-pattern {
    position: absolute;
    bottom: 2em;
    left: -2em;
    width: 8em;
    height: 4em;
    opacity: 0.3;
    transform: rotate(-10deg);
    pointer-events: none;
    z-index: 1;
  }

  .accent-shape {
    position: absolute;
    width: 2.5em;
    height: 2.5em;
    background: var(--secondary);
    border: 0.15em solid var(--text);
    border-radius: 0.3em;
    transform: rotate(45deg);
    bottom: -1.2em;
    right: 2em;
    z-index: 0;
    transition: transform 0.3s ease;
  }

  .card:hover .accent-shape {
    transform: rotate(55deg) scale(1.1);
  }

  .stamp {
    position: absolute;
    bottom: 1.5em;
    left: 1.5em;
    width: 4em;
    height: 4em;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.15em solid rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    transform: rotate(-15deg);
    opacity: 0.2;
    z-index: 1;
  }

  .stamp-text {
    font-size: 0.6em;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .corner-slice {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 1.5em;
    height: 1.5em;
    background: var(--bg);
    border-right: 0.25em solid var(--text);
    border-top: 0.25em solid var(--text);
    border-radius: 0 0.5em 0 0;
    z-index: 1;
  }
`;

export default NavigationCard; 