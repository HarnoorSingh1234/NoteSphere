'use client';

import React from 'react';
import styled from 'styled-components';

interface StyledAdminCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  accentColor?: string;
  secondaryColor?: string;
}

const StyledAdminCard: React.FC<StyledAdminCardProps> = ({
  title,
  description,
  children,
  icon,
  accentColor = "#DE5499",
  secondaryColor = "#E99F4C"
}) => {
  return (
    <CardWrapper $accentColor={accentColor} $secondaryColor={secondaryColor}>
      <div className="card">
        <div className="card-pattern-grid" />
        <div className="card-overlay-dots" />
        <div className="card-header">
          <div className="title-area">
            <h3 className="card-title">{title}</h3>
            {description && <p className="card-description">{description}</p>}
          </div>
          {icon && <div className="card-icon">{icon}</div>}
        </div>
        <div className="card-content">
          {children}
        </div>
      </div>
    </CardWrapper>
  );
};

const CardWrapper = styled.div<{ $accentColor: string; $secondaryColor: string }>`
  --accent-color: ${props => props.$accentColor};
  --secondary-color: ${props => props.$secondaryColor};
  --card-bg: var(--bg-skin-card, #FFFFFF);
  --card-shadow: rgba(0, 0, 0, 0.08);
  --text-color: var(--text-skin-base, #264143);
  --border-color: rgba(0, 0, 0, 0.1);
  --pattern-color: rgba(0, 0, 0, 0.03);
  
  display: flex;
  width: 100%;
  height: 100%;
  
  .card {
    background-color: var(--card-bg);
    border-radius: 1rem;
    border: 0.15em solid var(--border-color);
    box-shadow: 0.35em 0.35em 0 var(--accent-color);
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    width: 100%;
    transition: all 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    &:hover {
      transform: translateY(-0.15em);
      box-shadow: 0.5em 0.5em 0 var(--accent-color);
    }
  }
  
  .card-pattern-grid {
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
    opacity: 0.4;
    z-index: 0;
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
    z-index: 0;
  }
  
  .card:hover .card-overlay-dots {
    opacity: 0.4;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    z-index: 1;
  }
  
  .title-area {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .card-title {
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--text-color);
    position: relative;
    display: inline-block;
    
    &::after {
      content: "";
      position: absolute;
      bottom: -0.25rem;
      left: 0;
      width: 2rem;
      height: 0.15rem;
      background-color: var(--accent-color);
      border-radius: 1rem;
    }
  }
  
  .card-description {
    font-size: 0.875rem;
    color: var(--text-color);
    opacity: 0.7;
  }
  
  .card-icon {
    color: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 0.5rem;
    padding: 0.5rem;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.1) rotate(5deg);
      background-color: var(--accent-color);
      color: white;
    }
  }
  
  .card-content {
    position: relative;
    z-index: 1;
    flex: 1;
  }
  
  /* Dark theme */
  .dark & {
    --card-bg: var(--bg-skin-card-dark, #1f2937);
    --card-shadow: rgba(0, 0, 0, 0.2);
    --text-color: var(--text-skin-base-dark, #e5e7eb);
    --border-color: rgba(255, 255, 255, 0.1);
    --pattern-color: rgba(255, 255, 255, 0.05);
  }
`;

export default StyledAdminCard;
