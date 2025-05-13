'use client';

import StyledAdminCard from "./StyledAdminCard";
import { LucideIcon } from "lucide-react";
import styled from "styled-components";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export default function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <StyledAdminCard 
      title={title} 
      icon={<Icon size={20} />}
    >
      <StatsContent>
        <div className="stats-value">{value}</div>
        <p className="stats-description">{description}</p>
      </StatsContent>
    </StyledAdminCard>
  );
}

const StatsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  .stats-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-color);
  }
  
  .stats-description {
    font-size: 0.875rem;
    color: var(--text-color);
    opacity: 0.7;
  }
`;
