'use client';

import StatsCard from "./statscard";
import { FileText, TrendingUp, Users, Clock } from "lucide-react";
import styled from "styled-components";

export default function StatsGrid() {
  return (
    <StatCardsGrid>
      <StatsCard 
        title="Total Notes" 
        value="127" 
        description="+12 from last week" 
        icon={FileText} 
      />
      <StatsCard 
        title="Downloads" 
        value="843" 
        description="+28% from last month" 
        icon={TrendingUp} 
      />
      <StatsCard 
        title="Followers" 
        value="56" 
        description="+8 new followers" 
        icon={Users} 
      />
      <StatsCard 
        title="Study Time" 
        value="24h" 
        description="This week" 
        icon={Clock} 
      />
    </StatCardsGrid>
  );
}

const StatCardsGrid = styled.div`
  display: grid;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
