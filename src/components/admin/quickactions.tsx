'use client';

import StyledAdminCard from "./StyledAdminCard";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import styled from "styled-components";

export default function QuickActions() {
  return (
    <StyledAdminCard 
      title="Quick Actions" 
      description="Shortcuts to common tasks"
      icon={<ArrowUpRight size={20} />}
      accentColor="#16a34a"
      secondaryColor="#4ade80"
    >
      <ActionButtons>
        <Button asChild className="action-button primary">
          <Link href="/upload">Upload New Note</Link>
        </Button>
        <Button asChild variant="outline" className="action-button secondary">
          <Link href="/notes">Browse Notes</Link>
        </Button>
        <Button asChild variant="outline" className="action-button secondary">
          <Link href="/subjects">Explore Subjects</Link>
        </Button>
      </ActionButtons>
    </StyledAdminCard>
  );
}

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  
  .action-button {
    position: relative;
    overflow: hidden;
    font-weight: 600;
    transition: all 0.3s ease;
    border-width: 2px;
    
    &::before {
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
      transition: left 0.5s ease;
    }
    
    &:hover::before {
      left: 100%;
    }
    
    &.primary {
      background-color: var(--accent-color);
      border-color: var(--accent-color);
      box-shadow: 0 0.15rem 0 rgba(0, 0, 0, 0.1);
      
      &:hover {
        transform: translateY(-0.15rem);
        box-shadow: 0 0.25rem 0 rgba(0, 0, 0, 0.1);
      }
    }
    
    &.secondary {
      border-color: var(--accent-color);
      color: var(--accent-color);
      
      &:hover {
        background-color: var(--accent-color);
        color: white;
      }
    }
  }
`;
